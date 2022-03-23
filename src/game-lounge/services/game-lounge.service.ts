import { Injectable, Logger } from "@nestjs/common";
import { WG_ERROR_GL_CREATE } from "@wodo-platform/wg-shared-lib/dist/wodogaming/error/error.codes";
import { InjectModel } from "@nestjs/sequelize";
import { CreateGameLoungeProps, GameLoungeEntity, UpdateGameLoungeProps } from "../entities/game-lounge.entity";
import { Sequelize } from "sequelize-typescript";
import { GameLoungeState, GAME_LOUNGE_STATE_LIST } from "../../common/constants/game-lounge-state";
import { GameLoungeType, GAME_LOUNGE_TYPE_LIST } from "../../common/constants/game-lounge-type";
import { CreateGameLoungeUserProps, GameLoungeUserEntity } from "../entities/game-lounge-user.entity";
import { AccountEntity } from "src/wallet/entities/account.entity";
import { AccountService } from "src/wallet/services/account.service";
import { GameLoungeRepo } from "../repos/game-lounge.repo";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { WithdrawAssetInitiatedEvent, WithdrawAssetPayload } from "src/common/events/events";

/**
 * Service implementation for business logic. 
 */
@Injectable()
export class GameLoungeService {

  private readonly logger = new Logger(GameLoungeService.name);

  constructor(
    private readonly gameLoungeRepo:GameLoungeRepo,
    @InjectModel(GameLoungeEntity)
    private readonly gameLoungeEntity: typeof GameLoungeEntity,
    @InjectModel(GameLoungeUserEntity)
    private readonly gameLoungeUserEntity: typeof GameLoungeUserEntity,
    private readonly accountService: AccountService,
    private sequelize: Sequelize,
    private eventEmmitter:EventEmitter2) {

    this.logger.debug(`instantiated a new instance of ${GameLoungeService.name}`);
  }

  
  async addPlayer(glUserCreateProps: CreateGameLoungeUserProps): Promise<GameLoungeUserEntity> {
    
    let userId:number = glUserCreateProps.userId;
    let gameLoungeId:number = glUserCreateProps.gameLoungeId;

    let gameLounge: GameLoungeEntity = await this.findById(gameLoungeId);

    let glUSer!:GameLoungeUserEntity;

    // Till we have event driven architectire this needs to happen in the same DB transaction
    // debit functionality will be done via async message functionality at later phases
    // Three steps:
    //   1- Withdraw the amount
    //   2- create auidit log for the account
    //   3- let the user in the game lounge (create gameLoungeUser record in DB )
    try {
      await this.sequelize.transaction(async t => {
        const transactionHost = { transaction: t };

        let debitEvent: WithdrawAssetInitiatedEvent = new WithdrawAssetInitiatedEvent(); 
        debitEvent.payload = {
            userId:userId,
            accountId: null,
            assetId:gameLounge.assetId,
            fee: gameLounge.fee, 
            t:t
          };

        let result:any[] = await this.eventEmmitter.emitAsync(WithdrawAssetInitiatedEvent.toEventId(),debitEvent);

        if(result && result[0]) {
          this.logger.debug(`Withdraw event has been processed successfully.`);
        }

        //account = await  this.accountService.debitAsset(account, gameLounge.fee, transactionHost.transaction );
        glUSer = await this.gameLoungeUserEntity.create({...glUserCreateProps},
            transactionHost
        );
      });
    } catch (err) {
      this.logger.error(`Could not add user:${userId} to game lounge:${gameLoungeId}. error:${err}`);
      throw new Error(`Could not add user:${userId} to game lounge:${gameLoungeId}`);
    }

    return glUSer;

  }

  // standard CRUD functions

  async create(gameLounge: CreateGameLoungeProps): Promise<GameLoungeEntity> {

    this.logger.debug("creating game lounge:" + JSON.stringify(gameLounge));
    let gl:GameLoungeEntity = await this.gameLoungeRepo.create(gameLounge);
    
    return gl;
  }

  async update(id:number,gameLounge: UpdateGameLoungeProps): Promise<GameLoungeEntity> {

    this.logger.debug("updating game lounge:" + JSON.stringify(gameLounge));
    let gle:GameLoungeEntity = await this.gameLoungeRepo.update(id,gameLounge);
    return gle;
  }

  /**
   * Finds all entitis in the datastore
   * 
   * @param id 
   * @param name 
   * @returns array of GamingLounge entities
   */
  async findAll(id: number | null, name: string | null): Promise<GameLoungeEntity[]> {
    let gamingLounges: GameLoungeEntity[] = await this.gameLoungeRepo.findAll(id,name);
    return gamingLounges;
  }

  /**
   * Finds entity by the given id
   * 
   * @param id 
   * @returns GamingLounge
   */
  async findById(id: number): Promise<GameLoungeEntity> {
    // TODO: validate method params
    let gameLounge: GameLoungeEntity = await this.gameLoungeRepo.findById(id);
    return gameLounge;
  }

  /**
   * Sets deleted column to true (soft-delete) for entity by the given id
   * @param id 
   * @returns GamingLounge
   */
  async delete(id: number): Promise<void> {
   
    let gameLounge: GameLoungeEntity  = await this.findById(id);
    
    try {
      await gameLounge.destroy();
    } catch (error) {
      this.logger.error(`could not delete game lounge:${gameLounge.get({plain:true})}. error:${error}`);
      throw new Error(error);
    }
  }

  /**
   * 
   * @returns list of GamingLoungeType
   */
  async findTypes(): Promise<GameLoungeType[]> {
    return GAME_LOUNGE_TYPE_LIST;
  }

  /**
   * 
   * @returns list of GamingLoungeState
   */
  async findStates(): Promise<GameLoungeState[]> {
    return GAME_LOUNGE_STATE_LIST;
  }

  async findAllGlPlayers(gameLoungeId: number): Promise<GameLoungeUserEntity[]> {
    let glPlayers: GameLoungeUserEntity[] = await this.gameLoungeRepo.findAllGlPlayers(gameLoungeId);
    return glPlayers;
  }

}