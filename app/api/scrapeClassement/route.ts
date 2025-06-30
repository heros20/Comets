import { exec } from 'child_process';
import path from 'path';

export async function GET(request) {
  const scriptPath = path.resolve('./scripts/scrapeClassement.js');

  return new Promise((resolve) => {
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur exec : ${error.message}`);
        resolve(new Response(JSON.stringify({ error: error.message }), { status: 500 }));
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(new Response(JSON.stringify({ message: 'ScrapeClassement lancé', output: stdout }), { status: 200 }));
    });
  });
}
