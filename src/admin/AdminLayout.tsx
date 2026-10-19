import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle, signOutUser } from '../lib/firebase';
import { adminFetch } from '../lib/api';
import { UserProfile } from '../types';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        const me = await adminFetch('/me');
        if (!me.role || me.role === 'customer') {
          setErrorMsg('Access denied: You do not have staff permissions.');
        } else {
          setProfile(me);
        }
      } catch (err: any) {
        setErrorMsg('Failed to verify admin credentials. Please run /admin/setup if owner is unassigned.');
      } finally {
        setLoading(false);
      }
    };
    checkAdminAccess();
  }, [auth.currentUser]);

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

  if (!auth.currentUser) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      setSubmitting(true);
      try {
        await signInStaff(email, password);
        window.location.reload();
      } catch (err: any) {
        setLoginError(err.message || 'Login failed. Check your staff credentials.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#071E38] text-white flex items-center justify-center p-6">
        <div className="bg-[#0B3561] p-8 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl text-white">Staff Admin Login</h2>
            <p className="text-xs text-[#DDF3F4]/80">
              Enter your authorized staff email and password.
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
                placeholder="admin@pynotes.in"
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
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white"
              />
            </div>

            {loginError && <p className="text-[#C0392B] font-bold">{loginError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3.5 rounded-xl hover:brightness-105 shadow-md disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In as Staff'}
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 text-center">
            <Link to="/admin/setup" className="text-xs text-[#FFD54A] font-bold hover:underline">
              First time? Run /admin/setup to claim store ownership ↗
            </Link>
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
    { label: 'Orders', path: '/admin/orders', roles: ['owner', 'manager'] },
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
    { label: 'Settings', path: '/admin/settings', roles: ['owner'] },
    { label: 'Users & Audit', path: '/admin/users', roles: ['owner'] },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#0B3561] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#071E38] text-white p-4 flex items-center justify-between border-b border-white/10">
        <span className="font-heading font-bold text-sm text-[#12A5B0]">PyNotes Admin</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 border border-white/20 rounded-lg text-xs">
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

          <nav className="space-y-1 font-heading text-xs font-semibold">
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
            onClick={() => signOutUser().then(() => window.location.reload())}
            className="w-full text-left text-xs font-bold text-[#C0392B] hover:underline"
          >
            Sign Out Staff
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet context={{ profile, role }} />
      </main>
    </div>
  );
};
