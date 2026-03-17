import { getWeekSessions } from "./weekStatsUtils";
import { SupabaseClient } from "@supabase/supabase-js";

export type StatsResponse = {
  totalSessions: number;
  weekCompletionStatus: boolean[];
  streak: number;
};

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
  const [sessionsResponse, userResponse] = await Promise.all([
    supabase
      .from("sessions")
      // Limit to a reasonable number of recent sessions to keep payloads small.
      .select("completed_at", { count: "exact" })
      .order("completed_at", { ascending: false })
      .eq("user_id", userId)
      .limit(50),
    supabase
      .from("users")
      .select("examen_streak")
      .eq("id", userId)
      .single(),
  ]);

  const { data: sessions, error: sessionsError, count } = sessionsResponse;
  const { data: user, error: userError } = userResponse;

  if (sessionsError) throw sessionsError;
  if (userError) throw userError;

  return {
    totalSessions: count ?? (sessions?.length ?? 0),
    weekCompletionStatus: getWeekSessions(sessions ?? []),
    streak: user?.examen_streak ?? 0,
  };
}
