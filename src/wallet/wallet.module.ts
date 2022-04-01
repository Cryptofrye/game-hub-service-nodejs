import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountController } from './controllers/account.controller';
import { TemporalController } from './controllers/temporal.controller';
import { AccountEntity, CreateAccountProps } from './entities/account.entity';
import { AccountService } from './services/account.service';
import { ActivityProvider } from './temporal/activities/account.activities';
import { WalletTemporalClient } from './temporal/account-temporal-client';
import { AccountWorker } from './temporal/account-worker';
import { WorkerConfigFactory } from './temporal/worker-config.factory';



@Module({
  imports: [ 
    SequelizeModule.forFeature([AccountEntity]),
  ],
  providers: [
    AccountService,
    //ActivityProvider,
    //WorkerConfigFactory,
    //AccountWorker,
    //WalletTemporalClient
  ],
  controllers: [
    AccountController,
    //TemporalController
  ],
  exports: [AccountService]
})
export class WalletModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}