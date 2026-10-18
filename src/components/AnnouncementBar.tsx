import React from 'react';

interface AnnouncementBarProps {
  messages: { text: string; highlight?: string }[];
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ messages }) => {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="bg-[#071E38] text-white text-xs h-10 flex items-center overflow-hidden border-b border-white/10 relative select-none">
      <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] w-full items-center">
        {[...messages, ...messages, ...messages].map((msg, idx) => (
          <div key={idx} className="inline-flex items-center mx-6 sm:mx-10">
            <span className="font-heading font-bold text-[#FFD54A] mr-2 text-[11px] uppercase tracking-wider">
              {msg.highlight || 'SPECIAL OFFER'}
            </span>
            <span className="font-body text-[#F7FAFC] font-medium text-xs">
              {msg.text}
            </span>
            <span className="mx-6 text-[#12A5B0] font-bold">.</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
