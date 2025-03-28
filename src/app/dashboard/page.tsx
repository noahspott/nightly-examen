"use client";

// Lib
import { useMemo } from "react";
import { getGreeting } from "@/utils/greeting";
import { getRandomBibleVerse } from "@/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchStats } from "./lib/api";
import { updateUserStreak } from "./lib/userStreakUtils";
import { updateUserStats } from "./lib/dashboardUtils";
import { useEffect } from "react";
import { fetchDashboardDataFrom } from "./lib/dashboardUtils";

// Components
import UserStats from "@/app/dashboard/components/UserStats";
import { Main, Header, LinkButton } from "@/components/ui";
import { Quote } from "@/components/examen";
import ConfessionTracker from "./components/ConfessionTracker";
import getDaysSinceLastConfession from "./lib/confessionTrackerUtils";

// Types
import type { StatsResponse } from "./types/types";

const supabase = createClient();

/**
 * Dashboard Page
 *
 * This dashboard page is the home for the logged-in user.
 * - displays user stats
 * - allows logout
 * - allows Examen start
 */
export default function Dashboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    mutation.mutate();
  }, []);
  const mutation = useMutation({
    mutationFn: updateUserStats,
    onSettled: () => {
      console.log("[onSettled]");
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const {
    isFetching,
    data: stats = {
      streak: 0,
      totalSessions: 0,
      daysSinceLastConfession: 0,
      weekCompletionStatus: Array(7).fill(false),
    },
    error,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => fetchDashboardDataFrom(supabase),
  });

  if (error) return "An error has occurred. Please try refreshing the page.";

  const greeting = getGreeting();
  const bibleVerse = useMemo(() => getRandomBibleVerse(), []);

  return (
    <Main>
      <Header />
      <div className="px-4 flex flex-col gap-8">
        <h1 className="text-3xl text-white font-bold mt-4">Dashboard</h1>
        {/* <p className="text-xl font-bold my-4">{greeting}</p> */}

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
          <UserStats isFetching={isFetching} stats={stats} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Last Confession</h2>
          <ConfessionTracker
            isFetching={isFetching}
            daysSinceLastConfession={stats.daysSinceLastConfession}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Daily Wisdom</h2>
          <div className="dashboard--card">
            <Quote>
              <div className="flex flex-col gap-4">
                <p className="">{bibleVerse.text}</p>
                <div className="text-xl">
                  <p className="inline">{bibleVerse.book}</p>
                  <p className="inline">{` ${bibleVerse.chapter}`}</p>
                  <p className="inline">:</p>
                  <p className="inline">{bibleVerse.verse}</p>
                </div>
              </div>
            </Quote>
          </div>
        </div>

        <LinkButton
          href="/examen/classic"
          className="w-full button--primary--lg mb-16 mt-4"
        >
          Start Examen
        </LinkButton>
      </div>
    </Main>
  );
}
