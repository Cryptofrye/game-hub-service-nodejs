import { Inject, Injectable } from "@nestjs/common";
import { BaseTemporalWorker } from "./base-temporal-worker.service";
import { ActivityInterface } from '@temporalio/activity';
import { WorkerConfigFactory } from "./worker-config.factory";

export const ACCOUNT_QUEUE:string = "account";

//@Injectable()
export class AccountWorker extends BaseTemporalWorker {
  constructor(
    @Inject("ACTIVITIES_PROVIDER") private readonly activities: ActivityInterface,
    configFactory: WorkerConfigFactory
  ) {
    super();

    this.config = configFactory.createConfig(this.activities, "./workflows/account.workflow", /* task queue name */ ACCOUNT_QUEUE);
  }
}