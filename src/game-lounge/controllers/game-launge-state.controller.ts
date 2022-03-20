import { Get, Post, Body, Put, Delete, Param, Query, Controller, HttpCode, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { GamingLoungeState } from '@wodo-platform/wg-shared-lib/dist/wodogaming/lounge/gaming.lounge.state';
import { GameLoungeState } from '../../common/constants/game-lounge-state';
import { GameLoungeService } from '../services/game-lounge.service';

@ApiBearerAuth()
@ApiTags('gaming-lounge-states')
@Controller('gaming-lounge-states')
export class GameLoungeStateController {
    
    constructor(private readonly gamingLoungeService: GameLoungeService) {

    }

    @ApiOperation({ summary: 'Find all gaming lounges states' })
    @ApiResponse({ status: 200, description: 'Return all gaming lounges states.' })
    @Get('')
    async findStates(): Promise<GameLoungeState[]> {
        return await this.gamingLoungeService.findStates();
    }

}