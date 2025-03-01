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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
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
        setLoading(false);
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
   * Determines which days of the current week have completed sessions
   * @param sessions - Array of database sessions containing completion timestamps
   * @returns An array of 7 booleans representing each day of the week (Sunday to Saturday)
   *          where true indicates at least one completed session on that day
   * @example
   * // If sessions were completed on Sunday and Wednesday:
   * getWeekSessions(sessions) // returns [true, false, false, true, false, false, false]
   */
  function getWeekSessions(sessions: DatabaseSession[]) {
    const sunday = getLastSunday(new Date());

    let weekSessionArray = Array(7).fill(false);

    // Loop through each session
    sessions.forEach((session) => {
      const sessionDate = new Date(session.completed_at);

      // Check if the session is from this week
      if (
        sessionDate >= sunday &&
        sessionDate < new Date(sunday.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        // Get the day of the week (0-6, where 0 is Sunday)
        const dayIndex = sessionDate.getDay();
        weekSessionArray[dayIndex] = true;
      }
    });

    return weekSessionArray;
  }

  function getLastSunday(d: Date) {
    var t = new Date(d);
    t.setDate(t.getDate() - t.getDay());
    return t;
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
        <StatDisplayCard statName="Day Streak" statNum={stats.streak} />
        <StatDisplayCard
          statName="Total Sessions"
          statNum={stats.totalSessions}
        />
      </div>
    </div>
  );
}
