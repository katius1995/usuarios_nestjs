import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserMail(user: string, email_to: string) {
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

    async sendUserMailWithFile(user: string, email_to: string) {
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
          attachments:[{
            path:    join(__dirname,'images','texturaTerreno.jpg'),
            filename:'texturaTerreno.jpg',
            contentDisposition:"attachment"
          }]
        });
      }

}
