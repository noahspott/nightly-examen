import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWeekSessions } from "@/app/dashboard/lib/weekStatsUtils";
import type { DatabaseSession } from "@/app/dashboard/types/types";

function formatLocalDay(d: Date): string {
  // Use the local timezone day boundaries (not ISO/UTC).
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfLocalDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function calculateStreakFromSessions(sessions: DatabaseSession[]): number {
  if (!sessions || sessions.length === 0) return 0;

  const dayKeys = new Set<string>();
  for (const s of sessions) {
    const date = new Date(s.completed_at);
    if (Number.isNaN(date.getTime())) continue;
    dayKeys.add(formatLocalDay(date));
  }

  const now = new Date();
  const todayKey = formatLocalDay(now);

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterdayKey = formatLocalDay(yesterdayDate);

  // Streak always "ends" at today if there is any completion today,
  // otherwise at yesterday if there is any completion yesterday.
  let cursor: Date | null = null;
  if (dayKeys.has(todayKey)) cursor = startOfLocalDay(now);
  else if (dayKeys.has(yesterdayKey)) cursor = startOfLocalDay(yesterdayDate);
  else return 0;

  let streak = 0;
  while (dayKeys.has(formatLocalDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: userId } = await params;

  try {
    const supabase = await createClient();
    const {
      data: sessions,
      error: sessionsError,
      count,
    } = await supabase
      .from("sessions")
      .select("completed_at", { count: "exact" })
      .eq("user_id", userId);

    if (sessionsError) throw sessionsError;

    const safeSessions = sessions ?? [];

    const stats = {
      totalSessions: count ?? safeSessions.length,
      weekCompletionStatus: getWeekSessions(safeSessions),
      streak: calculateStreakFromSessions(safeSessions),
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard stats", error);

    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
