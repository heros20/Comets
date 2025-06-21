import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "gallery.json");

export async function GET() {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
  const newImage = await req.json();
  const data = await fs.readFile(DATA_PATH, "utf-8");
  const gallery = JSON.parse(data);
  gallery.unshift(newImage); // Ajout en haut
  await fs.writeFile(DATA_PATH, JSON.stringify(gallery, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { index } = await req.json();
  const data = await fs.readFile(DATA_PATH, "utf-8");
  const gallery = JSON.parse(data);
  gallery.splice(index, 1);
  await fs.writeFile(DATA_PATH, JSON.stringify(gallery, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}
