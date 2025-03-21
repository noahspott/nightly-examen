import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("users")
    .select("examen_streak, last_streak_increment")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
