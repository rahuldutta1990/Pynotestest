import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { auth, signOutUser, signInUser } from '../lib/firebase';
import { adminFetch } from '../lib/api';
import { UserProfile } from '../types';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login form state (declared unconditionally at top level to satisfy React Rules of Hooks)
  const [email, setEmail] = useState('admin@pynotes.in');
  const [password, setPassword] = useState('Admin@123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Check local staff session first
      const savedStaff = localStorage.getItem('pynotes_staff_user');
      if (savedStaff) {
        try {
          const parsed = JSON.parse(savedStaff);
          if (parsed && parsed.email) {
            setProfile(parsed);
            setLoading(false);
            return;
          }
        } catch {}
      }

      try {
        const me = await adminFetch('/me');
        if (!me.role || me.role === 'customer') {
          setErrorMsg('Access denied: You do not have staff permissions.');
        } else {
          setProfile(me);
          localStorage.setItem('pynotes_staff_user', JSON.stringify(me));
        }
      } catch (err: any) {
        console.warn('Admin access check notice:', err);
      } finally {
        setLoading(false);
      }
    };
    checkAdminAccess();
  }, [auth.currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setSubmitting(true);
    try {
      // Try backend pre-stored database login endpoint first
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem('pynotes_staff_user', JSON.stringify(data.user));
        setProfile(data.user);
        return;
      }

      // Try Firebase client fallback sign-in
      try {
        await signInUser(email, password);
        const me = await adminFetch('/me');
        if (me && me.role && me.role !== 'customer') {
          localStorage.setItem('pynotes_staff_user', JSON.stringify(me));
          setProfile(me);
          return;
        }
      } catch {}

      throw new Error(data.error || 'Invalid admin credentials or unauthorized email.');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Check your staff credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071E38] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#12A5B0] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-heading text-xs">Verifying Staff Privileges...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#071E38] text-white flex items-center justify-center p-6">
        <div className="bg-[#0B3561] p-8 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl text-white">Staff Admin Login</h2>
            <p className="text-xs text-[#DDF3F4]/80">
              Enter your pre-stored staff email and password.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-[#DDF3F4]">Staff Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="devrd720@gmail.com or admin@pynotes.in"
                className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#DDF3F4]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin@123"
                className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white"
              />
            </div>

            {loginError && <p className="text-[#C0392B] font-bold">{loginError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3.5 rounded-xl hover:brightness-105 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center space-y-1">
            <p className="text-[11px] font-bold text-[#FFD54A]">Pre-Stored Admin Emails:</p>
            <p className="text-[10px] text-[#DDF3F4]/90 font-mono">devrd720@gmail.com • admin@pynotes.in • shimadutta62@gmail.com</p>
            <p className="text-[10px] text-white/70 font-mono">Password: Admin@123</p>
          </div>
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

  const menuItems = [
    { label: 'Announcement Bar', path: '/admin/announcements', roles: ['owner', 'editor'] },
    { label: 'Hero Banners', path: '/admin/hero-banners', roles: ['owner', 'editor'] },
    { label: 'Products', path: '/admin/product-list', roles: ['owner', 'manager'] },
    { label: 'Orders & Logistics', path: '/admin/orders', roles: ['owner', 'manager'] },
    { label: 'Status Mappings', path: '/admin/status-mappings', roles: ['owner', 'manager'] },
    { label: 'Logistics Reports & Tests', path: '/admin/logistics-reports', roles: ['owner'] },
    { label: 'Courier Webhooks', path: '/admin/courier-webhooks', roles: ['owner'] },
    { label: 'Dashboard', path: '/admin', roles: ['owner', 'manager'] },
    { label: 'Inventory & Reconcile', path: '/admin/inventory', roles: ['owner', 'manager'] },
    { label: 'Subjects', path: '/admin/subjects', roles: ['owner', 'manager'] },
    { label: 'Coupons', path: '/admin/coupons', roles: ['owner', 'manager'] },
    { label: 'Pricing & Offers', path: '/admin/pricing', roles: ['owner', 'manager'] },
    { label: 'Content CMS', path: '/admin/content', roles: ['owner', 'editor'] },
    { label: 'Testimonials & Reviews', path: '/admin/reviews', roles: ['owner', 'manager', 'editor'] },
    { label: 'FAQ & Policy Pages', path: '/admin/pages', roles: ['owner', 'editor'] },
    { label: 'Support Inbox', path: '/admin/support', roles: ['owner', 'manager'] },
    { label: 'Reports', path: '/admin/reports', roles: ['owner'] },
    { label: 'System Check', path: '/admin/system-check', roles: ['owner'] },
    { label: 'Special Offers', path: '/admin/offers', roles: ['owner', 'manager', 'editor'] },
    { label: 'Subscription Plans & Hub', path: '/admin/subscriptions', roles: ['owner', 'manager'] },
    { label: 'Cancellations', path: '/admin/cancellations', roles: ['owner', 'manager'] },
    { label: 'Instagram Feed API', path: '/admin/instagram', roles: ['owner', 'editor'] },
    { label: 'Razorpay Payments', path: '/admin/payments', roles: ['owner'] },
    { label: 'Payment Page & QR', path: '/admin/payment-page', roles: ['owner', 'manager'] },
    { label: 'Webhook Log', path: '/admin/webhook-log', roles: ['owner'] },
    { label: 'Store Logo & Branding', path: '/admin/logo', roles: ['owner', 'manager', 'editor'] },
    { label: 'Settings', path: '/admin/settings', roles: ['owner'] },
    { label: 'Users & Audit', path: '/admin/users', roles: ['owner'] },
  ];

  const handleSignOut = async () => {
    localStorage.removeItem('pynotes_staff_user');
    sessionStorage.clear();
    setProfile(null);
    try {
      await signOutUser();
    } catch {}
    navigate('/admin');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#0B3561] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#071E38] text-white p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-lg text-white">Py<span className="text-[#12A5B0]">Notes</span></span>
          <span className="bg-[#12A5B0]/20 text-[#12A5B0] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-semibold">
          Menu
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 bg-[#071E38] text-white flex-shrink-0 p-6 flex flex-col justify-between ${sidebarOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="space-y-6">
          <div>
            <div className="font-display font-black italic text-2xl text-white">
              Py<span className="text-[#12A5B0]">Notes</span> <span className="text-xs font-normal text-[#FFD54A]">Admin</span>
            </div>
            <span className="text-[10px] font-heading font-semibold text-[#DDF3F4]/60 uppercase tracking-widest block mt-1">
              Role: {role.toUpperCase()}
            </span>
          </div>

          <nav className="space-y-1 font-heading text-xs font-semibold max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {menuItems
              .filter(item => item.roles.includes(role))
              .map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl transition ${
                    location.pathname === item.path
                      ? 'bg-[#12A5B0] text-[#071E38] font-bold shadow-xs'
                      : 'text-[#DDF3F4] hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <Link to="/" target="_blank" className="text-xs text-[#12A5B0] font-bold block hover:underline">
            View Live Storefront ↗
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left text-xs font-bold text-[#FF6B6B] hover:text-red-400 transition cursor-pointer flex items-center gap-1.5"
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
            <Link
              to="/"
              target="_blank"
              className="text-[11px] font-bold text-[#12A5B0] hover:underline bg-[#DDF3F4]/50 px-3 py-1.5 rounded-xl border border-[#12A5B0]/20"
            >
              Storefront Preview ↗
            </Link>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200 hover:bg-red-100 transition cursor-pointer text-[11px]"
            >
              Sign Out
            </button>
          </div>
        </div>

        <Outlet context={{ profile, role }} />
      </main>
    </div>
  );
};
