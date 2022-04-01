
import { FactoryProvider, } from '@nestjs/common';
import { CreateGameLoungeUserProps, GameLoungeUserEntity } from 'src/game-lounge/entities/game-lounge-user.entity';
import { GameLoungeService } from 'src/game-lounge/services/game-lounge.service';


export const GameLoungeUserActivityFactory = (gameLoungeService: GameLoungeService) => ({
    
    addUser: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<GameLoungeUserEntity> => {
        console.log(`${GameLoungeUserActivityFactory.name}: addUser activity with params:${JSON.stringify(gameLoungeUser)}`);
        return await gameLoungeService.addPlayer(gameLoungeUser);
    },
    removeUser: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<void> => {
        console.log(`${GameLoungeUserActivityFactory.name}: removeUser activity with params:${JSON.stringify(gameLoungeUser)}`);
    },
    withdrawFee: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<void> => {
        console.log(`${GameLoungeUserActivityFactory.name}: withdrawFee activity with params:${JSON.stringify(gameLoungeUser)}`);
    },
    refoundFee: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<void> => {
        console.log(`${GameLoungeUserActivityFactory.name}: refoundFee activity with params:${JSON.stringify(gameLoungeUser)}`);
    }
});


