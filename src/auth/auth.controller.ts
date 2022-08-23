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
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// DTO
import { LoginDTO } from './dto/login.dto';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { RegisterDTO } from './dto/register.dto';

// Services
import { AuthService } from './auth.service';

// Interfaces
import { Payload } from './interfaces/jwt-payload.interface';
import { IToken } from './interfaces/token.interface';

// Schemas
import { UserDocument } from 'src/user/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authSevice: AuthService) {}

  @Get('/onlyauth')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('jwt'))
  public async hiddenInformation(): Promise<string> {
    return 'hidden information';
  }

  @Get('/anyone')
  @ApiExcludeEndpoint()
  public async publicInformation(): Promise<string> {
    return 'this can be seen anyone';
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: [RegisterDTO] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ResponseSuccess,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User with this email already exists',
    type: ResponseError,
  })
  @HttpCode(HttpStatus.OK)
  public async register(
    @Body() RegisterDTO: RegisterDTO,
  ): Promise<ResponseSuccess | ResponseError> {
    try {
      const user: UserDocument = await this.authSevice.register(RegisterDTO);
      return new ResponseSuccess('REGISTER.SUCCESS', { user });
    } catch (error: any) {
      return new ResponseError('REGISTER.ERROR', error);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: [LoginDTO] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ResponseSuccess,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User does not exist',
    type: ResponseError,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid credential',
    type: ResponseError,
  })
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() UserDTO: LoginDTO,
  ): Promise<ResponseSuccess | ResponseError> {
    try {
      const response: { token: IToken; user: UserDocument } =
        await this.authSevice.login(UserDTO);
      return new ResponseSuccess('LOGIN.SECCESS', response);
    } catch (error: any) {
      return new ResponseError('LOGIN.ERROR', error);
    }
  }

  @Get('forgot-password/:email')
  @ApiOperation({ summary: 'Send email with password' })
  @ApiParam({ name: 'email', required: true, description: 'User email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ResponseSuccess,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    type: ResponseError,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not registered',
    type: ResponseError,
  })
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
