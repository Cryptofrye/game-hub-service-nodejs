import { CreateGameLoungeUserProps, GameLoungeUserEntity } from 'src/game-lounge/entities/game-lounge-user.entity';
import { CreateGameLoungeProps, GameLoungeEntity } from 'src/game-lounge/entities/game-lounge.entity';
import { GameLoungeService } from 'src/game-lounge/services/game-lounge.service';
import { GameLoungeTemporalClient } from '../game-lounge-temporal-client';





export const GameLoungeActivityFactory = (gameLoungeService: GameLoungeService, gameLoungeTemporalClient: GameLoungeTemporalClient) => ({
    
    createGameLounge: async (gameLounge: CreateGameLoungeProps): Promise<GameLoungeEntity> => {
        console.log(`${GameLoungeActivityFactory.name}: createGameLounge activity  with params:${JSON.stringify(gameLounge)}`);
        return await  gameLoungeService.create(gameLounge);
    },
    abordGameLounge: async (gameLounge: CreateGameLoungeProps): Promise<void> => {
        console.log(`${GameLoungeActivityFactory.name}: abordGameLounge activity  with params:${JSON.stringify(gameLounge)}`);
    },
    addUser: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<GameLoungeUserEntity> => {
        console.log(`${GameLoungeActivityFactory.name}: addUser activity with params:${JSON.stringify(gameLoungeUser)}`);
        return await gameLoungeTemporalClient.runAddUserFlow(gameLoungeUser);
    },
    removeUser: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<void> => {
        console.log(`${GameLoungeActivityFactory.name}: removeUser activity with params:${JSON.stringify(gameLoungeUser)}`);
    },
    startGame: async (): Promise<void> => {
        console.log(`${GameLoungeActivityFactory.name}: startGame activity`);
    },
    processGameResult: async (): Promise<void> => {
        console.log(`${GameLoungeActivityFactory.name}: processGameResult activity`);
    },
    closeGameLaounge: async (): Promise<GameLoungeEntity> => {
        console.log(`${GameLoungeActivityFactory.name}: closeGameLaounge activity`);
        return await gameLoungeService.findById(1);
    },
});



