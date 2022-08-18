// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require('node-cron');
import { exec } from 'child_process';

export default cron.schedule('*/5 * * * *', () => {
  exec(
    "docker exec mymongodb sh -c 'mongodump --archive' study-project/db.dump",
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
