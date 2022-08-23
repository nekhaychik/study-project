import { Module } from '@nestjs/common';

// Services
import { CronService } from './cron.service';

@Module({
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
