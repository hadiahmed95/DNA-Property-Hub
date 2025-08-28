import type { Metadata } from "next";
import Header from "../_components/header";
import Footer from "../_components/footer";
import TopBar from "../_components/top-bar";

export const metadata: Metadata = {
  title: "DNA Properties Hub",
  description: "Your trusted real estate partner",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      <Header />
      {children}
      <Footer />
    </>
  );
}