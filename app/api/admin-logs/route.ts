import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "admin-logs.json");

export async function GET() {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
  const newLog = await req.json();
  const data = await fs.readFile(DATA_PATH, "utf-8");
  const logs = JSON.parse(data);
  logs.unshift(newLog); // le plus récent en haut
  await fs.writeFile(DATA_PATH, JSON.stringify(logs, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}
