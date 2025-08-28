import type { Metadata } from "next";
import "./globals.css";
import { popinsFont } from "./fonts";

export const metadata: Metadata = {
  title: "DNA Properties Hub",
  description: "Your trusted real estate partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${popinsFont['400'].className} antialiased bg-[#f3f6f8]`}
      >
        {children}
      </body>
    </html>
  );
}