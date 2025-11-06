import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import TopLoader from "@/components/top-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EzzySave - Simplified Saving and Loans",
  description:
    "EzzySave is a user-friendly platform designed to simplify saving and loan management for individuals and businesses alike.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.className} antialiased`}>
          {children}

          <TopLoader />
        </body>
      </html>
    </ClerkProvider>
  );
}
