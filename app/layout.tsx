// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BottomTabBar } from "@/components/bottom-tab-bar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roomie Grocery",
  description: "Shared grocery list for roommates",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Roomie Grocery",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#16a34a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50`}>
        <main className="mx-auto min-h-screen max-w-lg pb-20">{children}</main>
        <BottomTabBar />
      </body>
    </html>
  );
}
