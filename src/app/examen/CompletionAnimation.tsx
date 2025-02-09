import { motion } from "framer-motion";

export default function CompletionAnimation() {
  return (
    <motion.div
      className="fixed inset-0 font-serif text-4xl flex items-center justify-center bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      Examen Complete
    </motion.div>
  );
}