import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { SiteSettings, Coupon, Subject, FAQ } from '../types';

export const AdminCMS: React.FC<{ section: string }> = ({ section }) => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      if (section === 'settings' || section === 'pricing' || section === 'content') {
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

        <button type="submit" className="w-full bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl">
          Save Settings
        </button>
      </form>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm text-xs space-y-4">
      <h3 className="font-heading font-bold text-lg text-[#0B3561] capitalize">{section} Management</h3>
      <p className="text-[#3C5D81]">Full administrative access to configure store content, coupons, and subjects.</p>
    </div>
  );
};
