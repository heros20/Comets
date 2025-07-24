import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET(request: Request) {
  const scriptPath = path.resolve("./scripts/2scrapeClassement.js");

  return new Promise<NextResponse>((resolve) => {
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur exec : ${error.message}`);
        resolve(
          NextResponse.json({ error: error.message }, { status: 500 })
        );
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(
        NextResponse.json(
          { message: "ScrapeClassement lancé", output: stdout },
          { status: 200 }
        )
      );
    });
  });
}
