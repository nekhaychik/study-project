import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Modules
import { AppModule } from './app.module';
import { BotService } from './bot/bot.service';

// Services
import { CronService } from './cron/cron.service';

dotenv.config();

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  // dump database
  const bot: BotService = new BotService();
  const cron: CronService = new CronService();
  cron.dumpDB();
  bot.startBot();

  const config = new DocumentBuilder()
    .setTitle('Study Project')
    .setDescription('The study project API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
