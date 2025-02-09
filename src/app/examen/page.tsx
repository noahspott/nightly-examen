"use client"
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Components
import Link from "next/link";
import Button from "@/components/Button";
import ProgressBar from "./ProgressBar";
import CompletionAnimation from "./CompletionAnimation";
import { useRouter } from "next/navigation";

// Constants
const animationDuration = 3000;
const numSteps = 10;

export default function Examen() {
  const router = useRouter();
  const [step, setStep] = useState(() => {
    return Number(sessionStorage.getItem("examenStep")) || 0;
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("examenStep", step.toString());

    if(isComplete) {

      // Reset session storage
      sessionStorage.removeItem("examenStep");

      setTimeout(() => {
        router.push("/");
      }, animationDuration);
    }
  }, [step, isComplete]);

  return (
    <>
      { isComplete ? <CompletionAnimation /> : 
        <div className="relative max-w-screen-lg mx-auto px-2 user-select-none">

      <div className="flex gap-8 items-center">
        {/* Progress Bar */}
        <ProgressBar numSteps={numSteps} currentStep={step}/>
    
        {/* Exit */}
        <Link href="/" className="text-white hover:text-white transition-all">
          <X className="size-8"/>
        </Link>
      </div>


      {/* Temp for testing */}
      <div className="flex justify-between items-center">
        <h1>Examen</h1>
        <p className="user-select-none">{step}</p>
      </div>

      {/* Complete Examen Button */}
      {step === numSteps && 
        <motion.button
          className="flex justify-center my-16 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}

          onClick={() => setIsComplete(true)}
        >
          <Button href="">Complete Examen</Button>
        </motion.button>
      }

      {/* Next and Back buttons */}
      <div className="grid grid-cols-2 max-w-screen-lg mx-auto px-2 py-4 fixed bottom-0 left-0 right-0">
        <motion.button
          disabled={step <= 0}
          className="user-select-none order-first transition-all disabled:opacity-0 disabled:cursor-not-allowed" 
          onClick={() => setStep(step - 1)}>
            <ChevronLeft className="size-16"/>
        </motion.button>
        <motion.button  
          disabled={step >= numSteps}
          className="user-select-none place-self-end transition-all disabled:opacity-0 disabled:cursor-not-allowed" 
          onClick={() => setStep(step + 1)}>
            <ChevronRight className="size-16"/>
        </motion.button>
      </div>
    </div>}
    </>
  );
}