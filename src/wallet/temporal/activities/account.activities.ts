import { FactoryProvider } from '@nestjs/common';

import { AccountEntity, CreateAccountProps } from '../../entities/account.entity';
import { AccountService } from '../../services/account.service';


export const ActivityFactory = (accountService: AccountService) => ({
    createAccount: async (account: CreateAccountProps): Promise<AccountEntity> => {
        console.log(`running activity createAccount with params:${JSON.stringify(account)}`);
        return await accountService.create(account);
    },
    getAccounts: async (): Promise<AccountEntity[]> => {
        return await accountService.findAll(null, null);
    },
    findById: async (id: string): Promise<AccountEntity> => {
        return await accountService.findById(id);
    },
    createGameLounge: async ()  => {
    }
});

// Provider to make activities available within Nest's DI context
export const ActivityProvider: FactoryProvider = {
    provide: "ACTIVITIES_PROVIDER",
    inject: [AccountService],
    useFactory: ActivityFactory,
};