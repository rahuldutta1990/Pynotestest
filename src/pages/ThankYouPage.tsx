import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Order } from '../types';
import { fetchOrderDetails } from '../lib/api';
import { CheckCircleIcon } from '../components/Icons';

export const ThankYouPage: React.FC = () => {
  const { orderNo } = useParams<{ orderNo: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNo || !token) {
      setLoading(false);
      return;
    }
    fetchOrderDetails(orderNo, token)
      .then(ord => {
        setOrder(ord);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Order not found');
        setLoading(false);
      });
  }, [orderNo, token]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-4 border-[#0B3561] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-heading font-semibold text-[#0B3561] text-sm">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-[#0B3561]/15 shadow-xl text-center space-y-6">
        <CheckCircleIcon className="w-16 h-16 text-[#13834D] mx-auto" />

        <div>
          <span className="bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs px-3.5 py-1 rounded-full border border-[#12A5B0]/30">
            ORDER CONFIRMED
          </span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#0B3561] mt-3">
            Thank You For Your Order!
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#3C5D81] mt-1">
            Order Number: <span className="font-mono font-bold text-[#0B3561]">{orderNo}</span>
          </p>
        </div>

        {order ? (
          <div className="text-left bg-[#F7FAFC] p-6 rounded-2xl border border-[#0B3561]/10 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#0B3561]/10">
              <div>
                <span className="font-bold text-[#0B3561] block">Delivery To:</span>
                <span className="text-[#3C5D81]">{order.ship_name} ({order.ship_phone})</span>
                <p className="text-[#3C5D81]">{order.ship_line1}, {order.ship_city}, {order.ship_state} - {order.ship_pincode}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#0B3561] block">Payment Method:</span>
                <span className="uppercase font-bold text-[#12A5B0]">{order.payment_method}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#0B3561] block">Ordered Books:</span>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-[#3C5D81]">
                  <span>{item.title} x {item.qty}</span>
                  <span className="font-mono font-bold">₹{(item.line_total_paise / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#0B3561]/10 flex justify-between font-bold text-sm text-[#0B3561]">
              <span>Total Paid:</span>
              <span className="font-display font-black">₹{(order.total_paise / 100).toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#3C5D81]">
            A confirmation email has been sent to your registered email address with full tracking details.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to={`/track?order_no=${orderNo}&phone=${order?.ship_phone || ''}`}
            className="flex-1 bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl text-xs hover:bg-[#071E38] transition shadow-md"
          >
            Track Order Status
          </Link>
          <a
            href={`/api/invoice/${orderNo}?t=${token}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 border border-[#0B3561]/20 text-[#0B3561] font-heading font-bold py-3 rounded-xl text-xs hover:bg-[#DDF3F4] transition"
          >
            Download GST Invoice
          </a>
        </div>
      </div>
    </div>
  );
};
