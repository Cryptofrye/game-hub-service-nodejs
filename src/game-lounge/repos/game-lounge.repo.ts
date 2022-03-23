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


@Injectable()
export class GameLoungeRepo {

  private readonly logger = new Logger(GameLoungeRepo.name);

  constructor(
    @InjectModel(GameLoungeEntity)
    private readonly gameLoungeRepo: typeof GameLoungeEntity,
    @InjectModel(GameLoungeUserEntity)
    private readonly gameLoungeUserModel: typeof GameLoungeUserEntity,
    private sequelize: Sequelize) {

    this.logger.debug(`instantiated a new instance of ${GameLoungeRepo.name}`);
  }

  async create(gameLounge: CreateGameLoungeProps): Promise<GameLoungeEntity> {

    this.logger.debug("creating game lounge:" + JSON.stringify(gameLounge));
    let gl:GameLoungeEntity = await this.gameLoungeRepo.create<GameLoungeEntity>({...gameLounge});
    
    return gl.get({plain:true});
  }

  async update(id:number,gameLounge: UpdateGameLoungeProps): Promise<GameLoungeEntity> {

    this.logger.debug("updating game lounge:" + JSON.stringify(gameLounge));
    let result = await this.gameLoungeRepo.update<GameLoungeEntity>({...gameLounge}, { where: { id } });

    if(result[0]> 0) {
      return new GameLoungeEntity({id: id, ...gameLounge});
    }
    else{
      throw new Error(`Game Lounge could not be found by id:${id}. No record updated`);
    }
  }

  /**
   * Finds all entitis in the datastore
   * 
   * @param id 
   * @param name 
   * @returns array of GamingLounge entities
   */
  async findAll(id: number | null, name: string | null): Promise<GameLoungeEntity[]> {
    let gamingLounges: GameLoungeEntity[] = await this.gameLoungeRepo.findAll<GameLoungeEntity>();
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
    this.logger.debug(`finding demo in the datastore by id[${id}]`);
    let gameLounge: GameLoungeEntity | null = await this.gameLoungeRepo.findByPk<GameLoungeEntity>(id);

    if (gameLounge) {
      this.logger.debug(`found demo[${JSON.stringify(gameLounge)}] in the datastore by id[${id}]`);
    }
    else {
      this.logger.debug(`could not find any game lounge record in the datastore by id[${id}]`);
      throw new Error(`Game Lounge could not be found by id:${id}`);
    }

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
    let glPlayers: GameLoungeUserEntity[] = await this.gameLoungeUserModel.findAll<GameLoungeUserEntity>({where: {gameLoungeId}});
    return glPlayers;
  }

}