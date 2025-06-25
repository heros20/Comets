import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const year = new Date().getFullYear();
    const url = `https://ffbs.wbsc.org/fr/events/${year}-championnat-r1-baseball-ligue-normandie/standings`;
    // On ajoute les headers "normaux" d’un navigateur pour éviter le blocage
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html",
      }
    });
    if (!res.ok) {
      console.error("[API] Statut HTTP:", res.status, res.statusText);
      return NextResponse.json({ error: "Erreur réseau" }, { status: 500 });
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // Extraction dynamique des tabs/tables, à adapter selon la structure
    const tabs: string[] = [];
    $(".nav.nav-tabs li a").each((i, el) => {
      tabs.push($(el).text().trim());
    });

    // Récupère chaque table du contenu des tabs (en général dans l’ordre)
    const standings: any[] = [];
    $(".tab-content .tab-pane").each((i, tab) => {
      const rows: any[] = [];
      $(tab)
        .find("table.standings-print tbody tr")
        .each((j, row) => {
          const cells = $(row)
            .find("td")
            .map((k, cell) => $(cell).text().trim())
            .get();
          if (cells.length) rows.push(cells);
        });
      standings.push(rows);
    });

    // Récupère les colonnes (l’en-tête de la première table)
    const columns: string[] = [];
    $(".tab-content .tab-pane").first().find("table.standings-print thead th").each((i, th) => {
      columns.push($(th).text().trim());
    });

    // >>> Ajoute "year" dans la réponse JSON !
    return NextResponse.json({ tabs, columns, standings, year });
  } catch (err) {
    console.error("Erreur api/classement-normandie:", err);
    return NextResponse.json({ error: "Erreur réseau" }, { status: 500 });
  }
}
