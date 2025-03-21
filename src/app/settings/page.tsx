"use client";

// Components
import { LogOut, ChevronRight } from "lucide-react";
import { Main, Header } from "@/components/ui";
import ConfirmationModal from "@/components/modals/ConfirmationModel";

// Next
import { useRouter } from "next/navigation";
import { useState } from "react";

// Auth
import { signOut } from "@/lib/auth/client";

export default function Settings() {
  const router = useRouter();

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  function handleLogout() {
    signOut();
    router.push("/");
  }

  return (
    <Main>
      <Header />

      <div className="px-4 flex flex-col gap-8">
        <h1 className="text-3xl text-white font-bold mt-4">Settings</h1>

        <div>
          <h2 className="text-2xl font-bold mb-4">Account</h2>
          <div className="dashboard--card">
            <button
              className="text-lg flex justify-between w-full"
              onClick={() => setIsExitModalOpen(true)}
            >
              <div className="flex gap-4 items-center">
                <LogOut />
                <span>Logout</span>
              </div>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={() => handleLogout()}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmationButtonText="Logout"
      />
    </Main>
  );
}
