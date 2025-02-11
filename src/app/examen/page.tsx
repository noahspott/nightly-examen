"use client"
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Components
import Link from "next/link";
import Button from "@/components/Button";
import ProgressBar from "./ProgressBar";
import CompletionAnimation from "./CompletionAnimation";
import { useRouter } from "next/navigation";

// Constants
import { examenSteps } from "./examen-classic/steps";
const animationDuration = 3000;
const numSteps = examenSteps.length - 1;


export default function Examen() {
  const router = useRouter();

  // State
  const [step, setStep] = useState(() => {
    return Number(sessionStorage.getItem("examenStep")) || 0;
  });
  const [isComplete, setIsComplete] = useState(false);
  const [blessings, setBlessings] = useState<string[]>([""]);
  const [failures, setFailures] = useState<string[]>([""]);
  const [blessingsTags, setBlessingsTags] = useState<string[]>([""]);
  const [failuresTags, setFailuresTags] = useState<string[]>([""]);

  // Saves current step to session storage
  useEffect(() => {
    sessionStorage.setItem("examenStep", step.toString());

    if(isComplete) {
      sessionStorage.removeItem("examenStep");

      setTimeout(() => {
        router.push("/");
      }, animationDuration);
    }
  }, [step, isComplete]);

  const CurrentStep = examenSteps[step];

  return (
    <>
      { isComplete ? <CompletionAnimation /> : 
        <div className="relative max-w-screen-lg mx-auto px-4 user-select-none pb-32">

        {/* Progress Bar and Exit Button */}
        <div className="flex gap-8 items-center">
          <ProgressBar numSteps={numSteps + 1} currentStep={step}/>
    
          <Link href="/" className="text-white hover:text-white transition-all">
            <X className="size-8"/>
          </Link>
        </div>

        {/* Examen Step Components Go Here */}
        {step <= numSteps && <CurrentStep 
          blessings={blessings}
          setBlessings={setBlessings}
          failures={failures}
          setFailures={setFailures}
          blessingsTags={blessingsTags}
          setBlessingsTags={setBlessingsTags}
          failuresTags={failuresTags}
          setFailuresTags={setFailuresTags}
        />}

        {/* Complete Examen Button */}
        {step === numSteps && 
          <motion.button
            className="flex justify-center my-16 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}

            onClick={() => {
              setStep((step) => step + 1);
              setTimeout(() => {
                setIsComplete(true)
              }, 500)
            }}
          >
            <Button href="">Complete Examen</Button>
          </motion.button>
        }

        {/* Next and Back buttons */}
        <div className="mt-16 grid grid-cols-2 max-w-screen-lg mx-auto px-2 py-4 fixed bottom-0 left-0 right-0 ">
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