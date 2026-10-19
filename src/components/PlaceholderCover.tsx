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
  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl shadow-md bg-white ${className}`}>
      <div className="relative aspect-[3/4] w-full h-full flex flex-col justify-between overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div
            className="relative h-full w-full overflow-hidden shadow-inner flex flex-col justify-between p-4 sm:p-5 text-white select-none"
            style={{
              background: 'linear-gradient(135deg, #0B3561 0%, #08284B 60%, #071E38 100%)',
            }}
          >
            {/* Notebook Ruled Texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, transparent, transparent 23px, #ffffff 23px, #ffffff 24px)',
              }}
            />

            {/* Vertical Teal Margin Line */}
            <div className="absolute top-0 bottom-0 left-6 w-[2px] bg-[#12A5B0] opacity-80 pointer-events-none" />

            {/* Top Series Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="font-heading font-bold text-[9px] sm:text-[10px] uppercase tracking-widest text-[#DDF3F4] bg-[#12A5B0]/25 px-2.5 py-1 rounded-full border border-[#12A5B0]/40 shadow-xs">
                Printed Book
              </span>
              {isAdminPreview && (
                <span className="bg-[#FFD54A] text-[#071E38] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Preview
                </span>
              )}
            </div>

            {/* Subject Title Center */}
            <div className="relative z-10 my-auto pl-4 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: accentColor }} />
                <span className="font-heading text-[10px] sm:text-xs font-bold text-[#12A5B0] uppercase tracking-wider">
                  PyNotes Handwritten
                </span>
              </div>
              <h3 className="font-display font-black italic text-xl sm:text-2xl lg:text-3xl leading-tight text-white drop-shadow-md">
                {title}
              </h3>
              <p className="font-heading text-[10px] sm:text-[11px] text-[#DDF3F4]/85 font-medium">
                Complete Semester Syllabus
              </p>
            </div>

            {/* Bottom Book Footnote */}
            <div className="relative z-10 border-t border-white/20 pt-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#12A5B0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="font-code text-[9px] text-white/90 font-bold">100% Physical Print</span>
              </div>
              <div className="h-1.5 w-8 rounded-full shadow-xs" style={{ backgroundColor: accentColor }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
