import React, { useState, useEffect } from 'react';
import { InnerPageBanner } from '../components/InnerPageBanner';
import { AbstractShapes } from '../components/AbstractShapes';
import { fetchPlans, startSubscription } from '../lib/api';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans().then(setPlans).finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (plan: any) => {
    if (!auth.currentUser) {
      navigate('/auth?redirect=/subscription');
      return;
    }

    setSubmitting(plan.razorpay_plan_id);
    setError(null);

    try {
      const { subscription_id, razorpay_key_id } = await startSubscription(plan.razorpay_plan_id);
      
      const trialEndDate = new Date(Date.now() + (plan.trial_days || 7) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const options = {
        key: razorpay_key_id,
        subscription_id: subscription_id,
        name: 'PyNotes',
        description: `${plan.name} - ${plan.trial_days || 7}-Day Trial`,
        image: '/logo-square.png',
        handler: function (response: any) {
          // Signature verification happens via webhook, but we can redirect now
          navigate('/account?sub=success');
        },
        prefill: {
          name: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
        },
        theme: {
          color: '#0B3561',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Failed to start subscription');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#0B3561] relative overflow-hidden">
      <SEO 
        title="Subscriptions" 
        description="Premium handwritten notes and current affairs subscriptions for govt exam preparation. Start your 7-day free trial." 
        keywords="UPSC, SSC, Banking, PSC, Current Affairs, Handwritten Notes"
      />
      <AbstractShapes />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-12 relative z-10 w-full space-y-12">
        <div className="text-center space-y-3 pt-6">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#0B3561]">Govt Exam Prep & Current Affairs Subscriptions</h1>
          <p className="font-body text-sm text-[#3C5D81] max-w-2xl mx-auto">Crack UPSC, SSC, Banking, and State PSC with structured notes, daily quizzes, and autopay passes.</p>
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-bold text-center">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#12A5B0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map(plan => {
              const trialEnd = new Date(Date.now() + (plan.trial_days || 7) * 24 * 60 * 60 * 1000);
              return (
                <div
                  key={plan.razorpay_plan_id}
                  className="bg-white p-8 rounded-3xl border-2 border-[#0B3561]/12 shadow-xl flex flex-col justify-between space-y-6 relative transition-all duration-300 hover:border-[#12A5B0]/50"
                >
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <div className="inline-block px-3 py-1 bg-[#12A5B0]/10 text-[#12A5B0] rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                        {plan.category}
                      </div>
                      <h3 className="font-heading font-bold text-xl text-[#0B3561]">{plan.name}</h3>
                      <p className="font-body text-xs text-[#3C5D81] min-h-[36px]">
                        {plan.features?.slice(0, 1).join('') || 'Full access to exam materials.'}
                      </p>
                    </div>

                    <div className="text-center py-4 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/10">
                      <div className="text-[10px] font-black text-[#12A5B0] uppercase tracking-tighter mb-1">
                        {plan.trial_days || 7}-Day Free Trial Included
                      </div>
                      <span className="font-display font-black text-4xl text-[#0B3561]">₹{plan.amount_paise / 100}</span>
                      <span className="text-xs text-[#3C5D81] font-medium"> / {plan.period}</span>
                      <p className="text-[10px] text-[#3C5D81] font-bold mt-1">
                        Cancel anytime before {trialEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, and you will not be charged.
                      </p>
                    </div>

                    <ul className="space-y-3 text-xs font-body text-[#0B3561]">
                      {plan.features?.map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#12A5B0] font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#0B3561]/10">
                    <div className="text-[9px] text-[#3C5D81] leading-tight text-center px-2">
                      I authorise automatic recurring debit of ₹{plan.amount_paise / 100} on {trialEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} unless I cancel before then.
                    </div>
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={submitting === plan.razorpay_plan_id}
                      className="w-full bg-[#0B3561] hover:bg-[#071E38] text-white font-heading font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                    >
                      {submitting === plan.razorpay_plan_id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Start Free Trial ⚡</span>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-[#3C5D81]">
                      Secured by Razorpay Autopay • Cards & UPI Supported
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VALUE ADDITIONS BANNER */}
        <div className="bg-[#071E38] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#12A5B0]/30 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl">🔥</div>
            <h4 className="font-heading font-bold text-sm text-[#FFD54A]">Daily Streak Quizzes</h4>
            <p className="text-xs text-[#DDF3F4]/80">Keep your exam preparation sharp with streak counters & instant feedback.</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🌐</div>
            <h4 className="font-heading font-bold text-sm text-[#FFD54A]">Bilingual Editions</h4>
            <p className="text-xs text-[#DDF3F4]/80">All current affairs & notes available in both English and Hindi.</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🎯</div>
            <h4 className="font-heading font-bold text-sm text-[#FFD54A]">Exam-Wise Tagging</h4>
            <p className="text-xs text-[#DDF3F4]/80">Precisely tagged for SSC CGL, UPSC Prelims, Banking PO, and Railways.</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">📥</div>
            <h4 className="font-heading font-bold text-sm text-[#FFD54A]">Watermarked Security</h4>
            <p className="text-xs text-[#DDF3F4]/80">Personalized secure PDFs tied to your account credentials.</p>
          </div>
        </div>

      </main>
    </div>
  );
};
