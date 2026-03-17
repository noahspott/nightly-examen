import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchStats } from "@/app/dashboard/lib/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const supabase = await createClient();
    const stats = await fetchStats(supabase, userId);

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching stats", error);

    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

