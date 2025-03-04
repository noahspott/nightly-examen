"use client";

// Lib
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getGreeting } from "@/utils/greeting";
import { Suspense } from "react";

// Components
import UserStats from "@/components/UserStats";
import LinkButton from "@/components/ui/LinkButton";
import Header from "@/components/ui/Header";

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

  return (
    <div className="max-w-screen-sm mx-auto">
      <Header />
      <div className="px-4">
        <p className="text-xl font-bold my-4">{greeting}</p>
        <div className="flex flex-col gap-4">
          <QueryClientProvider client={queryClient}>
            <UserStats />
          </QueryClientProvider>
          <LinkButton href="/examen/classic" className="w-full button--primary">
            Start Examen
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
