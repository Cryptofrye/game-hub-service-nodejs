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


@Module({
  imports: [ 
    SequelizeModule.forFeature([GameLoungeEntity, GameLoungeUserEntity, AccountEntity]),
    WalletModule
  ],
  providers: [
    GameLoungeRepo,
    GameLoungeService
  ],
  controllers: [
    GameLoungeController,
    GameLoungeStateController,
    GameLoungeTypeController
  ],
  exports: [GameLoungeService]
})
export class GameLoungeModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}