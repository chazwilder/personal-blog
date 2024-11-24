"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import React from "react";
import { format } from "date-fns";

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieSettings {
  consent: CookieConsent;
  hasConsented: boolean;
  lastUpdated: string;
}

interface CookieStore extends CookieSettings {
  updateConsent: (consent: Partial<CookieConsent>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
}

// Cookie Consent Store
export const useCookieStore = create<CookieStore>()(
  persist(
    (set) => ({
      consent: {
        necessary: true,
        analytics: false,
        marketing: false,
      },
      hasConsented: false,
      lastUpdated: new Date().toISOString(),
      updateConsent: (newConsent) =>
        set((state) => ({
          consent: { ...state.consent, ...newConsent },
          hasConsented: true,
          lastUpdated: new Date().toISOString(),
        })),
      acceptAll: () =>
        set({
          consent: {
            necessary: true,
            analytics: true,
            marketing: true,
          },
          hasConsented: true,
          lastUpdated: new Date().toISOString(),
        }),
      rejectAll: () =>
        set({
          consent: {
            necessary: true,
            analytics: false,
            marketing: false,
          },
          hasConsented: true,
          lastUpdated: new Date().toISOString(),
        }),
    }),
    {
      name: "cookie-consent",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function CookieConsentBanner() {
  const { consent, hasConsented, updateConsent, acceptAll, rejectAll } =
    useCookieStore();

  if (hasConsented) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-4 z-[999] shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            We use cookies to enhance your experience. By continuing to visit
            this site you agree to our use of cookies.{" "}
            <a href="/privacy-policy" className="text-main hover:underline">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => rejectAll()}
            className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            Reject All
          </button>
          <button
            onClick={() => acceptAll()}
            className="px-4 py-2 text-sm bg-main text-black rounded-md hover:bg-main/80 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { consent, updateConsent } = useCookieStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Cookie Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Necessary Cookies</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Required for the website to function properly
                </p>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className="rounded text-main"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Analytics Cookies</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Help us understand how visitors interact with the website
                </p>
              </div>
              <input
                type="checkbox"
                checked={consent.analytics}
                onChange={(e) => updateConsent({ analytics: e.target.checked })}
                className="rounded text-main"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Marketing Cookies</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Used to deliver personalized advertisements
                </p>
              </div>
              <input
                type="checkbox"
                checked={consent.marketing}
                onChange={(e) => updateConsent({ marketing: e.target.checked })}
                className="rounded text-main"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-main text-black rounded-md hover:bg-main/80 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GDPRDataProcessor({ children }: { children: React.ReactNode }) {
  const { consent, hasConsented } = useCookieStore();

  const handleAnalytics = () => {
    if (consent.analytics) {
      console.log("Analytics initialized");
    }
  };

  const handleMarketing = () => {
    if (consent.marketing) {
      console.log("Marketing tools initialized");
    }
  };

  React.useEffect(() => {
    if (hasConsented) {
      handleAnalytics();
      handleMarketing();
    }
  }, [hasConsented, consent]);

  return <>{children}</>;
}

const currentDate = new Date();

interface PrivacyPolicyProps {
  websiteUrl?: string;
  contactEmail?: string;
  companyAddress?: string;
  dpoEmail?: string;
}

export function PrivacyPolicy({
  websiteUrl = "https://chazwilder.io",
  contactEmail = "hello@chazwilder.io",
  companyAddress = "",
  dpoEmail = "privacy@chazwilder.io",
}: PrivacyPolicyProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-neutral-500">
        Last updated: {format(currentDate, "MMMM d, yyyy")}
      </p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to {websiteUrl} ("we," "us," or "our"). We respect your privacy
        and are committed to protecting your personal data. This privacy policy
        explains how we collect, use, and safeguard your information when you
        visit our website.
      </p>

      <h2>2. Information We Collect</h2>

      <h3>2.1 Information Automatically Collected</h3>
      <p>
        When you visit our website, we automatically collect certain information
        using Google Analytics 4, including:
      </p>
      <ul>
        <li>
          Device information (browser type, operating system, device type)
        </li>
        <li>IP address (anonymized)</li>
        <li>Pages visited and time spent on pages</li>
        <li>Referral source</li>
        <li>General geographic location (city/country level)</li>
        <li>Basic usage statistics</li>
      </ul>

      <h3>2.2 Information You Provide</h3>
      <p>We may also collect information you voluntarily provide when:</p>
      <ul>
        <li>Submitting contact forms</li>
        <li>Subscribing to newsletters</li>
        <li>Commenting on blog posts</li>
        <li>Interacting with our content</li>
      </ul>

      <h2>3. How We Use Google Analytics</h2>
      <p>
        We use Google Analytics 4 to understand how visitors interact with our
        website. This service helps us:
      </p>
      <ul>
        <li>Analyze website traffic and user behavior</li>
        <li>Improve our content and user experience</li>
        <li>Understand which content is most valuable to our visitors</li>
        <li>Track the effectiveness of our website</li>
      </ul>

      <h3>3.1 Data Collection by Google Analytics</h3>
      <p>
        Google Analytics collects data using cookies and similar technologies.
        The service may collect:
      </p>
      <ul>
        <li>Pages visited and time spent on each page</li>
        <li>Technical information about your device and browser</li>
        <li>General location data (not precise location)</li>
        <li>Referral sources</li>
      </ul>

      <h3>3.2 Data Protection Measures</h3>
      <p>We have implemented the following measures to protect your privacy:</p>
      <ul>
        <li>IP anonymization is enabled</li>
        <li>Data sharing with Google is limited</li>
        <li>Data retention period is set to 26 months</li>
        <li>Advertising features are disabled</li>
        <li>User consent is required for analytics cookies</li>
      </ul>

      <h2>4. Your Privacy Rights</h2>
      <p>
        Under the GDPR and similar privacy laws, you have the following rights:
      </p>
      <ul>
        <li>Right to access your personal data</li>
        <li>Right to rectification of incorrect data</li>
        <li>Right to erasure ("right to be forgotten")</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object to processing</li>
        <li>Right to withdraw consent</li>
      </ul>

      <h2>5. Cookie Management</h2>
      <p>We use the following types of cookies:</p>
      <ul>
        <li>
          <strong>Necessary Cookies:</strong> Required for the website to
          function properly
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Used by Google Analytics to
          understand user behavior
        </li>
      </ul>

      <p>You can manage your cookie preferences in several ways:</p>
      <ul>
        <li>Using our cookie consent banner</li>
        <li>Through your browser settings</li>
        <li>
          Using Google's{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            opt-out browser add-on
          </a>
        </li>
      </ul>

      <h2>6. Data Security</h2>
      <p>
        We implement appropriate technical and organizational security measures
        to protect your personal data. However, please note that no method of
        transmission over the internet is 100% secure.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        Our website is not intended for children under 16 years of age. We do
        not knowingly collect personal data from children under 16.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. Any changes will be
        posted on this page with an updated revision date.
      </p>

      <h2>9. Contact Information</h2>
      <div className="space-y-2">
        <p>
          For any questions about this privacy policy or our privacy practices,
          please contact us at:
        </p>
        <p>Email: {contactEmail}</p>
        {companyAddress && <p>Address: {companyAddress}</p>}
        <p>Data Protection Officer: {dpoEmail}</p>
      </div>

      <div className="mt-8 text-sm text-neutral-500">
        <p>
          This privacy policy was last updated on{" "}
          {format(currentDate, "MMMM d, yyyy")}.
        </p>
      </div>
    </div>
  );
}

export { PrivacyPolicy as privacyPolicy };
