import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as fs from 'fs';

@Injectable()
export class BotService {
  botTg = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

  startBot(bot = this.botTg) {
    const rawdata = fs.readFileSync('./store.json');
    const users = JSON.parse(rawdata).id;

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;

      users.push(chatId);
      let data = { id: users };
      let dataObj = JSON.stringify(data);
      fs.writeFileSync('store.json', dataObj);

      bot.sendMessage(chatId, 'Success');
    });
  }

  sendDbDump(bot = this.botTg) {
    const rawdata = fs.readFileSync('./store.json');
    const users = JSON.parse(rawdata).id;
    if (users.length > 0) {
      for (let i =0; i < users.length; i++) {
        bot.sendDocument(users[i], '../bd.dump');
      }
    }
  }
}
