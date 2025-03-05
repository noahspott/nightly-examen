import { getButtonClassNames, ButtonBaseProps } from "./ButtonBase";

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean | undefined;
  className?: string;
};

export default function Button({
  children,
  onClick,
  type,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}
