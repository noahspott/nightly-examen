import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function Button({ href, children }: ButtonProps) {
  return <Link href={href} className="bg-gradient-to-br from-white/90 to-white text-center w-full font-bold text-2xl text-black/90 p-4 rounded-full">{children}</Link>;
}
