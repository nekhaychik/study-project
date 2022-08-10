import { Body, Controller, Get, Post, UseGuards, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDTO } from 'src/user/register.dto';
import { UserService } from 'src/user/user.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authSevice: AuthService,
  ) {}

  @Get('/onlyauth')
  @UseGuards(AuthGuard('jwt'))
  async hiddenInformation() {
    return 'hidden information';
  }

  @Get('/anyone')
  async publicInformation() {
    return 'this can be seen anyone';
  }

  @Post('register')
  async register(@Body() RegisterDTO: RegisterDTO) {
    const user = await this.userService.create(RegisterDTO);
    const payload = {
      email: user.email,
    };
    const token = await this.authSevice.signPayload(payload);
    return { user, token };
  }

  @Post('login')
  async login(@Body() UserDTO: LoginDTO) {
    const user = await this.userService.findByLogin(UserDTO);
    const payload = {
      email: user.email,
    };
    const token = await this.authSevice.signPayload(payload);
    return { user, token };
  }


  @Get('forgot-password/:email')
  public async sendEmailForgotPassword(@Param() params) {
    try {
      let isEmailSent = await this.authSevice.sendEmailForgotPassword(params.email);
      if (isEmailSent){
        return new ResponseSuccess("LOGIN.EMAIL_RESENT", null);
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch (error) {
      return new ResponseError("LOGIN.ERROR.SEND_EMAIL", error);
    }
  }

}
