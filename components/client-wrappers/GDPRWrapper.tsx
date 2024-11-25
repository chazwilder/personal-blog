"use client";

import { CookieConsentBanner, GDPRDataProcessor } from "@/components/gdpr";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import TrackingPixels from "@/components/TrackingPixels";
import { useEffect, useState } from "react";

export default function GDPRWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [gaId, setGaId] = useState<string>("");

  useEffect(() => {
    setGaId(process.env.NEXT_PUBLIC_GA_ID || "");
  }, []);

  return (
    <GDPRDataProcessor>
      <AnalyticsProvider>
        {children}
        <CookieConsentBanner />
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <TrackingPixels />
      </AnalyticsProvider>
    </GDPRDataProcessor>
  );
}
