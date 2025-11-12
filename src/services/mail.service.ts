// mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  // Welcome email
  async sendWelcomeMail(to: string, name: string) {
    const html = `
      <html>
        <body>
          <h1>Welcome to Our App 🎉</h1>
          <p>Hi ${name || ""},</p>
          <p>We are excited to have you onboard. Explore our app and enjoy the features!</p>
          <p>Cheers,<br/>The Team</p>
        </body>
      </html>
    `;

    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Welcome to Our App 🎉',
        html,
        text: `Hi ${name||""}, Welcome to our app! Explore and enjoy the features. Cheers, The Team`,
      });
      this.logger.log(`Welcome email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}`, error);
      throw error; 
    }
  }

  // Password reset email 
  async sendPasswordReset(to: string, name: string, resetLink: string) {
    const html = `
      <html>
        <body>
          <h1>Password Reset Request 🔒</h1>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you didn't request this, ignore this email.</p>
          <p>Cheers,<br/>The Team</p>
        </body>
      </html>
    `;

    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Password Reset Request 🔒',
        html,
        text: `Hi ${name}, reset your password using this link: ${resetLink}`,
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}`, error);
      throw error;
    }
  }

}
