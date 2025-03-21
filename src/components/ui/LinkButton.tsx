import Link from "next/link";
import { ButtonBaseProps, getButtonClassNames } from "./ButtonBase";
import { LinkProps } from "next/link";

interface LinkButtonProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export default function LinkButton({
  children,
  href,
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
