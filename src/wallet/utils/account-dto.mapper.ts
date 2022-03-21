import { AccountDto } from "../dtos/account.dto";
import { AccountEntity } from "../entities/account.entity";

export class AccountDtoMapper {

    public static toAccountDto(accountEntity: AccountEntity) : AccountDto {

        let dto: AccountDto = {
            id: accountEntity.id,
            name: accountEntity.name,
            userId: accountEntity.userId,
            assetId: accountEntity.assetId,
            balance: accountEntity.balance,
            createdAt: accountEntity.createdAt,
            updatedAt: accountEntity.updatedAt,
            description: accountEntity.description,
            enabled: accountEntity.enabled,
        }

        return dto;

    }

    public static toAccountDtos(accountEntities: AccountEntity[]) : AccountDto[] {

        let dtos: AccountDto[] = new Array<AccountDto>(); 
        for (let i = 0; i < accountEntities.length; i++) {
            dtos.push(AccountDtoMapper.toAccountDto(accountEntities[i]));
            
        }

        return dtos;
    }
}