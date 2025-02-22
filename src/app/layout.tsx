// Metadata
import type { Metadata } from "next";

// Fonts
import { EB_Garamond, Playfair_Display } from "next/font/google";

// Styles
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

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
