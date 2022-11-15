import * as TelegramBot from 'node-telegram-bot-api';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';

dotenv.config();
const TOKEN = process.env.TELEGRAM_TOKEN;
const DOCKER_CONTAINER = process.env.DOCKER_CONTAINER_NAME;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

@Injectable()
export class BotService implements OnModuleInit {
  static botTg = new TelegramBot(TOKEN, {
    polling: true,
  });

  onModuleInit() {
    BotService.startBot();
    BotService.dump();
    BotService.logs();
  }

  public static startBot(bot = this.botTg) {
    const rawdata = fs.readFileSync('./store.json').toString();
    const users = JSON.parse(rawdata).id;

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;

      if (!users.find((id) => id === chatId)) {
        users.push(chatId);
        const data = { id: users };
        const dataObj = JSON.stringify(data);
        fs.writeFileSync('store.json', dataObj);

        bot.sendMessage(chatId, 'New');
      } else {
        bot.sendMessage(chatId, 'Old');
      }
    });
  }

  public static logs(bot = this.botTg) {
    this.createLogsFile();
    bot.onText(/\/logs/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendDocument(chatId, './docker.logs');
    });
  }

  public static dump(bot = this.botTg) {
    this.dumpBD();

    bot.onText(/\/dump/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendDocument(chatId, './db.dump');
    });
  }

  public static sendDbDump(bot = this.botTg) {
    const rawdata = fs.readFileSync('./store.json').toString();
    const users = JSON.parse(rawdata).id;
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        bot.sendDocument(users[i], './db.dump');
      }
    }
  }

  private static dumpBD() {
    exec(
      `docker exec ${DOCKER_CONTAINER} sh -c 'mongodump --authenticationDatabase admin -u ${MONGODB_USER} -p ${MONGODB_PASSWORD} --db ${MONGODB_DATABASE} --archive' > db.dump`,
      (error, stderr, stdout) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        BotService.sendDbDump();
      },
    );
  }

  private static createLogsFile() {
    exec(
      `docker logs -f ${DOCKER_CONTAINER} > docker.logs`,
      (error, stderr, stdout) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        BotService.sendDbDump();
      },
    );
  }
}
