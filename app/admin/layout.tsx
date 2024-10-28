import type { Metadata } from "next";
import "../globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

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
      <div className={`antialiased w-full min-h-screen h-full`}>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {children}
      </div>
    </ClerkProvider>
  );
}
