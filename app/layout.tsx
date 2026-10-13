import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { AppFrame } from "@/components/layout/AppFrame";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Certified Commercial Drone Pilots for Industry | Flight Operations Marketplace",
  description:
    "Hire verified, FAA Part 107 certified commercial drone pilots for agricultural spraying, infrastructure inspection, real estate mapping, aerial surveys, and construction monitoring.",
  keywords: [
    "drone pilot",
    "commercial drone certification",
    "Part 107 pilot",
    "agricultural spraying drone",
    "infrastructure drone inspection",
    "drone mapping",
    "aerial surveying",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col antialiased transition-colors duration-200`}>
        <Providers>
          <AppFrame>{children}</AppFrame>
        </Providers>
      </body>
    </html>
  );
}
