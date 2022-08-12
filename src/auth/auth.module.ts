import { Module } from '@nestjs/common';

// Modules
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

// Services
import { AuthService } from './auth.service';
import { JWTService } from './jwt.service';
import { MailService } from './mail.service';

// Controllers
import { AuthController } from './auth.controller';

// Strategies
import { JwtStrategy } from './passport/jwt.strategy';

// Schemas
import { ForgottenPasswordSchema } from './schemas/forgottenpassword.schema';

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
