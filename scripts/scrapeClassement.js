// scrapeClassement.js

// ----------- DEPENDANCES -----------
const cheerio = require("cheerio");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: './.env' });

// ----------- VARIABLES ENVIRONNEMENT -----------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const URL = "https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/standings";

// ----------- DEBUG: CHECK VARIABLES -----------
console.log("SUPABASE_URL =", SUPABASE_URL);
console.log("Clé Service (début) =", SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10), '...');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Variables d'environnement manquantes. Vérifie ton .env !");
  process.exit(1);
}

// ----------- INIT SUPABASE -----------
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ----------- FONCTION DE SCRAP -----------
async function fetchAndParseClassement() {
  console.log("Tentative de fetch de la page FFBS...");

  // --------- HEADERS ULTRA-HUMAINS ---------
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept":
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Referer": "https://ffbs.wbsc.org/",
    // Ajoute ici "Cookie" si tu veux tester avec ta session navigateur
  };

  // --------- FETCH ---------
  let res;
  try {
    res = await fetch(URL, { headers });
  } catch (err) {
    // Node.js <18: utilise node-fetch
    console.warn("fetch natif indisponible, tentative avec node-fetch...");
    const nodeFetch = require("node-fetch");
    res = await nodeFetch(URL, { headers });
  }

  console.log("Status fetch FFBS :", res.status);

  if (!res.ok) {
    const errText = await res.text();
    console.error("Erreur HTTP :", res.status, errText.slice(0, 200));
    throw new Error("Impossible de récupérer la page FFBS. Statut " + res.status);
  }

  const html = await res.text();

  // 2. Charger avec cheerio
  const $ = cheerio.load(html);

  // 3. Récupérer les onglets (ex : Saison régulière, Play Down, Play Off)
  const tabs = [];
  $("ul.nav-tabs li a").each((i, el) => {
    tabs.push($(el).text().trim());
  });
  console.log("Onglets trouvés :", tabs);

  // 4. Récupérer chaque tableau (1 par onglet)
  const standings = [];
  $(".tab-content .tab-pane").each((i, tabPane) => {
    const tabRows = [];
    $(tabPane)
      .find("table.standings-print tr")
      .slice(1) // skip header
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
  console.log("Nombre de tableaux récupérés :", standings.length);

  // 5. Année depuis le titre
  const year = $("title").text().match(/\d{4}/)?.[0] || "2025";
  console.log("Année détectée :", year);

  return { tabs, standings, year };
}

// ----------- FONCTION INSERTION SUPABASE -----------
async function saveClassementToSupabase(data) {
  const { error } = await supabase.from("classement_normandie").insert([{ data }]);
  if (error) throw error;
}

// ----------- MAIN -----------
(async () => {
  try {
    const classement = await fetchAndParseClassement();
    await saveClassementToSupabase(classement);
    console.log("✅ Classement sauvegardé avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur lors du scrap ou de l’insertion :", err.message || err);
    process.exit(1);
  }
})();
