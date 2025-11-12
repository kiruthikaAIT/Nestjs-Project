import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Queue } from 'bull';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(@InjectQueue('tasks') private taskQueue: Queue) {}

  // Run every 10 seconds
  @Cron('*/10 * * * * *')
  handleCron() {
    this.logger.debug('Called every 10 seconds');
  }

  @Cron('0 37 18 * * *')
  handleCrontime() {
    this.logger.debug('Caled at 6:37 pm');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleEveryMinute() {
    this.logger.debug('Called every minute');
  }

   @Cron('0 42 19 * * *')
  async addTaskToQueue() {
    this.logger.debug('Adding task to queue at 6:51 PM');
    await this.taskQueue.add('dailyTask', { message: 'Hello from cron!' });
  }
}
