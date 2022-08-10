import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './passport/jwt.strategy';
import { JWTService } from './jwt.service';
import { MailService } from './mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgottenPasswordSchema } from 'src/models/forgottenpassword.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: 'ForgottenPassword', schema: ForgottenPasswordSchema },
    ]),
  ],
  providers: [AuthService, JwtStrategy, JWTService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
