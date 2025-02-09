"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2500); // Start fade-out
    const timer2 = setTimeout(() => onFinish(), 3000); // Navigate to home

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={`z-50 h-screen flex items-center justify-center transition-opacity duration-500 bg-black ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-white text-4xl font-serif relative"
      >
        Nightly Examen
        <span className="absolute inset-0 blur-md opacity-60 text-gold animate-glow">Nightly Examen</span>
      </motion.h1>
    </div>
  );
}
