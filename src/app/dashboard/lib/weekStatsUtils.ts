import type { DatabaseSession } from "../types/types";

/**
 * Returns the start (midnight) of the week containing the given date
 * @param d - The date to get the week start for
 * @returns A new Date object set to Sunday 00:00:00 of the same week
 */
function getStartOfWeek(d: Date) {
  // Create a copy of the input date to avoid mutations
  const date = new Date(d);
  const day = date.getDay();

  // Subtract days to get to Sunday
  date.setDate(date.getDate() - day);

  // Set time to midnight (00:00:00.000)
  date.setHours(0, 0, 0, 0);

  return date;
}

/**
 * Analyzes completed sessions to create a weekly activity map
 * @param sessions - Array of completed sessions from the database
 * @returns boolean[] - A 7-element array where each index represents a day (0=Sunday to 6=Saturday)
 *
 * Key time concepts:
 * 1. We start by finding last Sunday at 00:00:00
 * 2. We consider sessions within a 7-day window from that Sunday
 * 3. Sessions on the same day are collapsed to a single 'true' value
 *
 * Note: There might be a timezone issue here. getStartOfWeek() returns
 * the date at 00:00:00 local time, but completed_at from the database
 * might be in UTC. This could cause edge-case issues around midnight.
 */
export function getWeekSessions(sessions: DatabaseSession[]) {
  const sunday = getStartOfWeek(new Date());

  let weekSessionArray = Array(7).fill(false);

  // Loop through each session
  sessions.forEach((session) => {
    const sessionDate = new Date(session.completed_at);

    console.log({
      sundayDate: sunday,
      sundayISO: sunday.toISOString(),
      sessionDate: sessionDate,
      sessionISO: sessionDate.toISOString(),
      comparison: sessionDate >= sunday,
    });

    // Define the week's time window:
    // From: Sunday 00:00:00
    // To:   Next Sunday 00:00:00 (sunday + 7 days)
    if (
      sessionDate >= sunday &&
      sessionDate < new Date(sunday.getTime() + 7 * 24 * 60 * 60 * 1000)
    ) {
      const dayIndex = sessionDate.getDay();
      weekSessionArray[dayIndex] = true;
    }
  });

  return weekSessionArray;
}
