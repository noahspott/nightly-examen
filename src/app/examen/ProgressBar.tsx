import { motion } from "framer-motion";

export default function ProgressBar({ numSteps, currentStep }: { numSteps: number, currentStep: number }) {
  return (
    <motion.div className="w-full h-4 bg-white/10 rounded-full my-8">
      <motion.div 
        className="h-full bg-white/10 rounded-full" 
        style={{ width: `${(currentStep / numSteps) * 100}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / numSteps) * 100}%` }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    </motion.div>
  )
}