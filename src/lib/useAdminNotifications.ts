import { useState, useEffect, useCallback, useRef } from 'react';
import { AdminNotification, NotificationType } from '../types';

// Web Audio API Synthesizer for pleasant operational notification chimes
function playChime(severity: 'critical' | 'warning' | 'info' | 'success' = 'info') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Frequencies tailored to severity
    const notes = severity === 'critical'
      ? [440, 370] // A4 -> F#4 alert chime
      : severity === 'warning'
      ? [523.25, 659.25] // C5 -> E5 warning
      : [587.33, 880]; // D5 -> A5 pleasant arrival chime

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = severity === 'critical' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.36);
    });
  } catch (err) {
    console.debug('Audio chime skipped:', err);
  }
}

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeToasts, setActiveToasts] = useState<AdminNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('pynotes_admin_sound') !== 'false';
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    localStorage.setItem('pynotes_admin_sound', val ? 'true' : 'false');
  };

  const addToast = useCallback((notif: AdminNotification) => {
    setActiveToasts(prev => [notif, ...prev.slice(0, 3)]);
    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== notif.id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const staffUser = sessionStorage.getItem('pynotes_admin_session') || localStorage.getItem('pynotes_staff_user');
      let staffEmail = '';
      if (staffUser) {
        try {
          const parsed = JSON.parse(staffUser);
          staffEmail = parsed.user?.email || parsed.email || '';
        } catch {}
      }

      const res = await fetch('/api/admin/notifications', {
        headers: staffEmail ? { 'x-staff-email': staffEmail } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (e) {
      console.debug('Failed to fetch notifications:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Connect to SSE stream
  useEffect(() => {
    fetchNotifications();

    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/admin/notifications/stream');
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
      };

      es.onmessage = (event) => {
        try {
          const newNotif: AdminNotification = JSON.parse(event.data);
          if (newNotif && newNotif.id) {
            setNotifications(prev => {
              // Deduplicate
              const filtered = prev.filter(n => n.id !== newNotif.id);
              return [newNotif, ...filtered];
            });
            setUnreadCount(prev => prev + 1);

            // Trigger chime if enabled
            if (soundEnabled) {
              playChime(newNotif.severity);
            }

            // Show floating toast alert
            addToast(newNotif);
          }
        } catch (err) {
          console.debug('Error parsing SSE event:', err);
        }
      };

      es.onerror = () => {
        setIsConnected(false);
        // Will automatically retry
      };
    } catch (e) {
      console.debug('EventSource connection error:', e);
    }

    // Polling backup interval every 30 seconds
    const pollInterval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(pollInterval);
      if (es) {
        es.close();
      }
    };
  }, [fetchNotifications, soundEnabled, addToast]);

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await fetch('/api/admin/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.debug('Failed to mark notification read:', e);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await fetch('/api/admin/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
    } catch (e) {
      console.debug('Failed to mark all notifications read:', e);
    }
  };

  const simulateAlert = async (type: NotificationType) => {
    try {
      const res = await fetch('/api/admin/notifications/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        const notif = await res.json();
        // Optimistically add and ring chime
        setNotifications(prev => [notif, ...prev.filter(n => n.id !== notif.id)]);
        setUnreadCount(prev => prev + 1);
        if (soundEnabled) {
          playChime(notif.severity);
        }
        addToast(notif);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    isConnected,
    soundEnabled,
    setSoundEnabled,
    activeToasts,
    dismissToast,
    markAsRead,
    markAllAsRead,
    simulateAlert,
    refresh: fetchNotifications,
  };
}
