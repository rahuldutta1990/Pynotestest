import React, { useState } from 'react';
import { InnerPageBanner } from '../components/InnerPageBanner';
import { AbstractShapes } from '../components/AbstractShapes';

export const SubscriptionPage: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState('UPSC / State PSC');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const EXAMS = ['UPSC / State PSC', 'SSC CGL / CHSL', 'Banking & IBPS', 'Railway (RRB NTPC / JE)', 'All Exams Master Pass'];

  const PLANS = [
    {
      id: 'monthly_ca',
      name: 'Monthly Current Affairs',
      monthlyPrice: 199,
      yearlyPrice: 149, // per month billed annually
      desc: 'Monthly PDF, daily & weekly quizzes, and concise one-page monthly current affairs capsules.',
      features: [
        'Monthly Current Affairs PDF (Eng & Hindi)',
        'Daily & Weekly Current Affairs Quizzes',
        'One-Page Quick Revision Capsules',
        'Last 3 Months Back Issues Access',
        'Email Streak & Daily Quiz Counter',
      ],
      razorpayLink: 'https://rzp.io/rzp/TiksPhvI',
    },
    {
      id: 'exam_pass',
      name: 'Target Exam Pass',
      monthlyPrice: 599,
      yearlyPrice: 399, // per month billed annually
      desc: 'Comprehensive current affairs, subject notes, test series, and previous-year papers for your chosen exam.',
      features: [
        'Everything in Monthly Current Affairs',
        'Complete Subject Notes (Polity, History, Economy, etc.)',
        'Exam-Specific Test Series & Mock Tests',
        'Previous-Year Question (PYQ) Topic Mapping',
        'Last 1 Year Full Archive & Watermarked PDFs',
      ],
      razorpayLink: 'https://rzp.io/rzp/TiksPhvI',
    },
    {
      id: 'all_access',
      name: 'All-Access Master Pass',
      monthlyPrice: 1299,
      yearlyPrice: 799, // per month billed annually
      desc: 'Unlimited access to all govt exam tracks, complete test series banks, and priority mentor sessions.',
      features: [
        'Access to ALL Exam Tracks (UPSC, SSC, Banking, Railway)',
        'Full Lifetime Archive & Monthly Mock Tests',
        'Bilingual English & Hindi PDF Downloads',
        'Personalized Student Dashboard & Streak Tracker',
        'Priority Support & WhatsApp Updates',
      ],
      razorpayLink: 'https://rzp.io/rzp/TiksPhvI',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#0B3561] relative overflow-hidden">
      <AbstractShapes />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-12 relative z-10 w-full space-y-12">
        <div className="text-center space-y-3 pt-6">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#0B3561]">Govt Exam Prep & Current Affairs Subscriptions</h1>
          <p className="font-body text-sm text-[#3C5D81] max-w-2xl mx-auto">Crack UPSC, SSC, Banking, and State PSC with structured notes, daily quizzes, and autopay passes.</p>
        </div>
        
        {/* EXAM TRACK SELECTOR */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/12 shadow-sm space-y-4 text-center">
          <span className="text-xs font-heading font-bold text-[#12A5B0] uppercase tracking-wider block">
            Step 1: Choose Your Target Exam Track
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {EXAMS.map(exam => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className={`px-5 py-2.5 rounded-2xl font-heading font-bold text-xs sm:text-sm transition-all shadow-xs ${
                  selectedExam === exam
                    ? 'bg-[#0B3561] text-[#FFD54A] shadow-md scale-105'
                    : 'bg-[#F7FAFC] text-[#0B3561] hover:bg-[#DDF3F4]'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>

          {/* BILLING CYCLE TOGGLE */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-[#0B3561]' : 'text-[#3C5D81]'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'yearly' ? 'monthly' : 'yearly')}
              className="w-14 h-8 bg-[#0B3561] rounded-full p-1 transition relative shadow-inner"
            >
              <div
                className={`w-6 h-6 bg-[#FFD54A] rounded-full shadow-md transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-[#0B3561]' : 'text-[#3C5D81]'}`}>
              Yearly Billing <span className="bg-[#12A5B0]/20 text-[#12A5B0] px-2 py-0.5 rounded text-[10px]">Save 35%</span>
            </span>
          </div>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map(plan => {
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`bg-white p-8 rounded-3xl border-2 shadow-xl flex flex-col justify-between space-y-6 relative transition-all duration-300 ${
                  selectedPlan === plan.id ? 'border-[#12A5B0] scale-102 ring-4 ring-[#12A5B0]/20' : 'border-[#0B3561]/12 hover:border-[#12A5B0]/50'
                }`}
              >
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="font-heading font-bold text-xl text-[#0B3561]">{plan.name}</h3>
                    <p className="font-body text-xs text-[#3C5D81] min-h-[36px]">{plan.desc}</p>
                  </div>

                  <div className="text-center py-4 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/10">
                    <span className="font-display font-black text-4xl text-[#0B3561]">₹{price}</span>
                    <span className="text-xs text-[#3C5D81] font-medium"> / month</span>
                    <p className="text-[10px] text-[#12A5B0] font-bold mt-1">
                      {billingCycle === 'yearly' ? `Billed annually (Target Exam: ${selectedExam})` : 'Billed monthly with 7-day trial'}
                    </p>
                  </div>

                  <ul className="space-y-3 text-xs font-body text-[#0B3561]">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#12A5B0] font-bold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#0B3561]/10">
                  <a
                    href={plan.razorpayLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#0B3561] hover:bg-[#071E38] text-white font-heading font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                  >
                    <span>Start 7-Day Free Trial ⚡</span>
                  </a>
                  <p className="text-[10px] text-center text-[#3C5D81]">
                    Secured by Razorpay Autopay • Cancel anytime from dashboard
                  </p>
                </div>
              </div>
            );
          })}
        </div>

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
