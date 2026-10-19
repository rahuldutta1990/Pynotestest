import React, { useState, useEffect } from 'react';
import { InnerPageBanner } from '../components/InnerPageBanner';
import { AbstractShapes } from '../components/AbstractShapes';
import { SiteSettings } from '../types';

interface PaymentPageProps {
  settings?: SiteSettings;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ settings: initialSettings }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings || null);
  const [orderNo, setOrderNo] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState('399');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!initialSettings) {
      fetch('/api/catalog')
        .then(res => res.json())
        .then(data => {
          if (data.settings) setSettings(data.settings);
        })
        .catch(() => {});
    }
  }, [initialSettings]);

  const merchantName = settings?.merchant_name || 'RAHUL DUTTA';
  const merchantUpi = settings?.merchant_upi_id || '9038417437-2@ybl';
  const qrImage = settings?.qr_code_image_url || '/qr-code.png';
  const instructions = settings?.payment_instructions || 'Scan the official QR code using any UPI app or use the direct payment link below.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber) {
      alert('Please enter your UPI Transaction Reference / UTR Number.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#0B3561] relative overflow-hidden">
      <AbstractShapes />
      
      <InnerPageBanner
        title="Secure Scan & Pay"
        subtitle="Instant UPI QR Code Payment for PyNotes Physical Printed Study Notes & Bundles"
        hideBreadcrumbs={true}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 py-12 relative z-10 w-full space-y-12">
        
        {/* QR CODE DISPLAY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* QR CODE CARD */}
          <div className="md:col-span-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#0B3561]/12 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0B3561] via-[#12A5B0] to-[#FFD54A]" />

            <div className="space-y-1">
              <span className="font-heading font-bold text-xs text-[#3C5D81] uppercase tracking-wider block">
                Powered by Razorpay & UPI
              </span>
              <h3 className="font-heading font-black text-2xl text-[#0B3561]">
                {merchantName}
              </h3>
              <p className="font-body text-xs text-[#12A5B0] font-bold">Scan and Pay with Any UPI App</p>
            </div>

            {/* QR IMAGE */}
            <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-[#12A5B0]/20 max-w-[280px] w-full aspect-square flex items-center justify-center relative overflow-hidden group-hover:scale-102 transition duration-300">
              <img
                src={qrImage}
                alt="PyNotes UPI QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            {/* MERCHANT UPI ID */}
            <div className="w-full pt-2">
              <div className="text-xs text-[#3C5D81]">
                Merchant UPI ID: <span className="font-mono font-bold text-[#0B3561]">{merchantUpi}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT CONFIRMATION FORM */}
          <div className="md:col-span-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#0B3561]/12 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-xl text-[#0B3561]">
                Confirm Your Payment
              </h3>
              <p className="font-body text-xs text-[#3C5D81]">
                After completing the scan and pay above, submit your Transaction ID (UTR) here so our team can dispatch your printed notes instantly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#12A5B0]/10 border-2 border-[#12A5B0] p-6 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-[#12A5B0] text-[#071E38] rounded-full flex items-center justify-center mx-auto font-bold text-xl">
                  ✓
                </div>
                <h4 className="font-heading font-bold text-lg text-[#0B3561]">Payment Details Submitted!</h4>
                <p className="text-xs text-[#3C5D81]">
                  Thank you! Our operations team will verify your UTR reference and dispatch your physical notes via express shipping.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#12A5B0] hover:underline"
                >
                  Submit Another Payment →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[#0B3561]">Order Number (If placed on store)</label>
                  <input
                    type="text"
                    value={orderNo}
                    onChange={e => setOrderNo(e.target.value)}
                    placeholder="e.g. PYN-1042 (Optional)"
                    className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#0B3561]">Paid Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#0B3561]">UPI Transaction Reference / UTR Number *</label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={e => setUtrNumber(e.target.value)}
                    placeholder="Enter 12-digit UTR or UPI Reference No."
                    className="w-full p-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0B3561] text-white font-heading font-bold py-3.5 rounded-xl hover:bg-[#071E38] transition shadow-md"
                >
                  Verify & Submit Payment ⚡
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-[#0B3561]/10 text-center">
              <a
                href={`upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`}
                className="inline-block bg-[#FFD54A] text-[#071E38] font-heading font-bold text-xs px-6 py-3 rounded-xl shadow hover:brightness-105 transition"
              >
                Open UPI App Direct Link 📱
              </a>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
