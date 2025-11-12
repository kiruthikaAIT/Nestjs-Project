import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  @Process('send')
  async handleSend(job: Job<{ to: string; subject: string; body: string }>) {
    console.log(`Sending email to ${job.data.to}`);
    // simulate sending email
    await new Promise((res) => setTimeout(res, 2000));
    console.log(`Email sent to ${job.data.to}`);
  }
}
