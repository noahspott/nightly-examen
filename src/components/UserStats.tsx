"use client";

import { getDayOfWeek } from "@/utils/dayOfTheWeek";
import { useState } from "react";
export default function UserStats() {

  const [dayStreak, setDayStreak] = useState(0);
  const [sessionCounter, setSessionCounter] = useState(0);
  return (
    <div className="flex flex-col gap-2 font-semibold">
      {/* Row 1 -- Week Stats */}
      <div className="flex justify-between bg-gradient-to-br from-white/20 to-white/5 rounded-lg px-3 md:px-6 py-4">
        {
          Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <h4 className="text-sm">{getDayOfWeek(index)}</h4>
              <div className="size-8 bg-white rounded-full"></div>
            </div>
          ))
        }
      </div>

      {/* Row 2 -- Day Streak and Reflection Hours */}
      <div className="grid grid-cols-2 gap-2">
        {/* Day Streak */}
        <div className="flex gap-2 bg-gradient-to-br from-white/20 to-white/5 rounded-lg px-3 md:px-6 py-4">
          <div className="mt-1 size-4 bg-white rounded-full"></div>
          <div className="flex flex-col">
            <p className="">{dayStreak}</p>
            <h4 className="text-xs">Day Streak</h4>
          </div>
        </div>

        {/* Sessions Completed */}
        <div className="flex gap-2 bg-gradient-to-br from-white/20 to-white/5 rounded-lg py-4 px-3 md:px-6">
          <div className="mt-1 size-4 bg-white rounded-full"></div>
          <div className="flex flex-col">
            <p className="">{sessionCounter}</p>
            <h4 className="text-xs">Sessions</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
