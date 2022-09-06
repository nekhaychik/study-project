import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {
  botMessage() {
    process.env.NTBA_FIX_319 = '1';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TelegramBot = require('node-telegram-bot-api');

    const token = '5686893949:AAGI3dUo6jD94flbsPwX11-9mbLXQRORY5U';

    const bot = new TelegramBot(token, { pulling: true });

    console.log('out');

    bot.onText(/\/echo(.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const resp = match[1];

      console.log('in');

      bot.sendMessage(chatId, 'MongoDB dump');

      bot.sendDocument(chatId, 'db.dump');
    });
  }
}
