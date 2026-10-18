import React from 'react';
import { NotesIcon, HandwrittenIcon, TruckIcon, CheckCircleIcon, CodeIcon, IdeaIcon } from './Icons';

export const FeatureStrip: React.FC = () => {
  const items = [
    { label: 'Premium Quality', icon: <CheckCircleIcon className="w-5 h-5 text-[#071E38]" navyColor="#071E38" tealColor="#0B3561" /> },
    { label: 'Handwritten Notes', icon: <HandwrittenIcon className="w-5 h-5 text-[#071E38]" navyColor="#071E38" tealColor="#0B3561" /> },
    { label: 'Beginner Friendly', icon: <IdeaIcon className="w-5 h-5 text-[#071E38]" navyColor="#071E38" tealColor="#0B3561" /> },
    { label: 'Fully Colorful', icon: <NotesIcon className="w-5 h-5 text-[#071E38]" navyColor="#071E38" tealColor="#0B3561" /> },
    { label: 'Printed Book', icon: <CodeIcon className="w-5 h-5 text-[#071E38]" navyColor="#071E38" tealColor="#0B3561" /> },
    { label: 'Cash on Delivery', icon: <TruckIcon className="w-5 h-5 text-[#071E38]" navyColor="#071E38" tealColor="#0B3561" /> },
    { label: 'Exam Ready', icon: <CheckCircleIcon className="w-5 h-5 text-[#071E38]" navyColor="#071E38" tealColor="#0B3561" /> },
    { label: 'Fast Shipping', icon: <TruckIcon className="w-5 h-5 text-[#071E38]" navyColor="#071E38" tealColor="#0B3561" /> },
  ];

  return (
    <div className="bg-[#12A5B0] text-[#071E38] py-3.5 overflow-hidden select-none border-y border-[#0B3561]/10 shadow-xs">
      <div className="flex whitespace-nowrap animate-stripMarquee hover:[animation-play-state:paused] w-full items-center">
        {[...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-2 mx-8 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider">
            {item.icon}
            <span>{item.label}</span>
            <span className="mx-6 text-[#071E38]/30 font-black">•</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes stripMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-stripMarquee {
          animation: stripMarquee 30s linear infinite;
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
