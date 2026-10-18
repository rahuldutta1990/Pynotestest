import React, { useState, useEffect } from 'react';

interface CookieBannerProps {
  ga4Id?: string;
  metaPixelId?: string;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ ga4Id, metaPixelId }) => {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('pynotes_cookie_consent');
    if (consent === 'true') {
      setAccepted(true);
      loadAnalytics();
    } else if (consent === 'false') {
      setAccepted(false);
    }
  }, []);

  const loadAnalytics = () => {
    if (ga4Id && !window.dataLayer) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', ga4Id);
    }
  };

  const handleAccept = () => {
    localStorage.setItem('pynotes_cookie_consent', 'true');
    setAccepted(true);
    loadAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem('pynotes_cookie_consent', 'false');
    setAccepted(false);
  };

  if (accepted !== null) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 bg-[#071E38] text-white p-5 rounded-2xl shadow-2xl border border-[#12A5B0]/30 animate-slideUp">
      <h4 className="font-heading font-bold text-sm text-[#FFD54A]">We Value Your Privacy</h4>
      <p className="font-body text-xs text-[#DDF3F4]/90 mt-1.5 leading-relaxed">
        We use essential cookies for store operations. Analytics cookies (GA4) are loaded only after your consent.
      </p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleAccept}
          className="flex-1 bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs py-2 rounded-xl hover:brightness-105 transition"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="px-4 border border-white/20 text-white font-heading font-semibold text-xs py-2 rounded-xl hover:bg-white/10 transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    dataLayer: any[];
  }
}
