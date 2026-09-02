import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReceiptScanner from "@/components/ReceiptScanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TritonBudget",
  description: "A budget tracker for UCSD students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        {/* Floating Scan & Upload button accessible on all pages */}
        <div className="fixed bottom-6 right-6 z-50">
          <ReceiptScanner />
        </div>

        <Footer />
      </body>
    </html>
  );
}