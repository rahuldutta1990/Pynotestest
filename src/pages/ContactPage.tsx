import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { WhatsappIcon } from '../components/Icons';
import { postContactMessage } from '../lib/api';

interface ContactPageProps {
  settings?: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      await postContactMessage({ name, email, phone, message });
      setSuccess('Your message has been sent successfully. We will get back to you soon!');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappNum = settings?.whatsapp_number || '+919876543210';
  const supportEmail = settings?.support_email || 'support@pynotes.in';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="font-heading font-bold text-3xl text-[#0B3561]">Get in Touch with PyNotes</h1>
        <p className="font-body text-xs text-[#3C5D81]">We are here to answer your questions regarding printed books, orders, and shipping.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-2">
            <h4 className="font-heading font-bold text-sm text-[#0B3561]">Support Email</h4>
            <p className="text-xs text-[#3C5D81] font-mono">{supportEmail}</p>
          </div>

          <a
            href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="block bg-[#25D366] text-white p-6 rounded-2xl shadow-md hover:brightness-105 transition space-y-2"
          >
            <div className="flex items-center gap-2">
              <WhatsappIcon className="w-6 h-6" />
              <span className="font-heading font-bold text-sm">WhatsApp Chat</span>
            </div>
            <p className="text-xs text-white/90">Instant assistance for order queries.</p>
          </a>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#0B3561]/10 shadow-lg space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Message *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs"
            />
          </div>

          {error && <p className="text-xs text-[#C0392B] font-bold">{error}</p>}
          {success && <p className="text-xs text-[#13834D] font-bold">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0B3561] text-white font-heading font-bold py-3.5 rounded-xl text-xs hover:bg-[#071E38]"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};
