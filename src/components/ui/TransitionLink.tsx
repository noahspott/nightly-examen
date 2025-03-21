"use client";

import Link from "next/link";
import { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
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

    router.push(href);
  }
  return (
    <Link href={href} onClick={(e) => handleTransition(e)}>
      {children}
    </Link>
  );
}
