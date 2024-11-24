import { useCookieStore } from "@/components/gdpr";
import { useCallback } from "react";

export function useAnalytics() {
  const { consent } = useCookieStore();

  const event = useCallback(
    (name: string, params: Record<string, any>) => {
      if (consent.analytics && window.gtag) {
        window.gtag("event", name, params);
      }
    },
    [consent.analytics],
  );

  return { event };
}
