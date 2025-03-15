import { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseSession } from "../types/types";

export async function fetchUserStreak(userId: string) {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

/**
 * Updates the last_active_date for a user in the database to the current date.
 * Returns the date in YYYY-MM-DD format, matching PostgreSQL's date type.
 */
export async function updateLastActiveDate(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  const { error: updateError } = await supabase
    .from("users")
    .update({
      last_active_date: today,
    })
    .eq("id", userId);

  if (updateError) {
    throw new Error(
      `Failed to update last_active_date: ${updateError.message}`,
    );
  }
}

export function wasLastActiveYesterday(lastActiveDate: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const lastActiveDateStr =
    lastActiveDate instanceof Date
      ? lastActiveDate.toISOString().split("T")[0]
      : new Date(lastActiveDate).toISOString().split("T")[0];

  return lastActiveDateStr === yesterdayStr;
}

export function wasLastActiveToday(lastActiveDate: Date) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const lastActiveDateStr =
    lastActiveDate instanceof Date
      ? lastActiveDate.toISOString().split("T")[0]
      : new Date(lastActiveDate).toISOString().split("T")[0];

  return lastActiveDateStr === todayStr;
}

/**
 *
 * Runs on Dashboard startup.
 *
 * @param supabase
 * @param userId
 */
export async function updateUserStreak(
  supabase: SupabaseClient,
  userId: string,
) {
  const { examen_streak } = await fetchUserStreak(userId);

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(2);

  if (error) throw new Error(`Failed to fetch sessions: ${error.message}`);

  const newStreak = await calculateNewStreak(sessions, examen_streak);

  await setUserStreak(supabase, userId, newStreak);
}

export function calculateNewStreak(
  sessions: DatabaseSession[],
  currentStreak: number,
): number {
  if (!sessions || sessions.length === 0) return 0;

  // Only one session exists
  if (sessions.length === 1) {
    const sessionDate = new Date(sessions[0].completed_at)
      .toISOString()
      .split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    return sessionDate === today ? 1 : 0;
  }

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const sessionDates = sessions.map(
    (s) => new Date(s.completed_at).toISOString().split("T")[0],
  );

  if (sessionDates[0] === today && sessionDates[1] === today) {
    return currentStreak; // maintain current streak
  }

  if (sessionDates[0] === today && sessionDates[1] === yesterdayStr) {
    return currentStreak + 1; // increment streak
  }

  if (sessionDates[0] === today) {
    return 1; // reset to 1
  }

  return 0; // reset to 0
}

export async function setUserStreak(
  supabase: SupabaseClient,
  userId: string,
  newStreak: number,
) {
  const { error: updateError } = await supabase
    .from("users")
    .update({
      examen_streak: newStreak,
    })
    .eq("id", userId);

  if (updateError) throw new Error("Error resetting userStreak");
}
