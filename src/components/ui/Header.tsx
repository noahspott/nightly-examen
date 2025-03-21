"use client";

import Link from "next/link";
import { LogOut, Settings, X } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import TransitionLink from "./TransitionLink";

export default function Header() {
  const pathname = usePathname();

  function handleSettingsClick() {}

  return (
    <div className="flex justify-between items-center h-16 shadow-sm max-w-screen-lg mx-auto px-4 border-b border-white/10">
      <Link href="/">
        <p className="text-2xl font-bold">NightlyExamen</p>
      </Link>

      {pathname === "/settings" ? (
        <TransitionLink href="/dashboard">
          <X />
        </TransitionLink>
      ) : (
        <TransitionLink href={"/settings"}>
          <Settings />
        </TransitionLink>
      )}
    </div>
  );
}
