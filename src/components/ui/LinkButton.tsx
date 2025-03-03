import Link from "next/link";
import { ButtonBaseProps, getButtonClassNames } from "./ButtonBase";

type LinkButtonProps = {
  className: string;
  variant?: "primary" | "secondary";
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function LinkButton({
  variant = "primary",
  className = "",
  children,
  href,
  ariaLabel,
}: LinkButtonProps) {
  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
