import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmationButtonText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmationButtonText = "Exit",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-black mx-4">
        <div className="bg-white/10 p-6 rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={onClose} className="text-white">
              <X className="size-6" />
            </button>
          </div>
          <p className="text-gray-300 mb-6">{message}</p>
          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="bg-white/10 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              {confirmationButtonText}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
