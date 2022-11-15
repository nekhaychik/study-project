import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as cron from 'node-cron';
import { BotService } from 'src/bot/bot.service';

@Injectable()
export class CronService {
  public dumpDB(): void {
    cron.schedule('0 0 13 * *', () => {
      exec(
        "docker exec mongodbStudyProject sh -c 'mongodump --authenticationDatabase admin -u root -p rootpassword --db test --archive' > db.dump",
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
      'docker exec -i mongodbStudyProject /usr/bin/mongorestore --username root --password rootpassword --authenticationDatabase admin --db test /dump/test',
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
