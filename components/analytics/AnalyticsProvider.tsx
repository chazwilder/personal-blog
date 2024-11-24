"use client";

import { useEffect } from "react";
import { useCookieStore } from "../gdpr";
import { event } from "./gtag";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { consent } = useCookieStore();
  useEffect(() => {
    if (consent.analytics) {
      const handleContactFormSubmit = () => {
        event({
          action: "submit_form",
          category: "engagement",
          label: "contact_form",
        });
      };

      document.addEventListener("contact_form_submit", handleContactFormSubmit);

      return () => {
        document.removeEventListener(
          "contact_form_submit",
          handleContactFormSubmit,
        );
      };
    }
  }, [consent.analytics]);

  return <>{children}</>;
}
