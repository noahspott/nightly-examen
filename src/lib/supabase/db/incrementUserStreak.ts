import type { SupabaseClient } from "@supabase/supabase-js";

type StreakResponse =
  | {
      message: string;
      newStreak: number;
    }
  | {
      error: Error;
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
  else if (dayKeys.has(yesterdayKey)) cursor = startOfLocalDay(yesterdayDate);
  else return 0;

  let streak = 0;
  while (dayKeys.has(formatLocalDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/**
 * Computes a user's examen streak based on their completed sessions.
 *
 * This is idempotent per day because it derives the streak from the database state
 * (completed sessions) rather than mutating the user row.
 */
export default async function incrementUserStreak(
  supabase: SupabaseClient,
  userId: string,
): Promise<StreakResponse> {
  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (sessionsError) {
    return { error: new Error(sessionsError.message) };
  }

  const newStreak = calculateStreakFromSessions((sessions ?? []) as SessionRow[]);

  return {
    message: "User streak calculated successfully",
    newStreak,
  };
}
