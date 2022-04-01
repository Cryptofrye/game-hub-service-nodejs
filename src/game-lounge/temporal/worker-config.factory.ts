import { Injectable } from "@nestjs/common";
import { ActivityInterface } from '@temporalio/activity';
import { WorkerOptions } from '@temporalio/worker';
import { merge } from "rxjs";


@Injectable()
export class WorkerConfigFactory {

  //public baseConfig!: WorkerOptions;

  constructor() {}

  createConfig(activities: ActivityInterface, workflowsPath: string, taskQueue: string, configOverrides?: WorkerOptions): WorkerOptions {
    let baseConfig:WorkerOptions = {
        taskQueue:taskQueue,
        activities,
        workflowsPath: require.resolve(workflowsPath)
    };

    return baseConfig; //merge<[WorkerOptions,WorkerOptions]>(baseConfig, configOverrides);
  }
}