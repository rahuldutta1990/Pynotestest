import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { SiteSettings } from '../types';
import { subscribeNewsletter } from '../lib/api';
import { UPIIcon, GooglePayIcon, PhonePeIcon, VisaIcon, MastercardIcon, RuPayIcon } from './PaymentIcons';

interface FooterProps {
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const legalName = settings?.legal_name || 'PyNotes India Ltd.';
  const aboutText =
    settings?.footer_about ||
    'PyNotes brings printed, colorful handwritten coding notes to students across India. Handcrafted by engineers for real understanding, conceptual clarity, and fast exam revision.';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid student email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setMessage('✓ You are subscribed! Watch your inbox for free sample pages and discount alerts.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="bg-[#070F1E] text-white pt-14 pb-8 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* NEWSLETTER SUBSCRIPTION SECTION */}
        <div className="bg-gradient-to-r from-[#0B3561] via-[#132742] to-[#0B3561] rounded-2xl p-7 sm:p-9 border border-[#12A5B0]/20 shadow-2xl relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent, transparent 23px, #ffffff 23px, #ffffff 24px)',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Newsletter Text Column */}
            <div className="lg:col-span-6 space-y-2">
              <span className="inline-block bg-[#12A5B0]/20 text-[#F59E0B] font-heading font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-[#12A5B0]/30">
                STAY IN THE LOOP
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                Never Miss a New Subject Book or Revision Kit!
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#BCCCDC] leading-relaxed">
                Subscribe for free sample chapter PDFs, semester exam cheat-sheets, and instant alerts when new batches print.
              </p>
            </div>

            {/* Newsletter Form Column */}
            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your student email..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#12A5B0] focus:ring-2 focus:ring-[#12A5B0]/30 backdrop-blur-xs font-medium"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#12A5B0] text-white font-heading font-bold text-xs sm:text-sm px-6 py-3 rounded-xl hover:bg-[#B45309] transition shadow-md flex-shrink-0 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === 'loading' ? (
                    'Subscribing...'
                  ) : (
                    <>
                      <span>Get Free Samples</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {message && (
                <p
                  className={`text-xs font-heading font-semibold mt-2.5 ${
                    status === 'success' ? 'text-[#34D399]' : 'text-[#FCD34D]'
                  }`}
                >
                  {message}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* FOOTER COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Column 1: Brand */}
          <div className="md:col-span-2 flex flex-col items-start gap-3.5 pr-4">
            <Logo variant="horizontal" surface="dark" customUrl={settings?.custom_logo_url} size="md" />
            <p className="font-body text-xs text-[#BCCCDC] leading-relaxed max-w-md">
              {aboutText}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] text-[#BCCCDC]/70 uppercase font-mono tracking-wider">
                Support:
              </span>
              <a
                href="mailto:support@pynotes.in"
                className="text-xs text-[#F59E0B] hover:underline font-mono"
              >
                support@pynotes.in
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#F59E0B] mb-3.5">
              Explore Store
            </h4>
            <ul className="space-y-2 font-heading text-xs text-[#D9E2EC]">
              <li><Link to="/" className="hover:text-[#F59E0B] transition">Home</Link></li>
              <li><Link to="/subjects" className="hover:text-[#F59E0B] transition">All 13 Subjects</Link></li>
              <li><Link to="/bundles" className="hover:text-[#F59E0B] transition">Placement Bundles</Link></li>
              <li><Link to="/subscription" className="hover:text-[#F59E0B] transition">Current Affairs Pro</Link></li>
              <li><Link to="/track" className="hover:text-[#F59E0B] transition">Live Order Tracking</Link></li>
              <li><Link to="/pay" className="hover:text-[#F59E0B] transition">UPI Instant Pay</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#F59E0B] mb-3.5">
              Help &amp; Legal
            </h4>
            <ul className="space-y-2 font-heading text-xs text-[#D9E2EC]">
              <li><Link to="/about" className="hover:text-[#F59E0B] transition">Our Story</Link></li>
              <li><Link to="/faq" className="hover:text-[#F59E0B] transition">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-[#F59E0B] transition">Contact &amp; Grievance</Link></li>
              <li><Link to="/policies/shipping-policy" className="hover:text-[#F59E0B] transition">Shipping &amp; Delivery</Link></li>
              <li><Link to="/policies/refund-policy" className="hover:text-[#F59E0B] transition">Return &amp; Refund Policy</Link></li>
              <li><Link to="/policies/privacy-policy" className="hover:text-[#F59E0B] transition">Privacy &amp; Terms</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Payment Badges & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#BCCCDC]/70 pt-1">
          <div className="flex items-center gap-3">
            <span className="font-heading font-medium text-[11px] uppercase tracking-wider">
              100% Secure Payments:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-white px-2 py-0.5 rounded flex items-center justify-center border border-white/20 h-6" title="UPI">
                <UPIIcon className="h-3.5 w-auto" />
              </div>
              <div className="bg-white px-2 py-0.5 rounded flex items-center justify-center border border-white/20 h-6" title="Google Pay">
                <GooglePayIcon className="h-3.5 w-auto" />
              </div>
              <div className="bg-white px-2 py-0.5 rounded flex items-center justify-center border border-white/20 h-6" title="PhonePe">
                <PhonePeIcon className="h-3.5 w-auto" />
              </div>
              <div className="bg-white px-2 py-0.5 rounded flex items-center justify-center border border-white/20 h-6" title="Visa">
                <VisaIcon className="h-3.5 w-auto" />
              </div>
              <div className="bg-white px-2 py-0.5 rounded flex items-center justify-center border border-white/20 h-6" title="Mastercard">
                <MastercardIcon className="h-3.5 w-auto" />
              </div>
              <div className="bg-white px-2 py-0.5 rounded flex items-center justify-center border border-white/20 h-6" title="RuPay">
                <RuPayIcon className="h-3.5 w-auto" />
              </div>
            </div>
          </div>

          <p className="font-body text-[11px] text-center md:text-right">
            © {new Date().getFullYear()} {legalName}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
