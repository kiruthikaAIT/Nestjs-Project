import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from './email.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly emailService: EmailService) {}

  // // Run every 10 seconds
  // @Cron('*/10 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Cron('0 37 18 * * *')
  // handleCrontime() {
  //   this.logger.debug('Caled at 6:37 pm');
  // }

  // @Cron(CronExpression.EVERY_MINUTE)
  // handleEveryMinute() {
  //   this.logger.debug('Called every minute');
  // }

  // Runs every 10 seconds
  // @Cron('*/10 * * * * *')
  // async handleEmail() {
  //   this.logger.debug('⏰ Cron: called every 10 seconds — adding email job');

  //   await this.emailService.sendEmail({
  //     to: 'kiruthikatait@outlook.com',
  //     subject: 'Automated Email',
  //     body: 'This email was triggered by a cron job every 10 seconds.',
  //   });

  //   this.logger.debug('📨 Email job added to queue successfully!');
  // }
}
