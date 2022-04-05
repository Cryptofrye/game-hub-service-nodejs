import * as wf from "@temporalio/workflow";
import { AccountEntity, CreateAccountProps } from "src/wallet/entities/account.entity";
import { ActivityFactory } from "../activities/account.activities";

const { createAccount, getAccounts, findById } = wf.proxyActivities<ReturnType<typeof ActivityFactory>>({
  startToCloseTimeout: "30 seconds",
  retry: { initialInterval: "2s", backoffCoefficient: 2 },
});

export async function createAccountFlow(account: CreateAccountProps): Promise<AccountEntity[]> {
  console.log(`running wokflow createAccount with params:${JSON.stringify(account)}`);
  await createAccount(account);
  //await findById("1");
  return await getAccounts();
} 