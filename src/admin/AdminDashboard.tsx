import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { adminFetch } from '../lib/api';
import { Order, Product, AdminNotification, NotificationType } from '../types';
import { Logo } from '../components/Logo';

interface AdminContextType {
  profile: any;
  role: string;
  notifications?: AdminNotification[];
  unreadCount?: number;
  isConnected?: boolean;
  soundEnabled?: boolean;
  setSoundEnabled?: (v: boolean) => void;
  markAsRead?: (id: string) => Promise<void>;
  markAllAsRead?: () => Promise<void>;
  simulateAlert?: (type: NotificationType) => Promise<void>;
}

export const AdminDashboard: React.FC = () => {
  const context = useOutletContext<AdminContextType>() || {};
  const {
    notifications = [],
    unreadCount = 0,
    isConnected = false,
    soundEnabled = true,
    setSoundEnabled,
    markAsRead,
    markAllAsRead,
    simulateAlert,
  } = context;

  const [alertFilter, setAlertFilter] = useState<'all' | 'new_order' | 'stock_out' | 'customer_inquiry'>('all');
  const [simulatingType, setSimulatingType] = useState<string | null>(null);

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
      {/* PyNotes Store Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="bg-[#071E38] p-2.5 rounded-2xl shadow-sm border border-[#0B3561]/20">
            <Logo size="md" surface="dark" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#0B3561] tracking-tight">
                PyNotes Admin
              </h2>
              <span className="bg-[#12A5B0]/15 text-[#0B3561] text-xs font-heading font-bold px-3 py-1 rounded-full border border-[#12A5B0]/30">
                ✨ 2026 Student Edition
              </span>
            </div>
            <p className="text-xs text-[#3C5D81] mt-1 max-w-xl leading-relaxed">
              Manage 100 GSM printed handwritten notes, rotating hero banners, order shipments, payments, and store branding seamlessly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <Link
            to="/admin/hero-banners"
            className="px-4 py-2.5 bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs rounded-xl hover:brightness-105 shadow-xs transition"
          >
            Manage Hero Banners 🖼️
          </Link>
          <Link
            to="/admin/logo"
            className="px-4 py-2.5 bg-[#0B3561] text-white font-heading font-bold text-xs rounded-xl hover:bg-[#071E38] shadow-xs transition"
          >
            Upload Logo 🎨
          </Link>
        </div>
      </div>
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

      {/* Real-Time Operational Notification & Alert Center */}
      <div className="bg-white rounded-3xl border border-[#0B3561]/10 shadow-sm overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-[#071E38] via-[#0B3561] to-[#071E38] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xl">⚡</span>
              <h3 className="font-heading font-black text-lg text-white tracking-tight">
                Live Operational Alert Center
              </h3>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-400/30 bg-emerald-500/20 text-emerald-300">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isConnected ? 'Real-Time SSE Connected' : 'Connecting Stream...'}</span>
              </div>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full animate-bounce">
                  {unreadCount} UNREAD ALERTS
                </span>
              )}
            </div>
            <p className="text-xs text-white/70 mt-1 max-w-xl">
              Instant push alerts for new student book orders, zero-stock warehouse events, and incoming customer inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {setSoundEnabled && (
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                  soundEnabled
                    ? 'bg-[#12A5B0]/25 text-[#12A5B0] border-[#12A5B0]/40 hover:bg-[#12A5B0]/35'
                    : 'bg-white/10 text-white/50 border-white/10 hover:bg-white/15'
                }`}
                title={soundEnabled ? 'Chime sound is enabled for alerts' : 'Chime sound is muted'}
              >
                <span>{soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: MUTED'}</span>
              </button>
            )}

            {unreadCount > 0 && markAllAsRead && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="px-3 py-1.5 bg-[#FFD54A] text-[#071E38] rounded-xl text-xs font-heading font-bold hover:brightness-105 transition cursor-pointer"
              >
                ✓ Mark All Read
              </button>
            )}

            <Link
              to="/admin/notifications"
              className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-xs font-heading font-bold hover:bg-white/20 transition"
            >
              Full Log ↗
            </Link>
          </div>
        </div>

        {/* Operational Test Trigger Bar */}
        <div className="bg-[#F0F5FA] px-6 py-3 border-b border-[#0B3561]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span className="font-heading font-bold text-[#0B3561] flex items-center gap-1.5">
            <span>🛠️ Test Responsiveness:</span>
            <span className="text-[#3C5D81] font-normal hidden sm:inline">
              Simulate live customer actions to test audio chimes and instant notifications:
            </span>
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={async () => {
                if (!simulateAlert) return;
                setSimulatingType('new_order');
                await simulateAlert('new_order');
                setSimulatingType(null);
              }}
              disabled={simulatingType === 'new_order'}
              className="px-2.5 py-1 bg-white hover:bg-[#0B3561] hover:text-white text-[#0B3561] border border-[#0B3561]/20 rounded-lg font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
            >
              🛍️ {simulatingType === 'new_order' ? 'Pushed...' : '+ Simulate Order'}
            </button>
            <button
              onClick={async () => {
                if (!simulateAlert) return;
                setSimulatingType('stock_out');
                await simulateAlert('stock_out');
                setSimulatingType(null);
              }}
              disabled={simulatingType === 'stock_out'}
              className="px-2.5 py-1 bg-white hover:bg-red-600 hover:text-white text-red-700 border border-red-200 rounded-lg font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
            >
              🚨 {simulatingType === 'stock_out' ? 'Pushed...' : '+ Simulate Stock-Out'}
            </button>
            <button
              onClick={async () => {
                if (!simulateAlert) return;
                setSimulatingType('customer_inquiry');
                await simulateAlert('customer_inquiry');
                setSimulatingType(null);
              }}
              disabled={simulatingType === 'customer_inquiry'}
              className="px-2.5 py-1 bg-white hover:bg-[#12A5B0] hover:text-white text-[#0B3561] border border-[#12A5B0]/30 rounded-lg font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
            >
              💬 {simulatingType === 'customer_inquiry' ? 'Pushed...' : '+ Simulate Inquiry'}
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="p-4 sm:px-6 bg-white border-b border-[#0B3561]/10 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setAlertFilter('all')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition flex-shrink-0 cursor-pointer ${
              alertFilter === 'all'
                ? 'bg-[#0B3561] text-white'
                : 'bg-gray-100 text-[#3C5D81] hover:bg-gray-200'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setAlertFilter('new_order')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition flex-shrink-0 flex items-center gap-1.5 cursor-pointer ${
              alertFilter === 'new_order'
                ? 'bg-[#0B3561] text-white'
                : 'bg-gray-100 text-[#3C5D81] hover:bg-gray-200'
            }`}
          >
            <span>🛍️</span>
            <span>New Orders ({notifications.filter(n => n.type === 'new_order').length})</span>
          </button>
          <button
            onClick={() => setAlertFilter('stock_out')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition flex-shrink-0 flex items-center gap-1.5 cursor-pointer ${
              alertFilter === 'stock_out'
                ? 'bg-[#C0392B] text-white'
                : 'bg-gray-100 text-[#3C5D81] hover:bg-gray-200'
            }`}
          >
            <span>🚨</span>
            <span>Stock-Outs ({notifications.filter(n => n.type === 'stock_out' || n.type === 'low_stock').length})</span>
          </button>
          <button
            onClick={() => setAlertFilter('customer_inquiry')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition flex-shrink-0 flex items-center gap-1.5 cursor-pointer ${
              alertFilter === 'customer_inquiry'
                ? 'bg-[#12A5B0] text-[#071E38]'
                : 'bg-gray-100 text-[#3C5D81] hover:bg-gray-200'
            }`}
          >
            <span>💬</span>
            <span>Customer Inquiries ({notifications.filter(n => n.type === 'customer_inquiry').length})</span>
          </button>
        </div>

        {/* Live Notification Feed Stream */}
        <div className="divide-y divide-[#0B3561]/5 max-h-[420px] overflow-y-auto">
          {(() => {
            const displayList = notifications.filter(n => {
              if (alertFilter === 'all') return true;
              if (alertFilter === 'stock_out') return n.type === 'stock_out' || n.type === 'low_stock';
              return n.type === alertFilter;
            });

            if (displayList.length === 0) {
              return (
                <div className="py-12 text-center text-[#3C5D81] space-y-2">
                  <span className="text-3xl block">✨</span>
                  <p className="font-heading font-bold text-sm text-[#0B3561]">
                    No Active Alerts in this Category
                  </p>
                  <p className="text-xs text-[#3C5D81] max-w-sm mx-auto">
                    New store activity will stream here in real time without refreshing the page.
                  </p>
                </div>
              );
            }

            return displayList.slice(0, 10).map(notif => {
              const diffSec = Math.floor((Date.now() - new Date(notif.timestamp).getTime()) / 1000);
              const timeAgo = diffSec < 45 ? 'Just now' : diffSec < 3600 ? `${Math.floor(diffSec / 60)}m ago` : `${Math.floor(diffSec / 3600)}h ago`;

              return (
                <div
                  key={notif.id}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
                    !notif.read ? 'bg-[#DDF3F4]/20' : 'hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0 mt-0.5">
                      {notif.type === 'stock_out' ? '🚨' : notif.type === 'low_stock' ? '⚠️' : notif.type === 'customer_inquiry' ? '💬' : '🛍️'}
                    </span>

                    <div className="space-y-1 min-w-0 flex-1 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-bold text-sm text-[#0B3561]">
                          {notif.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                            notif.severity === 'critical'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : notif.severity === 'warning'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : notif.severity === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-cyan-50 text-cyan-800 border-cyan-300'
                          }`}
                        >
                          {notif.severity}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" title="Unread alert" />
                        )}
                        <span className="text-[11px] text-[#3C5D81]">
                          • {timeAgo}
                        </span>
                      </div>

                      <p className="text-[#3C5D81] text-xs leading-relaxed">
                        {notif.message}
                      </p>

                      {/* Metadata Chips */}
                      {notif.metadata && (
                        <div className="flex items-center gap-3 text-[11px] text-[#3C5D81] pt-1 flex-wrap">
                          {notif.metadata.order_no && (
                            <span className="font-mono font-bold text-[#0B3561]">#{notif.metadata.order_no}</span>
                          )}
                          {notif.metadata.customer_name && (
                            <span>Student: <strong className="text-[#0B3561]">{notif.metadata.customer_name}</strong></span>
                          )}
                          {notif.metadata.total_paise !== undefined && (
                            <span className="font-bold text-[#13834D]">
                              ₹{(notif.metadata.total_paise / 100).toFixed(2)}
                            </span>
                          )}
                          {notif.metadata.payment_method && (
                            <span className="uppercase text-[10px] px-1.5 py-0.5 bg-gray-100 rounded font-bold">
                              {notif.metadata.payment_method}
                            </span>
                          )}
                          {notif.metadata.sender_phone && (
                            <span>Phone: {notif.metadata.sender_phone}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                    {notif.type === 'new_order' && notif.metadata?.order_no && (
                      <button
                        onClick={() => handleConfirmCod(notif.metadata!.order_no!)}
                        className="px-3 py-1.5 bg-[#13834D] text-white font-heading font-bold text-xs rounded-xl hover:brightness-105 transition shadow-xs cursor-pointer"
                      >
                        Confirm COD
                      </button>
                    )}

                    {notif.metadata?.sender_phone && (
                      <a
                        href={`https://wa.me/91${notif.metadata.sender_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hello ${notif.metadata.sender_name || 'Customer'}, this is PyNotes Support regarding your inquiry.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-[#25D366] text-white font-heading font-bold text-xs rounded-xl hover:brightness-105 transition cursor-pointer"
                      >
                        WhatsApp
                      </a>
                    )}

                    {notif.link && (
                      <Link
                        to={notif.link}
                        onClick={() => markAsRead?.(notif.id)}
                        className="px-3 py-1.5 bg-[#0B3561] text-white font-heading font-bold text-xs rounded-xl hover:bg-[#071E38] transition shadow-xs"
                      >
                        {notif.actionLabel || 'View'} →
                      </Link>
                    )}

                    {!notif.read && markAsRead && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="px-2.5 py-1.5 text-xs text-[#3C5D81] hover:text-[#0B3561] font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                        title="Mark read"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

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
