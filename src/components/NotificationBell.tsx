import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminNotification, NotificationType } from '../types';

interface NotificationBellProps {
  notifications: AdminNotification[];
  unreadCount: number;
  isConnected: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  activeToasts: AdminNotification[];
  dismissToast: (id: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  unreadCount,
  isConnected,
  soundEnabled,
  setSoundEnabled,
  markAsRead,
  markAllAsRead,
  activeToasts,
  dismissToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_order':
        return '🛍️';
      case 'stock_out':
        return '🚨';
      case 'low_stock':
        return '⚠️';
      case 'customer_inquiry':
        return '💬';
      default:
        return '🔔';
    }
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
        return 'bg-cyan-500/15 text-cyan-800 border-cyan-300';
    }
  };

  const formatTimeAgo = (iso: string) => {
    const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diffSec < 45) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  return (
    <>
      {/* Real-time Floating Toast Alert Cards */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {activeToasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-start gap-3 transform transition-all duration-300 animate-slide-in ${
              toast.severity === 'critical'
                ? 'bg-[#991B1B] text-white border-red-400'
                : toast.severity === 'warning'
                ? 'bg-[#B45309] text-white border-amber-400'
                : 'bg-[#0B3561] text-white border-[#12A5B0]/40'
            }`}
          >
            <span className="text-2xl flex-shrink-0">{getIcon(toast.type)}</span>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between gap-1">
                <span className="font-heading font-bold text-sm tracking-tight truncate">
                  {toast.title}
                </span>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-white/70 hover:text-white text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-white/90 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                {toast.message}
              </p>
              {toast.link && (
                <div className="mt-2 flex items-center justify-between">
                  <Link
                    to={toast.link}
                    onClick={() => {
                      markAsRead(toast.id);
                      dismissToast(toast.id);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] inline-block transition"
                  >
                    {toast.actionLabel || 'View Details'} →
                  </Link>
                  <span className="text-[10px] text-white/60">Real-time alert</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Bell Button & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
            isOpen ? 'bg-[#0B3561] text-white' : 'bg-gray-100 hover:bg-gray-200 text-[#0B3561]'
          }`}
          title="Operational Notifications & Alerts"
          aria-label="Open notifications"
        >
          <span className="text-lg">🔔</span>

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono font-black text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}

          {/* Live Stream Pulse Dot */}
          <span
            className={`absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white ${
              isConnected ? 'bg-emerald-500' : 'bg-gray-400'
            }`}
            title={isConnected ? 'Real-Time SSE Connected' : 'Connecting to Stream...'}
          />
        </button>

        {/* Dropdown Popover Drawer */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#0B3561]/15 z-50 overflow-hidden text-xs">
            {/* Header */}
            <div className="p-4 bg-[#071E38] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-sm text-white">Live Alerts</span>
                <span className="bg-[#12A5B0]/20 text-[#12A5B0] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  title={isConnected ? 'Live Stream Active' : 'Connecting'}
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Audio chime toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    soundEnabled ? 'bg-[#12A5B0]/30 text-[#12A5B0]' : 'bg-white/10 text-white/50'
                  }`}
                  title={soundEnabled ? 'Chime sound is ON' : 'Chime sound is MUTED'}
                >
                  <span>{soundEnabled ? '🔊 Sound' : '🔇 Muted'}</span>
                </button>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#FFD54A] hover:underline font-bold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="p-2.5 bg-[#F7FAFC] border-b border-[#0B3561]/10 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full font-bold transition flex-shrink-0 ${
                  filter === 'all'
                    ? 'bg-[#0B3561] text-white'
                    : 'bg-white text-[#3C5D81] hover:bg-gray-100 border border-[#0B3561]/10'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('new_order')}
                className={`px-3 py-1 rounded-full font-bold transition flex-shrink-0 flex items-center gap-1 ${
                  filter === 'new_order'
                    ? 'bg-[#0B3561] text-white'
                    : 'bg-white text-[#3C5D81] hover:bg-gray-100 border border-[#0B3561]/10'
                }`}
              >
                <span>🛍️</span> Orders
              </button>
              <button
                onClick={() => setFilter('stock_out')}
                className={`px-3 py-1 rounded-full font-bold transition flex-shrink-0 flex items-center gap-1 ${
                  filter === 'stock_out'
                    ? 'bg-[#0B3561] text-white'
                    : 'bg-white text-[#3C5D81] hover:bg-gray-100 border border-[#0B3561]/10'
                }`}
              >
                <span>🚨</span> Stock-outs
              </button>
              <button
                onClick={() => setFilter('customer_inquiry')}
                className={`px-3 py-1 rounded-full font-bold transition flex-shrink-0 flex items-center gap-1 ${
                  filter === 'customer_inquiry'
                    ? 'bg-[#0B3561] text-white'
                    : 'bg-white text-[#3C5D81] hover:bg-gray-100 border border-[#0B3561]/10'
                }`}
              >
                <span>💬</span> Inquiries
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[#0B3561]/5">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-[#3C5D81] space-y-1">
                  <span className="text-3xl block">✨</span>
                  <p className="font-heading font-bold text-xs text-[#0B3561]">All caught up!</p>
                  <p className="text-[11px] text-[#3C5D81]">No active operational alerts in this view.</p>
                </div>
              ) : (
                filteredNotifications.map(item => (
                  <div
                    key={item.id}
                    onClick={() => !item.read && markAsRead(item.id)}
                    className={`p-3.5 hover:bg-[#F7FAFC] transition flex items-start gap-3 ${
                      !item.read ? 'bg-[#DDF3F4]/20' : ''
                    }`}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{getIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-heading font-bold text-xs truncate ${!item.read ? 'text-[#0B3561]' : 'text-gray-600'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#3C5D81] mt-0.5 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase border ${getSeverityBadge(item.severity)}`}>
                          {item.type.replace('_', ' ')}
                        </span>

                        {item.link && (
                          <Link
                            to={item.link}
                            onClick={() => {
                              markAsRead(item.id);
                              setIsOpen(false);
                            }}
                            className="text-[#12A5B0] hover:underline font-bold text-[11px] flex items-center gap-0.5"
                          >
                            <span>{item.actionLabel || 'Action'}</span>
                            <span>↗</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#FAF7F0] border-t border-[#0B3561]/10 flex items-center justify-between text-[11px]">
              <span className="text-[#3C5D81]">
                Real-Time Ops Engine
              </span>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-[#0B3561] font-bold hover:underline"
              >
                Open Dashboard Feed →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
