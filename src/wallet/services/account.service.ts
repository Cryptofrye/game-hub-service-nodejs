import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { Transaction } from "sequelize";
import { AccountEntity, CreateAccountProps, UpdateAccountProps } from "../entities/account.entity";
import { OnEvent } from '@nestjs/event-emitter';
import { WithdrawAssetInitiatedEvent } from "src/common/events/events";
import { HOME_BANANO_ACCOUNT_ID, HOME_NANO_ACCOUNT_ID, HOME_XWGT_ACCOUNT_ID } from "../utils/account.contants";
import { ASSET_BANANO, ASSET_NANO, ASSET_XWGT } from "src/common/constants/asset";


@Injectable()
export class AccountService {

  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectModel(AccountEntity)
    private readonly accountRepo: typeof AccountEntity,
    private sequelize: Sequelize) {
    this.logger.debug(`instantiated a new instance of ${AccountService.name}`);
  }

  @OnEvent(`${WithdrawAssetInitiatedEvent.toEventId()}`)
  async handleDebitInitiatedEvent(withdrawEvent: WithdrawAssetInitiatedEvent) {
    this.logger.debug(`received event:${withdrawEvent}`)
    let account: AccountEntity =  await  this.withDrawAsset(withdrawEvent.payload.userId,withdrawEvent.payload.assetId , withdrawEvent.payload.fee, withdrawEvent.payload.t );
    return account;
  }

 /**
  * This is old-school psuedo implementation of withdrawing a fee from an account. 
  * It will be enhanced later with event driven and event sourcing designs.
  * 
  * @param userId 
  * @param assetId 
  * @param fee 
  * @param t 
  * @returns AccountEntity
  */
  async withDrawAsset(userId: number, assetId: number,fee:number, t:Transaction | null): Promise<AccountEntity> {

        let account: AccountEntity = await this.findByUserIdAssetId(userId, assetId);

        if(account.balance < fee) {
          throw new Error(`Insufficient balance ${account.balance} on account: ${account.id} for user:${userId} to withdraw: ${fee}`);
        }

        let homeXWGETAccount: AccountEntity = await this.getXWGTHomeAccount();
        account.balance = (account.balance - fee);
        homeXWGETAccount.balance = (homeXWGETAccount.balance + fee);
        account = await account.update({balance:account.balance}, {transaction:t});
        await homeXWGETAccount.update({balance:homeXWGETAccount.balance}, {transaction:t});
        return account;
  }

  async getHomeAccountByAssetId(assetId: number): Promise<AccountEntity> {

    switch (assetId) {
      case ASSET_XWGT.id:
          return await this.getXWGTHomeAccount();
      case ASSET_NANO.id:
          return await this.getNanoHomeAccount();
      case ASSET_BANANO.id:
          return await this.getBananoHomeAccount();     
      default:
          throw Error(`asset not found by id:${assetId}`);
    }
  }

  async getXWGTHomeAccount(): Promise<AccountEntity> {
    return this.findById(HOME_XWGT_ACCOUNT_ID);
  }

  async getNanoHomeAccount(): Promise<AccountEntity> {
    return this.findById(HOME_NANO_ACCOUNT_ID);
  }

  async getBananoHomeAccount(): Promise<AccountEntity> {
    return this.findById(HOME_BANANO_ACCOUNT_ID);
  }


  // standard CRUD methods

  async create(account: CreateAccountProps): Promise<AccountEntity> {

    this.logger.debug("creating account:" + JSON.stringify(account));
    let accountEntity:AccountEntity = await this.accountRepo.create<AccountEntity>({...account});
    
    return accountEntity;
  }

  async update(id:number,account: UpdateAccountProps): Promise<AccountEntity> {

    this.logger.debug("updating account:" + JSON.stringify(account));
    let result = await this.accountRepo.update<AccountEntity>({...account}, { where: { id } });

    if(result[0]> 0) {
      return new AccountEntity({id: id, ...account});
    }
    else{
      throw new Error(`Account could not be found by id:${id}. No record updated`);
    }
  }

  async findAll(id: number | null, name: string | null): Promise<AccountEntity[]> {
    let accountEntities: AccountEntity[] = await (await this.accountRepo.findAll<AccountEntity>());
    return accountEntities;
  }

  async findById(id: number): Promise<AccountEntity> {
    // TODO: validate method params
    this.logger.debug(`finding account in the datastore by id[${id}]`);
    let account: AccountEntity | null = await this.accountRepo.findByPk<AccountEntity>(id);

    if (account) {
      this.logger.debug(`found account[${JSON.stringify(account)}] in the datastore by id[${id}]`);
    }
    else {
      this.logger.debug(`could not find any account record in the datastore by id[${id}]`);
      throw new Error(`Account could not be found by id:${id}`);
    }

    return account;
  }

  async findByUserId(userId: number): Promise<AccountEntity> {
    // TODO: validate method params
    this.logger.debug(`finding account in the datastore by user id[${userId}]`);
    let account: AccountEntity | null = await this.accountRepo.findOne({where : { userId }})

    if (account) {
      this.logger.debug(`found account[${JSON.stringify(account)}] in the datastore by id[${userId}]`);
    }
    else {
      this.logger.debug(`could not find any account record in the datastore by user id[${userId}]`);
      throw new Error(`Account could not be found by user id:${userId}`);
    }

    return account;
  }

  async findByUserIdAssetId(userId: number, assetId: number): Promise<AccountEntity> {
    // TODO: validate method params
    this.logger.debug(`finding account in the datastore by user id[${userId}] and assetId[${assetId}]`);
    let account: AccountEntity | null = await this.accountRepo.findOne({where : { userId, assetId }});

    if (account) {
      this.logger.debug(`found account[${JSON.stringify(account)}] in the datastore by user id[${userId}] and assetId[${assetId}]`);
    }
    else {
      this.logger.debug(`could not find any account record in the datastore by user id[${userId}] and assetId[${assetId}]`);
      throw new Error(`Account could not be found by user id[${userId}] and assetId[${assetId}]`);
    }

    return account;
  }

  /**
   * Sets deleted column to true (soft-delete) for entity by the given id
   * @param id 
   * @returns AccountEntity
   */
   async delete(id: number): Promise<void> {
   
    let accountEntity: AccountEntity  = await this.findById(id);
    
    try {
      await accountEntity.destroy();
    } catch (error) {
      this.logger.error(`could not delete account entity:${accountEntity.get({plain:true})}. error:${error}`);
      throw new Error(error);
    }
  }

}