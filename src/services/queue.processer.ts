import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('tasks')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);

  @Process('dailyTask')
  async handleDailyTask(job: Job) {
    this.logger.debug(`Processing job: ${job.data.message}`);
  }
}
