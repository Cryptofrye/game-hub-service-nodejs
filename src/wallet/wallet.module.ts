import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountController } from './controllers/account.controller';
import { AccountEntity } from './entities/account.entity';
import { AccountService } from './services/account.service';


@Module({
  imports: [ 
    SequelizeModule.forFeature([AccountEntity]),
  ],
  providers: [
    AccountService
  ],
  controllers: [
    AccountController
  ],
  exports: [AccountService]
})
export class WalletModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}