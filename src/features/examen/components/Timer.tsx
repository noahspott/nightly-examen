import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type TimerProps = {
  minutes: number;
  seconds: number;
};

export default function Timer({ minutes, seconds }: TimerProps) {
  const [time, setTime] = useState<TimerProps>({ minutes, seconds });

  // Calculate total duration and progress
  const totalSeconds = minutes * 60 + seconds;
  const currentSeconds = time.minutes * 60 + time.seconds;
  const progress = currentSeconds / totalSeconds;

  useEffect(() => {
    // Don't start if timer is already at 0
    if (time.minutes === 0 && time.seconds === 0) return;

    const interval = setInterval(() => {
      if (time.seconds === 0) {
        if (time.minutes === 0) {
          clearInterval(interval);
        } else {
          setTime({ minutes: time.minutes - 1, seconds: 59 });
        }
      } else {
        setTime({ minutes: time.minutes, seconds: time.seconds - 1 });
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [time]);

  // Format numbers to always show two digits
  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  // Update color variables to match app theme
  const bgColor = "rgb(0 0 0 / 0.9)"; // black/90
  const wheelColor = "rgb(255 255 255 / 0.1)"; // white/10
  const innerBgColor = "rgb(0 0 0 / 0.9)"; // black/90

  return (
    <div className="relative w-[150px] h-[150px] flex items-center justify-center">
      {/* Outer shadow for depth */}
      <div className="absolute w-full h-full rounded-full bg-gray-900/20" />

      {/* Timer wheel */}
      <motion.div
        className="absolute w-full h-full rounded-full"
        style={{
          background: `conic-gradient(${wheelColor} ${progress * 360}deg, ${bgColor} 0deg)`,
        }}
        animate={{
          background: `conic-gradient(${wheelColor} ${progress * 360}deg, ${bgColor} 0deg)`,
        }}
        transition={{ duration: 1, ease: "linear" }}
      />

      {/* Inner circle */}
      <div
        className="absolute w-[90%] h-[90%] rounded-full shadow-white/10 shadow-2xl"
        style={{
          background: innerBgColor,
        }}
      />

      {/* Timer text */}
      <div className="relative z-10 text-3xl tracking-wider text-gray-100 tabular-nums">
        <span className="inline-block w-[1.2em] text-right">
          {formatNumber(time.minutes)}
        </span>
        <span className="mx-0.5">:</span>
        <span className="inline-block w-[1.2em] text-right">
          {formatNumber(time.seconds)}
        </span>
      </div>
    </div>
  );
}
