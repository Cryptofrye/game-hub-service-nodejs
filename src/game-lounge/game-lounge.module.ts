import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GameLoungeStateController } from './controllers/game-launge-state.controller';
import { GameLoungeTypeController } from './controllers/game-launge-type.controller';
import { GameLoungeController } from './controllers/game-lounge.controller';
import { GameLoungeEntity } from './entities/game-lounge.orm.entity';
import { GameLoungeService } from './services/game-lounge.service';
import { SequelizeModule } from '@nestjs/sequelize';


@Module({
  imports: [ 
    SequelizeModule.forFeature([GameLoungeEntity])
  ],
  providers: [
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