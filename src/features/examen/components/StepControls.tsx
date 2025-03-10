/**
 * StepControls
 *
 * The controls for the Examen to move between steps.
 */

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useExamen } from "@/context/ExamenContext";

export default function StepControls() {
  const { state, dispatch } = useExamen();
  const { step, numSteps, isTyping } = state;

  function handleStepChange(direction: "next" | "prev") {
    if (direction === "next") {
      dispatch({ type: "INCREMENT_STEP" });
    } else {
      dispatch({ type: "DECREMENT_STEP" });
    }
  }

  return (
    <div className="mt-16 flex justify-between max-w-screen-lg mx-auto px-2 py-4 fixed bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-30% to-black/60">
      <motion.button
        disabled={step <= 0}
        className="user-select-none order-first transition-all disabled:opacity-0 disabled:cursor-not-allowed  p-2 rounded-full "
        onClick={() => handleStepChange("prev")}
      >
        <ChevronLeft
          className={`${isTyping ? "size-12 text-white/90" : "size-16 text-white"}`}
        />
      </motion.button>
      <motion.button
        disabled={step >= numSteps - 1}
        className="user-select-none place-self-end transition-all disabled:opacity-0 disabled:cursor-not-allowed  p-2 rounded-full "
        onClick={() => handleStepChange("next")}
      >
        <ChevronRight
          className={`${isTyping ? "size-12 text-white/90" : "size-16 text-white"}`}
        />
      </motion.button>
    </div>
  );
}
