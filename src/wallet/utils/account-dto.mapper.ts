import { AccountCreateDto } from "../dtos/account-create.dto";
import { AccountUpdateDto } from "../dtos/account-update.dto";
import { AccountDto } from "../dtos/account.dto";
import { AccountEntity, CreateAccountProps, UpdateAccountProps } from "../entities/account.entity";

export class AccountDtoMapper {

    public static toAccountDto(accountEntity: AccountEntity) : AccountDto {

        let dto: AccountDto = {
            uid: accountEntity.uid,
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

    public static toCreateAccountProps(dto: AccountCreateDto) : CreateAccountProps {

        let props: CreateAccountProps = {
            name: dto.name,
            description: dto.description,
            userId: dto.userId,
            assetId: dto.assetId,
            balance: dto.balance,
            enabled: dto.enabled,
            deleted: false
        }

        return props;
    }

    public static toUpdateAccountProps(uid:string, dto: AccountUpdateDto) : CreateAccountProps {

        let props: UpdateAccountProps = {
            uid: uid,
            name: dto.name,
            description: dto.description,
            userId: dto.userId,
            assetId: dto.assetId,
            balance: dto.balance,
            enabled: dto.enabled,
            deleted: false
        }

        return props;

    }


}