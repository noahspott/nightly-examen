import { motion } from "framer-motion";
import { useExamen } from "@/context/ExamenContext";

export default function ProgressBar() {
  const { state } = useExamen();
  const { step, numSteps } = state;

  return (
    <motion.div className="w-full h-4 bg-white/10 rounded-full my-8">
      <motion.div
        className="h-full bg-white/10 rounded-full"
        style={{ width: `${(step / numSteps) * 100}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${(step / numSteps) * 100}%` }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    </motion.div>
  );
}
