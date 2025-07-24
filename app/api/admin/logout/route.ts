// /app/api/admin/logout/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // On efface le cookie en le mettant vide avec maxAge 0
  response.cookies.set("admin_session", "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
