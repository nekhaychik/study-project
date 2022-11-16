import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CronModule } from './cron/cron.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'), // Loaded from .ENV
      }),
    }),
    UserModule,
    AuthModule,
    CronModule,
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
