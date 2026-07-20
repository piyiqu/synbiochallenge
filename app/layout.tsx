import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dynamicImport from "next/dynamic";
import "./globals.css";

export const dynamic = "force-dynamic";

const NavBar = dynamicImport(() => import("@/components/NavBarWrapper"));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "合成生物学创新赛",
  description: "合成生物学创新赛 - 推动合成生物学领域创新发展",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
