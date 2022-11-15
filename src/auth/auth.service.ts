import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Interfaces
import { Payload } from './interfaces/jwt-payload.interface';
import { IToken } from './interfaces/token.interface';

// Services
import { UserService } from 'src/user/user.service';
import { MailService } from './mail.service';
import { JWTService } from './jwt.service';

// DTO
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// Schemas
import { User, UserDocument } from 'src/user/schemas/user.schema';
import {
  ForgottenPassword,
  ForgottenPasswordDocument,
} from './schemas/forgottenpassword.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ForgottenPassword.name)
    private readonly forgottenPasswordModel: Model<ForgottenPasswordDocument>,
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JWTService,
  ) {}

  public async login(
    UserDTO: LoginDto,
  ): Promise<{ token: IToken; user: UserDocument }> {
    const userDB: UserDocument = await this.userService.findByLogin(UserDTO);
    const token: IToken = await this.jwtService.createToken(UserDTO.email);
    return { token, user: userDB };
  }

  public async register(UserDTO: RegisterDto): Promise<UserDocument> {
    const newUser: UserDocument = await this.userService.create(UserDTO);
    return newUser;
  }

  public async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  public async createForgottenPasswordToken(
    email: string,
  ): Promise<ForgottenPasswordDocument> {
    const forgottenPassword: ForgottenPasswordDocument =
      await this.forgottenPasswordModel.findOne({ email });
    if (
      forgottenPassword &&
      (new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 <
        15
    ) {
      throw new HttpException(
        'RESET_PASSWORD.EMAIL_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const forgottenPasswordModel: ForgottenPasswordDocument =
        await this.forgottenPasswordModel.findOneAndUpdate(
          { email: email },
          {
            email: email,
            newPasswordToken: (
              Math.floor(Math.random() * 9000000) + 1000000
            ).toString(), //Generate 7 digits number,
            timestamp: new Date(),
          },
          { upsert: true, new: true },
        );
      if (forgottenPasswordModel) {
        return forgottenPasswordModel;
      } else {
        throw new HttpException(
          'LOGIN.ERROR.GENERIC_ERROR',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async sendEmailForgotPassword(email: string): Promise<boolean> {
    const userFromDb: UserDocument = await this.userModel.findOne({ email });
    if (!userFromDb) {
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    const tokenModel: ForgottenPasswordDocument =
      await this.createForgottenPasswordToken(email);
    if (tokenModel && tokenModel.newPasswordToken) {
      return this.mailService.sendEmail(email, tokenModel);
    } else {
      throw new HttpException(
        'REGISTER.USER_NOT_REGISTERED',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
