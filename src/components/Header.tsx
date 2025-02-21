"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
// Auth
import { authService } from "@/lib/auth/authService";

export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    console.log("logging out");
    await authService.signOut();
    router.push("/");
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
