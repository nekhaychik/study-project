import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as cron from 'node-cron';

@Injectable()
export class CronService {
  dumpDB(): void {
    cron.schedule('*/5 * * * *', () => {
      exec(
        "docker exec mymongodb sh -c 'mongodump --archive' > db.dump",
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
    });
  }

  restoreDB(): void {
    exec(
      "docker exec -i mymongodb sh -c 'mongorestore --archive < db.dump",
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
