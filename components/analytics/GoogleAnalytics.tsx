"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { useCookieStore } from "../gdpr";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function GoogleAnalyticsContent({ gaId }: { gaId: string }) {
  const { consent } = useCookieStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (consent.analytics && window.gtag && gaId) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      window.gtag("config", gaId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, consent.analytics, gaId]);

  if (!consent.analytics) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  if (!gaId) return null;

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent gaId={gaId} />
    </Suspense>
  );
}
