import { Logger, OnModuleInit } from "@nestjs/common";
import { Worker } from '@temporalio/worker';
import { WorkerOptions } from '@temporalio/worker/lib/worker-options';

export class BaseTemporalWorker implements OnModuleInit {
    private readonly logger = new Logger(BaseTemporalWorker.name);
  
    private worker!: Worker;
    private _config!: WorkerOptions;
  
    set config(value: WorkerOptions) {
      this._config = value;
    }

    get config() {
      return this._config;
    }
  
    private async startWorker() {
      console.log("Starting temporal worker with config " + JSON.stringify(this._config));
      this.worker = await Worker.create(this._config);
      await this.worker.run();
    }
  
    async onModuleInit() {
      this.startWorker().catch(err => {
        console.error(err);
      });
    }
  }