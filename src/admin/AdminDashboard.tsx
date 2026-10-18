import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../lib/api';
import { Order, Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<{
    today_orders_count: number;
    today_revenue_paise: number;
    cod_unconfirmed: Order[];
    low_stock_products: Product[];
    sample_content_count: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/dashboard');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleConfirmCod = async (orderNo: string) => {
    try {
      await adminFetch(`/orders/${orderNo}/confirm-cod`, { method: 'POST' });
      setActionMsg(`COD Order #${orderNo} confirmed! Moved to Processing.`);
      loadDashboard();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancelOrder = async (orderNo: string) => {
    if (!confirm(`Cancel order #${orderNo}? Stock will be restored.`)) return;
    try {
      await adminFetch(`/orders/${orderNo}/cancel`, { method: 'POST' });
      setActionMsg(`Order #${orderNo} cancelled.`);
      loadDashboard();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemoveSampleContent = async () => {
    if (!confirm('Remove all sample content (reviews, stats, logos)?')) return;
    try {
      await adminFetch('/content/remove-samples', { method: 'POST' });
      setActionMsg('Sample content removed.');
      loadDashboard();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#3C5D81]">Loading Dashboard Stats...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner: Sample Content Warning */}
      {data && data.sample_content_count > 0 && (
        <div className="bg-[#FFD54A] text-[#071E38] p-4 rounded-2xl border border-[#071E38]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="font-heading font-bold text-xs uppercase tracking-wider block">
              ⚠️ Live Sample Content Notice
            </span>
            <p className="text-xs font-medium">
              You currently have {data.sample_content_count} sample items (reviews/stats/logos) active on the storefront.
            </p>
          </div>
          <button
            onClick={handleRemoveSampleContent}
            className="bg-[#071E38] text-white font-heading font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#0B3561] flex-shrink-0"
          >
            Remove All Sample Content
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-1">
          <span className="text-xs font-heading font-semibold text-[#3C5D81] uppercase tracking-wider block">
            Today's Orders
          </span>
          <span className="font-display font-black text-3xl text-[#0B3561]">
            {data?.today_orders_count || 0}
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-1">
          <span className="text-xs font-heading font-semibold text-[#3C5D81] uppercase tracking-wider block">
            Today's Revenue
          </span>
          <span className="font-display font-black text-3xl text-[#13834D]">
            ₹{((data?.today_revenue_paise || 0) / 100).toFixed(2)}
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-1">
          <span className="text-xs font-heading font-semibold text-[#3C5D81] uppercase tracking-wider block">
            COD Pending Confirmation
          </span>
          <span className="font-display font-black text-3xl text-[#0B3561]">
            {data?.cod_unconfirmed?.length || 0}
          </span>
        </div>
      </div>

      {actionMsg && (
        <div className="bg-[#DDF3F4] text-[#0B3561] font-bold text-xs p-3 rounded-xl border border-[#12A5B0]/30">
          {actionMsg}
        </div>
      )}

      {/* COD Call List */}
      <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#0B3561]/10 pb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-[#0B3561]">COD Order Call List</h3>
            <p className="text-xs text-[#3C5D81]">Phone or WhatsApp the customer to confirm delivery address before dispatch.</p>
          </div>
        </div>

        {!data?.cod_unconfirmed || data.cod_unconfirmed.length === 0 ? (
          <p className="text-xs text-[#3C5D81] py-4 text-center">No unconfirmed COD orders pending verification.</p>
        ) : (
          <div className="divide-y divide-[#0B3561]/5">
            {data.cod_unconfirmed.map(ord => (
              <div key={ord.order_no} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0B3561]">Order #{ord.order_no}</span>
                    <span className="bg-[#FFD54A] text-[#071E38] font-bold text-[10px] px-2 py-0.5 rounded">
                      Awaiting Confirmation
                    </span>
                  </div>
                  <p className="text-[#3C5D81]">
                    Customer: <span className="font-bold text-[#0B3561]">{ord.ship_name}</span> ({ord.ship_phone})
                  </p>
                  <p className="text-[#3C5D81]">Address: {ord.ship_line1}, {ord.ship_city} - {ord.ship_pincode}</p>
                  <p className="font-mono font-bold text-[#0B3561]">Total Amount: ₹{(ord.total_paise / 100).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${ord.ship_phone}?text=${encodeURIComponent(
                      `Hello ${ord.ship_name}, this is PyNotes. Please confirm your COD order #${ord.order_no} for ₹${(ord.total_paise / 100).toFixed(0)}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366] text-white font-heading font-bold text-xs px-3.5 py-2 rounded-xl hover:brightness-105"
                  >
                    WhatsApp Chat
                  </a>
                  <button
                    onClick={() => handleConfirmCod(ord.order_no)}
                    className="bg-[#13834D] text-white font-heading font-bold text-xs px-3.5 py-2 rounded-xl hover:brightness-105"
                  >
                    Confirm COD
                  </button>
                  <button
                    onClick={() => handleCancelOrder(ord.order_no)}
                    className="bg-[#C0392B] text-white font-heading font-bold text-xs px-3.5 py-2 rounded-xl hover:brightness-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Low Stock Warning List */}
      <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-base text-[#0B3561]">Low Stock Inventory Alert</h3>
        {!data?.low_stock_products || data.low_stock_products.length === 0 ? (
          <p className="text-xs text-[#3C5D81] py-2">All books have healthy stock levels.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.low_stock_products.map(prod => (
              <div key={prod.slug} className="bg-[#F7FAFC] p-4 rounded-2xl border border-[#C0392B]/30 flex justify-between items-center">
                <div>
                  <h4 className="font-heading font-bold text-xs text-[#0B3561]">{prod.title}</h4>
                  <span className="text-[10px] text-[#C0392B] font-bold">Stock Remaining: {prod.stock_qty} copies</span>
                </div>
                <Link
                  to="/admin/products"
                  className="text-xs font-bold text-[#12A5B0] hover:underline"
                >
                  Restock ↗
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
