"use client";

import SplashScreen from "./SplashScreen";
import { useState, useEffect } from "react";

export default function SplashScreenHandler({ children }: { children: React.ReactNode }) {

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

    if(hasSeenSplash) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem('hasSeenSplash', 'true');

      setTimeout(() => {
        setShowSplash(false);
      }, 3000);
    }
  }, []);
  
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return children;
}