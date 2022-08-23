import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: string, email_to: string) {
      const url = "";
  
      await this.mailerService.sendMail({
        to: email_to,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './confimation', // `.hbs` extension is appended automatically
        context: { // ✏️ filling curly brackets with content
          name: user,
          url,
        },
      });
    }

}
