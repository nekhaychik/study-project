import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

// Modules
import { AppModule } from './app.module';

require("dotenv").config();

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
