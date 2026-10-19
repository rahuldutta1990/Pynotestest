import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, registerStaff } from '../lib/firebase';
import { adminFetch } from '../lib/api';

export const AdminSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterAndClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // 1. Create or sign in staff account with email/password
      try {
        await registerStaff(email, password);
      } catch (regErr: any) {
        // If user already exists, try sign in or proceed if already logged in
        if (!auth.currentUser) {
          throw regErr;
        }
      }

      // 2. Claim owner role
      const res = await adminFetch('/setup-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup_code: setupCode }),
      });
      setMsg(res.message || 'Congratulations! You are now the store Owner.');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err: any) {
      setError(err.message || 'Claim failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071E38] text-white flex items-center justify-center p-6">
      <div className="bg-[#0B3561] p-8 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-heading font-bold text-2xl text-[#FFD54A]">Claim Store Ownership</h2>
          <p className="text-xs text-[#DDF3F4]/80">
            One-time owner bootstrap. Enter your staff email, password, and the OWNER_SETUP_CODE secret to claim the Owner role.
          </p>
        </div>

        <form onSubmit={handleRegisterAndClaim} className="space-y-4 text-xs">
          {auth.currentUser && (
            <div className="bg-white/10 p-3 rounded-xl text-[#DDF3F4]">
              Currently signed in as: <span className="font-bold text-white">{auth.currentUser.email}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1 text-[#DDF3F4]">Staff Admin Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="owner@handwrittencode.com"
              className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#DDF3F4]">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#DDF3F4]">OWNER_SETUP_CODE Secret *</label>
            <input
              type="password"
              required
              value={setupCode}
              onChange={e => setSetupCode(e.target.value)}
              placeholder="e.g. pynotes-admin-setup"
              className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-white font-mono"
            />
          </div>

          {error && <p className="text-[#C0392B] font-bold">{error}</p>}
          {msg && <p className="text-[#13834D] font-bold">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD54A] text-[#071E38] font-heading font-bold py-3.5 rounded-xl hover:brightness-105 shadow-md disabled:opacity-50"
          >
            {loading ? 'Claiming Owner Role...' : 'Register & Claim Store Owner'}
          </button>
        </form>
      </div>
    </div>
  );
};
