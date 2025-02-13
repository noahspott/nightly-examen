import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type StepControlsProps = {
  step: number;
  setStep: (step: number) => void;
  numSteps: number;
}

export default function StepControls({step, setStep, numSteps}: StepControlsProps) {
  return (
    <div className=" mt-16 grid grid-cols-2 max-w-screen-lg mx-auto px-2 py-4 fixed bottom-0 left-0 right-0 ">
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
  )
}