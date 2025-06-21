import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "messages.json");

export async function GET() {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
  const newMessage = await req.json();
  const data = await fs.readFile(DATA_PATH, "utf-8");
  const messages = JSON.parse(data);
  messages.unshift(newMessage); // Ajout en haut
  await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { index } = await req.json();
  const data = await fs.readFile(DATA_PATH, "utf-8");
  const messages = JSON.parse(data);
  messages.splice(index, 1);
  await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}
