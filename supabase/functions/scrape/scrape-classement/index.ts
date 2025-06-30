// supabase/functions/scrape-classement/index.ts

// ------------- IMPORTS DENO STYLE -------------
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ------------- CONFIG ENV -------------
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const URL = "https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/standings";

// ------------- INIT SUPABASE -------------
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ------------- MAIN HANDLER -------------
serve(async (req) => {
  try {
    // 1. Fetch de la page FFBS
    const res = await fetch(URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Deno Supabase Edge Function)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Impossible de récupérer la page FFBS." }), { status: 500 });
    }
    const html = await res.text();

    // 2. Cheerio parsing
    const $ = cheerio.load(html);

    // 3. Tabs et standings
    const tabs: string[] = [];
    $("ul.nav-tabs li a").each((i, el) => tabs.push($(el).text().trim()));

    const standings: any[] = [];
    $(".tab-content .tab-pane").each((i, tabPane) => {
      const tabRows: any[] = [];
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
    const classement = { tabs, standings, year };

    // 4. Enregistrer dans Supabase
    // (tu peux delete/clean ici si tu veux comme dans le script original)
    await supabase.from("classement_normandie").delete().neq('id', 0);
    const { error } = await supabase.from("classement_normandie").insert([{ data: classement }]);
    if (error) throw error;

    // 5. Réponse HTTP OK
    return new Response(JSON.stringify({ ok: true, message: "Classement scrappé et sauvegardé !", classement }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || err }), { status: 500 });
  }
});
