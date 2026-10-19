import React from 'react';

export const FeatureStrip: React.FC = () => {
  const trustItems = [
    { label: 'Premium Print', sub: '100 GSM Cream Paper', icon: '✨' },
    { label: 'Beginner-Friendly', sub: 'Visual Code Tracing', icon: '💡' },
    { label: 'Fast Shipping', sub: '2–4 Days Across India', icon: '⚡' },
    { label: 'Cash on Delivery', sub: 'Pay on Arrival', icon: '📦' },
    { label: '100% Handwritten', sub: 'Zero Screen Fatigue', icon: '✍️' },
    { label: 'Exam Ready', sub: 'Placement Interview Ready', icon: '🎯' },
  ];

  return (
    <div className="bg-[#FAF7F0] border-y border-[#0B3561]/8 py-3.5 select-none shadow-[inset_0_1px_3px_rgba(10,25,47,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Desktop 4-column trust strip */}
        <div className="hidden md:grid grid-cols-4 gap-4 items-center divide-x divide-[#0B3561]/10">
          <div className="flex items-center gap-3 px-3">
            <span className="text-xl">✨</span>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B3561] uppercase tracking-wide">Premium Print</div>
              <div className="text-[11px] text-[#627D98]">100 GSM bleed-proof paper</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3">
            <span className="text-xl">💡</span>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B3561] uppercase tracking-wide">Beginner-Friendly</div>
              <div className="text-[11px] text-[#627D98]">Step-by-step visual logic</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3">
            <span className="text-xl">⚡</span>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B3561] uppercase tracking-wide">Fast Shipping</div>
              <div className="text-[11px] text-[#627D98]">Express dispatch to your door</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3">
            <span className="text-xl">📦</span>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B3561] uppercase tracking-wide">Cash on Delivery</div>
              <div className="text-[11px] text-[#627D98]">Available across India pincodes</div>
            </div>
          </div>
        </div>

        {/* Mobile Smooth Marquee Strip */}
        <div className="md:hidden overflow-hidden flex whitespace-nowrap animate-stripMarquee w-full items-center">
          {[...trustItems, ...trustItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 mx-5 text-xs font-heading font-semibold text-[#0B3561]">
              <span>{item.icon}</span>
              <span className="font-bold">{item.label}</span>
              <span className="text-[#627D98] text-[10px]">· {item.sub}</span>
              <span className="mx-3 text-[#12A5B0]/40">•</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes stripMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-stripMarquee {
          animation: stripMarquee 20s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-stripMarquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
