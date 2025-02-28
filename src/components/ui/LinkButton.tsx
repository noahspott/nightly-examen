import Link from "next/link";
import { ButtonBaseProps, getButtonClassNames } from "./ButtonBase";

type LinkButtonProps = ButtonBaseProps & {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function LinkButton({
  variant,
  children,
  href,
  ariaLabel,
  className,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${getButtonClassNames({ variant })} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
