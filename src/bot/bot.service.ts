import * as TelegramBot from 'node-telegram-bot-api';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';

dotenv.config();
const TG_TOKEN = process.env.TELEGRAM_TOKEN;
const DOCKER_CONTAINER = process.env.DOCKER_CONTAINER_NAME;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

@Injectable()
export class BotService implements OnModuleInit {
  private botTg = new TelegramBot(TG_TOKEN, {
    polling: true,
  });

  public onModuleInit() {
    this.startBot();
    this.dump();
    this.logs();
  }

  public startBot() {
    const rawdata = fs.readFileSync('./store.json').toString();
    const users = JSON.parse(rawdata).id;

    this.botTg.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;

      if (!users.find((id) => id === chatId)) {
        users.push(chatId);
        const data = { id: users };
        const dataObj = JSON.stringify(data);
        fs.writeFileSync('store.json', dataObj);

        this.botTg.sendMessage(chatId, 'New');
      } else {
        this.botTg.sendMessage(chatId, 'Old');
      }
    });
  }

  public logs() {
    this.createLogsFile();
    this.botTg.onText(/\/logs/, (msg) => {
      const chatId = msg.chat.id;
      this.botTg.sendDocument(chatId, './docker.log');
    });
  }

  public dump() {
    this.dumpBD();

    this.botTg.onText(/\/dump/, (msg) => {
      const chatId = msg.chat.id;
      this.botTg.sendDocument(chatId, './db.dump');
    });
  }

  public static sendDbDump() {
    const rawdata = fs.readFileSync('./store.json').toString();
    const users = JSON.parse(rawdata).id;
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        let bot = new TelegramBot(TG_TOKEN, {
          polling: true,
        });
        bot.sendDocument(users[i], './db.dump');
        bot = null;
      }
    }
  }

  private dumpBD() {
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
      },
    );
  }

  private createLogsFile() {
    exec(
      `docker logs -f ${DOCKER_CONTAINER} > docker.log`,
      (error, stderr, stdout) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      },
    );
  }
}
