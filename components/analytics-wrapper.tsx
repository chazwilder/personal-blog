"use client";

import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";

export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      {children}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </AnalyticsProvider>
  );
}
