type MainProps = {
  children: React.ReactNode;
};

export default function Main({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`max-w-screen-md mx-auto ${className}`} {...props}>
      {children}
    </main>
  );
}
