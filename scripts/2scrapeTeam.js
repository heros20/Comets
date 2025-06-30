// scripts/scrapeTeam.js

import cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(process.env.SUPABASE_URL, supabaseKey);

const URL = "https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/teams/34745";
const TEAM_ABBR = "HON";

export async function scrapeTeam() {
  const res = await fetch(URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }
  });
  if (!res.ok) throw new Error("Impossible de récupérer la page FFBS.");
  const html = await res.text();

  const $ = cheerio.load(html);

  const teamName = $(".team-heading h1").first().text().trim();

  const roster = [];
  $('h3:contains("Roster")').next("table").find("tbody tr").each((i, row) => {
    const cols = $(row).find("td");
    if (cols.length === 7) {
      const number = $(cols[0]).text().trim();
      const $playerCell = $(cols[1]);
      const playerLink = $playerCell.find("a").attr("href") || null;
      const lastName = $playerCell.find("strong").text().trim();
      let firstName = $playerCell.text().replace(lastName, "").trim().replace(/\s+/g, " ");

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

  const games = [];
  $('.box-container:has(h3:contains("Rencontres")) .game-row').each((i, gameRow) => {
    const $a = $(gameRow).find("a");
    const boxscoreLink = $a.attr("href") && $a.attr("href") !== "#" ? $a.attr("href") : null;
    const $row = $a.find('.row');
    const $cols = $row.find('.col-xs-4');

    const awayAbbr = $($cols[0]).find('.team-name').text().trim();
    const awayLogo = $($cols[0]).find('img').attr('src') || null;
    const homeAbbr = $($cols[2]).find('.team-name').text().trim();
    const homeLogo = $($cols[2]).find('img').attr('src') || null;

    const $scoreBlock = $($cols[1]).find('.score');
    const gameNumber = $scoreBlock.find('p').first().text().trim();
    const [awayScore, homeScore] = $scoreBlock.find('span').map((_, el) => parseInt($(el).text().trim(), 10)).get();
    const date = $scoreBlock.find('p').last().text().trim();

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
      return; // pas un match de la team
    }

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

  if (roster.length) {
    const { error } = await supabase
      .from('players')
      .upsert(roster, { onConflict: ['player_link'] });
    if (error) throw new Error("Erreur insertion joueurs : " + error.message);
  }
  if (games.length) {
    const { error } = await supabase
      .from('games')
      .upsert(games, { onConflict: ['team_abbr', 'game_number'] });
    if (error) throw new Error("Erreur insertion matchs : " + error.message);
  }

  return { teamName, roster, games };
}
