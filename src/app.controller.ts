import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

// Services
import { AppService } from './app.service';
import { BotService } from './bot/bot.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private botService: BotService,
  ) {}
}
