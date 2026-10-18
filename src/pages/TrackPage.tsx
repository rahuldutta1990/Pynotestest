import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Order } from '../types';
import { trackOrder } from '../lib/api';
import { TruckIcon } from '../components/Icons';

export const TrackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrderNo = searchParams.get('order_no') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderNo, setOrderNo] = useState(initialOrderNo);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNo.trim() || !phone.trim()) {
      setError('Please enter both Order Number and Mobile Number');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await trackOrder(orderNo.trim().toUpperCase(), phone.trim());
      setOrder(res);
    } catch (err: any) {
      setError(err.message || 'Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNo && initialPhone) {
      trackOrder(initialOrderNo, initialPhone)
        .then(res => setOrder(res))
        .catch(() => {});
    }
  }, [initialOrderNo, initialPhone]);

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'awaiting_confirmation':
      case 'pending_payment':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-heading font-bold text-3xl text-[#0B3561]">Track Your Parcel</h1>
        <p className="font-body text-xs text-[#3C5D81]">Enter your Order Number (e.g. PN-1001) and phone number.</p>
      </div>

      <form onSubmit={handleTrack} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Order Number *</label>
            <input
              type="text"
              required
              value={orderNo}
              onChange={e => setOrderNo(e.target.value)}
              placeholder="PN-1001"
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs font-mono font-bold text-[#0B3561] uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Mobile Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs font-mono font-bold text-[#0B3561]"
            />
          </div>
        </div>

        {error && <p className="text-xs text-[#C0392B] font-bold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0B3561] text-white font-heading font-bold py-3.5 rounded-xl text-xs hover:bg-[#071E38] transition shadow-md disabled:opacity-50"
        >
          {loading ? 'Searching Order...' : 'TRACK ORDER'}
        </button>
      </form>

      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/15 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#0B3561]/10 pb-4">
            <div>
              <span className="text-xs font-bold text-[#12A5B0] uppercase tracking-wider block">
                Order #{order.order_no}
              </span>
              <h3 className="font-heading font-bold text-lg text-[#0B3561]">
                Status: <span className="uppercase text-[#13834D]">{order.status.replace(/_/g, ' ')}</span>
              </h3>
            </div>
            {order.awb && (
              <a
                href={order.tracking_url || `https://shiprocket.co/tracking/${order.awb}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs px-4 py-2 rounded-xl hover:brightness-105"
              >
                Courier AWB: {order.awb} ↗
              </a>
            )}
          </div>

          {/* Timeline */}
          <div className="py-4">
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {[
                { title: 'Placed', desc: 'Order received' },
                { title: 'Processing', desc: 'Packed' },
                { title: 'Shipped', desc: 'In Transit' },
                { title: 'Delivered', desc: 'At Doorstep' },
              ].map((step, idx) => {
                const currentStep = getStatusStepIndex(order.status);
                const isPassed = idx + 1 <= currentStep;

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mb-1.5 transition ${
                        isPassed ? 'bg-[#0B3561] text-white shadow-xs' : 'bg-[#E7EBEF] text-[#9DAEC0]'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="font-heading font-bold text-xs text-[#0B3561]">{step.title}</span>
                    <span className="text-[10px] text-[#3C5D81] hidden sm:block">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-[#F7FAFC] p-4 rounded-xl border border-[#0B3561]/10 space-y-2 text-xs">
            <span className="font-bold text-[#0B3561] block">Items in Parcel:</span>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-[#3C5D81]">
                <span>{item.title} x {item.qty}</span>
                <span className="font-bold">₹{(item.line_total_paise / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
