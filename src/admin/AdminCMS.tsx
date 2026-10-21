import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { SiteSettings, Coupon, Subject, FAQ, HeroBannerItem } from '../types';
import { AdminOrders } from './AdminOrders';
import { AdminReviews } from './AdminReviews';

export const AdminCMS: React.FC<{ section: string }> = ({ section }) => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [adminPlans, setAdminPlans] = useState<any[]>([]);
  const [adminSubscriptions, setAdminSubscriptions] = useState<any[]>([]);
  const [adminCancellations, setAdminCancellations] = useState<any[]>([]);
  const [adminWebhookEvents, setAdminWebhookEvents] = useState<any[]>([]);
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [adminWishlists, setAdminWishlists] = useState<any[]>([]);
  const [adminPages, setAdminPages] = useState<any[]>([]);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [selectedBannerIdx, setSelectedBannerIdx] = useState(0);

  const loadAll = async () => {
    setLoading(true);
    try {
      if (section === 'settings' || section === 'seo' || section === 'logo' || section === 'pricing' || section === 'content' || section === 'announcements' || section === 'products' || section === 'hero-banners' || section === 'orders' || section === 'instagram' || section === 'payments' || section === 'payment-page' || section === 'subscriptions' || section === 'offers') {
        const res = await adminFetch('/settings');
        setSettings(res);
      } else if (section === 'coupons') {
        const res = await adminFetch('/coupons');
        setCoupons(res);
      } else if (section === 'wishlists') {
        const res = await adminFetch('/wishlists');
        setAdminWishlists(res);
      } else if (section === 'subjects') {
        const res = await adminFetch('/subjects');
        setSubjects(res);
      } else if (section === 'faqs') {
        const res = await adminFetch('/faqs');
        setFaqs(res);
      } else if (section === 'users') {
        const [usersRes, auditRes] = await Promise.all([
          adminFetch('/users'),
          adminFetch('/audit-logs').catch(() => [])
        ]);
        setUsers(usersRes || []);
        setAuditLogs(auditRes || []);
      } else if (section === 'subscriptions') {
        const [plansRes, subsRes, metricsRes] = await Promise.all([
          adminFetch('/plans'),
          adminFetch('/subscriptions'),
          adminFetch('/subscription-metrics')
        ]);
        setAdminPlans(plansRes);
        setAdminSubscriptions(subsRes);
        setAdminMetrics(metricsRes);
      } else if (section === 'cancellations') {
        const res = await adminFetch('/cancellations');
        setAdminCancellations(res);
      } else if (section === 'webhook-log') {
        const res = await adminFetch('/webhook-events');
        setAdminWebhookEvents(res);
      } else if (section === 'pages') {
        const res = await adminFetch('/pages');
        setAdminPages(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [section]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg(null);
    try {
      await adminFetch('/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaveMsg('Settings saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save');
    }
  };

  if (loading) return <div className="py-12 text-center text-xs text-[#3C5D81]">Loading Admin Management Screen...</div>;

  if (section === 'pricing') {
    return (
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 max-w-2xl text-xs">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Pricing, Offers & Discounts</h3>
        {saveMsg && <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3 rounded-xl">{saveMsg}</div>}

        <div>
          <label className="block font-semibold mb-1">Prepaid Instant Discount %</label>
          <input
            type="number"
            value={settings.prepaid_discount_percent ?? 10}
            onChange={e => setSettings({ ...settings, prepaid_discount_percent: Number(e.target.value) })}
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">COD Fee (in Paise, e.g. 4900 = Rs. 49)</label>
          <input
            type="number"
            value={settings.cod_fee_paise ?? 4900}
            onChange={e => setSettings({ ...settings, cod_fee_paise: Number(e.target.value) })}
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Free Shipping Threshold (in Paise, 0 = Always Free)</label>
          <input
            type="number"
            value={settings.free_shipping_threshold_paise ?? 0}
            onChange={e => setSettings({ ...settings, free_shipping_threshold_paise: Number(e.target.value) })}
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono"
          />
        </div>

        <button type="submit" className="w-full bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl">
          Save Pricing Rules
        </button>
      </form>
    );
  }

  if (section === 'seo') {
    const handleOgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file for OpenGraph preview.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings(prev => ({ ...prev, og_image: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="space-y-8 max-w-4xl text-xs">
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6">
          <div className="border-b border-[#0B3561]/10 pb-4">
            <h3 className="font-heading font-bold text-xl text-[#0B3561]">SEO, GA4 & Core Web Vitals Manager</h3>
            <p className="text-[#3C5D81] text-xs mt-1">
              Dynamically update global meta tags, social sharing (OpenGraph/Twitter) cards, Google Analytics 4 tracking, and Real User Monitoring (RUM) for Web Vitals across the entire store.
            </p>
          </div>

          {saveMsg && (
            <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3.5 rounded-2xl border border-[#12A5B0]/30 shadow-xs">
              {saveMsg}
            </div>
          )}

          {/* 1. Global Meta Tags */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm text-[#0B3561] flex items-center gap-2">
              <span>🔍</span> Search Engine Meta Tags
            </h4>

            <div>
              <label className="block font-semibold mb-1 text-[#0B3561]">Global Site Title (`&lt;title&gt;` & `og:title`)</label>
              <input
                type="text"
                value={settings.site_title || ''}
                onChange={e => setSettings({ ...settings, site_title: e.target.value })}
                placeholder="PyNotes - Printed Handwritten Coding Notes & Books"
                className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-medium"
              />
              <p className="text-[10px] text-[#3C5D81] mt-1">Recommended length: 30 - 60 characters.</p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#0B3561]">Meta Description (`&lt;meta name="description"&gt;`)</label>
              <textarea
                rows={3}
                value={settings.site_description || ''}
                onChange={e => setSettings({ ...settings, site_description: e.target.value })}
                placeholder="Learn. Write. Grow. Premium printed handwritten-style coding books and study bundles delivered across India."
                className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-medium"
              />
              <p className="text-[10px] text-[#3C5D81] mt-1">Recommended length: 120 - 160 characters.</p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#0B3561]">Meta Keywords (`&lt;meta name="keywords"&gt;`)</label>
              <input
                type="text"
                value={settings.meta_keywords || ''}
                onChange={e => setSettings({ ...settings, meta_keywords: e.target.value })}
                placeholder="PyNotes, coding books, handwritten notes, C, Java, Python, DSA"
                className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-medium"
              />
              <p className="text-[10px] text-[#3C5D81] mt-1">Comma-separated target search keywords.</p>
            </div>
          </div>

          {/* 2. OpenGraph & Social Media Cards */}
          <div className="space-y-4 pt-4 border-t border-[#0B3561]/10">
            <h4 className="font-heading font-bold text-sm text-[#0B3561] flex items-center gap-2">
              <span>🖼️</span> Social Sharing Cards (OpenGraph / Twitter)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-[#0B3561]">OpenGraph Banner Image (`og:image`)</label>
                <div className="space-y-2">
                  <div className="border border-dashed border-[#12A5B0]/40 bg-[#F7FAFC] rounded-xl p-4 text-center cursor-pointer relative hover:bg-[#DDF3F4]/20 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOgFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <p className="font-bold text-[#0B3561] text-xs">Upload OpenGraph Card Image</p>
                    <p className="text-[10px] text-[#3C5D81]">1200 x 630 px recommended (PNG / JPG / WebP)</p>
                  </div>
                  <input
                    type="text"
                    value={settings.og_image || ''}
                    onChange={e => setSettings({ ...settings, og_image: e.target.value })}
                    placeholder="Or enter direct URL: https://pynotes.in/og-banner.png"
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0B3561]">Twitter / X Handle (`@username`)</label>
                <input
                  type="text"
                  value={settings.twitter_handle || ''}
                  onChange={e => setSettings({ ...settings, twitter_handle: e.target.value })}
                  placeholder="@pynotes_in"
                  className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-medium"
                />
                <p className="text-[10px] text-[#3C5D81] mt-1">Appears on shared Twitter cards (`twitter:site`).</p>
              </div>
            </div>
          </div>

          {/* 3. Analytics & Performance Tracking */}
          <div className="space-y-4 pt-4 border-t border-[#0B3561]/10">
            <h4 className="font-heading font-bold text-sm text-[#0B3561] flex items-center gap-2">
              <span>📈</span> Analytics & Core Web Vitals Monitoring
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-[#0B3561]">Google Tag Manager Container ID</label>
                <input
                  type="text"
                  value={settings.gtm_id || ''}
                  onChange={e => setSettings({ ...settings, gtm_id: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                  className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-mono text-xs"
                />
                <p className="text-[10px] text-[#3C5D81] mt-1">Injects GTM container script and iframe snippet.</p>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0B3561]">Google Analytics 4 Measurement ID</label>
                <input
                  type="text"
                  value={settings.ga4_id || ''}
                  onChange={e => setSettings({ ...settings, ga4_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-mono text-xs"
                />
                <p className="text-[10px] text-[#3C5D81] mt-1">Direct GA4 tracking tag injection.</p>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#0B3561]">Meta / Facebook Pixel ID</label>
                <input
                  type="text"
                  value={settings.meta_pixel_id || ''}
                  onChange={e => setSettings({ ...settings, meta_pixel_id: e.target.value })}
                  placeholder="123456789012345"
                  className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-mono text-xs"
                />
                <p className="text-[10px] text-[#3C5D81] mt-1">Used for Meta ad tracking & conversions.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="enable_core_web_vitals"
                checked={!!settings.enable_core_web_vitals}
                onChange={e => setSettings({ ...settings, enable_core_web_vitals: e.target.checked })}
                className="w-4 h-4 text-[#12A5B0] accent-[#12A5B0] rounded cursor-pointer"
              />
              <label htmlFor="enable_core_web_vitals" className="font-semibold text-xs text-[#0B3561] cursor-pointer">
                Enable Core Web Vitals RUM Performance Tracking (LCP, CLS, FID/INP monitoring)
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#0B3561] text-white font-heading font-bold py-3.5 rounded-xl hover:bg-[#071E38] transition shadow-md">
            Save SEO & Analytics Settings
          </button>
        </form>
      </div>
    );
  }

  if (section === 'logo') {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, SVG, WebP).');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setSettings(prev => ({ ...prev, custom_logo_url: base64Url }));
      };
      reader.readAsDataURL(file);
    };

    const handleResetLogo = async () => {
      if (!confirm('Reset store logo back to official PyNotes primary logo?')) return;
      const updated = { ...settings, custom_logo_url: '' };
      setSettings(updated);
      try {
        await adminFetch('/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        setSaveMsg('Store logo reset to default official PyNotes logo!');
      } catch (err: any) {
        alert(err.message || 'Failed to reset logo');
      }
    };

    const currentLogo = settings.custom_logo_url || '/PyNotes_Primary-Stacked_FullColor.png';

    return (
      <div className="space-y-8 max-w-3xl text-xs">
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0B3561]/10 pb-4 gap-3">
            <div>
              <h3 className="font-heading font-bold text-xl text-[#0B3561]">Store Logo & Branding Management</h3>
              <p className="text-[#3C5D81] text-xs mt-1">
                Upload your official brand logo. Automatically published across header navigation, mobile drawer, checkout, and footer.
              </p>
            </div>
            {settings.custom_logo_url && (
              <button
                type="button"
                onClick={handleResetLogo}
                className="px-3.5 py-2 bg-red-50 text-red-700 font-semibold rounded-xl border border-red-200 hover:bg-red-100 transition-all cursor-pointer self-start sm:self-auto"
              >
                Reset to Default Logo
              </button>
            )}
          </div>

          {saveMsg && <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3.5 rounded-2xl border border-[#12A5B0]/30 shadow-xs">{saveMsg}</div>}

          {/* 1. Drag & Drop File Upload Card */}
          <div className="space-y-2">
            <label className="block font-heading font-bold text-sm text-[#0B3561]">Upload Logo File (Image Picker)</label>
            <div className="border-2 border-dashed border-[#12A5B0]/50 bg-[#F7FAFC] hover:bg-[#DDF3F4]/30 rounded-2xl p-6 text-center transition-all relative cursor-pointer group">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-[#12A5B0]/15 text-[#12A5B0] flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
                  📁
                </div>
                <p className="font-heading font-bold text-[#0B3561] text-sm">
                  Click to Upload Logo File or Drag & Drop Here
                </p>
                <p className="text-[11px] text-[#3C5D81]">
                  Supports PNG, JPG, WebP, SVG (Transparent PNG or SVG recommended) • Max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* 2. Direct Image URL Input */}
          <div className="space-y-2">
            <label className="block font-semibold text-xs text-[#0B3561]">Or Enter Direct Custom Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.custom_logo_url || ''}
                onChange={e => setSettings({ ...settings, custom_logo_url: e.target.value })}
                placeholder="https://your-domain.com/assets/my-logo.png"
                className="flex-1 p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs font-mono"
              />
              {settings.custom_logo_url && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, custom_logo_url: '' })}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-[10px] text-[#3C5D81]">
              Leave blank to use the default official PyNotes handwritten logo.
            </p>
          </div>

          {/* 3. Live Surface Preview Box */}
          <div className="space-y-3 pt-4 border-t border-[#0B3561]/10">
            <h4 className="font-heading font-bold text-sm text-[#0B3561]">Live Storefront Logo Preview</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Surface View (Header) */}
              <div className="bg-[#F7FAFC] border border-[#0B3561]/15 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-[#3C5D81] uppercase tracking-wider block">
                  Header & Light Navigation View
                </span>
                <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-center min-h-[90px]">
                  <img
                    src={currentLogo}
                    alt="Logo Preview Light"
                    className="max-h-16 w-auto object-contain block drop-shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Dark Surface View (Footer & Mobile Bar) */}
              <div className="bg-[#071E38] p-4 rounded-2xl space-y-2 text-white">
                <span className="text-[10px] font-bold text-[#12A5B0] uppercase tracking-wider block">
                  Footer & Dark Capsule View
                </span>
                <div className="bg-[#0B3561] p-4 rounded-xl border border-white/10 flex items-center justify-center min-h-[90px]">
                  <div className="inline-flex items-center bg-white px-3.5 py-2 rounded-2xl border border-white/30 shadow-md">
                    <img
                      src={currentLogo}
                      alt="Logo Preview Dark"
                      className="max-h-16 w-auto object-contain block"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3.5 rounded-xl hover:brightness-105 shadow-md cursor-pointer text-sm"
          >
            Save & Publish Store Logo
          </button>
        </form>
      </div>
    );
  }

  if (section === 'settings') {
    return (
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 max-w-2xl text-xs">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Store GST & Branding Settings</h3>
        {saveMsg && <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3 rounded-xl">{saveMsg}</div>}

        <div>
          <label className="block font-semibold mb-1">Custom Logo Image URL (Optional - leave blank for default SVG logo)</label>
          <input
            type="text"
            value={settings.custom_logo_url || ''}
            onChange={e => setSettings({ ...settings, custom_logo_url: e.target.value })}
            placeholder="https://..."
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Legal Company Name</label>
            <input
              type="text"
              value={settings.legal_name || ''}
              onChange={e => setSettings({ ...settings, legal_name: e.target.value })}
              className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">GSTIN Number</label>
            <input
              type="text"
              value={settings.gstin || ''}
              onChange={e => setSettings({ ...settings, gstin: e.target.value })}
              className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Support Email</label>
            <input
              type="email"
              value={settings.support_email || ''}
              onChange={e => setSettings({ ...settings, support_email: e.target.value })}
              className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">WhatsApp Support Number</label>
            <input
              type="text"
              value={settings.whatsapp_number || ''}
              onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Instagram Access Token (Secret Key)</label>
          <input
            type="password"
            value={settings.instagram_access_token || ''}
            onChange={e => setSettings({ ...settings, instagram_access_token: e.target.value })}
            placeholder="Paste your Instagram Graph API access token here..."
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono text-xs"
          />
          <p className="text-[10px] text-[#3C5D81] mt-1">Saves your Instagram Access Token securely in database settings to fetch live posts on product detail pages.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#0B3561]/10">
          <div>
            <label className="block font-semibold mb-1">Razorpay Key ID (Live/Test)</label>
            <input
              type="text"
              value={settings.razorpay_key_id || ''}
              onChange={e => setSettings({ ...settings, razorpay_key_id: e.target.value })}
              placeholder="rzp_live_..."
              className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Razorpay Key Secret</label>
            <input
              type="password"
              value={settings.razorpay_key_secret || ''}
              onChange={e => setSettings({ ...settings, razorpay_key_secret: e.target.value })}
              placeholder="Enter Razorpay Secret..."
              className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl hover:bg-[#071E38] transition">
            Save Settings
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                const res = await adminFetch('/test-razorpay', { method: 'POST' });
                alert(res.message || 'Razorpay live API test successful!');
              } catch (err: any) {
                alert('Razorpay Test Failed: ' + (err.message || 'Check your keys'));
              }
            }}
            className="px-6 bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3 rounded-xl hover:brightness-105 transition"
          >
            Test Live API ⚡
          </button>
        </div>
      </form>
    );
  }

  if (section === 'announcements') {
    return (
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 max-w-2xl text-xs">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Announcement Bar</h3>
        {saveMsg && <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3 rounded-xl">{saveMsg}</div>}

        <div className="space-y-4">
          {(settings.announcement_messages || []).map((msg, index) => (
            <div key={index} className="flex gap-2 items-start border-b pb-4">
              <input
                type="text"
                value={msg.text}
                onChange={e => {
                  const newMsgs = [...(settings.announcement_messages || [])];
                  newMsgs[index].text = e.target.value;
                  setSettings({ ...settings, announcement_messages: newMsgs });
                }}
                className="flex-1 p-2.5 bg-[#F7FAFC] border rounded-xl"
                placeholder="Message text"
              />
              <input
                type="text"
                value={msg.highlight || ''}
                onChange={e => {
                  const newMsgs = [...(settings.announcement_messages || [])];
                  newMsgs[index].highlight = e.target.value;
                  setSettings({ ...settings, announcement_messages: newMsgs });
                }}
                className="w-24 p-2.5 bg-[#F7FAFC] border rounded-xl"
                placeholder="Highlight"
              />
              <button 
                type="button"
                onClick={() => {
                  const newMsgs = (settings.announcement_messages || []).filter((_, i) => i !== index);
                  setSettings({ ...settings, announcement_messages: newMsgs });
                }}
                className="text-red-500 font-bold p-2"
              >
                Delete
              </button>
            </div>
          ))}
          <button 
            type="button"
            onClick={() => setSettings({ ...settings, announcement_messages: [...(settings.announcement_messages || []), { text: '', highlight: '' }] })}
            className="text-blue-600 font-bold"
          >
            + Add Message
          </button>
        </div>

        <button type="submit" className="w-full bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl">
          Save Announcements
        </button>
      </form>
    );
  }

  if (section === 'products') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm text-xs space-y-4">
        <h3 className="font-heading font-bold text-lg text-[#0B3561] capitalize">Manage Products</h3>
        <p className="text-[#3C5D81]">Manage your catalog: add, edit, or remove books.</p>
        {/* Simplified form structure placeholder */}
        <button className="bg-[#12A5B0] text-white p-2 rounded-xl">Add New Product</button>
      </div>
    );
  }

  if (section === 'reviews') {
    return <AdminReviews />;
  }

  if (section === 'hero-banners') {
    const defaultHeroBannersList: HeroBannerItem[] = [
      {
        id: 'banner_1',
        badge: '✨ 2026 Revised Student Edition • 100 GSM Colour Print',
        headline: 'Master Coding with Printed, Colourful Handwritten Notes.',
        writeup: 'Step-by-step algorithms, visual syntax trees, and color-coded memory traces on premium 100 GSM cream paper — built to crack semester exams and placement interviews without screen fatigue.',
        cta_text: 'Shop Notes',
        cta_link: '#subjects-grid',
        secondary_cta_text: 'Placement Bundles SAVE 50%',
        secondary_cta_link: '/bundles',
        image: '',
        accent_color: '#0B3561',
        active: true,
      },
      {
        id: 'banner_2',
        badge: '🚀 Complete Placement Prep • Visual DSA & Systems',
        headline: 'Crack Tech Interviews with Diagrammatic Logic & Solved Problems.',
        writeup: 'Over 850+ pages of handwritten problem breakdowns, visual recursion trees, Big-O proofs, and dynamic programming tabular patterns across Java, Python, and SQL.',
        cta_text: 'Explore Placement Bundles',
        cta_link: '/bundles',
        secondary_cta_text: 'View All 12 Subjects',
        secondary_cta_link: '/subjects',
        image: '',
        accent_color: '#12A5B0',
        active: true,
      },
      {
        id: 'banner_3',
        badge: '📖 Bleed-Proof 100 GSM Archival Cream Sheets',
        headline: 'Physical Notes Built for Long Study Sessions & Zero Glare.',
        writeup: 'High-opacity, smudge-resistant cream paper designed for highlighters and pens. Annotate, trace algorithms, and study without blue-light screen headache.',
        cta_text: 'Shop Notes',
        cta_link: '#subjects-grid',
        secondary_cta_text: 'Look Inside Pages',
        secondary_cta_link: '#look-inside',
        image: '',
        accent_color: '#FFD54A',
        active: true,
      },
      {
        id: 'banner_4',
        badge: '⚡ Pan-India Express Delivery • COD Available',
        headline: 'Order with Cash on Delivery — Arrives in 2–4 Business Days.',
        writeup: 'Dispatched in reinforced weather-proof packaging with live SMS and WhatsApp tracking so you can receive your books before semester test week.',
        cta_text: 'Order with Cash on Delivery',
        cta_link: '#subjects-grid',
        secondary_cta_text: 'Track Existing Order',
        secondary_cta_link: '/track',
        image: '',
        accent_color: '#10B981',
        active: true,
      },
    ];

    const currentBanners: HeroBannerItem[] = (settings.hero_banners && settings.hero_banners.length > 0)
      ? settings.hero_banners
      : defaultHeroBannersList;

    const safeIdx = Math.min(selectedBannerIdx, currentBanners.length - 1);
    const selectedBanner = currentBanners[safeIdx] || currentBanners[0];

    const updateBannerField = (field: keyof HeroBannerItem, value: any) => {
      const updated = currentBanners.map((b, i) => (i === safeIdx ? { ...b, [field]: value } : b));
      setSettings(prev => ({ ...prev, hero_banners: updated }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, WebP).');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        updateBannerField('image', base64Url);
      };
      reader.readAsDataURL(file);
    };

    const handleAddBanner = () => {
      const newBanner: HeroBannerItem = {
        id: `banner_${Date.now()}`,
        badge: '✨ 2026 Student Edition • 100 GSM Colour Print',
        headline: 'New Coding Notes Edition',
        writeup: 'Color-coded visual explanations and exam questions printed on premium bleed-proof paper.',
        cta_text: 'Shop Notes',
        cta_link: '#subjects-grid',
        secondary_cta_text: 'Placement Bundles SAVE 50%',
        secondary_cta_link: '/bundles',
        image: '',
        accent_color: '#12A5B0',
        active: true,
      };
      const updated = [...currentBanners, newBanner];
      setSettings(prev => ({ ...prev, hero_banners: updated }));
      setSelectedBannerIdx(updated.length - 1);
    };

    const handleDeleteBanner = (idx: number) => {
      if (currentBanners.length <= 1) {
        alert('You must have at least one hero banner.');
        return;
      }
      if (!confirm('Are you sure you want to remove this hero banner slide?')) return;
      const updated = currentBanners.filter((_, i) => i !== idx);
      setSettings(prev => ({ ...prev, hero_banners: updated }));
      setSelectedBannerIdx(Math.max(0, idx - 1));
    };

    const handleMoveBanner = (fromIdx: number, toIdx: number) => {
      if (toIdx < 0 || toIdx >= currentBanners.length) return;
      const updated = [...currentBanners];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      setSettings(prev => ({ ...prev, hero_banners: updated }));
      setSelectedBannerIdx(toIdx);
    };

    const handleResetToDefaults = async () => {
      if (!confirm('Reset all hero banners back to the standard 2026 Student Edition slides?')) return;
      setSettings(prev => ({ ...prev, hero_banners: defaultHeroBannersList }));
      setSelectedBannerIdx(0);
      try {
        await adminFetch('/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...settings, hero_banners: defaultHeroBannersList }),
        });
        setSaveMsg('Hero banners reset to 2026 Student Edition defaults!');
      } catch (err: any) {
        alert(err.message || 'Failed to reset hero banners');
      }
    };

    return (
      <div className="space-y-6 max-w-5xl text-xs">
        {/* Top Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🖼️</span>
              <h3 className="font-heading font-black text-xl text-[#0B3561]">Hero Banners & Visual Carousel</h3>
              <span className="bg-[#12A5B0]/15 text-[#0B3561] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {currentBanners.length} Slides Configured
              </span>
            </div>
            <p className="text-[#3C5D81] text-xs mt-1 max-w-2xl">
              Control the top hero banners rotating on the homepage. Change the student edition badges, headlines, write-ups, buttons, and upload big visual images. Changes are published live to students immediately upon saving.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-3.5 py-2 bg-gray-100 text-[#0B3561] font-semibold rounded-xl hover:bg-gray-200 transition text-xs"
            >
              Reset to 2026 Defaults
            </button>
            <button
              type="button"
              onClick={handleAddBanner}
              className="px-4 py-2 bg-[#12A5B0] text-[#071E38] font-heading font-bold rounded-xl hover:brightness-105 shadow-xs transition text-xs"
            >
              + Add New Slide
            </button>
          </div>
        </div>

        {saveMsg && (
          <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3.5 rounded-2xl border border-[#12A5B0]/30 flex items-center justify-between">
            <span>✓ {saveMsg}</span>
            <button onClick={() => setSaveMsg(null)} className="text-[#0B3561]/60 hover:text-[#0B3561]">✕</button>
          </div>
        )}

        {/* Slide Selection Bar */}
        <div className="bg-white p-3 rounded-2xl border border-[#0B3561]/10 shadow-xs flex items-center gap-2 overflow-x-auto">
          {currentBanners.map((banner, idx) => {
            const isSelected = idx === safeIdx;
            return (
              <button
                key={banner.id || idx}
                type="button"
                onClick={() => setSelectedBannerIdx(idx)}
                className={`px-4 py-2.5 rounded-xl font-heading text-xs font-bold flex items-center gap-2 transition flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B3561] text-white shadow-xs'
                    : 'bg-[#F7FAFC] text-[#3C5D81] hover:bg-[#DDF3F4]/50'
                }`}
              >
                <span>Slide {idx + 1}</span>
                <span className={`w-2 h-2 rounded-full ${banner.active !== false ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                {isSelected && <span className="text-[10px] text-[#FFD54A]">● Editing</span>}
              </button>
            );
          })}
        </div>

        {/* Live Preview Card */}
        <div className="bg-[#071E38] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#12A5B0] flex items-center gap-2">
              <span>👁️</span> Live Storefront Preview (Slide {safeIdx + 1} of {currentBanners.length})
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
              selectedBanner.active !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {selectedBanner.active !== false ? 'Active on Storefront' : 'Disabled / Hidden'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold">
                <span>{selectedBanner.badge || '✨ 2026 Revised Student Edition • 100 GSM Colour Print'}</span>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
                {selectedBanner.headline || 'Master Coding with Printed, Colourful Handwritten Notes.'}
              </h2>
              <p className="text-xs text-[#DDF3F4]/80 leading-relaxed max-w-xl">
                {selectedBanner.writeup || 'Step-by-step algorithms, visual syntax trees, and color-coded memory traces on premium 100 GSM cream paper...'}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="px-5 py-2.5 bg-[#12A5B0] text-[#071E38] font-heading font-bold rounded-xl text-xs">
                  {selectedBanner.cta_text || 'Shop Notes'} ↓
                </span>
                {selectedBanner.secondary_cta_text && (
                  <span className="px-4 py-2.5 bg-white/10 text-white font-heading font-bold rounded-xl text-xs border border-white/20">
                    {selectedBanner.secondary_cta_text}
                  </span>
                )}
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-[10px] text-[#DDF3F4]/70">
                <span>✓ Cash on Delivery</span>
                <span>✓ 2–4 Day Express Delivery</span>
                <span>✓ Bleed-Proof 100 GSM</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              {selectedBanner.image ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl max-h-52 w-full">
                  <img
                    src={selectedBanner.image}
                    alt={selectedBanner.headline}
                    className="w-full h-52 object-cover object-center"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-md font-mono">
                    Custom Artwork
                  </span>
                </div>
              ) : (
                <div className="bg-[#0B3561] border border-white/10 rounded-2xl p-6 text-center space-y-2 w-full">
                  <span className="text-4xl block">📖</span>
                  <span className="font-heading font-bold text-xs text-[#DDF3F4] block">
                    Default 3D Open Notebook Visual
                  </span>
                  <p className="text-[10px] text-[#DDF3F4]/60">
                    Displays interactive 3D notes mockups with floating subject books on the storefront.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor Form for Selected Banner */}
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#0B3561]/10 pb-4">
            <div>
              <h4 className="font-heading font-bold text-base text-[#0B3561]">
                Editing Slide {safeIdx + 1} Details
              </h4>
              <p className="text-xs text-[#3C5D81] mt-0.5">
                Update texts, links, badges, and big artwork for this slide.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safeIdx === 0}
                onClick={() => handleMoveBanner(safeIdx, safeIdx - 1)}
                className="px-2.5 py-1.5 border border-[#0B3561]/20 rounded-lg text-xs font-bold disabled:opacity-30 hover:bg-[#F7FAFC]"
                title="Move Slide Earlier"
              >
                ← Earlier
              </button>
              <button
                type="button"
                disabled={safeIdx === currentBanners.length - 1}
                onClick={() => handleMoveBanner(safeIdx, safeIdx + 1)}
                className="px-2.5 py-1.5 border border-[#0B3561]/20 rounded-lg text-xs font-bold disabled:opacity-30 hover:bg-[#F7FAFC]"
                title="Move Slide Later"
              >
                Later →
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBanner(safeIdx)}
                className="px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg border border-red-200 hover:bg-red-100 text-xs"
              >
                Delete Slide
              </button>
            </div>
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center justify-between p-4 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/10">
            <div>
              <label className="font-heading font-bold text-xs text-[#0B3561] block">
                Slide Visibility
              </label>
              <span className="text-[11px] text-[#3C5D81]">
                When enabled, this slide appears in the homepage rotating carousel.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBanner.active !== false}
                onChange={e => updateBannerField('active', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12A5B0]"></div>
            </label>
          </div>

          {/* Badge & Accent Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-[#0B3561]">
                Badge / Tagline (Appears Above Headline)
              </label>
              <input
                type="text"
                value={selectedBanner.badge || ''}
                onChange={e => updateBannerField('badge', e.target.value)}
                placeholder="e.g. ✨ 2026 Revised Student Edition • 100 GSM Colour Print"
                className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs font-medium focus:outline-none focus:border-[#12A5B0]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#0B3561]">
                Accent Highlight Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedBanner.accent_color || '#0B3561'}
                  onChange={e => updateBannerField('accent_color', e.target.value)}
                  className="w-10 h-10 p-0 border border-[#0B3561]/20 rounded-xl cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedBanner.accent_color || '#0B3561'}
                  onChange={e => updateBannerField('accent_color', e.target.value)}
                  className="flex-1 p-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div>
            <label className="block font-semibold mb-1 text-[#0B3561]">
              Main Headline (Big Title)
            </label>
            <input
              type="text"
              value={selectedBanner.headline || ''}
              onChange={e => updateBannerField('headline', e.target.value)}
              placeholder="e.g. Master Coding with Printed, Colourful Handwritten Notes."
              className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-sm font-heading font-bold text-[#0B3561] focus:outline-none focus:border-[#12A5B0]"
            />
          </div>

          {/* Write-up */}
          <div>
            <label className="block font-semibold mb-1 text-[#0B3561]">
              Write-up / One-Line Promise Description
            </label>
            <textarea
              rows={3}
              value={selectedBanner.writeup || ''}
              onChange={e => updateBannerField('writeup', e.target.value)}
              placeholder="Step-by-step algorithms, visual syntax trees, and color-coded memory traces on premium 100 GSM cream paper — built to crack semester exams and placement interviews without screen fatigue."
              className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-[#12A5B0]"
            />
          </div>

          {/* Buttons & Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/10 space-y-3">
              <span className="font-heading font-bold text-xs text-[#0B3561] block">
                Primary Button
              </span>
              <div>
                <label className="block font-semibold mb-1 text-[#3C5D81] text-[11px]">Button Label</label>
                <input
                  type="text"
                  value={selectedBanner.cta_text || ''}
                  onChange={e => updateBannerField('cta_text', e.target.value)}
                  placeholder="Shop Notes"
                  className="w-full p-2.5 bg-white border border-[#0B3561]/20 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-[#3C5D81] text-[11px]">Link Destination</label>
                <input
                  type="text"
                  value={selectedBanner.cta_link || ''}
                  onChange={e => updateBannerField('cta_link', e.target.value)}
                  placeholder="#subjects-grid or /subjects"
                  className="w-full p-2.5 bg-white border border-[#0B3561]/20 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/10 space-y-3">
              <span className="font-heading font-bold text-xs text-[#0B3561] block">
                Secondary Button (Optional)
              </span>
              <div>
                <label className="block font-semibold mb-1 text-[#3C5D81] text-[11px]">Button Label</label>
                <input
                  type="text"
                  value={selectedBanner.secondary_cta_text || ''}
                  onChange={e => updateBannerField('secondary_cta_text', e.target.value)}
                  placeholder="Placement Bundles SAVE 50%"
                  className="w-full p-2.5 bg-white border border-[#0B3561]/20 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-[#3C5D81] text-[11px]">Link Destination</label>
                <input
                  type="text"
                  value={selectedBanner.secondary_cta_link || ''}
                  onChange={e => updateBannerField('secondary_cta_link', e.target.value)}
                  placeholder="/bundles or /subjects"
                  className="w-full p-2.5 bg-white border border-[#0B3561]/20 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Hero Banner Big Image Artwork */}
          <div className="p-4 sm:p-6 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-heading font-bold text-xs text-[#0B3561] block">
                  Big Hero Artwork / Photo (Right Side of Slide)
                </label>
                <p className="text-[11px] text-[#3C5D81] mt-0.5">
                  Upload an image (PNG, JPG, WebP) or enter an image URL. If left empty, the interactive 3D open notebook visual is displayed.
                </p>
              </div>
              {selectedBanner.image && (
                <button
                  type="button"
                  onClick={() => updateBannerField('image', '')}
                  className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 text-[11px]"
                >
                  Clear Image (Use 3D Visual)
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block font-semibold mb-1 text-[11px] text-[#3C5D81]">Upload Image File</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="w-full p-2 bg-white border border-[#0B3561]/20 rounded-xl text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0B3561] file:text-white hover:file:bg-[#071E38] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[11px] text-[#3C5D81]">Or Paste Image URL</label>
                <input
                  type="url"
                  value={selectedBanner.image || ''}
                  onChange={e => updateBannerField('image', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-white border border-[#0B3561]/20 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {selectedBanner.image && (
              <div className="p-3 bg-white rounded-xl border border-[#0B3561]/10 flex items-center gap-4">
                <img
                  src={selectedBanner.image}
                  alt="Slide preview"
                  className="h-16 w-28 object-cover rounded-lg border border-[#0B3561]/10"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#0B3561] block">Active Visual Artwork Attached</span>
                  <span className="text-[11px] text-[#3C5D81]">This artwork will display proudly beside the text on this slide.</span>
                </div>
              </div>
            )}
          </div>

          {/* Save Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#0B3561]/10">
            <span className="text-xs text-[#3C5D81]">
              All changes to hero banner slides will be saved into the central store settings.
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0B3561] text-white font-heading font-bold text-sm rounded-xl hover:bg-[#071E38] shadow-md hover:shadow-lg transition cursor-pointer"
            >
              Save All Hero Banners
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (section === 'instagram') {
    return (
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 max-w-2xl text-xs">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Instagram Feed API Integration</h3>
        <p className="text-[#3C5D81]">Connect your personal Instagram account to stream live study notes posts on product detail pages.</p>
        {saveMsg && <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3 rounded-xl">{saveMsg}</div>}

        <div>
          <label className="block font-semibold mb-1">Instagram Access Token (Secret Key)</label>
          <input
            type="password"
            value={settings.instagram_access_token || ''}
            onChange={e => setSettings({ ...settings, instagram_access_token: e.target.value })}
            placeholder="Paste your Instagram Graph API access token here..."
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono text-xs"
          />
          <p className="text-[10px] text-[#3C5D81] mt-1">Saves securely in database settings. If empty, curated handwritten study posts are displayed as fallback.</p>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl hover:bg-[#071E38] transition">
            Save Instagram Token
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                const res = await fetch('/api/instagram/feed');
                const data = await res.json();
                alert(data.connected ? 'Instagram Live Feed Connected Successfully! 🚀' : 'Using curated fallback feed. (Set valid access token above to connect live).');
              } catch (err: any) {
                alert('Failed to test Instagram feed: ' + err.message);
              }
            }}
            className="px-6 bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3 rounded-xl hover:brightness-105 transition"
          >
            Test Feed API 📸
          </button>
        </div>
      </form>
    );
  }

  if (section === 'payments') {
    return (
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 max-w-2xl text-xs">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Razorpay Payment Gateway (Live / Test)</h3>
        <p className="text-[#3C5D81]">Configure your Razorpay live keys to accept secure prepaid payments from students across India.</p>
        {saveMsg && <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3 rounded-xl">{saveMsg}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Razorpay Key ID</label>
            <input
              type="text"
              value={settings.razorpay_key_id || ''}
              onChange={e => setSettings({ ...settings, razorpay_key_id: e.target.value })}
              placeholder="rzp_live_..."
              className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Razorpay Key Secret</label>
            <input
              type="password"
              value={settings.razorpay_key_secret || ''}
              onChange={e => setSettings({ ...settings, razorpay_key_secret: e.target.value })}
              placeholder="Enter Razorpay Secret..."
              className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl hover:bg-[#071E38] transition">
            Save Payment Keys
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                const res = await adminFetch('/test-razorpay', { method: 'POST' });
                alert(res.message || 'Razorpay live API test successful!');
              } catch (err: any) {
                alert('Razorpay Test Failed: ' + (err.message || 'Check your keys'));
              }
            }}
            className="px-6 bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3 rounded-xl hover:brightness-105 transition"
          >
            Test Live API ⚡
          </button>
        </div>
      </form>
    );
  }

  if (section === 'subscriptions') {
    return (
      <div className="space-y-8 text-xs">
        {/* Dashboard Metrics */}
        {adminMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-1">
              <p className="text-[#3C5D81] font-semibold">Trials Started</p>
              <p className="text-lg font-black text-[#0B3561]">{adminMetrics.trials_started}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-1">
              <p className="text-[#3C5D81] font-semibold">Conversion %</p>
              <p className="text-lg font-black text-[#12A5B0]">{adminMetrics.trial_to_paid_conversion}%</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-1">
              <p className="text-[#3C5D81] font-semibold">Trial Cancels</p>
              <p className="text-lg font-black text-red-600">{adminMetrics.trial_cancellations}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-1">
              <p className="text-[#3C5D81] font-semibold">Active Subs</p>
              <p className="text-lg font-black text-green-600">{adminMetrics.active_subscribers}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-1">
              <p className="text-[#3C5D81] font-semibold">Failed Payments</p>
              <p className="text-lg font-black text-red-600">{adminMetrics.failed_payments}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-1">
              <p className="text-[#3C5D81] font-semibold">Est. MRR</p>
              <p className="text-lg font-black text-[#0B3561]">₹{adminMetrics.mrr_paise / 100}</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-[#0B3561]">Active Subscriptions</h3>
            <div className="flex gap-2">
              <button onClick={loadAll} className="px-3 py-1.5 bg-[#F7FAFC] border rounded-lg hover:bg-[#DDF3F4]">Refresh</button>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#0B3561]/10 rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-[#F7FAFC] text-[#3C5D81] font-bold uppercase tracking-wider border-b border-[#0B3561]/10">
                <tr>
                  <th className="px-4 py-3">Student / Email</th>
                  <th className="px-4 py-3">Plan ID</th>
                  <th className="px-4 py-3">RZP Sub ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Trial End</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3561]/5">
                {adminSubscriptions.map(s => (
                  <tr key={s.razorpay_subscription_id} className="hover:bg-[#DDF3F4]/20 transition">
                    <td className="px-4 py-3">
                      <p className="font-bold text-[#0B3561]">{s.email}</p>
                    </td>
                    <td className="px-4 py-3 font-mono">{s.plan_id}</td>
                    <td className="px-4 py-3 font-mono">{s.razorpay_subscription_id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        s.status === 'active' ? 'bg-green-100 text-green-700' :
                        s.status === 'trialling' ? 'bg-blue-100 text-blue-700' :
                        s.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#9DAEC0]">{new Date(s.trial_end).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={async () => {
                            const res = await adminFetch(`/subscriptions/${s.razorpay_subscription_id}/sync`, { method: 'POST' });
                            alert(`Synced! New status: ${res.status}`);
                            loadAll();
                          }}
                          className="text-[#12A5B0] font-bold hover:underline"
                        >
                          Sync
                        </button>
                        {s.status !== 'cancelled' && (
                          <button 
                            onClick={async () => {
                              if (!confirm('Are you sure you want to cancel this subscription?')) return;
                              await adminFetch(`/subscriptions/${s.razorpay_subscription_id}/cancel`, { method: 'POST', body: JSON.stringify({ reason: 'Admin Cancel' }) });
                              alert('Cancelled!');
                              loadAll();
                            }}
                            className="text-red-600 font-bold hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan Management */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-[#0B3561]">Razorpay Plans</h3>
            <button 
              onClick={() => {
                const name = prompt('Plan Name? (e.g. Monthly UPSC Current Affairs)');
                if (!name) return;
                const category = prompt('Category? (e.g. UPSC)');
                const amount = Number(prompt('Amount in Paise? (e.g. 14900 for Rs. 149)'));
                const trial = Number(prompt('Trial Days? (e.g. 7)') || 7);
                if (name && amount) {
                  adminFetch('/plans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      name, 
                      category, 
                      amount_paise: amount, 
                      period: 'monthly', 
                      trial_days: trial,
                      features: ['All-Access PDF', 'Daily Quizzes', 'Personal Mentorship'] 
                    })
                  }).then(() => {
                    alert('Plan Created!');
                    loadAll();
                  });
                }
              }}
              className="bg-[#12A5B0] text-[#071E38] font-heading font-bold px-4 py-2 rounded-xl"
            >
              + Create New Plan
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adminPlans.map(p => (
              <div key={p.razorpay_plan_id} className="p-4 border rounded-2xl bg-[#F7FAFC] space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[#0B3561]">{p.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black ${p.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <p className="text-[#3C5D81] font-mono text-[10px]">{p.razorpay_plan_id}</p>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black">₹{p.amount_paise / 100} / {p.period}</span>
                  <span className="text-[#9DAEC0]">{p.trial_days} Day Trial</span>
                </div>
                <div className="pt-2 flex gap-2">
                   <button 
                    onClick={async () => {
                      await adminFetch(`/plans/${p.razorpay_plan_id}`, { method: 'PUT', body: JSON.stringify({ active: !p.active }) });
                      loadAll();
                    }}
                    className="text-[9px] font-bold text-[#0B3561] hover:underline"
                   >
                     {p.active ? 'Deactivate' : 'Activate'}
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'cancellations') {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 text-xs">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Cancellations History</h3>
        <div className="overflow-x-auto border border-[#0B3561]/10 rounded-2xl">
          <table className="w-full text-left">
            <thead className="bg-[#F7FAFC] text-[#3C5D81] font-bold uppercase tracking-wider border-b border-[#0B3561]/10">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Sub ID</th>
                <th className="px-4 py-3">By</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">In Trial?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B3561]/5">
              {adminCancellations.map((c, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">{new Date(c.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-mono">{c.subscription_id}</td>
                  <td className="px-4 py-3 capitalize">{c.cancelled_by}</td>
                  <td className="px-4 py-3 text-[#3C5D81]">{c.reason || 'N/A'}</td>
                  <td className="px-4 py-3 font-bold">{c.was_in_trial ? 'YES' : 'NO'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section === 'offers') {
    const offers = settings.offers || [
      {
        id: 'off-1',
        title: 'BTech Computer Science Semester Complete Bundle',
        subject: 'Computer Science',
        discount_text: 'FLAT 40% OFF',
        description: 'Get all 8 semesters handwritten notes, coding cheat sheets, and solved PYQs at a massive discount.',
        coupon_code: 'BTECH40',
        image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        valid_until: '31st Oct 2026',
        badge: 'BESTSELLER',
      },
      {
        id: 'off-2',
        title: 'GATE Computer Science & IT Master Pass',
        subject: 'GATE / PSU',
        discount_text: '₹500 OFF',
        description: 'Comprehensive data structures, algorithms, operating systems, and DBMS notes with test series.',
        coupon_code: 'GATE500',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        valid_until: '15th Nov 2026',
        badge: 'LIMITED TIME',
      },
      {
        id: 'off-3',
        title: 'UPSC Civil Services General Studies Notes Combo',
        subject: 'UPSC / Civil Services',
        discount_text: 'FLAT 35% OFF',
        description: 'Polity, History, Geography, Economy, and Environment handwritten toppers notes.',
        coupon_code: 'UPSC35',
        image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
        valid_until: '30th Nov 2026',
        badge: 'POPULAR',
      },
    ];

    const handleAddOffer = () => {
      const newOffer = {
        id: 'off-' + Date.now(),
        title: 'New Subject Offer',
        subject: 'Computer Science',
        discount_text: '20% OFF',
        description: 'Offer details and inclusions...',
        coupon_code: 'SAVE20',
        image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        valid_until: 'End of Month',
        badge: 'NEW',
      };
      setSettings({ ...settings, offers: [...offers, newOffer] });
    };

    const handleDeleteOffer = (id: string) => {
      setSettings({ ...settings, offers: offers.filter(o => o.id !== id) });
    };

    const handleUpdateOffer = (id: string, field: string, val: any) => {
      setSettings({
        ...settings,
        offers: offers.map(o => o.id === id ? { ...o, [field]: val } : o),
      });
    };

    return (
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 max-w-4xl text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#0B3561]">Special Offers & Subject Deals Management</h3>
            <p className="text-[#3C5D81]">Add, edit, or delete offers displayed on the dedicated /offers page.</p>
          </div>
          <button type="button" onClick={handleAddOffer} className="bg-[#12A5B0] text-[#071E38] font-heading font-bold px-4 py-2.5 rounded-xl hover:brightness-105 transition">
            + Add New Offer
          </button>
        </div>

        {saveMsg && <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3 rounded-xl">{saveMsg}</div>}

        <div className="space-y-6">
          {offers.map((offer, idx) => (
            <div key={offer.id} className="border border-[#0B3561]/15 p-4 sm:p-6 rounded-2xl bg-[#F7FAFC] space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#0B3561]">Offer #{idx + 1}</span>
                <button type="button" onClick={() => handleDeleteOffer(offer.id)} className="text-red-600 font-semibold hover:underline">
                  Delete Offer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Offer Title</label>
                  <input
                    type="text"
                    value={offer.title}
                    onChange={e => handleUpdateOffer(offer.id, 'title', e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Subject Category</label>
                  <input
                    type="text"
                    value={offer.subject}
                    onChange={e => handleUpdateOffer(offer.id, 'subject', e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Tag (e.g. FLAT 40% OFF)</label>
                  <input
                    type="text"
                    value={offer.discount_text}
                    onChange={e => handleUpdateOffer(offer.id, 'discount_text', e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold text-[#12A5B0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={offer.coupon_code}
                    onChange={e => handleUpdateOffer(offer.id, 'coupon_code', e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Valid Until</label>
                  <input
                    type="text"
                    value={offer.valid_until}
                    onChange={e => handleUpdateOffer(offer.id, 'valid_until', e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Badge Text (Optional)</label>
                  <input
                    type="text"
                    value={offer.badge || ''}
                    onChange={e => handleUpdateOffer(offer.id, 'badge', e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={offer.image_url}
                  onChange={e => handleUpdateOffer(offer.id, 'image_url', e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={offer.description}
                  onChange={e => handleUpdateOffer(offer.id, 'description', e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="w-full bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl hover:bg-[#071E38] transition">
          Save All Special Offers ⚡
        </button>
      </form>
    );
  }

  if (section === 'users') {
    return (
      <div className="space-y-8 text-xs">
        {/* User Management Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#0B3561]">User Management</h3>
              <p className="text-[#3C5D81]">View and manage all registered users, staff, and customers.</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#0B3561]/10 rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-[#F7FAFC] text-[#3C5D81] font-bold uppercase tracking-wider border-b border-[#0B3561]/10">
                <tr>
                  <th className="px-4 py-3">User / Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3561]/5">
                {users.map(u => (
                  <tr key={u.uid} className="hover:bg-[#DDF3F4]/20 transition">
                    <td className="px-4 py-3 font-bold text-[#0B3561]">{u.name || 'Student'}</td>
                    <td className="px-4 py-3 text-[#3C5D81] font-mono">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        u.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#9DAEC0]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-10 text-center text-[#3C5D81]">No users found in database.</div>
            )}
          </div>
        </div>

        {/* Audit Logs & Settings History Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#0B3561]">Settings & SEO Change Audit Trail</h3>
            <p className="text-[#3C5D81]">Recorded in dual Firestore collections (`audit_logs` and `settings_history`).</p>
          </div>

          <div className="overflow-x-auto border border-[#0B3561]/10 rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-[#F7FAFC] text-[#3C5D81] font-bold uppercase tracking-wider border-b border-[#0B3561]/10">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Admin Email</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3561]/5">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#DDF3F4]/20 transition">
                    <td className="px-4 py-3 font-mono text-[10px] text-[#3C5D81]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0B3561]">{log.admin_email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-[#DDF3F4] text-[#0B3561] px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#3C5D81]">
                      {log.details}
                      {log.changes && (
                        <div className="mt-1 font-mono text-[10px] bg-[#F7FAFC] p-2 rounded border text-[#0B3561] max-w-lg truncate">
                          {JSON.stringify(log.changes)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {auditLogs.length === 0 && (
              <div className="p-10 text-center text-[#3C5D81]">No audit logs recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    );
  }


  if (section === 'payment-page') {
    return (
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 max-w-2xl text-xs">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Payment Page & QR Code Management</h3>
        <p className="text-[#3C5D81]">Configure merchant details, UPI ID, and QR code displayed on the dedicated /pay page.</p>
        {saveMsg && <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3 rounded-xl">{saveMsg}</div>}

        <div>
          <label className="block font-semibold mb-1">Merchant Name</label>
          <input
            type="text"
            value={settings.merchant_name || 'RAHUL DUTTA'}
            onChange={e => setSettings({ ...settings, merchant_name: e.target.value })}
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Merchant UPI ID</label>
          <input
            type="text"
            value={settings.merchant_upi_id || 'rahuldutta@okaxis'}
            onChange={e => setSettings({ ...settings, merchant_upi_id: e.target.value })}
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">QR Code Image URL</label>
          <input
            type="text"
            value={settings.qr_code_image_url || '/qr-code.png'}
            onChange={e => setSettings({ ...settings, qr_code_image_url: e.target.value })}
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl font-mono text-xs"
          />
          <p className="text-[10px] text-[#3C5D81] mt-1">Default is /qr-code.png (uploaded QR code image).</p>
        </div>

        <div>
          <label className="block font-semibold mb-1">Payment Instructions & Notice</label>
          <textarea
            rows={3}
            value={settings.payment_instructions || 'Scan the official QR code using any UPI app (GPay, PhonePe, Paytm, BHIM) or use the direct payment link below.'}
            onChange={e => setSettings({ ...settings, payment_instructions: e.target.value })}
            className="w-full p-2.5 bg-[#F7FAFC] border rounded-xl"
          />
        </div>

        <button type="submit" className="w-full bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl hover:bg-[#071E38] transition">
          Save Payment Page Settings ⚡
        </button>
      </form>
    );
  }

  if (section === 'webhook-log') {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 text-xs">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Razorpay Webhook Event Log</h3>
        <p className="text-[#3C5D81]">Monitoring real-time events from Razorpay for subscriptions and orders.</p>
        
        <div className="overflow-x-auto border border-[#0B3561]/10 rounded-2xl">
          <table className="w-full text-left">
            <thead className="bg-[#F7FAFC] text-[#3C5D81] font-bold uppercase tracking-wider border-b border-[#0B3561]/10">
              <tr>
                <th className="px-4 py-3">Processed At</th>
                <th className="px-4 py-3">Event ID</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B3561]/5">
              {adminWebhookEvents.map((ev, i) => (
                <tr key={ev.event_id} className="align-top">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(ev.processed_at).toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-[10px]">{ev.event_id}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase text-[9px]">{ev.payload?.event}</span>
                  </td>
                  <td className="px-4 py-3">
                    <details>
                      <summary className="cursor-pointer text-[#12A5B0] font-bold">View JSON</summary>
                      <pre className="mt-2 p-2 bg-gray-50 rounded text-[9px] max-w-xs overflow-x-auto">
                        {JSON.stringify(ev.payload, null, 2)}
                      </pre>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {adminWebhookEvents.length === 0 && <div className="p-10 text-center text-[#3C5D81]">No webhook events logged yet.</div>}
        </div>
      </div>
    );
  }

  if (section === 'pages') {
    return (
      <div className="space-y-8 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#0B3561]">Legal Policies & Content Pages</h3>
            <p className="text-[#3C5D81]">Manage Privacy Policy, Terms, and other static pages. Use Markdown for formatting.</p>
          </div>
          <button 
            onClick={() => setEditingPage({ title: '', slug: '', body_md: '', is_draft: false })}
            className="bg-[#12A5B0] text-[#071E38] font-heading font-bold px-4 py-2 rounded-xl"
          >
            + Add New Page
          </button>
        </div>

        {editingPage && (
          <div className="bg-[#F7FAFC] p-6 rounded-3xl border-2 border-[#12A5B0]/30 space-y-4">
            <h4 className="font-heading font-bold text-[#0B3561]">{editingPage.slug ? 'Edit Page' : 'Create New Page'}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Page Title</label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                  placeholder="e.g. Refund Policy"
                  className="w-full p-2.5 bg-white border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">URL Slug (lowercase, no spaces)</label>
                <input
                  type="text"
                  value={editingPage.slug}
                  onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                  placeholder="e.g. refund-policy"
                  className="w-full p-2.5 bg-white border rounded-xl font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Page Content (Markdown supported)</label>
              <textarea
                rows={12}
                value={editingPage.body_md}
                onChange={e => setEditingPage({ ...editingPage, body_md: e.target.value })}
                placeholder="# Page Heading\n\nWrite your content here..."
                className="w-full p-3 bg-white border rounded-xl font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="is_draft"
                checked={editingPage.is_draft}
                onChange={e => setEditingPage({ ...editingPage, is_draft: e.target.checked })}
              />
              <label htmlFor="is_draft" className="font-semibold">Save as Draft (Hidden from footer)</label>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={async () => {
                  try {
                    await adminFetch('/pages', { method: 'POST', body: JSON.stringify(editingPage) });
                    alert('Page saved!');
                    setEditingPage(null);
                    loadAll();
                  } catch (err: any) { alert(err.message); }
                }}
                className="flex-1 bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl"
              >
                Save Page Content
              </button>
              <button 
                onClick={() => setEditingPage(null)}
                className="px-6 bg-white border border-[#0B3561]/20 text-[#0B3561] font-heading font-bold py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminPages.map(p => (
            <div key={p.slug} className="bg-white p-5 rounded-2xl border border-[#0B3561]/10 shadow-sm flex items-center justify-between group">
              <div>
                <h4 className="font-bold text-[#0B3561] text-sm">{p.title}</h4>
                <p className="text-[#3C5D81] font-mono text-[10px]">/pages/{p.slug}</p>
                {p.is_draft && <span className="inline-block mt-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[9px] font-black uppercase">Draft</span>}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingPage(p)}
                  className="p-2 bg-[#DDF3F4] text-[#0B3561] rounded-lg hover:bg-[#12A5B0] hover:text-white transition"
                  title="Edit Page"
                >
                  Edit
                </button>
                <button 
                  onClick={async () => {
                    if (!confirm(`Delete page "${p.title}"?`)) return;
                    await adminFetch(`/pages/${p.slug}`, { method: 'DELETE' });
                    loadAll();
                  }}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                  title="Delete Page"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'orders') {
    return <AdminOrders />;
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm text-xs space-y-4">
      <h3 className="font-heading font-bold text-lg text-[#0B3561] capitalize">{section} Management</h3>
      <p className="text-[#3C5D81]">Full administrative access to configure store content, coupons, and subjects.</p>
    </div>
  );
};
