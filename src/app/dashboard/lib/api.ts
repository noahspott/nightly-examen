import { getWeekSessions } from "./weekStatsUtils";
import { SupabaseClient } from "@supabase/supabase-js";

export type StatsResponse = {
  totalSessions: number;
  weekCompletionStatus: boolean[];
  streak: number;
};

type SessionRow = {
  completed_at: string;
};

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

function calculateStreakFromSessions(sessions: SessionRow[]): number {
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
  else if (dayKeys.has(yesterdayKey))
    cursor = startOfLocalDay(yesterdayDate);
  else return 0;

  let streak = 0;
  while (dayKeys.has(formatLocalDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/**
 * Fetches and aggregates user statistics including total sessions, weekly completion status, and current streak.
 *
 * @param {SupabaseClient} supabase - Supabase client instance for database operations
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<{
 *   totalSessions: number,
 *   weekCompletionStatus: Array<boolean>,
 *   streak: number
 * }>} Object containing:
 *   - totalSessions: Total number of completed sessions
 *   - weekCompletionStatus: Array of boolean values indicating completion status for each day of the week
 *   - streak: Current user's examination streak
 * @throws {Error} If session data fetch fails
 */
export async function fetchStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<StatsResponse> {
  const sessionsResponse = await Promise.all([
    supabase
      .from("sessions")
      .select("completed_at", { count: "exact" })
      .order("completed_at", { ascending: false })
      .eq("user_id", userId),
  ]);

  const { data: sessions, error: sessionsError, count } = sessionsResponse[0];

  if (sessionsError) throw sessionsError;

  return {
    totalSessions: count ?? (sessions?.length ?? 0),
    weekCompletionStatus: getWeekSessions(sessions ?? []),
    streak: calculateStreakFromSessions((sessions ?? []) as SessionRow[]),
  };
}
