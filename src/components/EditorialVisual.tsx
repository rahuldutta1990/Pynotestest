import React, { useState } from 'react';
import { getSlot, ImageSlot } from '../config/imageSlots';

interface EditorialVisualProps {
  slotId: string;
  className?: string;
  aspectRatio?: '4:3' | '3:4' | '16:9';
}

export const EditorialVisual: React.FC<EditorialVisualProps> = ({
  slotId,
  className = '',
  aspectRatio = '4:3',
}) => {
  const [imageError, setImageError] = useState(false);
  const slot: ImageSlot = getSlot(slotId);

  const aspectClass = {
    '4:3': 'aspect-[4/3]',
    '3:4': 'aspect-[3/4]',
    '16:9': 'aspect-[16/9]',
  }[aspectRatio];

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl shadow-lg border border-[#0A192F]/10 ${aspectClass} ${className}`}>
      {slot.path && !imageError ? (
        <img
          src={slot.path}
          alt={slot.altText}
          loading="lazy"
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover block"
        />
      ) : (
        /* Rich Styled Fallback depending on slot */
        <div className="w-full h-full bg-[#FAF7F0] p-6 flex flex-col justify-between select-none relative overflow-hidden">
          {slotId === 'notes_macro_diagram' && (
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full inline-block">
                  Handwriting Macro
                </span>
                <h4 className="font-handwriting text-2xl font-bold text-[#0A192F]">
                  Tactile Ink &amp; Visual Logic
                </h4>
                <p className="font-body text-xs text-[#486581] leading-relaxed">
                  Real ink lines, multi-color highlighters, and chapter summary cards mapped on smooth 100 GSM paper.
                </p>
              </div>

              {/* Sample diagram snippet */}
              <div className="bg-white p-3.5 rounded-xl border border-[#0A192F]/10 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  <span className="font-handwriting text-sm font-bold text-[#0A192F]">Binary Search Step-Trace</span>
                </div>
                <div className="flex gap-1.5">
                  {[2, 5, 8, 12, 16, 23, 38, 56, 72, 91].map((val, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 text-center py-1 text-[10px] font-mono rounded ${
                        val === 23
                          ? 'bg-[#FEF08A] font-bold text-[#0A192F] ring-1 ring-[#EAB308]'
                          : 'bg-[#F0F4F8] text-[#334E68]'
                      }`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-[#16A34A] text-right font-semibold">
                  Found target in 3 comparisons!
                </div>
              </div>
            </div>
          )}

          {slotId === 'student_studying' && (
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full inline-block">
                  Study Focus
                </span>
                <h4 className="font-handwriting text-2xl font-bold text-[#0A192F]">
                  Designed for Long Study Hours
                </h4>
                <p className="font-body text-xs text-[#486581] leading-relaxed">
                  Physical pages eliminate blue light fatigue, screen notifications, and browser tab distractions.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#0A192F] to-[#1E3A5F] text-white p-4 rounded-xl shadow-md space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#FCD34D]">
                  <span>Active Recall Technique</span>
                  <span>94% Exam Retention</span>
                </div>
                <div className="text-[11px] text-white/80 font-handwriting">
                  &quot;Annotating directly on paper helps neural pathways encode syntax much faster than typing into an IDE.&quot;
                </div>
              </div>
            </div>
          )}

          {slotId === 'parcel_shipping' && (
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3B82F6] bg-[#DBEAFE] px-2.5 py-0.5 rounded-full inline-block">
                  Safe Logistics
                </span>
                <h4 className="font-handwriting text-2xl font-bold text-[#0A192F]">
                  Durable Water-Resistant Packaging
                </h4>
                <p className="font-body text-xs text-[#486581] leading-relaxed">
                  Every book order is encased in bubble film and high-grade corrugated box with live courier tracking.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#0A192F]/10 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-[#486581] uppercase font-semibold">Fast Shipping Across India</div>
                  <div className="text-xs font-bold text-[#0A192F]">2–4 Business Days Delivery</div>
                  <div className="text-[10px] text-[#16A34A] font-semibold">Cash on Delivery Available</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#D97706]/10 flex items-center justify-center text-xl text-[#D97706]">
                  📦
                </div>
              </div>
            </div>
          )}

          {slotId.startsWith('sample_page_') && (
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full inline-block">
                  Look Inside Sample
                </span>
                <h4 className="font-handwriting text-xl font-bold text-[#0A192F]">
                  {slot.name}
                </h4>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#0A192F]/10 shadow-xs space-y-2 my-auto">
                <div className="h-2 w-3/4 bg-[#FEF08A] rounded" />
                <div className="h-2 w-full bg-[#F0F4F8] rounded" />
                <div className="h-2 w-5/6 bg-[#F0F4F8] rounded" />
                <div className="h-2 w-2/3 bg-[#BBF7D0] rounded" />
                <div className="h-2 w-4/5 bg-[#F0F4F8] rounded" />
              </div>

              <div className="text-[10px] font-mono text-center text-[#486581]">
                High-Resolution Colour Print · 100 GSM Paper
              </div>
            </div>
          )}

          {/* Fallback default */}
          {!['notes_macro_diagram', 'student_studying', 'parcel_shipping'].includes(slotId) && !slotId.startsWith('sample_page_') && (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <span className="text-2xl mb-2">📖</span>
              <h4 className="font-heading font-semibold text-sm text-[#0A192F]">{slot.name}</h4>
              <p className="text-[11px] text-[#627D98] mt-1">{slot.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
