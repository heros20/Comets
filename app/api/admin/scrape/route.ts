// /app/api/admin/scrape/route.ts
import { NextResponse } from "next/server";
import { exec } from "child_process";

function execScript(script: string): Promise<{ ok: boolean, output?: string, error?: string }> {
  return new Promise((resolve) => {
    exec(`node ${script}`, (error, stdout, stderr) => {
      if (error) {
        resolve({ ok: false, error: stderr || error.message });
      } else {
        resolve({ ok: true, output: stdout });
      }
    });
  });
}

export async function POST() {
  // Sécurité à gérer en prod !
  const team = await execScript("scripts/scrapeTeam.js");
  const classement = await execScript("scripts/scrapeClassement.js");

  // Si tu veux les lancer EN PARALLÈLE plutôt que l’un après l’autre, tu peux utiliser Promise.all.
  return NextResponse.json({
    team,
    classement,
    global_ok: team.ok && classement.ok
  });
}
