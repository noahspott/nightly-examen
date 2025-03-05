export default function Quote({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-2xl font-serif border-s-4 border-white/10 pl-4">
      {children}
    </div>
  );
}
