export type ButtonBaseProps = {
  variant?: "primary" | "secondary";
  className?: string;
};

export function getButtonClassNames({
  variant = "primary",
  className = "",
}: ButtonBaseProps) {
  const baseStyles =
    "text-lg px-6 py-3 text-center text-white transition-colors duration-200 font-medium rounded-full border-2";

  const variantStyles = {
    primary: "bg-white/10 hover:bg-white/20 border-white/10",
    secondary: "border-white hover:bg-white/20",
  };

  return `${baseStyles} ${variantStyles[variant]} ${className}`;
}
