// app/examen/page.tsx -- Examen Page

"use client";

// Lib
import React, { useEffect, useState } from "react";
import { useExamen } from "@/context/ExamenContext";
import { useRouter } from "next/navigation";

// Constants
import { examenSteps } from "../examen-classic/steps";
const animationDuration = 3000;
const numSteps = examenSteps.length - 1;

export default function Examen() {
  const { state, dispatch } = useExamen();
  const router = useRouter();
  // const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // State
  // const [step, setStep] = useState<number>(0);

  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [blessings, setBlessings] = useState<string[]>([""]);
  const [failures, setFailures] = useState<string[]>([""]);

  const [blessingsTags, setBlessingsTags] = useState<string[]>([""]);
  const [failuresTags, setFailuresTags] = useState<string[]>([""]);

  // function handleCompleteExamen() {
  //   // setStep((step) => step + 1);
  //   dispatch({ type: "INCREMENT_STEP" });

  //   // update database with examen completion.

  //   setTimeout(() => {
  //     setIsComplete(true);
  //   }, 500);
  // }

  // Effect to handle the completion of the examen
  // useEffect(() => {
  //   if (isComplete) {
  //     setTimeout(() => {
  //       router.push("/");
  //     }, animationDuration);
  //   }
  // }, [state.step, isComplete]);

  const CurrentStep = examenSteps[state.step];

  return (
    <>
      <div className="relative max-w-screen-lg mx-auto px-4 user-select-none pb-32">
        {/* Examen Step Components */}
        {state.step <= numSteps && (
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
      </div>
    </>
  );
}
