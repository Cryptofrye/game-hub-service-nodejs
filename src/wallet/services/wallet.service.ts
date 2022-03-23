import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { Transaction } from "sequelize";
import { AccountEntity, CreateAccountProps, UpdateAccountProps } from "../entities/account.entity";


@Injectable()
export class WalletService {

  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectModel(AccountEntity)
    private readonly accountRepo: typeof AccountEntity,
    private sequelize: Sequelize) {
    this.logger.debug(`instantiated a new instance of ${WalletService.name}`);
  }
}