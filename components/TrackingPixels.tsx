import { useCookieStore } from "@/components/gdpr";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function TrackingPixels() {
  const { consent } = useCookieStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (consent.marketing && window.fbq) {
      window.fbq("track", "PageView");
    }
    if (consent.marketing && window.twq) {
      window.twq("track", "PageView");
    }
  }, [pathname, searchParams, consent.marketing]);

  if (!consent.marketing) return null;

  return (
    <>
      {/* Meta Pixel */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '910803960688803');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=910803960688803&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      {/* Twitter Pixel */}
      <Script id="twitter-pixel" strategy="afterInteractive">
        {`
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','nvftf');
        `}
      </Script>
    </>
  );
}
