import React from 'react';

interface RecentBuyer {
  firstName: string;
  city: string;
  bookTitle: string;
}

interface RecentBuyersStripProps {
  buyers?: RecentBuyer[];
  enabled?: boolean;
}

export const RecentBuyersStrip: React.FC<RecentBuyersStripProps> = ({ buyers = [], enabled = true }) => {
  if (!enabled || !buyers || buyers.length === 0) return null;

  const displayBuyer = buyers[0];

  return (
    <div className="bg-[#DDF3F4] text-[#0B3561] border border-[#12A5B0]/30 rounded-xl p-3 flex items-center gap-3 my-4 animate-fadeIn shadow-xs">
      <div className="flex -space-x-2">
        {buyers.slice(0, 3).map((b, idx) => (
          <div
            key={idx}
            className="w-8 h-8 rounded-full bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs"
          >
            {b.firstName.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
      <div className="text-xs font-heading font-medium">
        <span className="font-bold text-[#0B3561]">{displayBuyer.firstName}</span> from{' '}
        <span className="font-bold">{displayBuyer.city}</span> recently ordered{' '}
        <span className="font-bold text-[#12A5B0] italic">"{displayBuyer.bookTitle}"</span>
        {buyers.length > 1 && (
          <span className="text-[#3C5D81] font-semibold ml-1">
            and {buyers.length - 1} other student{buyers.length > 2 ? 's' : ''} this month
          </span>
        )}
      </div>
    </div>
  );
};
