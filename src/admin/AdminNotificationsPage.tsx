import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { AdminNotification, NotificationType } from '../types';

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

export const AdminNotificationsPage: React.FC = () => {
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

  const [activeTab, setActiveTab] = useState<'all' | 'new_order' | 'stock_out' | 'customer_inquiry'>('all');
  const [isSimulating, setIsSimulating] = useState<string | null>(null);

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'stock_out') return n.type === 'stock_out' || n.type === 'low_stock';
    return n.type === activeTab;
  });

  const ordersCount = notifications.filter(n => n.type === 'new_order').length;
  const stockCount = notifications.filter(n => n.type === 'stock_out' || n.type === 'low_stock').length;
  const inquiriesCount = notifications.filter(n => n.type === 'customer_inquiry').length;

  const handleSimulate = async (type: NotificationType) => {
    if (!simulateAlert) return;
    setIsSimulating(type);
    try {
      await simulateAlert(type);
    } finally {
      setTimeout(() => setIsSimulating(null), 600);
    }
  };

  const formatTime = (iso: string) => {
    const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diffSec < 30) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return new Date(iso).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/15 text-red-700 border-red-300';
      case 'warning':
        return 'bg-amber-500/15 text-amber-800 border-amber-300';
      case 'success':
        return 'bg-emerald-500/15 text-emerald-800 border-emerald-300';
      default:
        return 'bg-[#12A5B0]/15 text-[#0B3561] border-[#12A5B0]/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading font-black text-2xl text-[#0B3561]">
              Live Operational Alerts & Notifications
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-800">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isConnected ? 'Real-Time SSE Connected' : 'Connecting...'}</span>
            </div>
          </div>
          <p className="text-xs text-[#3C5D81] mt-1">
            Real-time server-authoritative operational alert center for new book orders, inventory stock-outs, and student inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {setSoundEnabled && (
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                soundEnabled
                  ? 'bg-[#12A5B0]/15 text-[#0B3561] border-[#12A5B0]/30 hover:bg-[#12A5B0]/25'
                  : 'bg-gray-100 text-[#3C5D81] border-gray-200 hover:bg-gray-200'
              }`}
            >
              <span>{soundEnabled ? '🔊 Audio Chimes: ON' : '🔇 Audio Chimes: MUTED'}</span>
            </button>
          )}

          {unreadCount > 0 && markAllAsRead && (
            <button
              onClick={() => markAllAsRead()}
              className="px-3.5 py-2 bg-[#0B3561] text-white rounded-xl text-xs font-heading font-bold hover:bg-[#071E38] transition cursor-pointer"
            >
              ✓ Mark All as Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Quick Testing Bar for Admins */}
      <div className="bg-[#0B3561] text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#12A5B0] block">
            ⚡ Test Operational Responsiveness
          </span>
          <p className="text-xs text-white/80 mt-0.5">
            Trigger real-time test alerts to verify instant SSE stream push, audio chimes, and floating toast notifications.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSimulate('new_order')}
            disabled={isSimulating === 'new_order'}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <span>🛍️</span>
            <span>{isSimulating === 'new_order' ? 'Broadcasting...' : 'Simulate Order'}</span>
          </button>
          <button
            onClick={() => handleSimulate('stock_out')}
            disabled={isSimulating === 'stock_out'}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 rounded-xl text-xs font-bold text-white transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <span>🚨</span>
            <span>{isSimulating === 'stock_out' ? 'Broadcasting...' : 'Simulate Stock-Out'}</span>
          </button>
          <button
            onClick={() => handleSimulate('customer_inquiry')}
            disabled={isSimulating === 'customer_inquiry'}
            className="px-3 py-1.5 bg-[#12A5B0]/20 hover:bg-[#12A5B0]/30 border border-[#12A5B0]/40 rounded-xl text-xs font-bold text-white transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <span>💬</span>
            <span>{isSimulating === 'customer_inquiry' ? 'Broadcasting...' : 'Simulate Inquiry'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white border-[#0B3561] ring-2 ring-[#0B3561]/10 shadow-sm'
              : 'bg-white border-[#0B3561]/10 hover:border-[#0B3561]/30'
          }`}
        >
          <span className="text-[11px] font-heading font-semibold text-[#3C5D81] uppercase block">
            All Alerts
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-display font-black text-2xl text-[#0B3561]">
              {notifications.length}
            </span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveTab('new_order')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'new_order'
              ? 'bg-white border-[#0B3561] ring-2 ring-[#0B3561]/10 shadow-sm'
              : 'bg-white border-[#0B3561]/10 hover:border-[#0B3561]/30'
          }`}
        >
          <span className="text-[11px] font-heading font-semibold text-[#3C5D81] uppercase block">
            🛍️ New Orders
          </span>
          <span className="font-display font-black text-2xl text-[#0B3561] mt-1 block">
            {ordersCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stock_out')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'stock_out'
              ? 'bg-white border-[#0B3561] ring-2 ring-[#0B3561]/10 shadow-sm'
              : 'bg-white border-[#0B3561]/10 hover:border-[#0B3561]/30'
          }`}
        >
          <span className="text-[11px] font-heading font-semibold text-[#C0392B] uppercase block">
            🚨 Stock-Outs & Low Stock
          </span>
          <span className="font-display font-black text-2xl text-[#C0392B] mt-1 block">
            {stockCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('customer_inquiry')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'customer_inquiry'
              ? 'bg-white border-[#0B3561] ring-2 ring-[#0B3561]/10 shadow-sm'
              : 'bg-white border-[#0B3561]/10 hover:border-[#0B3561]/30'
          }`}
        >
          <span className="text-[11px] font-heading font-semibold text-[#12A5B0] uppercase block">
            💬 Inquiries & Leads
          </span>
          <span className="font-display font-black text-2xl text-[#0B3561] mt-1 block">
            {inquiriesCount}
          </span>
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="bg-white rounded-3xl border border-[#0B3561]/10 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#0B3561]/10 flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-[#0B3561] flex items-center gap-2">
            <span>Operational Activity Stream</span>
            <span className="text-xs text-[#3C5D81] font-normal">
              ({filtered.length} {filtered.length === 1 ? 'alert' : 'alerts'})
            </span>
          </h3>
          <span className="text-xs text-[#3C5D81]">
            Auto-synced via WebSockets / SSE
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#3C5D81] space-y-2">
            <span className="text-4xl block">🎉</span>
            <p className="font-heading font-bold text-sm text-[#0B3561]">
              All Clear! No Pending Operational Alerts
            </p>
            <p className="text-xs max-w-sm mx-auto">
              You are completely caught up. New orders, inventory depletion warnings, and customer support inquiries will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#0B3561]/5">
            {filtered.map(notif => (
              <div
                key={notif.id}
                className={`p-5 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  !notif.read ? 'bg-[#DDF3F4]/20' : 'hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0 mt-0.5">
                    {notif.type === 'stock_out'
                      ? '🚨'
                      : notif.type === 'low_stock'
                      ? '⚠️'
                      : notif.type === 'customer_inquiry'
                      ? '💬'
                      : '🛍️'}
                  </span>

                  <div className="space-y-1 min-w-0 flex-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-sm text-[#0B3561]">
                        {notif.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getSeverityBadge(
                          notif.severity
                        )}`}
                      >
                        {notif.severity}
                      </span>
                      {!notif.read && (
                        <span className="bg-red-500 w-2 h-2 rounded-full inline-block animate-pulse" title="Unread" />
                      )}
                      <span className="text-[11px] text-[#3C5D81]">
                        • {formatTime(notif.timestamp)}
                      </span>
                    </div>

                    <p className="text-[#3C5D81] text-xs leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Additional Metadata Details */}
                    {notif.metadata && (
                      <div className="flex items-center gap-3 text-[11px] text-[#3C5D81] pt-1 flex-wrap font-mono">
                        {notif.metadata.order_no && (
                          <span>Order: #{notif.metadata.order_no}</span>
                        )}
                        {notif.metadata.customer_name && (
                          <span>Customer: {notif.metadata.customer_name}</span>
                        )}
                        {notif.metadata.total_paise !== undefined && (
                          <span className="font-bold text-[#13834D]">
                            Amount: ₹{(notif.metadata.total_paise / 100).toFixed(2)}
                          </span>
                        )}
                        {notif.metadata.payment_method && (
                          <span className="uppercase font-bold">
                            Mode: {notif.metadata.payment_method}
                          </span>
                        )}
                        {notif.metadata.sender_phone && (
                          <span>Phone: {notif.metadata.sender_phone}</span>
                        )}
                        {notif.metadata.stock_qty !== undefined && (
                          <span className="text-red-700 font-bold">
                            Stock Left: {notif.metadata.stock_qty}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={() => markAsRead?.(notif.id)}
                      className="px-3.5 py-1.5 bg-[#0B3561] text-white font-heading font-bold text-xs rounded-xl hover:bg-[#071E38] transition shadow-xs"
                    >
                      {notif.actionLabel || 'View Details'} →
                    </Link>
                  )}

                  {notif.metadata?.sender_phone && (
                    <a
                      href={`https://wa.me/91${notif.metadata.sender_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hello ${notif.metadata.sender_name || 'Student'}, thank you for contacting PyNotes.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#25D366] text-white font-heading font-bold text-xs rounded-xl hover:brightness-105 transition"
                    >
                      WhatsApp
                    </a>
                  )}

                  {!notif.read && markAsRead && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="px-2.5 py-1.5 text-xs text-[#3C5D81] hover:text-[#0B3561] font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                      title="Mark as read"
                    >
                      ✓ Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
