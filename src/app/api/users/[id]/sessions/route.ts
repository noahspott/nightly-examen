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

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("id", id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const order = searchParams.get("order") ?? "desc";

  let query = supabase
    .from("sessions")
    .select("id, completed_at")
    .eq("user_id", id)
    .order("completed_at", { ascending: order !== "desc" });

  if (limit) {
    const parsed = parseInt(limit, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      // Allow callers to request larger windows (e.g. long streak history).
      query = query.limit(parsed);
    }
  }

  const { data: sessions, error: sessionsError } = await query;

  if (sessionsError) {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }

  return NextResponse.json(sessions ?? []);
}
