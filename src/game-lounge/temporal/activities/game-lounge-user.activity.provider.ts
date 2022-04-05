

import { FactoryProvider,  } from '@nestjs/common';
import { GameLoungeService } from 'src/game-lounge/services/game-lounge.service';
import { AccountService } from 'src/wallet/services/account.service';
import { GameLoungeUserActivityFactory } from './game-lounge-user.activities';

export const ACTIVITIES_GL_USER_PROVIDER:string = "ACTIVITIES_GL_USER_PROVIDER";

// Provider to make activities available within Nest's DI context
export const GameLoungeUserActivityProvider: FactoryProvider = {
    provide: ACTIVITIES_GL_USER_PROVIDER,
    inject: [GameLoungeService,AccountService],
    useFactory: GameLoungeUserActivityFactory,
};