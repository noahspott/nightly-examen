"use client";

// Lib
import { useQuery } from "@tanstack/react-query";
import { getDayOfWeek } from "@/utils/dayOfTheWeek";
import type { StatsResponse } from "../lib/api";

// Components
import StatDisplayCard from "./StatDisplayCard";
import { CheckCircle, Circle } from "lucide-react";

type UserStatsProps = {
  userId: string;
};

export default function UserStats({ userId }: UserStatsProps) {
  const {
    isFetching,
    data: stats = {
      totalSessions: 0,
      weekCompletionStatus: Array(7).fill(false),
      streak: 0,
    },
    error,
  } = useQuery({
    queryKey: ["stats", userId],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const response = await fetch(`/api/stats?userId=${encodeURIComponent(userId)}`);

      if (!response.ok) {
        throw new Error("Failed to load stats");
      }

      const data: StatsResponse = await response.json();
      return data;
    },
  });

  if (error) return "An error has occurred. Please try refreshing the browser.";

  return (
    <div className="flex flex-col gap-2 font-semibold">
      {/* Row 1 -- Week Stats */}
      <div
        className={`flex justify-between dashboard--card ${
          isFetching && "animate-pulse"
        }`}
      >
        {stats.weekCompletionStatus.map((dayIsComplete, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className={`transition-all duration-150 ${
                isFetching ? "opacity-0" : "opacity-100"
              }`}
            >
              {dayIsComplete ? (
                <CheckCircle className="size-6 sm:size-8" />
              ) : (
                <Circle className="size-6 sm:size-8" />
              )}
            </div>
            {/* Day of the week -- Smaller screens */}
            <h3
              className={`sm:hidden block text-base text-white/70 transition-all duration-150 ${
                isFetching ? "opacity-0" : "opacity-100"
              }`}
            >
              {getDayOfWeek(index, "sm")}
            </h3>
            {/* Day of the week -- Larger screens */}
            <h3
              className={`hidden sm:block text-base text-white/70 transition-all duration-150 ${
                isFetching ? "opacity-0" : "opacity-100"
              }`}
            >
              {getDayOfWeek(index, "md")}
            </h3>
          </div>
        ))}
      </div>

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

