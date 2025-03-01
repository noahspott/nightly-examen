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
          weekSessions: sessions.filter(
            (s) => new Date(s.completed_at) >= sunday,
          ),
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

  return (
    <div className="flex flex-col gap-2 font-semibold">
      {/* Row 1 -- Week Stats */}
      <div className="flex justify-between bg-gradient-to-br from-white/10 to-white/5 rounded-lg px-3 md:px-6 py-4">
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
        <div className="flex gap-2 bg-gradient-to-br from-white/10 to-white/5 rounded-lg px-3 md:px-6 py-4">
          <div className="mt-1 size-4 bg-white rounded-full"></div>
          <div className="flex flex-col">
            <p className="">{stats.streak}</p>
            <h4 className="text-xs">Day Streak</h4>
          </div>
        </div>

        {/* Sessions Completed */}
        <div className="flex gap-2 bg-gradient-to-br from-white/10 to-white/5 rounded-lg py-4 px-3 md:px-6">
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
