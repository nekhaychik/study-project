import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ForgottenPassword } from './interfaces/forgottenpassword.interface';
import { Payload } from './interfaces/jwt-payload.interface';
import { User } from 'src/user/interfaces/user.inerface';
import { UserService } from 'src/user/user.service';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('ForgottenPassword') private readonly forgottenPasswordModel: Model<ForgottenPassword>,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async signPayload(payload: Payload) {
    return sign(payload, process.env.SECRET_KEY,  { expiresIn: '7d' });
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  async createForgottenPasswordToken(email: string) {
    let forgottenPassword = await this.forgottenPasswordModel.findOne({ email });
    if (forgottenPassword && ((new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 < 15 )) {
      throw new HttpException('RESET_PASSWORD.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      let forgottenPasswordModel = await this.forgottenPasswordModel.findOneAndUpdate(
        { email: email },
        { 
          email: email,
          newPasswordToken: (Math.floor(Math.random() * (9000000)) + 1000000).toString(), //Generate 7 digits number,
          timestamp: new Date(),
        },
        { upsert: true, new: true },
      );
      if (forgottenPasswordModel) {
        return forgottenPasswordModel;
      } else {
        throw new HttpException('LOGIN.ERROR.GENERIC_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async sendEmailForgotPassword(email: string): Promise<boolean> {
    var userFromDb = await this.userModel.findOne({ email });
    if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    var tokenModel = await this.createForgottenPasswordToken(email);

    if(tokenModel && tokenModel.newPasswordToken){
      return this.mailService.sendEmail(email, tokenModel);
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }
}
