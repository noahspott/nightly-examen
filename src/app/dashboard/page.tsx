"use client";

// Lib
import { useMemo } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getGreeting } from "@/utils/greeting";
import { getRandomBibleVerse } from "@/utils";
import type { BibleVerse } from "@/types/types";

// Components
import UserStats from "@/components/UserStats";
import LinkButton from "@/components/ui/LinkButton";
import Header from "@/components/ui/Header";
import { Quote } from "@/components/examen";

/**
 * Dashboard Page
 *
 * This dashboard page is the home for the logged-in user.
 * - displays user stats
 * - allows logout
 * - allows Examen start
 */
export default function Dashboard() {
  const queryClient = new QueryClient();
  const greeting = getGreeting();
  const bibleVerse = useMemo(() => getRandomBibleVerse(), []);

  return (
    <div className="max-w-screen-sm mx-auto">
      <Header />
      <div className="px-4">
        <p className="text-xl font-bold my-4">{greeting}</p>
        <div className="flex flex-col gap-4 py-4">
          <QueryClientProvider client={queryClient}>
            <UserStats />
          </QueryClientProvider>
          <div className="dashboard--card">
            <Quote>
              <div className="flex flex-col gap-4">
                <p className="">{bibleVerse.text}</p>
                <div>
                  <p className="inline">{bibleVerse.book}</p>
                  <p className="inline">{` ${bibleVerse.chapter}`}</p>
                  <p className="inline">:</p>
                  <p className="inline">{bibleVerse.verse}</p>
                </div>
              </div>
            </Quote>
          </div>
          <LinkButton
            href="/examen/classic"
            className="w-full button--secondary--lg mb-16"
          >
            Start Examen
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
