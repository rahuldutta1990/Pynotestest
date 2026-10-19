import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInUser, registerUser, auth } from '../lib/firebase';
import { adminFetch } from '../lib/api';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLoginParam = searchParams.get('mode') !== 'signup';
  const [isLogin, setIsLogin] = useState(isLoginParam);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInUser(email, password);
      } else {
        const userCred = await registerUser(email, password);
        // Create user profile in Firestore via a proxy or direct if rules allow
        // Here we use a server call to ensure the user is registered in our 'users' collection with 'customer' role
        const token = await userCred.user.getIdToken();
        await fetch('/api/me', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F7FAFC]">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[2.5rem] border border-[#0B3561]/10 shadow-2xl space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <h1 className="font-heading font-black text-3xl text-[#0B3561]">
            {isLogin ? 'Welcome Back' : 'Join PyNotes'}
          </h1>
          <p className="font-body text-sm text-[#3C5D81]">
            {isLogin ? 'Sign in to access your notes and orders' : 'Create an account to start your learning journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Rahul Dutta"
                className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0] focus:ring-4 focus:ring-[#12A5B0]/5 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="rahul@example.com"
              className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0] focus:ring-4 focus:ring-[#12A5B0]/5 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0] focus:ring-4 focus:ring-[#12A5B0]/5 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-xs font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B3561] text-[#FFD54A] font-heading font-black py-4 rounded-2xl text-sm hover:bg-[#071E38] transition-all shadow-lg hover:shadow-[#0B3561]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-[#12A5B0] hover:underline transition-all"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};
