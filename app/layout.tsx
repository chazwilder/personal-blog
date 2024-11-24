import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Inter } from "next/font/google";
import { CookieConsentBanner, GDPRDataProcessor } from "@/components/gdpr";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";

const inter = Inter({ subsets: ["latin"] });
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
          <GDPRDataProcessor>
            <AnalyticsProvider>
              {children}
              <CookieConsentBanner />
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
            </AnalyticsProvider>
          </GDPRDataProcessor>
        </ThemeProvider>
      </body>
    </html>
  );
}
