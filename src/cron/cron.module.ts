import { Module } from '@nestjs/common';
import { BotService } from 'src/bot/bot.service';

// Services
import { CronService } from './cron.service';

@Module({
  imports: [],
  providers: [CronService, BotService],
  exports: [CronService],
})
export class CronModule {}
