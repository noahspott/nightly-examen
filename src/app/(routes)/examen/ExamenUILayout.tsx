/**
 * ExamenUILayout
 *
 * This layout provides shared UI of all Examen types:
 * - Step controls
 * - Progress Bar
 * -
 */

"use client";

// Lib
import React, { useEffect, useState } from "react";
import { useExamen } from "@/context/ExamenContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

// Components
import { X } from "lucide-react";
import { Button } from "@/components/ui";
import {
  ProgressBar,
  StepControls,
  CompletionAnimation,
} from "@/features/examen/components";
import ConfirmationModal from "@/components/modals/ConfirmationModel";

// Types
import { User } from "@supabase/auth-js";

// Constants
const animationDuration = 3000;

export default function ExamenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, dispatch } = useExamen();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }

    getUser();
  }, []);

  // Go to dashboard after completion animation
  useEffect(() => {
    if (showCompletion) {
      setTimeout(() => {
        router.push(user ? "/dashboard" : "/");
      }, animationDuration);
    }
  }, [showCompletion]);

  async function handleCompleteExamen() {
    dispatch({ type: "INCREMENT_STEP" });

    if (user) {
      await handleLogSession();
      // await handleUpdateUserData(user.id);
    }

    // Wait for progress bar animation to complete
    setTimeout(() => {
      setShowCompletion(true);
    }, 600);
  }

  async function handleLogSession() {
    try {
      console.log("Attempting to log session...");
      const response = await fetch("/api/sessions", { method: "POST" });

      if (!response.ok) throw new Error("Failed to log session");

      const data = await response.json();
      console.log("Session logged successfully:", data);
    } catch (error) {
      console.error("Failed to log session:", error);
    }
  }

  // async function handleUpdateUserData(id: string) {
  //   try {
  //     console.log("Attempting to update user data...");
  //     const response = await fetch(`/api/users/${id}`, { method: "PATCH" });

  //     if (!response.ok) throw new Error("Failed to update user data");

  //     const data = await response.json();
  //     console.log("User data updated successfully:", data);
  //   } catch (error) {
  //     console.error("Failed to update user data:", error);
  //   }
  // }

  return (
    <>
      {showCompletion ? (
        <CompletionAnimation duration={animationDuration / 1000} />
      ) : (
        <div className="relative max-w-screen-lg mx-auto px-4 user-select-none pb-32">
          {/* Progress Bar and Exit Button */}
          <div className="flex py-8 w-full gap-8">
            <ProgressBar />

            <button
              onClick={() => setIsExitModalOpen(true)}
              className="text-white"
            >
              <X className="size-8" />
            </button>
          </div>

          {/* This is where the Examen steps go */}
          {children}

          {/* Complete Examen Button */}
          {state.step === state.numSteps - 1 && (
            <motion.div
              className="flex justify-center mt-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                onClick={handleCompleteExamen}
                className="button--primary--lg w-full"
              >
                Complete Examen
              </Button>
            </motion.div>
          )}

          {/* Step Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <StepControls />
          </motion.div>
          {/* Add Modal */}
          <ConfirmationModal
            isOpen={isExitModalOpen}
            onClose={() => setIsExitModalOpen(false)}
            onConfirm={() => router.push("/")}
            title="Exit Examen"
            message="Are you sure you want to exit? Your progress will not be saved."
          />
        </div>
      )}
    </>
  );
}
