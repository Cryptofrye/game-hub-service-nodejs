

import { FactoryProvider,  } from '@nestjs/common';
import { GameLoungeService } from 'src/game-lounge/services/game-lounge.service';
import { GameLoungeTemporalClient } from '../game-lounge-temporal-client';
import { GameLoungeActivityFactory } from './game-lounge.activities';


export const ACTIVITIES_GL_PROVIDER:string = "ACTIVITIES_GL_PROVIDER";
// Provider to make activities available within Nest's DI context
export const GameLoungeActivityProvider: FactoryProvider = {
    provide: ACTIVITIES_GL_PROVIDER,
    inject: [GameLoungeService, GameLoungeTemporalClient],
    useFactory: GameLoungeActivityFactory,
};
