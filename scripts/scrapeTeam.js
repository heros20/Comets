// scripts/scrapeTeam.js

// ----------- DEPENDANCES -----------
const cheerio = require("cheerio");
require("dotenv").config({ path: './.env' });
const fetch = global.fetch || require("node-fetch");
const { createClient } = require('@supabase/supabase-js');

// ----------- SUPABASE INIT -----------
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(process.env.SUPABASE_URL, supabaseKey);


// ----------- VARIABLES -----------
const URL = "https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/teams/34745";
const TEAM_ABBR = "HON"; // Change si tu scrap d'autres teams

// ----------- SCRAP TEAM FUNCTION -----------
async function fetchAndParseTeamPage() {
  console.log("Tentative de fetch de la page d’équipe FFBS...");
  const res = await fetch(URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }
  });
  console.log("Status fetch FFBS :", res.status);
  if (!res.ok) throw new Error("Impossible de récupérer la page FFBS.");
  const html = await res.text();

  // Charger le HTML dans Cheerio
  const $ = cheerio.load(html);

  // ----------- INFOS D'ÉQUIPE -----------
  const teamName = $(".team-heading h1").first().text().trim();
  console.log("Nom d’équipe :", teamName);

  // ----------- EXTRACTION DU ROSTER -----------
  const roster = [];
  $('h3:contains("Roster")').next("table").find("tbody tr").each((i, row) => {
    const cols = $(row).find("td");
    if (cols.length === 7) {
      const number = $(cols[0]).text().trim();
      const $playerCell = $(cols[1]);
      const playerLink = $playerCell.find("a").attr("href") || null;
      const lastName = $playerCell.find("strong").text().trim();
      let firstName = $playerCell.text().replace(lastName, "").trim();
      firstName = firstName.replace(/\s+/g, " ");

      const pos = $(cols[2]).text().trim();
      const bt = $(cols[3]).text().trim();
      const height = $(cols[4]).text().trim();
      const weight = $(cols[5]).text().trim();
      const yob = $(cols[6]).text().trim();

      roster.push({
        number,
        last_name: lastName,
        first_name: firstName,
        pos,
        bt,
        height,
        weight,
        yob,
        player_link: playerLink,
        team_abbr: TEAM_ABBR
      });
    }
  });
  console.log("Roster extrait :", roster);

  // ----------- EXTRACTION DES MATCHS -----------
  const games = [];
  $('.box-container:has(h3:contains("Rencontres")) .game-row').each((i, gameRow) => {
    const $a = $(gameRow).find("a");
    const boxscoreLink = $a.attr("href") && $a.attr("href") !== "#" ? $a.attr("href") : null;
    const $row = $a.find('.row');
    const $cols = $row.find('.col-xs-4');

    // Home/Away (gauche: visiteurs, droite: recevant)
    const awayAbbr = $($cols[0]).find('.team-name').text().trim();
    const awayLogo = $($cols[0]).find('img').attr('src') || null;
    const homeAbbr = $($cols[2]).find('.team-name').text().trim();
    const homeLogo = $($cols[2]).find('img').attr('src') || null;

    // Le score, le numéro, la date
    const $scoreBlock = $($cols[1]).find('.score');
    const gameNumber = $scoreBlock.find('p').first().text().trim();
    const [awayScore, homeScore] = $scoreBlock.find('span').map((_, el) => parseInt($(el).text().trim(), 10)).get();
    const date = $scoreBlock.find('p').last().text().trim();

    // Qui est Honfleur ?
    let isHome, opponentAbbr, opponentLogo, teamScore, opponentScore;
    if (homeAbbr === TEAM_ABBR) {
      isHome = true;
      opponentAbbr = awayAbbr;
      opponentLogo = awayLogo;
      teamScore = homeScore;
      opponentScore = awayScore;
    } else if (awayAbbr === TEAM_ABBR) {
      isHome = false;
      opponentAbbr = homeAbbr;
      opponentLogo = homeLogo;
      teamScore = awayScore;
      opponentScore = homeScore;
    } else {
      // Oups, match où HON n'est pas là ? Skip
      return;
    }

    // Win/Lose/Draw
    let result = "D";
    if (teamScore > opponentScore) result = "W";
    else if (teamScore < opponentScore) result = "L";

    games.push({
      game_number: gameNumber,
      date,
      is_home: isHome,
      opponent_abbr: opponentAbbr,
      opponent_logo: opponentLogo,
      team_score: teamScore,
      opponent_score: opponentScore,
      result,
      boxscore_link: boxscoreLink,
      team_abbr: TEAM_ABBR
    });
  });
  console.log("Matchs extraits :", games);

  // ----------- INSERTION DANS LA BDD -----------
  if (roster.length) {
    const { error } = await supabase
      .from('players')
      .upsert(roster, { onConflict: ['player_link'] });
    if (error) {
      console.error("Erreur insertion joueurs :", error.message);
    } else {
      console.log("Joueurs insérés/à jour !");
    }
  }
  if (games.length) {
    const { error } = await supabase
      .from('games')
      .upsert(games, { onConflict: ['team_abbr', 'game_number'] });
    if (error) {
      console.error("Erreur insertion matchs :", error.message);
    } else {
      console.log("Matchs insérés/à jour !");
    }
  }
  return { teamName, roster, games };
}

// ----------- LANCE LE SCRIPT -----------
fetchAndParseTeamPage().catch(err => console.error("Erreur :", err.message));
