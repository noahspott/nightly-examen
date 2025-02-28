"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";

export default function Header() {
  const router = useRouter();

  function handleLogout() {
    signOut();
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
