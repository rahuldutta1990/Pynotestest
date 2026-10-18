import React from 'react';

interface PlaceholderCoverProps {
  title: string;
  accentColor?: string;
  isAdminPreview?: boolean;
  className?: string;
  imageUrl?: string;
}

export const PlaceholderCover: React.FC<PlaceholderCoverProps> = ({
  title,
  accentColor = '#12A5B0',
  isAdminPreview = false,
  className = '',
  imageUrl,
}) => {
  if (imageUrl) {
    return (
      <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#0B3561] shadow-md ${className}`}>
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        {isAdminPreview && (
          <span className="absolute top-2 right-2 bg-[#FFD54A] text-[#071E38] text-[10px] font-bold px-2 py-0.5 rounded shadow">
            Uploaded
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-lg flex flex-col justify-between p-4 sm:p-5 text-white select-none ${className}`}
      style={{
        background: 'linear-gradient(135deg, #0B3561 0%, #071E38 100%)',
      }}
    >
      {/* Ruled paper background lines on cover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 23px, #ffffff 23px, #ffffff 24px)',
        }}
      />

      {/* Vertical Teal Margin Rule */}
      <div className="absolute top-0 bottom-0 left-6 w-[2px] bg-[#12A5B0] opacity-80 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-heading font-bold text-[9px] sm:text-[11px] uppercase tracking-widest text-[#DDF3F4] bg-[#12A5B0]/20 px-2.5 py-1 rounded-full border border-[#12A5B0]/40">
          Simplified Handwritten Notes
        </span>
        {isAdminPreview && (
          <span className="bg-[#FFD54A] text-[#071E38] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
            Placeholder
          </span>
        )}
      </div>

      {/* Subject Title Center */}
      <div className="relative z-10 my-auto pl-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="font-heading text-xs font-semibold text-[#12A5B0] uppercase tracking-wider">
            Handwritten Series
          </span>
        </div>
        <h3 className="font-display font-black italic text-2xl sm:text-3xl leading-none text-white drop-shadow-md">
          {title}
        </h3>
        <p className="font-heading text-[11px] text-[#DDF3F4]/80 mt-2 font-medium">
          Exam-Ready . Beginner-Friendly
        </p>
      </div>

      {/* Bottom Accent Stripe and Icon Mark */}
      <div className="relative z-10 border-t border-white/20 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <svg className="w-5 h-5 text-[#12A5B0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="font-code text-[10px] text-white/90">PyNotes Published</span>
        </div>
        <div
          className="h-1.5 w-12 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
};
