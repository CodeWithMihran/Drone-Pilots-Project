import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/layout/Navbar";

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
    <html lang="en" className="dark">
      <body className="bg-[#060b18] text-slate-100 min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
