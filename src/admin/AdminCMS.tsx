import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { SiteSettings, Coupon, Subject, FAQ } from '../types';

export const AdminCMS: React.FC<{ section: string }> = ({ section }) => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      if (section === 'settings' || section === 'pricing' || section === 'content' || section === 'announcements' || section === 'products' || section === 'hero-banners' || section === 'orders' || section === 'instagram' || section === 'payments' || section === 'payment-page' || section === 'subscriptions' || section === 'offers') {
        const res = await adminFetch('/settings');
        setSettings(res);
      } else if (section === 'coupons') {
        const res = await adminFetch('/coupons');
        setCoupons(res);
      } else if (section === 'subjects') {
        const res = await adminFetch('/subjects');
        setSubjects(res);
      } else if (section === 'faqs') {
        const res = await adminFetch('/faqs');
        setFaqs(res);
      } else if (section === 'users') {
        const res = await adminFetch('/users');
        setUsers(res);
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

  if (section === 'hero-banners') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm text-xs space-y-4">
        <h3 className="font-heading font-bold text-lg text-[#0B3561] capitalize">Manage Hero Banners</h3>
        <p className="text-[#3C5D81]">Upload and replace your hero banner images.</p>
        <button className="bg-[#12A5B0] text-white p-2 rounded-xl">Upload New Banner</button>
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
    const plans = settings.subscription_plans || [
      { id: 'sub-1', name: 'Monthly Current Affairs', contents: 'Monthly PDF, daily/weekly quizzes, one-page monthly capsule', billing: 'Monthly', price: 149, razorpay_link: 'https://rzp.io/rzp/TiksPhvI' },
      { id: 'sub-2', name: 'Exam Pass (SSC, Banking, UPSC)', contents: 'Current affairs, subject notes, test series, PYQs for one exam', billing: 'Quarterly / Yearly', price: 699, razorpay_link: 'https://rzp.io/rzp/TiksPhvI', popular: true },
      { id: 'sub-3', name: 'All-Access Pass', contents: 'Every exam track + unlimited PYQs & test series', billing: 'Yearly', price: 1999, razorpay_link: 'https://rzp.io/rzp/TiksPhvI' },
    ];

    const handleAddPlan = () => {
      const newPlan = {
        id: 'sub-' + Date.now(),
        name: 'New Plan',
        contents: 'Plan features & inclusions',
        billing: 'Monthly',
        price: 299,
        razorpay_link: 'https://rzp.io/rzp/TiksPhvI',
      };
      setSettings({ ...settings, subscription_plans: [...plans, newPlan] });
    };

    const handleDeletePlan = (id: string) => {
      setSettings({ ...settings, subscription_plans: plans.filter(p => p.id !== id) });
    };

    const handleUpdatePlan = (id: string, field: string, val: any) => {
      setSettings({
        ...settings,
        subscription_plans: plans.map(p => p.id === id ? { ...p, [field]: val } : p),
      });
    };

    return (
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 max-w-4xl text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#0B3561]">Subscription Plans Management</h3>
            <p className="text-[#3C5D81]">Add, edit, or delete subscription plans, billing cycles, and Razorpay payment links.</p>
          </div>
          <button type="button" onClick={handleAddPlan} className="bg-[#12A5B0] text-[#071E38] font-heading font-bold px-4 py-2.5 rounded-xl hover:brightness-105 transition">
            + Add New Plan
          </button>
        </div>

        {saveMsg && <div className="bg-[#DDF3F4] text-[#0B3561] font-bold p-3 rounded-xl">{saveMsg}</div>}

        <div className="space-y-4">
          {plans.map((p, idx) => (
            <div key={p.id} className="border border-[#0B3561]/15 p-4 sm:p-6 rounded-2xl bg-[#F7FAFC] space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#0B3561]">Plan #{idx + 1}</span>
                <button type="button" onClick={() => handleDeletePlan(p.id)} className="text-red-600 font-semibold hover:underline">
                  Delete Plan
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={p.name}
                    onChange={e => handleUpdatePlan(p.id, 'name', e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Billing Cycle</label>
                  <input
                    type="text"
                    value={p.billing}
                    onChange={e => handleUpdatePlan(p.id, 'billing', e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={p.price}
                    onChange={e => handleUpdatePlan(p.id, 'price', Number(e.target.value))}
                    className="w-full p-2.5 bg-white border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Razorpay Payment Link URL</label>
                  <input
                    type="text"
                    value={p.razorpay_link}
                    onChange={e => handleUpdatePlan(p.id, 'razorpay_link', e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Plan Contents / Inclusions</label>
                <input
                  type="text"
                  value={p.contents}
                  onChange={e => handleUpdatePlan(p.id, 'contents', e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`pop-${p.id}`}
                  checked={!!p.popular}
                  onChange={e => handleUpdatePlan(p.id, 'popular', e.target.checked)}
                  className="rounded text-[#12A5B0]"
                />
                <label htmlFor={`pop-${p.id}`} className="font-semibold text-[#0B3561]">Mark as Most Popular / Recommended</label>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="w-full bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl hover:bg-[#071E38] transition">
          Save All Subscription Plans ⚡
        </button>
      </form>
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-6 text-xs">
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

  if (section === 'orders') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm text-xs space-y-4">
        <h3 className="font-heading font-bold text-lg text-[#0B3561] capitalize">Manage Orders</h3>
        <p className="text-[#3C5D81]">View and filter customer orders, manage statuses and COD confirmation.</p>
        {/* Placeholder for Order Table */}
        <div className="border p-4 rounded-xl">Order List Placeholder</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm text-xs space-y-4">
      <h3 className="font-heading font-bold text-lg text-[#0B3561] capitalize">{section} Management</h3>
      <p className="text-[#3C5D81]">Full administrative access to configure store content, coupons, and subjects.</p>
    </div>
  );
};
