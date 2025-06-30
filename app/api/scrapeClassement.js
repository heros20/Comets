// app/api/scrapeClassement.js (handler)
import { scrapeClassement } from '../../scripts/2scrapeClassement';

export default async function handler(req, res) {
  try {
    const result = await scrapeClassement();
    res.status(200).json({ message: "Scrape classement OK", data: result });
  } catch (err) {
    res.status(500).json({ error: err.message || err.toString() });
  }
}
