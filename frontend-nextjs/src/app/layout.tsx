import type { Metadata } from "next";
import "./globals.css";
import { popinsFont } from "./fonts";
import { AuthProvider } from "@/contexts/auth.context";
import { Toaster } from "react-hot-toast";

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
        className={`${popinsFont["400"].className} antialiased bg-[#f3f6f8]`}
      >
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}