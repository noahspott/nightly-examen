// app/examen/page.tsx -- Examen Page

"use client";

// Lib
import React, { useEffect, useState } from "react";
import { useExamen } from "@/context/ExamenContext";

// Constants
import { examenSteps } from "../examen-classic/steps";

export default function Examen() {
  const { state, dispatch } = useExamen();

  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [blessings, setBlessings] = useState<string[]>([""]);
  const [failures, setFailures] = useState<string[]>([""]);

  const [blessingsTags, setBlessingsTags] = useState<string[]>([""]);
  const [failuresTags, setFailuresTags] = useState<string[]>([""]);

  const CurrentStep = examenSteps[state.step];
  const numSteps = examenSteps.length;

  useEffect(() => {
    dispatch({ type: "SET_NUM_STEPS", numSteps });
  }, [dispatch, numSteps]);

  return (
    <div className="relative max-w-screen-lg mx-auto px-4 user-select-none pb-32">
      {/* Examen Step Components */}
      {state.step < numSteps && (
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
  );
}
