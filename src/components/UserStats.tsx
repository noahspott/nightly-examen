/**
 * UserStats
 *
 * This component will display the user's stats related
 * to their Examen habits.
 */

"use client";

// Lib
import { getDayOfWeek } from "@/utils/dayOfTheWeek";
import { useState, useEffect } from "react";
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
  const [stats, setStats] = useState<Session>({
    totalSessions: 0,
    weekCompletionStatus: Array(7).fill(false),
    streak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Get user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("User fetch error:", userError);
          throw userError;
        }

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

        if (sessionsError) {
          console.error("Sessions fetch error:", sessionsError);
          throw sessionsError;
        }

        // Get the date range for this week (Sunday to now)
        const sunday = new Date();
        sunday.setDate(sunday.getDate() - sunday.getDay());
        sunday.setHours(0, 0, 0, 0);

        const stats = {
          totalSessions: sessions.length,
          weekCompletionStatus: getWeekSessions(sessions),
          streak: userStreakData.examen_streak || 0,
        };
        setStats(stats);
      } catch (err) {
        console.error("Full error details:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    console.log("stats.weekSessions", stats.weekCompletionStatus);

    const channel = supabase
      .channel("sessions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
        },
        () => {
          fetchStats();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchUserStreak(userId: string) {
    const res = await fetch(`/api/users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user data");
    return res.json();
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

  return (
    <div className="flex flex-col gap-2 font-semibold">
      {/* Row 1 -- Week Stats */}
      <div className="flex justify-between bg-gradient-to-br from-white/10 to-white/5 rounded-lg px-3 md:px-6 py-4">
        {stats.weekCompletionStatus.map((dayIsComplete, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <h3 className="text-sm">{getDayOfWeek(index)}</h3>

            {dayIsComplete ? <CheckCircle /> : <Circle />}
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
