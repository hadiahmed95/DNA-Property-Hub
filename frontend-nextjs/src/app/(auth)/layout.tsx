import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - DNA Properties Hub",
  description: "Sign in to your DNA Properties Hub account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* No header, no footer - just the auth content */}
      {children}
    </>
  );
}