import { getButtonClassNames, ButtonBaseProps } from "./ButtonBase";

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean | undefined;
} & ButtonBaseProps;

export default function Button({
  variant,
  children,
  onClick,
  type,
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${getButtonClassNames({ variant })} ${className}`}
    >
      {children}
    </button>
  );
}
