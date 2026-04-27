import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web GIS Starter Kit",
  description: "Next.js 16 + OpenLayers 10 + Tailwind v4 + shadcn/ui 웹 GIS 스타터킷",
};

// v16: LayoutProps 전역 타입 헬퍼 — import 불필요
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
