// app/examen/page.tsx -- Examen Page

"use client"
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { X } from "lucide-react";

// Components
import Link from "next/link";
import Button from "@/components/Button";
import ProgressBar from "./ProgressBar";
import CompletionAnimation from "./CompletionAnimation";
import { useRouter } from "next/navigation";
import StepControls from "./StepControls";

// Constants
import { examenSteps } from "./examen-classic/steps";
const animationDuration = 3000;
const numSteps = examenSteps.length - 1;


export default function Examen() {
  const router = useRouter();

  // State
  const [step, setStep] = useState<number>(0);
  
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [blessings, setBlessings] = useState<string[]>([""]);
  const [failures, setFailures] = useState<string[]>([""]);
  
  const [blessingsTags, setBlessingsTags] = useState<string[]>([""]);
  const [failuresTags, setFailuresTags] = useState<string[]>([""]);

  // Effect to handle the completion of the examen
  useEffect(() => {
    if(isComplete) {
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

        {/* Examen Step Components */}
        {step <= numSteps && <CurrentStep 
          blessings={blessings}
          setBlessings={setBlessings}
          failures={failures}
          setFailures={setFailures}
          blessingsTags={blessingsTags}
          setBlessingsTags={setBlessingsTags}
          failuresTags={failuresTags}
          setFailuresTags={setFailuresTags}
          setIsTyping={setIsTyping}
          isTyping={isTyping}
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
        
        {/* Step Controls */}
        {!isTyping ? 
        // make the animation happen upon appearance and disappear upon disappearance
        <motion.div
          // since the element is fixed to the bottom of the screen, we need to offset it by the height of the screen
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
          <StepControls step={step} setStep={setStep} numSteps={numSteps}/>
        </motion.div> : null}
      </div>}
    </>
  );
}