import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { AccountEntity, CreateAccountProps, UpdateAccountProps } from "../entities/account.entity";


@Injectable()
export class AccountService {

  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectModel(AccountEntity)
    private readonly accountRepo: typeof AccountEntity,
    private sequelize: Sequelize) {
    this.logger.debug(`instantiated a new instance of ${AccountService.name}`);
  }

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