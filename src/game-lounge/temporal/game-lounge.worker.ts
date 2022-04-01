import { Inject, Injectable } from "@nestjs/common";
import { BaseTemporalWorker } from "./base-temporal-worker.service";
import { ActivityInterface } from '@temporalio/activity';
import { WorkerConfigFactory } from "./worker-config.factory";
import { ACTIVITIES_GL_PROVIDER } from "./activities/game-lounge.activity.provider";

export const GAME_LOUNGE_QUEUE:string = "gameLounge";


@Injectable()
export class GameLoungeWorker extends BaseTemporalWorker {
  constructor(
    @Inject(ACTIVITIES_GL_PROVIDER) private readonly activities: ActivityInterface,
    configFactory: WorkerConfigFactory
  ) {
    super();
    this.config = configFactory.createConfig(this.activities, "./workflows/game-lounge.workflow", /* task queue name */ GAME_LOUNGE_QUEUE);
  }
}
