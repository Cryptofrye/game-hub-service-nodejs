import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateGameLoungeProps, GameLoungeEntity, UpdateGameLoungeProps } from "../entities/game-lounge.entity";
import { Sequelize } from "sequelize-typescript";
import { GameLoungeState, GAME_LOUNGE_STATE_LIST } from "../../common/constants/game-lounge-state";
import { GameLoungeType, GAME_LOUNGE_TYPE_LIST } from "../../common/constants/game-lounge-type";
import { GameLoungeUserEntity } from "../entities/game-lounge-user.entity";
import { v4 as uuid } from 'uuid';



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

    if(!gameLounge.uid || gameLounge.uid === "" || gameLounge.uid === null) gameLounge.uid = uuid();

    this.logger.debug("creating game lounge:" + JSON.stringify(gameLounge));
    let gl:GameLoungeEntity = await this.gameLoungeRepo.create<GameLoungeEntity>({...gameLounge});
    
    return gl.get({plain:true});
  }

  async update(uid:string,gameLounge: UpdateGameLoungeProps): Promise<GameLoungeEntity> {

    this.logger.debug("updating game lounge:" + JSON.stringify(gameLounge));
    let result = await this.gameLoungeRepo.update<GameLoungeEntity>({...gameLounge}, { where: { uid } });

    if(result[0]> 0) {
      return new GameLoungeEntity({uid: uid, ...gameLounge});
    }
    else{
      throw new Error(`Game Lounge could not be found by uid:${uid}. No record updated`);
    }
  }

  /**
   * Finds all entitis in the datastore
   * 
   * @param uid 
   * @param name 
   * @returns array of GamingLounge entities
   */
  async findAll(uid: string | null, name: string | null): Promise<GameLoungeEntity[]> {
    let gamingLounges: GameLoungeEntity[] = await this.gameLoungeRepo.findAll<GameLoungeEntity>();
    return gamingLounges;
  }

  /**
   * Finds entity by the given uid
   * 
   * @param uid 
   * @returns GamingLounge
   */
  async findById(uid: string): Promise<GameLoungeEntity> {
    // TODO: validate method params
    this.logger.debug(`finding demo in the datastore by uid[${uid}]`);
    let gameLounge: GameLoungeEntity | null = await this.gameLoungeRepo.findByPk<GameLoungeEntity>(uid);

    if (gameLounge) {
      this.logger.debug(`found demo[${JSON.stringify(gameLounge)}] in the datastore by uid[${uid}]`);
    }
    else {
      this.logger.debug(`could not find any game lounge record in the datastore by uid[${uid}]`);
      throw new Error(`Game Lounge could not be found by uid:${uid}`);
    }

    return gameLounge;
  }

  /**
   * Sets deleted column to true (soft-delete) for entity by the given uid
   * @param uid 
   * @returns GamingLounge
   */
  async delete(uid: string): Promise<void> {
   
    let gameLounge: GameLoungeEntity  = await this.findById(uid);
    
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

  async findAllGlPlayers(gameLoungeId: string): Promise<GameLoungeUserEntity[]> {
    let glPlayers: GameLoungeUserEntity[] = await this.gameLoungeUserModel.findAll<GameLoungeUserEntity>({where: {gameLoungeId}});
    return glPlayers;
  }

}