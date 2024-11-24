import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

// Dynamically import GDPR and Analytics components
const GDPRWrapper = dynamic(
  () => import("@/components/client-wrappers/GDPRWrapper"),
  {
    ssr: true,
  },
);

export const metadata: Metadata = {
  title: "The Curious Coder | Full Stack Problem Solver",
  description: "Driven By Curiosity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Suspense fallback={null}>
            <GDPRWrapper>{children}</GDPRWrapper>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
