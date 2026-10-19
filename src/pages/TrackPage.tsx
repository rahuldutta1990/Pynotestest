import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { trackOrder } from '../lib/api';
import { SEO } from '../components/SEO';
import { TruckIcon, WhatsappIcon } from '../components/Icons';

export const TrackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrderNo = searchParams.get('order_no') || '';
  const initialContact = searchParams.get('phone') || searchParams.get('email') || '';

  const [orderNo, setOrderNo] = useState(initialOrderNo);
  const [contact, setContact] = useState(initialContact);
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTrack = async (num: string, cnt: string) => {
    if (!num.trim() || !cnt.trim()) {
      setError('Please enter both Order Number and registered Mobile or Email');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await trackOrder(num.trim().toUpperCase(), cnt.trim());
      setTrackingData(res);
    } catch (err: any) {
      setError(err.message || 'Invalid order number or contact details');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrack(orderNo, contact);
  };

  useEffect(() => {
    if (initialOrderNo && initialContact) {
      executeTrack(initialOrderNo, initialContact);
    }
  }, [initialOrderNo, initialContact]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'out_for_delivery':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'in_transit':
      case 'shipped':
      case 'picked_up':
      case 'ready_to_ship':
        return 'bg-[#DDF3F4] text-[#0B3561] border-[#12A5B0]/30';
      case 'attempt_failed':
      case 'rto_initiated':
      case 'rto_delivered':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'cancelled':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-blue-50 text-[#0B3561] border-blue-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8 animate-fadeIn">
      <SEO 
        title="Track Order | PyNotes India Logistics" 
        description="Live delivery tracking, courier AWB status, and shipment timeline for your printed handwritten coding books." 
      />

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12A5B0]/10 text-[#12A5B0] rounded-full text-xs font-heading font-black uppercase tracking-wider">
          <TruckIcon className="w-4 h-4" /> Live Courier Dispatch Tracker
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#0B3561]">Track Your Parcel</h1>
        <p className="font-body text-xs text-[#3C5D81] max-w-md mx-auto">
          Enter your Order Number along with the mobile number or email used during purchase.
        </p>
      </div>

      {/* Tracking Search Form */}
      <form onSubmit={handleTrackSubmit} className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#0B3561]/10 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">
              Order Number *
            </label>
            <input
              type="text"
              required
              value={orderNo}
              onChange={e => setOrderNo(e.target.value)}
              placeholder="e.g. PN-1001 or PYN-XXXXXX"
              className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-xs font-mono font-bold text-[#0B3561] uppercase focus:outline-none focus:border-[#12A5B0]"
            />
          </div>
          <div>
            <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">
              Phone Number or Email ID *
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="10-digit mobile or registered email"
              className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-xs font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0]"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100 flex items-center justify-between">
            <span>{error}</span>
            <span className="text-[10px] font-normal text-rose-500">Security Check Protected</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0B3561] text-[#FFD54A] font-heading font-black py-4 rounded-2xl text-xs hover:bg-[#071E38] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#FFD54A] border-t-transparent rounded-full animate-spin" />
              <span>Querying Courier Network...</span>
            </>
          ) : (
            <span>TRACK SHIPMENT STATUS ↗</span>
          )}
        </button>
      </form>

      {/* Tracking Results Card */}
      {trackingData && (
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-[#0B3561]/10 shadow-2xl space-y-8 animate-fadeIn">
          {/* Header Status Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#0B3561]/10 pb-6">
            <div>
              <span className="text-xs font-bold text-[#12A5B0] uppercase tracking-wider block mb-1">
                Verified Order #{trackingData.order_no}
              </span>
              <div className="flex items-center gap-3">
                <h2 className="font-heading font-black text-2xl text-[#0B3561]">
                  {trackingData.friendly_status}
                </h2>
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${getStatusBadgeColor(trackingData.status)}`}>
                  {trackingData.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Need Help Button */}
            <div className="flex items-center gap-2 flex-wrap">
              {trackingData.invoice_available && (
                <a
                  href={`/api/orders/${trackingData.order_no}/invoice`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#F7FAFC] border border-[#0B3561]/15 text-[#0B3561] text-xs font-heading font-bold px-4 py-2.5 rounded-xl hover:bg-[#DDF3F4] transition"
                >
                  Download Invoice 📄
                </a>
              )}
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi PyNotes Support, I need help with my Order #${trackingData.order_no}`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm hover:brightness-105 transition"
              >
                <WhatsappIcon className="w-4 h-4" />
                <span>Need Help?</span>
              </a>
            </div>
          </div>

          {/* Exception Banner if attempt failed or RTO */}
          {trackingData.exception_message && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="text-xs space-y-1">
                <p className="font-black font-heading text-sm">Delivery Exception Notice</p>
                <p>{trackingData.exception_message}</p>
                <p className="text-[11px] text-rose-600">Our logistics team has been notified automatically. No additional charge will apply for re-attempts.</p>
              </div>
            </div>
          )}

          {/* Digital / Subscription Banner */}
          {trackingData.is_digital && (
            <div className="bg-[#DDF3F4] border border-[#12A5B0]/30 text-[#0B3561] p-5 rounded-2xl flex items-start gap-3">
              <span className="text-xl">🎓</span>
              <div className="text-xs space-y-1">
                <p className="font-black font-heading text-sm">Instant Digital Access</p>
                <p>This order contains digital coding resources / pro subscriptions. Digital materials are activated directly in your User Account dashboard.</p>
                <Link to="/account" className="inline-block mt-2 font-bold text-[#12A5B0] hover:underline">Go to User Account Dashboard →</Link>
              </div>
            </div>
          )}

          {/* Shipments List (Supports Split Shipments) */}
          {trackingData.shipments && trackingData.shipments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xs text-[#0B3561] uppercase tracking-wider">
                Assigned Logistics Couriers ({trackingData.shipments.length} {trackingData.shipments.length === 1 ? 'Package' : 'Packages'})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trackingData.shipments.map((s: any) => (
                  <div key={s.id} className="p-4 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#0B3561]">{s.courier_name || 'Shiprocket'}</span>
                      <span className="text-[10px] font-black uppercase text-[#12A5B0] bg-[#DDF3F4] px-2 py-0.5 rounded-md">
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#3C5D81]">AWB: <strong className="text-[#0B3561]">{s.awb}</strong></p>
                    {s.tracking_url && (
                      <a
                        href={s.tracking_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-[11px] font-bold text-[#12A5B0] hover:underline"
                      >
                        Official Courier Tracking Portal ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Timeline: Newest First */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-xs text-[#0B3561] uppercase tracking-wider">
              Live Shipment Journey Timeline
            </h3>

            {(!trackingData.timeline || trackingData.timeline.length === 0) ? (
              <div className="p-8 text-center bg-[#F7FAFC] rounded-2xl border border-dashed border-[#0B3561]/20 text-xs text-[#3C5D81]">
                Package details received. Courier transit scans will appear here as soon as the first checkpoint scan occurs.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#0B3561]/10">
                {trackingData.timeline.map((event: any, idx: number) => {
                  const isLatest = idx === 0;
                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 transition-transform duration-300 ${
                          isLatest
                            ? 'bg-[#12A5B0] border-white ring-4 ring-[#12A5B0]/20 scale-110'
                            : 'bg-white border-[#0B3561]/30'
                        }`}
                      />
                      <div className="bg-[#F7FAFC] p-4 rounded-2xl border border-[#0B3561]/5 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                          <span className={`font-heading font-bold ${isLatest ? 'text-[#12A5B0]' : 'text-[#0B3561]'}`}>
                            {event.status}
                          </span>
                          <span className="text-[10px] text-[#9DAEC0] font-mono">
                            {new Date(event.time).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-[#3C5D81] font-medium leading-relaxed">{event.activity}</p>
                        {event.location && event.location !== 'Hub' && (
                          <p className="text-[10px] text-[#9DAEC0] flex items-center gap-1">
                            <span>📍</span> {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Items in Parcel */}
          {trackingData.items && trackingData.items.length > 0 && (
            <div className="pt-4 border-t border-[#0B3561]/10 space-y-2">
              <span className="font-heading font-bold text-xs text-[#0B3561] uppercase tracking-wider block">
                Items in This Shipment
              </span>
              <div className="divide-y divide-[#0B3561]/5 text-xs text-[#3C5D81]">
                {trackingData.items.map((it: any, i: number) => (
                  <div key={i} className="py-2 flex justify-between">
                    <span>{it.title}</span>
                    <span className="font-bold text-[#0B3561]">Qty: {it.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
