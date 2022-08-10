import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import config from 'src/config';

@Injectable()
export class MailService {
  async sendEmail(email, tokenModel) {
    let transporter = nodemailer.createTransport({
      host: 'localhos',
      port: 587,
      secure: false,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });

    let mailOptions = {
      from: '"Company" <' + config.mail.user + '>', 
      to: email, // list of receivers (separated by ,)
      subject: 'Frogotten Password', 
      text: 'Forgot Password',
      html: 'Hi! <br><br> If you requested to reset your password<br><br>'+
      '<a href='+ config.host.url + ':' + config.host.port +'/auth/reset-password/'+ tokenModel.newPasswordToken + '>Click here</a>'  // html body
    };

    let sent = await new Promise<boolean>(async function(resolve, reject) {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {      
          console.log('Message sent: %s', error);
          return reject(false);
        }
        console.log('Message sent: %s', info.messageId);
        resolve(true);
      });      
    })
    return sent;
  }
}
