import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SiteSettings } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  siteSettings?: SiteSettings | null;
  jsonLd?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  siteSettings,
  jsonLd
}) => {
  const globalSiteTitle = siteSettings?.site_title || 'PyNotes - Printed Handwritten Coding Notes';
  const fullTitle = title 
    ? (title.toLowerCase().includes('pynotes') ? title : `${title} | ${globalSiteTitle.split(' - ')[0]}`) 
    : globalSiteTitle;
  
  const defaultDescription = siteSettings?.site_description || 'Learn. Write. Grow. Premium printed handwritten-style coding books and study bundles across India.';
  const finalDescription = description || defaultDescription;
  
  const finalKeywords = keywords || siteSettings?.meta_keywords || 'PyNotes, coding books, handwritten notes, C programming, Java, Python, DSA, engineering books';
  const finalImage = image || siteSettings?.og_image || siteSettings?.custom_logo_url || '/PyNotes_Primary-Stacked_FullColor.png';
  const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://pynotes.in');
  const ga4Id = siteSettings?.ga4_id;
  const gtmId = siteSettings?.gtm_id;

  // Google Tag Manager (GTM) Container Injection
  useEffect(() => {
    if (!gtmId || typeof window === 'undefined') return;

    // Check if GTM script already injected
    if (!document.getElementById('gtm-script')) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

      const script = document.createElement('script');
      script.id = 'gtm-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      document.head.appendChild(script);

      // Noscript iframe fallback for body
      if (!document.getElementById('gtm-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'gtm-noscript';
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.appendChild(noscript);
      }
    }
  }, [gtmId]);

  // Google Analytics 4 Injection
  useEffect(() => {
    if (!ga4Id || typeof window === 'undefined') return;

    // Check if GA script already injected
    if (!document.getElementById('ga4-script')) {
      const script1 = document.createElement('script');
      script1.id = 'ga4-script';
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.id = 'ga4-init';
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${ga4Id}', { send_page_view: true });
      `;
      document.head.appendChild(script2);
    }
  }, [ga4Id]);


  // Core Web Vitals RUM Performance Monitor
  useEffect(() => {
    if (!siteSettings?.enable_core_web_vitals || typeof window === 'undefined') return;

    if ('performance' in window && 'PerformanceObserver' in window) {
      try {
        // Observe LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            console.log('[Core Web Vitals] LCP:', Math.round(lastEntry.startTime), 'ms');
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // Observe CLS (Cumulative Layout Shift)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
          console.log('[Core Web Vitals] CLS:', clsScore.toFixed(3));
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // Observe FID / INP
        const inpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            console.log('[Core Web Vitals] INP/FID:', Math.round(lastEntry.duration), 'ms');
          }
        });
        inpObserver.observe({ type: 'first-input', buffered: true });
      } catch (err) {
        // Ignore unsupported performance entry types
      }
    }
  }, [siteSettings?.enable_core_web_vitals]);

  // Default WebApplication / Store JSON-LD Schema
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'PyNotes',
    url: 'https://pynotes.in',
    description: finalDescription,
    image: finalImage,
    priceRange: '₹399 - ₹2499',
  };

  const activeSchema = jsonLd || defaultSchema;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalUrl} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="PyNotes" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />

      {/* Twitter / X Social Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      {siteSettings?.twitter_handle && (
        <meta name="twitter:site" content={siteSettings.twitter_handle} />
      )}

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(activeSchema)}
      </script>
    </Helmet>
  );
};

