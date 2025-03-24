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
import { createClient } from "@/lib/supabase/client";
import { fetchStats } from "../lib/api";
import { updateUserStreak } from "../lib/userStreakUtils";

// Components
import StatDisplayCard from "./StatDisplayCard";
import WeekStats from "./WeekStats";

const supabase = createClient();

export default function UserStats() {
  const {
    isFetching,
    data: stats = {
      totalSessions: 0,
      weekCompletionStatus: Array(7).fill(false),
      streak: 0,
    },
    error,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      await updateUserStreak(supabase, user.id);
      return await fetchStats(supabase);
    },
  });

  if (error) return "An error has occurred. Please try refreshing the browser.";

  return (
    <div className="flex flex-col gap-2">
      {/* Row 1 -- Week Stats */}
      <WeekStats stats={stats} isFetching={isFetching} />

      {/* Row 2 -- Day Streak and Reflection Hours */}
      <div className="grid grid-cols-2 gap-2">
        <StatDisplayCard
          statName="Day Streak"
          statNum={stats.streak}
          isFetching={isFetching}
        />
        <StatDisplayCard
          statName="Sessions"
          statNum={stats.totalSessions}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}
