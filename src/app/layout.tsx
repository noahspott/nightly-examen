// Metadata
import type { Metadata } from "next";

// Styles
import "./globals.css";

export const metadata: Metadata = {
  title: "NightlyExamen",
  description:
    "The Nightly Examen journaling app to help you grow consistently in your prayer life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` bg-black text-white`}>{children}</body>
    </html>
  );
}
