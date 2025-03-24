/**
 * Week Stats
 */

// Components
import { CheckCircle, Circle } from "lucide-react";

// Lib
import { getDayOfWeek } from "@/utils/dayOfTheWeek";

type WeekStatsProps = {
  isFetching: boolean;
  stats: {
    totalSessions: number;
    weekCompletionStatus: any[];
    streak: number;
  };
};

export default function WeekStats({ isFetching, stats }: WeekStatsProps) {
  return (
    <div
      className={`flex justify-between dashboard--card ${isFetching && "animate-pulse"}`}
    >
      {stats.weekCompletionStatus.map((dayIsComplete, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <div
            className={`transition-all duration-500 ${isFetching ? "opacity-0" : "opacity-100"}`}
          >
            {dayIsComplete ? (
              <CheckCircle className={`size-6 sm:size-8 }`} />
            ) : (
              <Circle className={`size-6 sm:size-8 }`} />
            )}
          </div>
          {/* Day of the week -- Smaller screens */}
          <h3
            className={`sm:hidden block text-base text-white/70 transition-all duration-500 ${isFetching ? "opacity-0" : "opacity-100"}`}
          >
            {getDayOfWeek(index, "sm")}
          </h3>
          {/* Day of the week -- Larger screens */}
          <h3
            className={`hidden sm:block text-base text-white/70 transition-all duration-500 ${isFetching ? "opacity-0" : "opacity-100"}`}
          >
            {getDayOfWeek(index, "md")}
          </h3>
        </div>
      ))}
    </div>
  );
}
