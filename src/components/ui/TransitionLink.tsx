"use client";

import Link from "next/link";
import { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function TransitionLink({
  children,
  href,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();

  async function handleTransition(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    e.preventDefault();
    console.log("handleTransition!");

    const body = document.querySelector("body");

    body?.classList.add("page-transition");

    await sleep(500);
    router.push(href);
    await sleep(500);

    body?.classList.remove("page-transition");
  }
  return (
    <Link href={href} onClick={(e) => handleTransition(e)}>
      {children}
    </Link>
  );
}
