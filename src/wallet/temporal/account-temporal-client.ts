// @@@SNIPSTART typescript-hello-client
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Connection, WorkflowClient } from '@temporalio/client';
import { AccountEntity, CreateAccountProps } from 'src/wallet/entities/account.entity';
import { WorkerConfigFactory } from './worker-config.factory';
import { createAccountFlow } from './workflows/account.workflow';


//@Injectable()
export class WalletTemporalClient implements OnApplicationShutdown {
  

  private connection:Connection;
  private client:WorkflowClient;

  onApplicationShutdown(signal: string) {
    console.log(`app shutdown hook ${signal}`); // e.g. "SIGINT"
    this.connection.client.close();
  }
 

  constructor(private readonly configFactory: WorkerConfigFactory) {
    this.connection = new Connection({
      // // Connect to localhost with default ConnectionOptions.
      // // In production, pass options to the Connection constructor to configure TLS and other settings:
      // address: 'foo.bar.tmprl.cloud', // as provisioned
      // tls: {} // as provisioned
    });
  
    this.client = new WorkflowClient(this.connection.service, {
      // namespace: 'default', // change if you have a different namespace
    });
  }

  async run(account: CreateAccountProps):Promise<AccountEntity[]> {


    const handle = await this.client.start(createAccountFlow, {
      args: [account], // type inference works! args: [name: string]
      taskQueue: this.configFactory.baseConfig.taskQueue,
      // in practice, use a meaningful business id, eg customerId or transactionId
      workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
    });
    console.log(`Started workflow ${handle.workflowId}`);
  
    // optional: wait for client result
    let result:AccountEntity[] = await handle.result();
    console.log(`result:${result.length}`); // Hello, Temporal!
    return result;
  }
}




