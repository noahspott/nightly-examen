import { motion } from "framer-motion";

type CompletionAnimationProps = {
  duration: number;
};

export default function CompletionAnimation({
  duration,
}: CompletionAnimationProps) {
  return (
    <motion.div
      className="fixed inset-0 font-serif text-2xl sm:text-4xl flex items-center justify-center bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration }}
    >
      Examen Complete
    </motion.div>
  );
}
