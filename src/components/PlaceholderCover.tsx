import React, { useState } from 'react';

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
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`relative w-full aspect-[3/4] ${className}`}>
      {imageUrl && !imageError ? (
        <div className="book-cover-3d w-full h-full bg-[#0B3561] relative overflow-hidden rounded-2xl shadow-lg">
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover block"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-white/10 to-transparent pointer-events-none" />
        </div>
      ) : (
        /* Bright tactile cream notebook cover */
        <div
          className="w-full h-full bg-[#FFFDF9] rounded-2xl p-5 sm:p-6 flex flex-col justify-between select-none relative overflow-hidden border border-[#0B3561]/12 shadow-lg"
          style={{
            boxShadow:
              '-4px 0 12px -2px rgba(10, 25, 47, 0.08), 0 12px 28px -5px rgba(10, 25, 47, 0.12), 0 0 0 1px rgba(10, 25, 47, 0.06)',
          }}
        >
          {/* Spiral binding rings on left */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#E5E0D4] to-[#FAF7F0] border-r border-[#0B3561]/15 flex flex-col justify-around py-3 z-20 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center pl-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#334E68]/30 shadow-inner" />
                <div className="w-3.5 h-1 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 rounded-full shadow-xs -ml-1 border-t border-white" />
              </div>
            ))}
          </div>

          {/* Faint notebook paper lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0, transparent 24px, #CBD5E1 24px, #CBD5E1 25px)',
            }}
          />

          {/* Top Series Badge */}
          <div className="relative z-10 pl-3 flex items-center justify-between">
            <span className="font-heading font-bold text-[10px] uppercase tracking-wider text-[#713F12] bg-[#FEF08A] border border-[#FACC15] px-2.5 py-0.5 rounded shadow-xs">
              100% Handwritten
            </span>
            {isAdminPreview ? (
              <span className="bg-[#12A5B0] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                Preview
              </span>
            ) : (
              <span className="font-mono text-[9px] text-[#627D98] font-bold">
                100 GSM Cream Paper
              </span>
            )}
          </div>

          {/* Subject Title Center with Highlighter Swipe */}
          <div className="relative z-10 pl-3 my-auto space-y-1.5">
            <p className="font-mono text-[10px] text-[#12A5B0] uppercase tracking-widest font-bold">
              PyNotes Compendium
            </p>
            <div className="relative inline-block">
              <span className="absolute inset-x-0 bottom-1 h-3.5 bg-[#FEF08A] opacity-90 rounded-sm -rotate-1 pointer-events-none" />
              <h3 className="relative font-handwriting font-bold text-3xl sm:text-4xl leading-tight text-[#0B3561] drop-shadow-xs">
                {title}
              </h3>
            </div>
            <p className="font-heading text-xs text-[#486581] font-semibold">
              Printed Colourful Study Notes with Flowcharts &amp; Solutions
            </p>
          </div>

          {/* Bottom Book Footnote */}
          <div className="relative z-10 pl-3 border-t border-[#0B3561]/10 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#0B3561] font-bold">
              <span className="text-[#12A5B0]">★</span>
              <span>Full Colour Print</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-[#12A5B0]/40 bg-[#FEF3C7] flex items-center justify-center shadow-xs">
              <span className="text-[7px] font-black text-[#92400E]">PY</span>
            </div>
          </div>

          {/* Sheen reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none z-30" />
        </div>
      )}
    </div>
  );
};
