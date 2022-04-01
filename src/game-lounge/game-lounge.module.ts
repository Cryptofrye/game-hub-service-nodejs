import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GameLoungeStateController } from './controllers/game-launge-state.controller';
import { GameLoungeTypeController } from './controllers/game-launge-type.controller';
import { GameLoungeController } from './controllers/game-lounge.controller';
import { GameLoungeEntity } from './entities/game-lounge.entity';
import { GameLoungeService } from './services/game-lounge.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { WalletModule } from 'src/wallet/wallet.module';
import { AccountEntity } from 'src/wallet/entities/account.entity';
import { GameLoungeUserEntity } from './entities/game-lounge-user.entity';
import { GameLoungeRepo } from './repos/game-lounge.repo';
import { WorkerConfigFactory } from './temporal/worker-config.factory';
import { GameLoungeWorker } from './temporal/game-lounge.worker';
import { GameLoungeTemporalClient } from './temporal/game-lounge-temporal-client';
import { TemporalController } from './controllers/temporal.controller';
import { GameLoungeUserWorker } from './temporal/game-lounge-user.worker';
import { GameLoungeActivityProvider } from './temporal/activities/game-lounge.activity.provider';
import { GameLoungeUserActivityProvider } from './temporal/activities/game-lounge-user.activity.provider';


@Module({
  imports: [ 
    SequelizeModule.forFeature([GameLoungeEntity, GameLoungeUserEntity, AccountEntity]),
    WalletModule
    //forwardRef(() => NanoApiModule),
  ],
  providers: [
    GameLoungeTemporalClient,
    GameLoungeActivityProvider,
    GameLoungeUserActivityProvider,
    GameLoungeRepo,
    GameLoungeService,
    WorkerConfigFactory,
    GameLoungeWorker,
    GameLoungeUserWorker
  ],
  controllers: [
    GameLoungeController,
    GameLoungeStateController,
    GameLoungeTypeController,
    TemporalController
  ],
  exports: [GameLoungeTemporalClient,GameLoungeActivityProvider,GameLoungeUserActivityProvider,GameLoungeService]
})
export class GameLoungeModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}