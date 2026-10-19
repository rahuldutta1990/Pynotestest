import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { SiteSettings } from '../types';
import { subscribeNewsletter } from '../lib/api';

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
    'PyNotes blends the art of handwritten learning with modern coding. We make programming simple, visual, and human-friendly through clean notes and structured printed books.';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setMessage('✓ Thank you for subscribing! Check your inbox for exclusive student offers.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="bg-[#071E38] text-white pt-16 pb-8 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* TOP BANNER: NEWSLETTER SUBSCRIPTION SECTION */}
        <div className="bg-gradient-to-r from-[#0B3561] via-[#08284B] to-[#071E38] rounded-3xl p-8 sm:p-10 border border-[#12A5B0]/30 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ruled Texture Accent */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent, transparent 23px, #ffffff 23px, #ffffff 24px)',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Newsletter Text Column */}
            <div className="lg:col-span-6 space-y-2">
              <span className="inline-block bg-[#12A5B0]/20 text-[#12A5B0] font-heading font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-[#12A5B0]/30">
                STAY UPDATED
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                Never Miss a New Book or Offer!
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#DDF3F4]/80 leading-relaxed font-medium">
                Subscribe to get exclusive discount codes, exam cheat-sheets, and instant notifications when new printed subject books launch.
              </p>
            </div>

            {/* Newsletter Form Column */}
            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your student email address..."
                  className="flex-1 px-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#12A5B0] focus:ring-2 focus:ring-[#12A5B0]/30 backdrop-blur-xs font-medium"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs sm:text-sm px-7 py-3.5 rounded-2xl hover:brightness-110 transition shadow-lg flex-shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    'Subscribing...'
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Status Message Display */}
              {message && (
                <p
                  className={`text-xs font-heading font-semibold mt-2.5 ${
                    status === 'success' ? 'text-[#12A5B0]' : 'text-[#FFD54A]'
                  }`}
                >
                  {message}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* FOOTER COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col items-start gap-4">
            <Logo variant="horizontal" surface="dark" customUrl={settings?.custom_logo_url} size="md" />
            <p className="font-body text-sm text-[#DDF3F4]/80 leading-relaxed max-w-sm">
              {aboutText}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs text-[#DDF3F4]/60 uppercase font-heading font-semibold tracking-wider">
                Follow Us
              </span>
              <div className="flex items-center gap-3 text-[#12A5B0]">
                <a href="#" className="hover:text-white transition" aria-label="Instagram">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="hover:text-white transition" aria-label="YouTube">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-[#12A5B0] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 font-heading text-sm text-[#DDF3F4]">
              <li><Link to="/" className="hover:text-[#12A5B0] transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#12A5B0] transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#12A5B0] transition">Contact Us</Link></li>
              <li><Link to="/track" className="hover:text-[#12A5B0] transition">Order Tracking</Link></li>
              <li>
                <Link to="/pay" className="hover:text-[#12A5B0] transition flex items-center gap-1.5">
                  <span>Quick Scan & Pay</span>
                  <span className="bg-[#12A5B0] text-[#071E38] text-[10px] font-bold px-1.5 py-0.5 rounded">UPI QR</span>
                </Link>
              </li>
              <li><Link to="/faq" className="hover:text-[#12A5B0] transition">FAQ's</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal Policies */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-[#12A5B0] mb-4">
              Legal Policies
            </h4>
            <ul className="space-y-2.5 font-heading text-sm text-[#DDF3F4]">
              <li><Link to="/policies/privacy-policy" className="hover:text-[#12A5B0] transition">Privacy Policy</Link></li>
              <li><Link to="/policies/terms-of-service" className="hover:text-[#12A5B0] transition">Terms of Service</Link></li>
              <li><Link to="/policies/refund-policy" className="hover:text-[#12A5B0] transition">Return & Refund Policy</Link></li>
              <li><Link to="/policies/shipping-policy" className="hover:text-[#12A5B0] transition">Shipping Policy</Link></li>
              <li><Link to="/policies/contact-info" className="hover:text-[#12A5B0] transition">Contact Information</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Payment Icons & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#DDF3F4]/60 pt-2">
          <div className="flex items-center gap-3">
            <span className="font-heading font-medium text-[11px] uppercase tracking-wider">
              Secured Payments:
            </span>
            <div className="flex items-center gap-2">
              {['UPI', 'Google Pay', 'PhonePe', 'Visa', 'Mastercard', 'RuPay'].map(icon => (
                <span key={icon} className="bg-white/10 text-white font-code text-[10px] px-2 py-1 rounded border border-[#12A5B0]/20">
                  {icon}
                </span>
              ))}
            </div>
          </div>

          <p className="font-body text-center md:text-right">
            © {new Date().getFullYear()}, {legalName}. All rights reserved. Powered by PyNotes Platform.
          </p>
        </div>

      </div>
    </footer>
  );
};
