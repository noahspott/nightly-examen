import { NextResponse } from "next/server";
import { logSession } from "@/lib/supabase/db";

export async function POST() {
  console.log("[log-session] Starting session logging...");
  try {
    await logSession();
    console.log("[log-session] Successfully logged session");
    return NextResponse.json({ message: "Session logged!" }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[log-session] Error logging session:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
