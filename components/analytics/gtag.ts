export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export function gtag(...args: any[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

export function pageview(url: string) {
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function event({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) {
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}
