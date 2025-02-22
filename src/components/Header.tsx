"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/auth";

export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    console.log("logging out");
    const { success, error } = await signOut();
    if (success) {
      console.log("signed out successfully");
      router.push("/");
    } else {
      console.error("error signing out:", error);
    }
  }

  return (
    <div className="flex items-center h-16 shadow-sm max-w-screen-lg mx-auto px-4 border-b border-white/10">
      <Link href="/">
        <h1 className="text-2xl font-bold">Nightly Examen</h1>
      </Link>

      <button className="ml-auto" onClick={handleLogout}>
        <LogOut />
      </button>
    </div>
  );
}
