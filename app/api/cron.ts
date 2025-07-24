import { NextResponse } from "next/server";

export async function GET() {
  console.log("Script lancé à 2h du mat");
  return NextResponse.json({ message: "OK" });
}
