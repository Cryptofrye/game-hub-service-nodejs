
import { Inject, Injectable } from "@nestjs/common";
import { BaseTemporalWorker } from "./base-temporal-worker.service";
import { ActivityInterface } from '@temporalio/activity';
import { WorkerConfigFactory } from "./worker-config.factory";
import { ACTIVITIES_GL_USER_PROVIDER } from "./activities/game-lounge-user.activity.provider";

export const GAME_LOUNGE_USER_QUEUE:string = "gameLoungeUser";


@Injectable()
export class GameLoungeUserWorker extends BaseTemporalWorker {
  constructor(
    @Inject(ACTIVITIES_GL_USER_PROVIDER) private readonly activities: ActivityInterface,
    configFactory: WorkerConfigFactory
  ) {
    super();

    this.config = configFactory.createConfig(this.activities, "./workflows/game-lounge-add-user-workflow",  GAME_LOUNGE_USER_QUEUE);
  }
}