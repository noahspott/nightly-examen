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

type UserStatsProps = {
  sessionCount: number;
};

type Session = {
  totalSessions: number;
  weekSessions: { completed_at: string }[];
  streak: number;
};

type DatabaseSession = {
  completed_at: string;
};

export default function UserStats() {
  const [stats, setStats] = useState<Session>({
    totalSessions: 0,
    weekSessions: [],
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        console.log("Fetching user...");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("User fetch error:", userError);
          throw userError;
        }

        console.log("User data:", user);
        if (!user) throw new Error("No user found");

        console.log("Fetching sessions for user:", user.id);
        const { data: sessions, error: sessionsError } = await supabase
          .from("sessions")
          .select("completed_at")
          .order("completed_at", { ascending: false })
          .eq("user_id", user.id);

        if (sessionsError) {
          console.error("Sessions fetch error:", sessionsError);
          throw sessionsError;
        }

        console.log("Sessions data:", sessions);

        // Get the date range for this week (Sunday to now)
        const sunday = new Date();
        sunday.setDate(sunday.getDate() - sunday.getDay());
        sunday.setHours(0, 0, 0, 0);

        const stats = {
          totalSessions: sessions.length,
          weekSessions: sessions.filter(
            (s) => new Date(s.completed_at) >= sunday,
          ),
          streak: calculateStreak(sessions),
        };

        console.log("Processed stats:", stats);
        setStats(stats);
      } catch (err) {
        console.error("Full error details:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

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

  // Helper function for streak calculation
  function calculateStreak(sessions: DatabaseSession[]): number {
    if (!sessions.length) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = today;

    // Sort sessions by date (newest first)
    const sessionDates = sessions.map((s) => {
      const date = new Date(s.completed_at);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    // Check if there's a session today
    const hasSessionToday = sessionDates.some(
      (date) => date.getTime() === today.getTime(),
    );

    if (!hasSessionToday) {
      // If no session today, check if there was one yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (
        !sessionDates.some((date) => date.getTime() === yesterday.getTime())
      ) {
        return 0; // Streak broken
      }
    }

    // Count consecutive days
    while (true) {
      if (
        sessionDates.some((date) => date.getTime() === currentDate.getTime())
      ) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  return (
    <div className="flex flex-col gap-2 font-semibold">
      {/* Row 1 -- Week Stats */}
      <div className="flex justify-between bg-gradient-to-br from-white/20 to-white/5 rounded-lg px-3 md:px-6 py-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <h4 className="text-sm">{getDayOfWeek(index)}</h4>
            <div className="size-8 bg-white rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Row 2 -- Day Streak and Reflection Hours */}
      <div className="grid grid-cols-2 gap-2">
        {/* Day Streak */}
        <div className="flex gap-2 bg-gradient-to-br from-white/20 to-white/5 rounded-lg px-3 md:px-6 py-4">
          <div className="mt-1 size-4 bg-white rounded-full"></div>
          <div className="flex flex-col">
            <p className="">{stats.streak}</p>
            <h4 className="text-xs">Day Streak</h4>
          </div>
        </div>

        {/* Sessions Completed */}
        <div className="flex gap-2 bg-gradient-to-br from-white/20 to-white/5 rounded-lg py-4 px-3 md:px-6">
          <div className="mt-1 size-4 bg-white rounded-full"></div>
          <div className="flex flex-col">
            <p className="">{stats.totalSessions}</p>
            <h4 className="text-xs">Sessions</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
