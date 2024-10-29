import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "The Curious Coder",
  description: "Driven By Curiosity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div
        className={`antialiased w-full min-h-screen h-full flex flex-1 flex-col z-50 text-black`}
      >
        <NavBar />
        {children}
      </div>
    </ClerkProvider>
  );
}
