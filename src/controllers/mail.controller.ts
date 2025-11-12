// mail.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from 'src/services/mail.service';
import { MESSAGES } from 'src/utils/const';

@Controller('api/mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('welcome')
  async sendWelcome(@Body() body: { email: string; name: string }) {
    const { email, name } = body;
    console.log(email, name);

    await this.mailService.sendWelcomeMail(email, name);
    return { sucess: true, message: MESSAGES.EMAIL_SUCESS };
  }

  @Post('reset')
  async sendReset(@Body() body: { email: string; name: string }) {
    const { email, name } = body;
    const resetLink = 'https://example.com/reset-password';
    await this.mailService.sendPasswordReset(email, name, resetLink);
    return { success: true, message: MESSAGES.RESET_EMAIL };
  }
}
