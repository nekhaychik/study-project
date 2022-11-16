import { Module } from '@nestjs/common';

// Modules
import { BotModule } from 'src/bot/bot.module';

// Services
import { CronService } from './cron.service';

@Module({
  imports: [BotModule],
  providers: [CronService],
})
export class CronModule {}
