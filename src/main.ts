import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Modules
import { AppModule } from './app.module';

// Services
import { CronService } from './cron/cron.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  // dump database
  const cron = new CronService();
  cron.dumpDB();

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
