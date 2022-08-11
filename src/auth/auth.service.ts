import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Interfaces
import { ForgottenPassword, ForgottenPasswordDB } from './interfaces/forgottenpassword.interface';
import { Payload } from './interfaces/jwt-payload.interface';
import { User, UserDB } from 'src/user/interfaces/user.inerface';
import { IToken } from './interfaces/token.interface';

// Services
import { UserService } from 'src/user/user.service';
import { MailService } from './mail.service';
import { JWTService } from './jwt.service';

// DTO
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from 'src/user/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('ForgottenPassword') private readonly forgottenPasswordModel: Model<ForgottenPassword>,
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JWTService,
  ) {}

  public async login(UserDTO: LoginDTO): Promise<{ token: IToken; user: UserDB; }> {
    const userDB: UserDB = await this.userService.findByLogin(UserDTO);
    const token: IToken = await this.jwtService.createToken(UserDTO.email);
    return { token, user: userDB };
  }

  public async register(UserDTO: RegisterDTO): Promise<UserDB> {
    const newUser: UserDB = await this.userService.create(UserDTO);
    return newUser;
  }

  public async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  public async createForgottenPasswordToken(email: string): Promise<ForgottenPasswordDB> {
    const forgottenPassword: ForgottenPasswordDB = await this.forgottenPasswordModel.findOne({ email });
    if (forgottenPassword && ((new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 < 15 )) {
      throw new HttpException('RESET_PASSWORD.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      const forgottenPasswordModel: ForgottenPasswordDB = await this.forgottenPasswordModel.findOneAndUpdate(
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

  public async sendEmailForgotPassword(email: string): Promise<boolean> {
    const userFromDb: UserDB = await this.userModel.findOne({ email });
    if (!userFromDb) {
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    const tokenModel: ForgottenPasswordDB = await this.createForgottenPasswordToken(email);
    if(tokenModel && tokenModel.newPasswordToken){
      return this.mailService.sendEmail(email, tokenModel);
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }
}
