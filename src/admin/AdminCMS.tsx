import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { SiteSettings, Coupon, Subject, FAQ } from '../types';
import { AdminOrders } from './AdminOrders';

export const AdminCMS: React.FC<{ section: string }> = ({ section }) => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [adminPlans, setAdminPlans] = useState<any[]>([]);
  const [adminSubscriptions, setAdminSubscriptions] = useState<any[]>([]);
  const [adminCancellations, setAdminCancellations] = useState<any[]>([]);
  const [adminWebhookEvents, setAdminWebhookEvents] = useState<any[]>([]);
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [adminPages, setAdminPages] = useState<any[]>([]);
  const [editingPage, setEditingPage] = useState<any>(null);
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
