import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// DTO
import { LoginDTO } from './dto/login.dto';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RegisterDTO } from 'src/user/dto/register.dto';

// Services
import { AuthService } from './auth.service';

// Interfaces
import { UserDB } from 'src/user/interfaces/user.inerface';
import { Payload } from './interfaces/jwt-payload.interface';
import { IToken } from './interfaces/token.interface';

@Controller('auth')
export class AuthController {
  constructor(private authSevice: AuthService) {}

  @Get('/onlyauth')
  @UseGuards(AuthGuard('jwt'))
  public async hiddenInformation(): Promise<string> {
    return 'hidden information';
  }

  @Get('/anyone')
  public async publicInformation(): Promise<string> {
    return 'this can be seen anyone';
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(
    @Body() RegisterDTO: RegisterDTO,
  ): Promise<ResponseSuccess | ResponseError> {
    try {
      const user: UserDB = await this.authSevice.register(RegisterDTO);
      return new ResponseSuccess('REGISTER.SUCCESS', { user });
    } catch (error: any) {
      return new ResponseError('REGISTER.ERROR', error);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() UserDTO: LoginDTO,
  ): Promise<ResponseSuccess | ResponseError> {
    try {
      const response: { token: IToken; user: UserDB } =
        await this.authSevice.login(UserDTO);
      return new ResponseSuccess('LOGIN.SECCESS', response);
    } catch (error: any) {
      return new ResponseError('LOGIN.ERROR', error);
    }
  }

  @Get('forgot-password/:email')
  public async sendEmailForgotPassword(
    @Param() params: Payload,
  ): Promise<ResponseSuccess | ResponseError> {
    try {
      const isEmailSent: boolean =
        await this.authSevice.sendEmailForgotPassword(params.email);
      if (isEmailSent) {
        return new ResponseSuccess('LOGIN.EMAIL_RESENT', null);
      } else {
        return new ResponseError('REGISTRATION.ERROR.MAIL_NOT_SENT');
      }
    } catch (error: any) {
      return new ResponseError('LOGIN.ERROR.SEND_EMAIL', error);
    }
  }
}
