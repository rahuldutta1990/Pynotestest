import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { auth, signOutUser, signInUser } from '../lib/firebase';
import { adminFetch } from '../lib/api';
import { UserProfile } from '../types';
import { Logo } from '../components/Logo';
import { useAdminNotifications } from '../lib/useAdminNotifications';
import { NotificationBell } from '../components/NotificationBell';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabSearch, setTabSearch] = useState('');
  const notifState = useAdminNotifications();

  // Login & Forgot Password form state
  const [authView, setAuthView] = useState<'login' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Inactivity session timeout: 15 minutes
  const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Check active tab session (NOT permanent localStorage)
      const rawSession = sessionStorage.getItem('pynotes_admin_session');
      if (rawSession) {
        try {
          const session = JSON.parse(rawSession);
          const now = Date.now();
          if (session.user && session.lastActive && (now - session.lastActive < SESSION_TIMEOUT_MS)) {
            session.lastActive = now;
            sessionStorage.setItem('pynotes_admin_session', JSON.stringify(session));
            setProfile(session.user);
            setLoading(false);
            return;
          } else {
            sessionStorage.removeItem('pynotes_admin_session');
            setLoginError('Session expired due to inactivity. Please sign in again.');
          }
        } catch {
          sessionStorage.removeItem('pynotes_admin_session');
        }
      }

      // No active session in this tab/window: always require email & password
      setLoading(false);
    };

    checkAdminAccess();
  }, []);

  // Inactivity tracking listener during active session
  useEffect(() => {
    if (!profile) return;

    const updateActivity = () => {
      const rawSession = sessionStorage.getItem('pynotes_admin_session');
      if (rawSession) {
        try {
          const session = JSON.parse(rawSession);
          session.lastActive = Date.now();
          sessionStorage.setItem('pynotes_admin_session', JSON.stringify(session));
        } catch {}
      }
    };

    const interval = setInterval(() => {
      const rawSession = sessionStorage.getItem('pynotes_admin_session');
      if (rawSession) {
        try {
          const session = JSON.parse(rawSession);
          if (Date.now() - session.lastActive > SESSION_TIMEOUT_MS) {
            handleSignOut('Session timed out after 15 minutes of inactivity. Please enter your credentials again.');
          }
        } catch {}
      }
    }, 15000);

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [profile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setInfoMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        // Save session in sessionStorage (isolated to current tab/window with activity timestamp)
        const session = {
          user: data.user,
          lastActive: Date.now(),
        };
        sessionStorage.setItem('pynotes_admin_session', JSON.stringify(session));
        setProfile(data.user);
        return;
      }

      throw new Error(data.error || 'Invalid credentials. Please enter your valid admin email and password.');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setInfoMsg(null);
    if (!email.trim()) {
      setLoginError('Please enter your admin email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process password reset.');

      setInfoMsg(data.message || 'Verification code generated.');
      if (data.dev_code) {
        setResetCode(data.dev_code);
      }
      setAuthView('reset');
    } catch (err: any) {
      setLoginError(err.message || 'Unable to request password reset code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setInfoMsg(null);

    if (!resetCode.trim()) {
      setLoginError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setLoginError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLoginError('Passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: resetCode.trim(),
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password.');

      setInfoMsg('Password updated successfully! Please enter your new password to sign in.');
      setPassword('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
      setAuthView('login');
    } catch (err: any) {
      setLoginError(err.message || 'Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071E38] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#12A5B0] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-heading text-xs">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#071E38] text-white flex items-center justify-center p-6">
        <div className="bg-[#0B3561] p-8 sm:p-10 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="bg-white px-4 py-2.5 rounded-2xl border border-white/20 shadow-md">
              <Logo size="md" />
            </div>
            <div className="space-y-1">
              <h2 className="font-heading font-black text-2xl text-white tracking-tight">
                {authView === 'login' && 'Staff Admin Login'}
                {authView === 'forgot' && 'Reset Admin Password'}
                {authView === 'reset' && 'Set New Password'}
              </h2>
              <p className="text-xs text-[#DDF3F4]/80">
                {authView === 'login' && 'Enter your authorized staff email and password.'}
                {authView === 'forgot' && 'Enter your admin email to receive a 6-digit verification code.'}
                {authView === 'reset' && `Enter the 6-digit code sent for ${email} and choose your new password.`}
              </p>
            </div>
          </div>

          {infoMsg && (
            <div className="bg-[#12A5B0]/20 border border-[#12A5B0]/40 text-[#DDF3F4] text-xs font-semibold p-3 rounded-xl">
              {infoMsg}
            </div>
          )}

          {loginError && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold p-3 rounded-xl">
              {loginError}
            </div>
          )}

          {authView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#DDF3F4]">Staff Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#12A5B0] transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-[#DDF3F4]">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView('forgot');
                      setLoginError(null);
                      setInfoMsg(null);
                    }}
                    className="text-[#12A5B0] hover:underline font-semibold cursor-pointer text-[11px]"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#12A5B0] transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3.5 rounded-xl hover:brightness-105 shadow-md disabled:opacity-50 cursor-pointer transition text-sm"
              >
                {submitting ? 'Authenticating...' : 'Sign In to Admin Panel'}
              </button>
            </form>
          )}

          {authView === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#DDF3F4]">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#12A5B0] transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3.5 rounded-xl hover:brightness-105 shadow-md disabled:opacity-50 cursor-pointer transition text-sm"
              >
                {submitting ? 'Generating Code...' : 'Send Verification Code'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthView('login');
                  setLoginError(null);
                  setInfoMsg(null);
                }}
                className="w-full text-center text-xs text-[#DDF3F4]/70 hover:text-white pt-2 block"
              >
                ← Back to Sign In
              </button>
            </form>
          )}

          {authView === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#DDF3F4]">6-Digit Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={resetCode}
                  onChange={e => setResetCode(e.target.value)}
                  placeholder="Enter 6-digit verification code"
                  className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white placeholder-white/40 font-mono tracking-widest text-center text-lg focus:outline-none focus:border-[#12A5B0] transition"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#DDF3F4]">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#12A5B0] transition"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#DDF3F4]">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#12A5B0] transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3.5 rounded-xl hover:brightness-105 shadow-md disabled:opacity-50 cursor-pointer transition text-sm"
              >
                {submitting ? 'Updating Password...' : 'Save New Password & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthView('login');
                  setLoginError(null);
                  setInfoMsg(null);
                }}
                className="w-full text-center text-xs text-[#DDF3F4]/70 hover:text-white pt-2 block"
              >
                ← Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#071E38] text-white flex items-center justify-center p-6">
        <div className="bg-[#0B3561] p-8 rounded-3xl max-w-md w-full border border-white/10 text-center space-y-4">
          <h2 className="font-heading font-bold text-xl text-[#C0392B]">Access Denied</h2>
          <p className="text-xs text-[#DDF3F4]/90">{errorMsg}</p>
          <div className="pt-4 flex gap-2">
            <Link to="/admin/setup" className="flex-1 bg-[#FFD54A] text-[#071E38] py-2.5 rounded-xl font-bold text-xs">
              Go to /admin/setup
            </Link>
            <button
              onClick={() => signOutUser().then(() => window.location.reload())}
              className="px-4 border border-white/20 py-2.5 rounded-xl text-xs font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const role = profile?.role || 'customer';

  const adminNavGroups = [
    {
      groupName: 'Overview',
      icon: '📊',
      items: [
        { label: 'Dashboard', path: '/admin', roles: ['owner', 'manager'] },
        {
          label: 'Live Notifications & Alerts',
          path: '/admin/notifications',
          roles: ['owner', 'manager', 'editor'],
          badge: notifState.unreadCount > 0 ? `${notifState.unreadCount} New` : 'Live',
        },
      ],
    },
    {
      groupName: 'Storefront & Branding',
      icon: '🎨',
      items: [
        { label: 'Announcement Bar', path: '/admin/announcements', roles: ['owner', 'editor'] },
        { label: 'Content CMS', path: '/admin/content', roles: ['owner', 'editor'] },
        { label: 'FAQ & Policy Pages', path: '/admin/pages', roles: ['owner', 'editor'] },
        { label: 'Hero Banners', path: '/admin/hero-banners', roles: ['owner', 'editor'], badge: 'New 2026' },
        { label: 'Instagram Feed API', path: '/admin/instagram', roles: ['owner', 'editor'] },
        { label: 'SEO, GA4 & Web Vitals', path: '/admin/seo', roles: ['owner', 'manager', 'editor'], badge: 'Pro' },
        { label: 'Special Offers', path: '/admin/offers', roles: ['owner', 'manager', 'editor'] },
        { label: 'User Wishlists', path: '/admin/wishlists', roles: ['owner', 'manager'] },
        { label: 'Store Logo & Branding', path: '/admin/logo', roles: ['owner', 'manager', 'editor'] },
        { label: 'Testimonials & Reviews', path: '/admin/reviews', roles: ['owner', 'manager', 'editor'] },
      ],
    },
    {
      groupName: 'Catalog & Inventory',
      icon: '📚',
      items: [
        { label: 'Inventory & Reconcile', path: '/admin/inventory', roles: ['owner', 'manager'] },
        { label: 'Pricing & Offers', path: '/admin/pricing', roles: ['owner', 'manager'] },
        { label: 'Products', path: '/admin/product-list', roles: ['owner', 'manager'] },
        { label: 'Subjects', path: '/admin/subjects', roles: ['owner', 'manager'] },
        { label: 'Subscription Plans & Hub', path: '/admin/subscriptions', roles: ['owner', 'manager'] },
      ],
    },
    {
      groupName: 'Orders & Logistics',
      icon: '📦',
      items: [
        { label: 'Cancellations', path: '/admin/cancellations', roles: ['owner', 'manager'] },
        { label: 'Courier Webhooks', path: '/admin/courier-webhooks', roles: ['owner'] },
        { label: 'Logistics Reports & Tests', path: '/admin/logistics-reports', roles: ['owner'] },
        { label: 'Orders & Logistics', path: '/admin/orders', roles: ['owner', 'manager'] },
        { label: 'Status Mappings', path: '/admin/status-mappings', roles: ['owner', 'manager'] },
      ],
    },
    {
      groupName: 'Payments & Finance',
      icon: '💳',
      items: [
        { label: 'Coupons', path: '/admin/coupons', roles: ['owner', 'manager'] },
        { label: 'Payment Page & QR', path: '/admin/payment-page', roles: ['owner', 'manager'] },
        { label: 'Razorpay Payments', path: '/admin/payments', roles: ['owner'] },
      ],
    },
    {
      groupName: 'Settings & System',
      icon: '⚙️',
      items: [
        { label: 'Reports', path: '/admin/reports', roles: ['owner'] },
        { label: 'Settings', path: '/admin/settings', roles: ['owner'] },
        { label: 'Support Inbox', path: '/admin/support', roles: ['owner', 'manager'] },
        { label: 'System Check', path: '/admin/system-check', roles: ['owner'] },
        { label: 'Environment Status', path: '/admin/env-status', roles: ['owner'], badge: 'Live' },
        { label: 'Users & Audit', path: '/admin/users', roles: ['owner'] },
        { label: 'Webhook Log', path: '/admin/webhook-log', roles: ['owner'] },
      ],
    },
  ];

  const handleSignOut = async (reason?: string) => {
    sessionStorage.removeItem('pynotes_admin_session');
    localStorage.removeItem('pynotes_staff_user');
    sessionStorage.clear();
    setProfile(null);
    if (reason && typeof reason === 'string') {
      setLoginError(reason);
    }
    try {
      await signOutUser();
    } catch {}
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#0B3561] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#071E38] text-white p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="bg-white px-2 py-1 rounded-xl shadow-xs">
            <Logo size="sm" />
          </div>
          <span className="bg-[#12A5B0]/20 text-[#12A5B0] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell {...notifState} />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-semibold cursor-pointer">
            Menu
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-68 bg-[#071E38] text-white flex-shrink-0 p-5 flex flex-col justify-between border-r border-white/5 ${sidebarOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="space-y-4">
          {/* Logo & Store Info */}
          <div className="bg-[#0B3561]/60 p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow-xs flex-shrink-0">
              <Logo size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-black text-sm text-white tracking-tight flex items-center gap-1.5 truncate">
                <span>PyNotes</span>
                <span className="bg-[#FFD54A] text-[#071E38] text-[9px] font-heading font-extrabold px-1.5 py-0.2 rounded-sm">ADMIN</span>
              </div>
              <span className="text-[10px] font-mono text-[#DDF3F4]/70 uppercase tracking-wider block mt-0.5">
                Role: <strong className="text-[#12A5B0]">{role}</strong>
              </span>
            </div>
          </div>

          {/* Tab Filter Search Box */}
          <div className="relative">
            <input
              type="text"
              value={tabSearch}
              onChange={e => setTabSearch(e.target.value)}
              placeholder="Search admin tabs..."
              className="w-full bg-[#041224] text-xs text-white placeholder-white/40 px-3 py-2 pl-7 rounded-xl border border-white/10 focus:outline-none focus:border-[#12A5B0] transition"
            />
            <span className="absolute left-2.5 top-2.5 text-[11px] text-white/40">🔍</span>
            {tabSearch && (
              <button
                onClick={() => setTabSearch('')}
                className="absolute right-2.5 top-2 text-[10px] text-white/50 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Grouped Navigation Links */}
          <nav className="space-y-4 font-heading text-xs max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {adminNavGroups.map(group => {
              const visibleItems = group.items
                .filter(item => item.roles.includes(role))
                .filter(item => !tabSearch.trim() || item.label.toLowerCase().includes(tabSearch.toLowerCase()));

              if (visibleItems.length === 0) return null;

              return (
                <div key={group.groupName} className="space-y-1">
                  {/* Group Header */}
                  <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-[#DDF3F4]/50 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span>{group.icon}</span>
                      <span>{group.groupName}</span>
                    </span>
                    <span className="text-[9px] bg-white/5 px-1.5 py-0.2 rounded-full font-mono text-[#DDF3F4]/40">
                      {visibleItems.length}
                    </span>
                  </div>

                  {/* Group Items (Alphabetical) */}
                  <div className="space-y-0.5">
                    {visibleItems.map(item => {
                      const isActive = location.pathname === item.path ||
                        (item.path !== '/admin' && location.pathname.startsWith(item.path));

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                            isActive
                              ? 'bg-[#12A5B0] text-[#071E38] font-bold shadow-xs'
                              : 'text-[#DDF3F4] hover:bg-white/10 font-medium'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                              isActive ? 'bg-[#071E38] text-[#FFD54A]' : 'bg-[#FFD54A]/20 text-[#FFD54A]'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2 mt-auto">
          <Link
            to="/"
            target="_blank"
            className="text-xs text-[#12A5B0] font-bold flex items-center justify-between hover:underline px-2 py-1.5 rounded-lg hover:bg-white/5"
          >
            <span>Live Storefront</span>
            <span>↗</span>
          </Link>
          <button
            onClick={() => handleSignOut()}
            className="w-full text-left text-xs font-bold text-[#FF6B6B] hover:text-red-300 transition cursor-pointer flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-red-500/10"
          >
            <span>🚪</span> Sign Out Staff
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto min-h-screen bg-[#F7FAFC]">
        {/* Admin Top Header Bar */}
        <div className="bg-white p-4 sm:px-6 sm:py-3.5 rounded-2xl border border-[#0B3561]/10 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#0B3561]/10 text-[#0B3561] font-heading font-bold px-3 py-1 rounded-xl uppercase tracking-wider text-[11px]">
              {location.pathname.replace('/admin/', '').replace('/admin', 'Dashboard') || 'Dashboard'}
            </span>
            <span className="text-[#3C5D81] hidden sm:inline">•</span>
            <span className="text-[#3C5D81] text-[11px]">
              Logged in as <strong className="text-[#0B3561]">{profile?.email}</strong> ({profile?.role})
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Real-time Notification Bell */}
            <NotificationBell {...notifState} />

            <Link
              to="/"
              target="_blank"
              className="text-[11px] font-bold text-[#12A5B0] hover:underline bg-[#DDF3F4]/50 px-3 py-1.5 rounded-xl border border-[#12A5B0]/20"
            >
              Storefront Preview ↗
            </Link>
            <button
              onClick={() => handleSignOut()}
              className="px-3 py-1.5 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200 hover:bg-red-100 transition cursor-pointer text-[11px]"
            >
              Sign Out
            </button>
          </div>
        </div>

        <Outlet context={{ profile, role, ...notifState }} />
      </main>
    </div>
  );
};
