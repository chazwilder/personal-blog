import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
      <div className={`antialiased w-full min-h-[80vh] h-full flex flex-col`}>
        {children}
      </div>
    </ClerkProvider>
  );
}
