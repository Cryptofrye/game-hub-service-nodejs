import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Connection, WorkflowClient } from '@temporalio/client';
import { CreateGameLoungeProps } from '../entities/game-lounge.entity';
import { v4 as uuid } from 'uuid';
import { GAME_LOUNGE_QUEUE } from './game-lounge.worker';
import { CreateGameLoungeUserProps, GameLoungeUserEntity } from '../entities/game-lounge-user.entity';
import { GAME_LOUNGE_USER_QUEUE } from './game-lounge-user.worker';


@Injectable()
export class GameLoungeTemporalClient implements OnApplicationShutdown {
  
  private connection:Connection;
  public client:WorkflowClient;

  onApplicationShutdown(signal: string) {
    console.log(`app shutdown hook ${signal}`); // e.g. "SIGINT"
    this.connection.client.close();
  }
 
  constructor() {
   
    this.connection = new Connection({
      // // Connect to localhost with default ConnectionOptions.
      // // In production, pass options to the Connection constructor to configure TLS and other settings:
      // address: 'foo.bar.tmprl.cloud', // as provisioned
      // tls: {} // as provisioned
    });
  
    this.client = new WorkflowClient(this.connection.service, {
      //namespace: 'gameLounge', // change if you have a different namespace
    });

    console.log(`${GameLoungeTemporalClient.name} instantiated.`)
  }

  async run(gameLounge: CreateGameLoungeProps):Promise<string> {

    let uid:string = gameLounge.uuid ? gameLounge.uuid : uuid();
    const handle = await this.client.start("gameLoungeFlow", {
      args: [gameLounge], // type inference works! args: [name: string]
      taskQueue: GAME_LOUNGE_QUEUE,
      // in practice, use a meaningful business id, eg customerId or transactionId
      workflowId: `${uid}`,
    });
    console.log(`Started game lounge workflow ${handle.workflowId}`);
  
    // optional: wait for client result
    //let result:GameLoungeEntity = await handle.result();
    //console.log(`result:${result}`);
    return handle.workflowId;
  }

  async runAddUserFlow(gameLoungeUser: CreateGameLoungeUserProps):Promise<GameLoungeUserEntity> {

    let uid:string = String(gameLoungeUser.gameLoungeId + "-" + gameLoungeUser.userId);
    const handle = await this.client.start("addUserFlow", {
      args: [gameLoungeUser], // type inference works! args: [name: string]
      taskQueue: GAME_LOUNGE_USER_QUEUE,
      // in practice, use a meaningful business id, eg customerId or transactionId
      workflowId: `${uid}`,
    });
    console.log(`Started add user workflow ${handle.workflowId}`);
  
    // optional: wait for client result
    let result:GameLoungeUserEntity = await handle.result();
    //console.log(`result:${result}`);
    return result;
  }
}




