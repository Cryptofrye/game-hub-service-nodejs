
import { FactoryProvider, } from '@nestjs/common';
import { CreateGameLoungeUserProps, GameLoungeUserEntity } from 'src/game-lounge/entities/game-lounge-user.entity';
import { GameLoungeEntity } from 'src/game-lounge/entities/game-lounge.entity';
import { GameLoungeService } from 'src/game-lounge/services/game-lounge.service';
import { AccountEntity } from 'src/wallet/entities/account.entity';
import { AccountService } from 'src/wallet/services/account.service';


export const GameLoungeUserActivityFactory = (gameLoungeService: GameLoungeService, accountService:AccountService) => ({
    
    addUser: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<GameLoungeUserEntity> => {
        console.log(`${GameLoungeUserActivityFactory.name}: addUser activity with params:${JSON.stringify(gameLoungeUser)}`);
        return await gameLoungeService.addPlayer(gameLoungeUser);
    },
    removeUser: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<void> => {
        console.log(`${GameLoungeUserActivityFactory.name}: removeUser activity with params:${JSON.stringify(gameLoungeUser)}`);
    },
    withdrawFee: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<AccountEntity> => {
        console.log(`${GameLoungeUserActivityFactory.name}: withdrawFee activity with params:${JSON.stringify(gameLoungeUser)}`);
        let gl:GameLoungeEntity = await gameLoungeService.findById(gameLoungeUser.gameLoungeId);
        return await accountService.withdrawAsset(gameLoungeUser.userId,gl.assetId,gl.fee,null);
    },
    refoundFee: async (gameLoungeUser: CreateGameLoungeUserProps): Promise<void> => {
        console.log(`${GameLoungeUserActivityFactory.name}: refoundFee activity with params:${JSON.stringify(gameLoungeUser)}`);
    }
});


