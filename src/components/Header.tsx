import Link from "next/link";

export default function Header() {
  return (
    <div className="flex items-center h-16 shadow-sm max-w-screen-lg mx-auto px-2 border-b border-white/10">
      <Link href="/">
        <h1 className="text-2xl font-bold">Nightly Examen</h1>
      </Link>
    </div>
  );
}
