import { exec } from 'child_process';
import path from 'path';

export default async function handler(req, res) {
  const scriptPath = path.resolve('./scripts/scrapeTeam.js');

  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur exec : ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    res.status(200).json({ message: 'ScrapeTeam lancé', output: stdout });
  });
}
