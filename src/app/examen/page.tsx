// app/examen/page.tsx -- Examen Page

"use client";
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { X } from "lucide-react";

// Components
import Button from "@/components/ui/ButtonBase";
import ProgressBar from "./ProgressBar";
import CompletionAnimation from "./CompletionAnimation";
import { useRouter } from "next/navigation";
import StepControls from "./StepControls";
import ConfirmationModal from "@/components/modals/ConfirmationModel";

// Constants
import { examenSteps } from "./examen-classic/steps";
const animationDuration = 3000;
const numSteps = examenSteps.length - 1;

export default function Examen() {
  const router = useRouter();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // State
  const [step, setStep] = useState<number>(0);

  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [blessings, setBlessings] = useState<string[]>([""]);
  const [failures, setFailures] = useState<string[]>([""]);

  const [blessingsTags, setBlessingsTags] = useState<string[]>([""]);
  const [failuresTags, setFailuresTags] = useState<string[]>([""]);

  function handleCompleteExamen() {
    setStep((step) => step + 1);

    // update database with examen completion.

    setTimeout(() => {
      setIsComplete(true);
    }, 500);
  }

  // Effect to handle the completion of the examen
  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        router.push("/");
      }, animationDuration);
    }
  }, [step, isComplete]);

  const CurrentStep = examenSteps[step];

  return (
    <>
      {isComplete ? (
        <CompletionAnimation />
      ) : (
        <div className="relative max-w-screen-lg mx-auto px-4 user-select-none pb-32">
          {/* Progress Bar and Exit Button */}
          <div className="flex gap-8 items-center">
            <ProgressBar numSteps={numSteps + 1} currentStep={step} />

            <button
              onClick={() => setIsExitModalOpen(true)}
              className="text-white"
            >
              <X className="size-8" />
            </button>
          </div>
          {/* Examen Step Components */}
          {step <= numSteps && (
            <CurrentStep
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
            />
          )}
          {/* Complete Examen Button */}
          {step === numSteps && (
            <motion.button
              className="flex justify-center my-16 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={handleCompleteExamen}
            >
              <Button href="">Complete Examen</Button>
            </motion.button>
          )}
          {/* Step Controls */}
          <motion.div
            // since the element is fixed to the bottom of the screen, we need to offset it by the height of the screen
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <StepControls
              step={step}
              setStep={setStep}
              numSteps={numSteps}
              isTyping={isTyping}
            />
          </motion.div>
          {/* Add Modal */}
          <ConfirmationModal
            isOpen={isExitModalOpen}
            onClose={() => setIsExitModalOpen(false)}
            onConfirm={() => router.push("/")}
            title="Exit Examen"
            message="Are you sure you want to exit? Your progress will not be saved."
          />
        </div>
      )}
    </>
  );
}
