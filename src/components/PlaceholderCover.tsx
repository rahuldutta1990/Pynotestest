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
    <div className={`relative perspective-[1200px] group/book py-2 px-1 ${className}`}>
      {/* Soft 3D Floor Shadow */}
      <div className="absolute bottom-0 left-4 right-6 h-3 bg-[#071E38]/25 blur-md rounded-full transform group-hover/book:scale-110 group-hover/book:bg-[#071E38]/35 transition-all duration-300" />

      {/* 3D Book Perspective Container */}
      <div className="relative aspect-[3/4] w-full transform-gpu transition-all duration-300 ease-out group-hover/book:-rotate-y-12 group-hover/book:rotate-x-6 group-hover/book:-translate-y-2 group-hover/book:scale-102">
        
        {/* 3D Page Stack Edge (Right Side) */}
        <div className="absolute top-1 bottom-1 right-0 w-3 sm:w-3.5 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-200 rounded-r-xs border-r border-gray-300 shadow-inner translate-x-2 transform rotate-y-90 origin-right flex flex-col justify-between py-1 opacity-90">
          <div className="w-full h-px bg-gray-300/60" />
          <div className="w-full h-px bg-gray-300/60" />
          <div className="w-full h-px bg-gray-300/60" />
          <div className="w-full h-px bg-gray-300/60" />
        </div>

        {/* 3D Book Front Cover */}
        <div
          className="relative h-full w-full rounded-r-xl rounded-l-xs overflow-hidden shadow-xl flex flex-col justify-between p-4 sm:p-5 text-white select-none border-l-4 border-l-[#071E38]/80"
          style={{
            background: 'linear-gradient(135deg, #0B3561 0%, #08284B 60%, #071E38 100%)',
          }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
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

              {/* Left Spine Crease Shadow */}
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/45 to-transparent pointer-events-none" />

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
            </>
          )}

          {/* Foil Reflection Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-60 group-hover/book:opacity-90 transition-opacity" />
        </div>

      </div>
    </div>
  );
};
