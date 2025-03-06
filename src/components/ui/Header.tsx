"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { Settings } from "lucide-react";
import ConfirmationModal from "../modals/ConfirmationModel";

export default function Header() {
  const router = useRouter();

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  function handleLogout() {
    signOut();
    router.push("/");
  }

  function handleSettingsClick() {}

  return (
    <div className="flex justify-between items-center h-16 shadow-sm max-w-screen-lg mx-auto px-4 border-b border-white/10">
      <Link href="/">
        <p className="text-2xl font-bold">NightlyExamen</p>
      </Link>

      {/* <button onClick={handleSettingsClick}>
        <Settings />
      </button> */}

      <button className="ml-auto" onClick={() => setIsExitModalOpen(true)}>
        <LogOut />
      </button>

      <ConfirmationModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={() => handleLogout()}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmationButtonText="Logout"
      />
    </div>
  );
}
