import { Module } from '@nestjs/common';
import { BotModule } from 'src/bot/bot.module';

// Services
import { CronService } from './cron.service';

@Module({
  imports: [BotModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
