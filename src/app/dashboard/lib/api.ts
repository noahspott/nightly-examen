import { fetchUserStreak, updateUserStreak } from "./userStreakUtils";
import { getWeekSessions } from "./weekStatsUtils";
import { SupabaseClient } from "@supabase/supabase-js";

type StatsResponse = {
  totalSessions: number;
  weekCompletionStatus: boolean[];
  streak: number;
};

/**
 * Fetches and aggregates user statistics including total sessions, weekly completion status, and current streak.
 *
 * @param {SupabaseClient} supabase - Supabase client instance for database operations
 * @returns {Promise<{
 *   totalSessions: number,
 *   weekCompletionStatus: Array<boolean>,
 *   streak: number
 * }>} Object containing:
 *   - totalSessions: Total number of completed sessions
 *   - weekCompletionStatus: Array of boolean values indicating completion status for each day of the week
 *   - streak: Current user's examination streak
 * @throws {Error} If user is not found or authentication fails
 * @throws {Error} If session data fetch fails
 */
export async function fetchStats(
  supabase: SupabaseClient,
): Promise<StatsResponse> {
  console.log("\n\nfetchStats\n\n");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("No user found");

  await updateUserStreak(supabase, user.id);

  // Get session data and user streak data
  const [sessionsResponse, userStreakData] = await Promise.all([
    supabase
      .from("sessions")
      .select("completed_at")
      .order("completed_at", { ascending: false })
      .eq("user_id", user.id),

    fetchUserStreak(user.id),
  ]);

  let userStreak = userStreakData;
  console.log("userStreak: ", userStreak);

  const { data: sessions, error: sessionsError } = sessionsResponse;
  if (sessionsError) throw sessionsError;

  // const { last_active_date, examen_streak } = userStreakData;

  // if (
  //   examen_streak != 0 &&
  //   !wasLastActiveYesterday(last_active_date) &&
  //   !wasLastActiveToday(last_active_date)
  // ) {
  //   console.log("Resetting User Streak!");
  //   resetUserStreak(supabase, user.id);

  //   // Refetch userStreak
  //   userStreak = await fetchUserStreak(user.id);
  // }

  return {
    totalSessions: sessions.length,
    weekCompletionStatus: getWeekSessions(sessions),
    streak: userStreak.examen_streak,
  };
}
