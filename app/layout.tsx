import type { Metadata } from "next";
import { Inter } from "next/font/google";

import SiteHeader from "@/components/layout/SiteHeader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lakshan Enterprises | B2B Optical Portal",
  description: "Wholesale optical accessories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
