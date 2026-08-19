import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AvatarProvider } from "@/hooks/useAvatarStore";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaceCraft — AI Avatar Generator",
  description:
    "Describe an avatar and refine it with AI, or start from scratch and customize it manually. Download as PNG or SVG.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AvatarProvider>{children}</AvatarProvider>
      </body>
    </html>
  );
}
