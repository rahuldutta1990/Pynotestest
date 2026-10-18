import React from 'react';
import { FAQ } from '../types';

interface FaqPageProps {
  faqs: FAQ[];
}

export const FaqPage: React.FC<FaqPageProps> = ({ faqs }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-heading font-bold text-3xl text-[#0B3561]">Frequently Asked Questions</h1>
        <p className="font-body text-xs text-[#3C5D81]">Everything you need to know about PyNotes printed books, orders, and delivery.</p>
      </div>

      <div className="space-y-4">
        {faqs.map(faq => (
          <details key={faq.id} className="bg-white p-5 rounded-2xl border border-[#0B3561]/10 shadow-sm group">
            <summary className="font-heading font-bold text-sm text-[#0B3561] cursor-pointer flex justify-between items-center list-none">
              <span>{faq.question}</span>
              <span className="text-[#12A5B0] group-open:rotate-180 transition">▼</span>
            </summary>
            <p className="font-body text-xs text-[#3C5D81] mt-3 leading-relaxed pt-3 border-t border-[#0B3561]/5">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
};
