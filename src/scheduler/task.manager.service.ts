import { Injectable, Logger} from '@nestjs/common';
import { Cron, CronExpression,SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TaskManager {

    private readonly logger = new Logger(TaskManager.name);
    constructor(
        private schedulerRegistry: SchedulerRegistry){

    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    retrieveBananoTransactions() {
        this.logger.debug(`running the scheduled task.Start time:`+new Date());
        
        this.logger.debug(`completed the scheduled task.End time:`+new Date());
    }

}