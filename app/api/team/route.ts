import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "team.json");

export async function GET() {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

// Ajout d'un membre
export async function POST(req: Request) {
  const newMember = await req.json();
  const data = await fs.readFile(DATA_PATH, "utf-8");
  const team = JSON.parse(data);
  team.push(newMember);
  await fs.writeFile(DATA_PATH, JSON.stringify(team, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}

// Edition d'un membre (par index)
export async function PUT(req: Request) {
  const { index, member } = await req.json();
  const data = await fs.readFile(DATA_PATH, "utf-8");
  const team = JSON.parse(data);
  team[index] = member;
  await fs.writeFile(DATA_PATH, JSON.stringify(team, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}

// Suppression d'un membre (par index)
export async function DELETE(req: Request) {
  const { index } = await req.json();
  const data = await fs.readFile(DATA_PATH, "utf-8");
  const team = JSON.parse(data);
  team.splice(index, 1);
  await fs.writeFile(DATA_PATH, JSON.stringify(team, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}
