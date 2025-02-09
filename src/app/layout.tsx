
// Metadata
import type { Metadata } from "next";

// Fonts
import { EB_Garamond, Playfair_Display } from "next/font/google";

// Components
import Header from "../components/Header";
import SplashScreen from "../components/SplashScreen";
import SplashScreenHandler from "@/components/SplashScreenHandler";

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
  description: "The nightly examen app to track your spiritual growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` bg-black/90 text-white`}>
        <SplashScreenHandler>
          <Header />
          {children}
        </SplashScreenHandler>
      </body>
    </html>
  );
}
