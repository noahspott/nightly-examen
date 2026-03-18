import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logSession } from "@/lib/supabase/db";
import { getUser } from "@/lib/auth/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

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

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Enforce that the URL `id` matches the currently authenticated Supabase user.
  const serverSupabase = await createServerClient();
  const user = await getUser(serverSupabase);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.id !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await logSession();
    return NextResponse.json({ message: "Session logged!" }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[log-session] Error logging session:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
