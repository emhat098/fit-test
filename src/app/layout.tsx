import type { Metadata } from "next";

import "./globals.css";

import { geistMono, geistSans, openSans } from "@/next.font";

export const metadata: Metadata = {
  title: "Coding Test",
  description: "Em Ha Tuan - Coding Test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
