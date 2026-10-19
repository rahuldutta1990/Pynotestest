import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { signInUser, registerUser, auth, resetPassword, sendVerification } from '../lib/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { InnerPageBanner } from '../components/InnerPageBanner';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLoginParam = searchParams.get('mode') !== 'signup';
  const isVerify = searchParams.get('mode') === 'verify';
  const [isLogin, setIsLogin] = useState(isLoginParam || isVerify);
  const [showForgot, setShowForgot] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91');
  const [address, setAddress] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const validatePassword = (pass: string) => {
    // max 8 (1 uppercase, 1 lowercase, 1 special character)
    if (pass.length > 8) return "Password must be maximum 8 characters.";
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    if (!hasUpper || !hasLower || !hasSpecial) {
      return "Password must contain at least 1 uppercase, 1 lowercase, and 1 special character.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const passError = validatePassword(password);
      if (passError) {
        setError(passError);
        return;
      }
      if (!email.includes('@')) {
        setError("Enter a valid email ID.");
        return;
      }
      const phoneClean = phone.replace(/\s+/g, '');
      if (!/^\+91\d{10}$/.test(phoneClean)) {
        setError("Enter phone number in +91 followed by 10 digits format.");
        return;
      }
    }

    setLoading(true);

    try {
      if (showForgot) {
        await resetPassword(email);
        setSuccessMsg("Password reset link sent to your email!");
        setShowForgot(false);
      } else if (isLogin) {
        const userCred = await signInUser(email, password);
        if (!userCred.user.emailVerified) {
          setError("Please verify your email before logging in. Check your inbox for the activation link.");
          await signOut(auth); // Log them out if not verified
          return;
        }
        const redirect = searchParams.get('redirect') || '/account';
        navigate(redirect);
      } else {
        const userCred = await registerUser(email, password);
        // Send verification email
        try {
          await sendEmailVerification(userCred.user);
        } catch (vErr) {
          console.error("Verification mail failed:", vErr);
        }
        
        const token = await userCred.user.getIdToken();
        // Initialize profile with all data
        await fetch('/api/me', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            name, 
            phone, 
            shipping_address: {
              line1: address,
              city: '',
              state: '',
              pincode: ''
            }
          })
        });
        
        setSuccessMsg("Account created! Please check your email and click the activation link to verify your profile.");
        setIsLogin(true); // Switch to login mode
        setEmail(email);
        setPassword('');
        // We don't navigate yet, they need to verify
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const bannerTitle = isVerify ? 'Activate Profile' : (isLogin ? 'Sign In' : 'Create Account');

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <InnerPageBanner 
        title={bannerTitle} 
        subtitle={isLogin ? "Welcome back to the PyNotes family." : "Join thousands of students learning through handwritten notes."} 
      />

      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[2.5rem] border border-[#0B3561]/10 shadow-2xl space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-black text-2xl text-[#0B3561]">
              {showForgot ? 'Forgot Password?' : (isVerify ? 'Activate Your Account' : (isLogin ? 'Welcome Back' : 'Join PyNotes'))}
            </h2>
            <p className="font-body text-sm text-[#3C5D81]">
              {showForgot 
                ? 'Enter your email to receive a secure reset link.' 
                : (isVerify ? 'You need to verify your email to continue.' : (isLogin ? 'Sign in to access your notes and orders' : 'Create an account to start your learning journey'))}
            </p>
          </div>

          {isVerify && !successMsg && !error && (
            <div className="bg-yellow-50 text-yellow-700 p-6 rounded-2xl text-xs font-bold border border-yellow-100 text-center space-y-3">
              <p>Account Activation Required</p>
              <p className="font-medium text-[10px]">We've sent a link to your email. Please click it to activate your profile and access this page.</p>
              <button 
                onClick={() => navigate('/auth?mode=login')}
                className="text-[#0B3561] underline"
              >
                Already verified? Sign In
              </button>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-xs font-bold border border-green-100 text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !showForgot && (
              <div>
                <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">1. Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0] focus:ring-4 focus:ring-[#12A5B0]/5 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">{isLogin ? 'Email ID *' : '2. Email ID *'}</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email ID"
                className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0] focus:ring-4 focus:ring-[#12A5B0]/5 transition-all"
              />
            </div>

            {!isLogin && !showForgot && (
              <div>
                <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">3. Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0] focus:ring-4 focus:ring-[#12A5B0]/5 transition-all"
                />
              </div>
            )}

            {!showForgot && (
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="text-xs font-heading font-bold text-[#0B3561]">
                    {isLogin ? 'Enter your password. *' : '4. Enter your password. *'}
                  </label>
                  {isLogin && (
                    <button 
                      type="button" 
                      onClick={() => setShowForgot(true)}
                      className="text-[10px] font-bold text-[#12A5B0] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password."
                    className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0] focus:ring-4 focus:ring-[#12A5B0]/5 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3C5D81] hover:text-[#0B3561]"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-[9px] text-[#3C5D81] mt-1 ml-1 font-medium">Max 8 characters. Must have Uppercase, Lowercase & Special char.</p>
                )}
              </div>
            )}

            {!isLogin && !showForgot && (
              <>
                <div>
                  <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">5. Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0] focus:ring-4 focus:ring-[#12A5B0]/5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3C5D81] hover:text-[#0B3561]"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold text-[#0B3561] mb-1.5 ml-1">6. Address *</label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Address"
                    className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0] focus:ring-4 focus:ring-[#12A5B0]/5 transition-all"
                  />
                </div>
              </>
            )}

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
              {loading ? 'Processing...' : (showForgot ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account'))}
            </button>
          </form>

          <div className="text-center pt-2 space-y-3">
            <button
              onClick={() => {
                if (showForgot) {
                  setShowForgot(false);
                } else {
                  setIsLogin(!isLogin);
                }
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-xs font-bold text-[#12A5B0] hover:underline transition-all"
            >
              {showForgot ? "Back to Login" : (isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
