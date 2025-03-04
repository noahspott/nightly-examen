/**
 * UserStats - A component that displays user statistics for Examen practice habits
 *
 * This component fetches and displays three main statistics:
 * 1. Weekly completion status - Visual representation of completed sessions for each day
 * 2. Current streak - Number of consecutive days with completed sessions
 * 3. Total sessions - Aggregate count of all completed sessions
 *
 * @component
 * @example
 * ```tsx
 * <UserStats />
 * ```
 *
 * @remarks
 * The component uses React Query for data fetching and caching. It makes two parallel requests:
 * - Fetches session data from Supabase
 * - Fetches user streak data from a custom API endpoint
 *
 * Time calculations for the weekly view start from Sunday at 00:00:00 local time.
 * Note: There might be timezone considerations when comparing local dates with UTC database timestamps.
 *
 * @returns {JSX.Element} A responsive grid layout containing:
 *  - A weekly calendar view showing completed days
 *  - Two stat cards displaying streak and total session counts
 *
 * @throws {Error} When user authentication fails or data fetching encounters an error
 */

"use client";

// Lib
import { useQuery } from "@tanstack/react-query";
import { getDayOfWeek } from "@/utils/dayOfTheWeek";
import { createClient } from "@/lib/supabase/client";

// Components
import { StatDisplayCard } from "./ui";
import { CheckCircle, Circle } from "lucide-react";

type UserStatsProps = {
  sessionCount: number;
};

type Session = {
  totalSessions: number;
  weekCompletionStatus: boolean[];
  streak: number;
};

type DatabaseSession = {
  completed_at: string;
};

export default function UserStats() {
  const supabase = createClient();

  const fetchStats = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("No user found");

    // Get session data and user streak data
    const [sessionsResponse, userStreakData] = await Promise.all([
      supabase
        .from("sessions")
        .select("completed_at")
        .order("completed_at", { ascending: false })
        .eq("user_id", user.id),

      fetchUserStreak(user.id),
    ]);

    const { data: sessions, error: sessionsError } = sessionsResponse;
    if (sessionsError) throw sessionsError;

    return {
      totalSessions: sessions.length,
      weekCompletionStatus: getWeekSessions(sessions),
      streak: userStreakData.examen_streak || 0,
    };
  };

  async function fetchUserStreak(userId: string) {
    const res = await fetch(`/api/users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user data");
    return res.json();
  }

  // UseQuery
  const {
    isLoading,
    data: stats = {
      totalSessions: 0,
      weekCompletionStatus: Array(7).fill(false),
      streak: 0,
    },
    error,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

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
  function getWeekSessions(sessions: DatabaseSession[]) {
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

  // if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex flex-col gap-2 font-semibold">
      {/* Row 1 -- Week Stats */}
      <div
        className={`flex justify-between bg-gradient-to-br from-white/10 to-white/5 rounded-lg px-3 md:px-6 py-4 transition-all duration-1000 ${isLoading && "animate-pulse"}`}
      >
        {stats.weekCompletionStatus.map((dayIsComplete, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <h3
              className={`text-xl transition-all duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}
            >
              {getDayOfWeek(index, "sm")}
            </h3>

            <div
              className={`transition-all duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}
            >
              {dayIsComplete ? (
                <CheckCircle className={`size-6 sm:size-8 }`} />
              ) : (
                <Circle className={`size-6 sm:size-8 }`} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 -- Day Streak and Reflection Hours */}
      <div className="grid grid-cols-2 gap-2">
        <StatDisplayCard
          statName="Day Streak"
          statNum={stats.streak}
          isLoading={isLoading}
        />
        <StatDisplayCard
          statName="Total Sessions"
          statNum={stats.totalSessions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
