import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Hack typage Next.js qui croit que cookies() est une Promise...
  const cookieStore = cookies() as any;
  const adminSession = cookieStore.get("admin_session");

  if (!adminSession?.value) {
    return NextResponse.json({ isAdmin: false, isMember: false });
  }

  const email = adminSession.value;

  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("email", email)
    .single();

  if (error || !data) {
    return NextResponse.json({ isAdmin: false, isMember: false });
  }

  return NextResponse.json({
    isAdmin: data.role === "admin",
    isMember: data.role === "member",
  });
}
