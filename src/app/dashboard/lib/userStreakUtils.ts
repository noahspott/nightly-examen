import { DatabaseSession } from "../types/types";

// Date utility functions
export const formatDateToString = (date: Date): string => {
  // Use local timezone day boundaries (not UTC).
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

// User streak fetcher (used by dashboard stats API)
export async function fetchUserStreak(userId: string) {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

// Streak calculation logic (pure, no DB calls)
export function calculateNewStreak(
  sessions: DatabaseSession[],
  currentStreak: number,
  lastStreakIncrement: string | null | undefined,
): number {
  const completedAtToDayKey = (completedAt: string): string => {
    // Tests (and possibly other callers) may pass `YYYY-MM-DD` directly.
    // Treat it as already a day key to avoid `new Date("YYYY-MM-DD")`
    // being parsed as UTC.
    if (/^\d{4}-\d{2}-\d{2}$/.test(completedAt)) return completedAt;
    return formatDateToString(new Date(completedAt));
  };

  // No sessions exist
  if (!sessions || sessions.length === 0) {
    return 0;
  }

  const today = getTodayString();
  const yesterday = getYesterdayString();

  // Only one session exists
  if (sessions.length === 1) {
    const sessionDate = completedAtToDayKey(sessions[0].completed_at);
    if (sessionDate === today || sessionDate === yesterday) {
      return 1;
    }
    return 0;
  }

  // Handle undefined or null lastStreakIncrement
  if (!lastStreakIncrement) {
    // If there's a session today or yesterday, start streak at 1
    const latestSessionDate = completedAtToDayKey(sessions[0].completed_at);
    return latestSessionDate === today || latestSessionDate === yesterday
      ? 1
      : 0;
  }

  if (lastStreakIncrement === today) {
    return currentStreak;
  }

  // More than 1 sessions exist
  const sessionDates = sessions.map((s) =>
    completedAtToDayKey(s.completed_at),
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
