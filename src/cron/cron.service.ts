import { Injectable, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';
import * as cron from 'node-cron';
import * as dotenv from 'dotenv';

// Services
import { BotService } from 'src/bot/bot.service';

dotenv.config();
const DOCKER_CONTAINER = process.env.DOCKER_CONTAINER_NAME;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

@Injectable()
export class CronService implements OnModuleInit {
  public onModuleInit(): void {
    this.dumpDB();
  }

  public dumpDB(): void {
    cron.schedule('0 0 13 * *', () => {
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
    });
  }

  public restoreDB(): void {
    exec(
      `docker exec -i ${DOCKER_CONTAINER} sh -c 'mongorestore --authenticationDatabase admin -u ${MONGODB_USER} -p ${MONGODB_PASSWORD} --db ${MONGODB_DATABASE} --archive' < db.dump`,
      (error, stdout, stderr) => {
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
