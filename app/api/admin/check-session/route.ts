import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // La doc t'oblige à faire comme ça maintenant :
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  if (!adminSession?.value) {
    return NextResponse.json({ isAdmin: false, isMember: false });
  }

  const username = adminSession.value;

  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("username", username)
    .single();

  if (error || !data) {
    return NextResponse.json({ isAdmin: false, isMember: false });
  }

  return NextResponse.json({
    isAdmin: data.role === "admin",
    isMember: data.role === "member",
  });
}
