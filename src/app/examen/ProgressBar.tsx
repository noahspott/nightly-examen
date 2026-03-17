import { motion } from "framer-motion";
import { useExamen } from "@/context/ExamenContext";

export default function ProgressBar() {
  const { state } = useExamen();
  const { step, numSteps } = state;

  const progressPercent = ((step + 1) / numSteps) * 100;

  return (
    <motion.div className="w-full h-4 bg-white/10 rounded-full my-8">
      <motion.div
        className="h-full bg-white/10 rounded-full"
        style={{ width: `${progressPercent}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progressPercent}%` }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    </motion.div>
  );
}
