import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ----------- ENV -----------
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const URL = "https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/teams/34745";
const TEAM_ABBR = "HON";

// ----------- INIT -----------
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ----------- MAIN HANDLER -----------
serve(async (req) => {
  try {
    // Headers "qui sentent bon le navigateur"
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Supabase Edge Function; Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      "Referer": "https://ffbs.wbsc.org/",
    };

    // 1. Fetch la page de l'équipe FFBS
    const res = await fetch(URL, { headers });
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Impossible de récupérer la page FFBS. Statut " + res.status }),
        { status: 500 },
      );
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // ----------- INFOS D'ÉQUIPE -----------
    const teamName = $(".team-heading h1").first().text().trim();

    // ----------- ROSTER -----------
    const roster: any[] = [];
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

    // ----------- MATCHS -----------
    const games: any[] = [];
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
        return;
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

    // ----------- INSERTION BDD -----------
    let playerInsert = { error: null };
    let gamesInsert = { error: null };
    if (roster.length) {
      playerInsert = await supabase
        .from('players')
        .upsert(roster, { onConflict: ['player_link'] });
    }
    if (games.length) {
      gamesInsert = await supabase
        .from('games')
        .upsert(games, { onConflict: ['team_abbr', 'game_number'] });
    }
    if (playerInsert.error) throw new Error("Erreur insertion joueurs : " + playerInsert.error.message);
    if (gamesInsert.error) throw new Error("Erreur insertion matchs : " + gamesInsert.error.message);

    // ----------- RÉPONSE OK -----------
    return new Response(JSON.stringify({
      ok: true,
      message: "Équipe et matchs scrappés & sauvegardés !",
      teamName,
      rosterCount: roster.length,
      gamesCount: games.length
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || err }), { status: 500 });
  }
});
