import { Get, Post, Body, Put, Delete, Param, Query, Controller, HttpCode, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { GamingLoungeType } from '@wodo-platform/wg-shared-lib/dist/wodogaming/lounge/gaming.lounge.type';
import { GameLoungeService } from '../services/game-lounge.service';

@ApiBearerAuth()
@ApiTags('gaming-lounge-types')
@Controller('gaming-lounge-types')
export class GameLoungeTypeController {
    
    constructor(private readonly gameLoungeService: GameLoungeService) {

    }

    @ApiOperation({ summary: 'Find all gaming lounges types' })
    @ApiResponse({ status: 200, description: 'Return all gaming lounges types.' })
    @Get('')
    async findTypes(): Promise<GamingLoungeType[]> {
        return await this.gameLoungeService.findTypes()
    }


}