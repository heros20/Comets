// scripts/scrapeClassement.js

import cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const URL = "https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/standings";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("❌ Variables d'environnement manquantes. Vérifie ton .env !");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function scrapeClassement() {
  const res = await fetch(URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }
  });
  if (!res.ok) throw new Error("Impossible de récupérer la page FFBS.");
  const html = await res.text();

  const $ = cheerio.load(html);

  const tabs = [];
  $("ul.nav-tabs li a").each((i, el) => {
    tabs.push($(el).text().trim());
  });

  const standings = [];
  $(".tab-content .tab-pane").each((i, tabPane) => {
    const tabRows = [];
    $(tabPane)
      .find("table.standings-print tr")
      .slice(1)
      .each((j, row) => {
        const cols = $(row).find("td");
        if (cols.length === 8) {
          const teamCell = $(cols[2]);
          const abbr = teamCell.find(".team-name").clone().children().remove().end().text().trim().split('\n')[0];
          const name = teamCell.find("small").text().trim() || abbr;
          const logo = $(cols[1]).find("img").attr("src") || null;
          const teamLink = teamCell.find("a").attr("href") || null;

          tabRows.push({
            rank: parseInt($(cols[0]).text().trim(), 10),
            abbreviation: abbr,
            name,
            logo,
            team_url: teamLink,
            W: parseInt($(cols[3]).text().trim(), 10),
            L: parseInt($(cols[4]).text().trim(), 10),
            T: parseInt($(cols[5]).text().trim(), 10),
            PCT: $(cols[6]).text().trim(),
            GB: $(cols[7]).text().trim()
          });
        }
      });
    standings.push(tabRows);
  });

  const year = $("title").text().match(/\d{4}/)?.[0] || "2025";

  // Insert dans Supabase
  const { error } = await supabase.from("classement_normandie").insert([{ tabs, standings, year }]);
  if (error) throw error;

  return { tabs, standings, year };
}
