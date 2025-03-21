import { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseSession } from "../types/types";

// Date utility functions
export const formatDateToString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export function getTodayString() {
  return formatDateToString(new Date());
}
export function getYesterdayString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateToString(yesterday);
}

// Date comparison functions
export function wasLastActiveYesterday(lastActiveDate: Date) {
  const lastActiveDateStr = formatDateToString(
    lastActiveDate instanceof Date ? lastActiveDate : new Date(lastActiveDate),
  );
  return lastActiveDateStr === getYesterdayString();
}

export function wasLastActiveToday(lastActiveDate: Date) {
  const lastActiveDateStr = formatDateToString(
    lastActiveDate instanceof Date ? lastActiveDate : new Date(lastActiveDate),
  );
  return lastActiveDateStr === getTodayString();
}

// Database operations
export async function fetchUserStreak(userId: string) {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

/**
 * Updates the last_active_date for a user in the database to the current date.
 * Returns the date in YYYY-MM-DD format, matching PostgreSQL's date type.
 */
export async function updateLastStreakIncrement(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const today = formatDateToString(new Date());

  const { error: updateError } = await supabase
    .from("users")
    .update({
      last_streak_increment: today,
    })
    .eq("id", userId);

  if (updateError) {
    throw new Error(
      `Failed to update last_streak_increment: ${updateError.message}`,
    );
  }
}

export async function setUserStreak(
  supabase: SupabaseClient,
  userId: string,
  newStreak: number,
  lastStreakIncrement: string,
) {
  const { error: updateError } = await supabase
    .from("users")
    .update({
      examen_streak: newStreak,
      last_streak_increment: lastStreakIncrement,
    })
    .eq("id", userId);

  if (updateError) throw new Error("Error resetting userStreak");
}

// Streak calculation logic
export function calculateNewStreak(
  sessions: DatabaseSession[],
  currentStreak: number,
  lastStreakIncrement: string | null | undefined,
): number {
  // No sessions exist
  if (!sessions || sessions.length === 0) {
    return 0;
  }

  const today = getTodayString();
  const yesterday = getYesterdayString();

  // Only one session exists
  if (sessions.length === 1) {
    const sessionDate = formatDateToString(new Date(sessions[0].completed_at));
    if (sessionDate === today || sessionDate === yesterday) {
      return 1;
    }
    return 0;
  }

  // Handle undefined or null lastStreakIncrement
  if (!lastStreakIncrement) {
    // If there's a session today or yesterday, start streak at 1
    const latestSessionDate = formatDateToString(
      new Date(sessions[0].completed_at),
    );
    return latestSessionDate === today || latestSessionDate === yesterday
      ? 1
      : 0;
  }

  if (lastStreakIncrement === today) {
    return currentStreak;
  }

  // More than 1 sessions exist
  const sessionDates = sessions.map((s) =>
    formatDateToString(new Date(s.completed_at)),
  );

  // This shouldn't ever happen because of last_streak_increment
  // if (sessionDates[0] === today && sessionDates[1] === today) {
  //   return currentStreak; // maintain current streak
  // }

  if (sessionDates[0] === today && sessionDates[1] === yesterday) {
    return currentStreak + 1; // increment streak
  }

  if (sessionDates[0] === today) {
    return 1; // reset to 1
  }

  if (sessionDates[0] === yesterday) {
    return currentStreak; // maintain streak
  }

  return 0; // reset to 0
}

/**
 * Updates the user's streak based on their recent session history.
 * Runs on Dashboard startup.
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID to update streak for
 */
export async function updateUserStreak(
  supabase: SupabaseClient,
  userId: string,
) {
  const { examen_streak = 0, last_streak_increment } =
    await fetchUserStreak(userId);

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(2);

  if (error) throw new Error(`Failed to fetch sessions: ${error.message}`);

  const newStreak = calculateNewStreak(
    sessions,
    examen_streak,
    last_streak_increment,
  );

  let newStreakIncrement = last_streak_increment;

  if (newStreak > examen_streak) {
    newStreakIncrement = getTodayString();
  }

  await setUserStreak(supabase, userId, newStreak, newStreakIncrement);
}
