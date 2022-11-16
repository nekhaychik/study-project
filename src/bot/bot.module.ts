import { Module } from '@nestjs/common';

// Services
import { BotService } from './bot.service';

@Module({
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
