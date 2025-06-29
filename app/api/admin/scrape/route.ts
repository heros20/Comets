import { NextResponse } from "next/server";
import cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// URLs et constantes
const CLASSEMENT_URL = "https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/standings";
const TEAM_URL = "https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/teams/34745";
const TEAM_ABBR = "HON";

// Fonction scraping classement
async function fetchAndParseClassement() {
  const res = await fetch(CLASSEMENT_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html",
    },
  });
  if (!res.ok) throw new Error("Erreur fetch classement FFBS");
  const html = await res.text();
  const $ = cheerio.load(html);

  const tabs: string[] = [];
  $("ul.nav-tabs li a").each((i, el) => tabs.push($(el).text().trim()));

  const standings = [];
  $(".tab-content .tab-pane").each((i, tabPane) => {
    const tabRows = [];
    $(tabPane).find("table.standings-print tr").slice(1).each((j, row) => {
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

  return { tabs, standings, year };
}

// Sauvegarde classement dans Supabase
async function saveClassementToSupabase(data: any) {
  // Nettoyer l'ancienne table avant insertion (optionnel)
  await supabase.from("classement_normandie").delete().neq('id', 0);
  const { error } = await supabase.from("classement_normandie").insert([{ data }]);
  if (error) throw error;
}

// Fonction scraping équipe + matchs
async function fetchAndParseTeamPage() {
  const res = await fetch(TEAM_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html",
    },
  });
  if (!res.ok) throw new Error("Erreur fetch équipe FFBS");
  const html = await res.text();
  const $ = cheerio.load(html);

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
      return; // match pas de HON, skip
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
    const { error } = await supabase.from('players').upsert(roster, { onConflict: ['player_link'] });
    if (error) throw new Error("Erreur insertion joueurs : " + error.message);
  }
  if (games.length) {
    const { error } = await supabase.from('games').upsert(games, { onConflict: ['team_abbr', 'game_number'] });
    if (error) throw new Error("Erreur insertion matchs : " + error.message);
  }

  return { rosterCount: roster.length, gamesCount: games.length };
}

export async function POST() {
  try {
    const classement = await fetchAndParseClassement();
    await saveClassementToSupabase(classement);

    const teamResult = await fetchAndParseTeamPage();

    return NextResponse.json({
      message: `Classement et équipe mis à jour ✅`,
      details: {
        teamsUpdated: teamResult.rosterCount,
        gamesUpdated: teamResult.gamesCount,
      },
    });
  } catch (err: any) {
    console.error("[scrape] error:", err);
    return NextResponse.json({ error: err.message || "Erreur serveur" }, { status: 500 });
  }
}
