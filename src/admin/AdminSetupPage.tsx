import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from '../lib/firebase';
import { adminFetch } from '../lib/api';

export const AdminSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [setupCode, setSetupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('Please sign in with Google first.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
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
            One-time owner bootstrap. Enter the OWNER_SETUP_CODE secret to claim the Owner role for your Google account.
          </p>
        </div>

        {!auth.currentUser ? (
          <button
            onClick={async () => {
              await signInWithGoogle();
              window.location.reload();
            }}
            className="w-full bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3.5 rounded-xl hover:brightness-105 shadow-md text-xs"
          >
            Step 1: Sign In with Google
          </button>
        ) : (
          <form onSubmit={handleClaim} className="space-y-4">
            <div className="bg-white/10 p-3 rounded-xl text-xs text-[#DDF3F4]">
              Signed in as: <span className="font-bold text-white">{auth.currentUser.email}</span>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-[#DDF3F4] mb-1">
                Enter OWNER_SETUP_CODE Secret *
              </label>
              <input
                type="password"
                required
                value={setupCode}
                onChange={e => setSetupCode(e.target.value)}
                placeholder="e.g. pynotes-admin-123"
                className="w-full px-4 py-3 bg-[#071E38] border border-white/20 rounded-xl text-xs text-white font-mono"
              />
            </div>

            {error && <p className="text-xs text-[#C0392B] font-bold">{error}</p>}
            {msg && <p className="text-xs text-[#13834D] font-bold">{msg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD54A] text-[#071E38] font-heading font-bold py-3.5 rounded-xl text-xs hover:brightness-105 shadow-md disabled:opacity-50"
            >
              {loading ? 'Claiming Owner Role...' : 'Step 2: Claim Store Owner Role'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
