import { Get, Post, Body, Put, Delete, Param, Query, Controller, HttpCode,ParseIntPipe, ParseBoolPipe, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { AccountCreateDto } from '../dtos/account-create.dto';
import { AccountDto } from '../dtos/account.dto';
import { AccountEntity } from '../entities/account.entity';
import { AccountService } from '../services/account.service';
import { AccountDtoMapper } from '../utils/account-dto.mapper';


@ApiBearerAuth()
@ApiTags('wallets')
@Controller('wallets')
export class WalletController { 

  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Create account' })
  @ApiResponse({ status: 201, description: 'The account has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  async create(@Body() accountCreateDto: AccountCreateDto): Promise<AccountDto> {
    let gl:AccountEntity = await this.accountService.create({...accountCreateDto, deleted:false});
    let glDto:AccountDto = AccountDtoMapper.toAccountDto(gl);
    return glDto;
  }
}