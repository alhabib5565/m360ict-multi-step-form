import type { Metadata } from "next";
import "./globals.css";

import { poppins } from "@/assets/fonts/fonts";

export const metadata: Metadata = {
  title: "Guil cam",
  description: "Guil cam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
