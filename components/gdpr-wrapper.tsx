"use client";

import { CookieConsentBanner, GDPRDataProcessor } from "@/components/gdpr";

export function GDPRWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GDPRDataProcessor>
      {children}
      <CookieConsentBanner />
    </GDPRDataProcessor>
  );
}
