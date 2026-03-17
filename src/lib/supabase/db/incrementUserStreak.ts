import type { SupabaseClient } from "@supabase/supabase-js";
import {
  calculateNewStreak,
  getTodayString,
} from "@/app/dashboard/lib/userStreakUtils";

type StreakResponse =
  | {
      message: string;
      newStreak: number;
    }
  | {
      error: Error;
    };

/**
 * Recalculates and persists a user's examen streak based on their recent sessions.
 *
 * This uses the shared, date-based streak logic and is idempotent per day:
 * calling it multiple times in the same day will not inflate the streak.
 */
export default async function incrementUserStreak(
  supabase: SupabaseClient,
  userId: string,
): Promise<StreakResponse> {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("examen_streak, last_streak_increment")
    .eq("id", userId)
    .single();

  if (userError) {
    return { error: new Error(userError.message) };
  }

  const currentStreak = user?.examen_streak ?? 0;
  const lastStreakIncrement: string | null = user?.last_streak_increment ?? null;

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(2);

  if (sessionsError) {
    return { error: new Error(sessionsError.message) };
  }

  const newStreak = calculateNewStreak(
    sessions ?? [],
    currentStreak,
    lastStreakIncrement,
  );

  let newStreakIncrement = lastStreakIncrement;
  if (newStreak > currentStreak) {
    newStreakIncrement = getTodayString();
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      examen_streak: newStreak,
      last_streak_increment: newStreakIncrement,
    })
    .eq("id", userId);

  if (updateError) {
    return { error: new Error(updateError.message) };
  }

  return {
    message: "User streak updated successfully",
    newStreak,
  };
}
