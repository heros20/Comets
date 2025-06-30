import cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const URL = "https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/standings";

export async function scrapeTeam() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Impossible de récupérer la page FFBS.");
  const html = await res.text();

  const $ = cheerio.load(html);
  // ... Ton scraping ici
  // Et l’insert supabase

  return { message: "ScrapeClassement OK" };
}
