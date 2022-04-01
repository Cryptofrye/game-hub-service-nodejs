import { Get, Post, Body, Put, Delete, Param, Query, Controller, HttpCode,ParseIntPipe, ParseBoolPipe, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { AccountCreateDto } from '../dtos/account-create.dto';
import { AccountDto } from '../dtos/account.dto';
import { AccountEntity } from '../entities/account.entity';
import { AccountService } from '../services/account.service';
import { WalletTemporalClient } from '../temporal/account-temporal-client';
import { AccountDtoMapper } from '../utils/account-dto.mapper';


@ApiBearerAuth()
@ApiTags('temporal')
//@Controller('temporal')
export class TemporalController { 

  constructor( private readonly walletTemporalClient:WalletTemporalClient) {}

  @ApiOperation({ summary: 'Run temporal flow' })
  @ApiResponse({ status: 201, description: 'The flow has been successfully executed' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  async createUser(@Body(/*new ValidationPipe(VALIDATION_SCHEMA_GAMING_LOUNGE_CREATE)*/) accountCreateDto: AccountCreateDto): Promise<AccountEntity[]> {
    console.log(`running temporal controller with params:${JSON.stringify(accountCreateDto)}`)
    let result:AccountEntity[] = await this.walletTemporalClient.run({...accountCreateDto, deleted:false});
    return result;
  }
}