import React, { useState } from 'react';
import { getSlot, ImageSlot } from '../config/imageSlots';

interface BookCoverVisualProps {
  slotId?: string;
  title: string;
  subjectSlug?: string;
  accentColor?: string;
  highlighterColor?: 'yellow' | 'pink' | 'green' | 'orange' | 'amber';
  imageUrl?: string;
  className?: string;
  editionText?: string;
}

export const BookCoverVisual: React.FC<BookCoverVisualProps> = ({
  slotId,
  title,
  subjectSlug,
  accentColor = 'var(--navy)',
  highlighterColor = 'yellow',
  imageUrl,
  className = '',
  editionText = '2026 Revised Edition',
}) => {
  const [imageError, setImageError] = useState(false);
  const slot: ImageSlot | undefined = slotId ? getSlot(slotId) : undefined;
  const imageSrc = imageUrl || slot?.path;

  // Highlighter color accents on paper
  const hlScheme = {
    yellow: {
      bg: 'bg-[#FEF08A]',
      text: 'text-[#854D0E]',
      border: 'border-[#FACC15]',
      badge: 'bg-[#FEF9C3] text-[#713F12]',
      pen: '#CA8A04',
      lightBg: 'bg-[#FEFCE8]',
    },
    pink: {
      bg: 'bg-[#FCE7F3]',
      text: 'text-[#9D174D]',
      border: 'border-[#F472B6]',
      badge: 'bg-[#FDF2F8] text-[#831843]',
      pen: '#DB2777',
      lightBg: 'bg-[#FDF2F8]',
    },
    green: {
      bg: 'bg-[#DCFCE7]',
      text: 'text-[#166534]',
      border: 'border-[#4ADE80]',
      badge: 'bg-[#F0FDF4] text-[#14532D]',
      pen: '#16A34A',
      lightBg: 'bg-[#F0FDF4]',
    },
    orange: {
      bg: 'bg-[#FFEDD5]',
      text: 'text-[#9A3412]',
      border: 'border-[#FB923C]',
      badge: 'bg-[#FFF7ED] text-[#7C2D12]',
      pen: '#EA580C',
      lightBg: 'bg-[#FFF7ED]',
    },
    amber: {
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#92400E]',
      border: 'border-[#F59E0B]',
      badge: 'bg-[#FFFBEB] text-[#78350F]',
      pen: '#12A5B0',
      lightBg: 'bg-[#FFFBEB]',
    },
  }[highlighterColor];

  // Subject-specific hand-drawn visual diagrams on cream paper
  const renderSubjectDiagram = () => {
    const slug = (subjectSlug || '').toLowerCase();

    if (slug.includes('c-plus-plus') || slug === 'cpp') {
      return (
        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="flex items-center justify-between text-[#1E3A5F] font-bold border-b border-[#0B3561]/10 pb-1">
            <span>STL Vector Memory</span>
            <span className="text-[#059669] font-semibold">Heap [cap=8]</span>
          </div>
          {/* Visual Memory Blocks */}
          <div className="flex items-center gap-1 pt-1">
            {[10, 25, 40, 65].map((val, i) => (
              <div
                key={i}
                className="flex-1 py-1.5 bg-[#EFF6FF] border border-[#3B82F6]/30 rounded text-center font-bold text-[#1D4ED8]"
              >
                {val}
              </div>
            ))}
            <div className="flex-1 py-1.5 bg-gray-100 border border-dashed border-gray-300 rounded text-center text-gray-400">
              ∅
            </div>
          </div>
          <p className="text-[9px] font-handwriting text-[#64748B] italic pt-0.5">
            ✎ dynamic reallocation: 2x factor
          </p>
        </div>
      );
    }

    if (slug.includes('java')) {
      return (
        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="flex items-center justify-between text-[#1E3A5F] font-bold border-b border-[#0B3561]/10 pb-1">
            <span>OOP Heap References</span>
            <span className="text-[#12A5B0] font-semibold">JVM Stack</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <div className="p-1.5 bg-[#FFFBEB] border border-[#F59E0B]/30 rounded text-center">
              <span className="text-[9px] text-[#92400E] block font-sans font-bold">Stack Frame</span>
              <span className="text-[10px] text-[#1E3A5F] font-bold">Node ptr ➔</span>
            </div>
            <div className="p-1.5 bg-[#FEF3C7] border border-[#F59E0B]/40 rounded text-center">
              <span className="text-[9px] text-[#92400E] block font-sans font-bold">Heap Object</span>
              <span className="text-[10px] text-[#1E3A5F] font-bold">data: 42</span>
            </div>
          </div>
          <p className="text-[9px] font-handwriting text-[#64748B] italic pt-0.5">
            ✎ garbage collector sweeps unreferenced
          </p>
        </div>
      );
    }

    if (slug.includes('python')) {
      return (
        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="flex items-center justify-between text-[#1E3A5F] font-bold border-b border-[#0B3561]/10 pb-1">
            <span>List Comprehension</span>
            <span className="text-[#059669] font-semibold">O(N)</span>
          </div>
          <div className="p-1.5 bg-[#F0FDF4] border border-[#22C55E]/30 rounded text-[#14532D]">
            <span className="text-[#16A34A] font-bold">[x*2 </span>
            <span className="text-[#1E3A5F]">for x in nums </span>
            <span className="text-[#12A5B0]">if x &gt; 0]</span>
          </div>
          <p className="text-[9px] font-handwriting text-[#64748B] italic pt-0.5">
            ✎ generator expressions avoid full memory load
          </p>
        </div>
      );
    }

    if (slug.includes('dsa')) {
      return (
        <div className="space-y-1 text-[10px] font-mono">
          <div className="flex items-center justify-between text-[#1E3A5F] font-bold border-b border-[#0B3561]/10 pb-1">
            <span>Binary Search Tree</span>
            <span className="text-[#12A5B0] font-semibold">O(log N)</span>
          </div>
          {/* Mini Tree Diagram */}
          <div className="flex flex-col items-center py-1">
            <div className="w-5 h-5 rounded-full border border-[#12A5B0] bg-[#FEF3C7] flex items-center justify-center text-[9px] font-bold text-[#92400E]">
              50
            </div>
            <div className="w-12 h-2 flex justify-between border-t border-dashed border-[#0B3561]/30 mt-0.5">
              <div className="w-4 h-4 rounded-full border border-[#059669] bg-[#DCFCE7] flex items-center justify-center text-[8px] font-bold text-[#14532D] -mt-1">
                25
              </div>
              <div className="w-4 h-4 rounded-full border border-[#2563EB] bg-[#DBEAFE] flex items-center justify-center text-[8px] font-bold text-[#1E40AF] -mt-1">
                75
              </div>
            </div>
          </div>
          <p className="text-[9px] font-handwriting text-[#64748B] italic text-center">
            ✎ Left &lt; Root &lt; Right
          </p>
        </div>
      );
    }

    if (slug.includes('sql') || slug.includes('dbms')) {
      return (
        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="flex items-center justify-between text-[#1E3A5F] font-bold border-b border-[#0B3561]/10 pb-1">
            <span>Relational Schema</span>
            <span className="text-[#059669] font-semibold">1 : N</span>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex-1 p-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-center">
              <span className="font-bold text-[#0F172A] block text-[9px]">Users</span>
              <span className="text-[8px] text-[#2563EB]">PK: id</span>
            </div>
            <span className="text-[#12A5B0] font-bold text-xs">➔</span>
            <div className="flex-1 p-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-center">
              <span className="font-bold text-[#0F172A] block text-[9px]">Orders</span>
              <span className="text-[8px] text-[#DC2626]">FK: user_id</span>
            </div>
          </div>
          <p className="text-[9px] font-handwriting text-[#64748B] italic pt-0.5">
            ✎ indexed joins eliminate sequential scan
          </p>
        </div>
      );
    }

    if (slug.includes('os') || slug.includes('operating')) {
      return (
        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="flex items-center justify-between text-[#1E3A5F] font-bold border-b border-[#0B3561]/10 pb-1">
            <span>Process Scheduling</span>
            <span className="text-[#7C3AED] font-semibold">Context Switch</span>
          </div>
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex-1 py-1 bg-[#EDE9FE] border border-[#A78BFA] rounded text-center font-bold text-[#5B21B6] text-[9px]">
              Ready
            </div>
            <span className="text-[#64748B] text-[8px]">➔</span>
            <div className="flex-1 py-1 bg-[#FEF3C7] border border-[#F59E0B] rounded text-center font-bold text-[#92400E] text-[9px]">
              Running
            </div>
            <span className="text-[#64748B] text-[8px]">➔</span>
            <div className="flex-1 py-1 bg-[#DCFCE7] border border-[#4ADE80] rounded text-center font-bold text-[#166534] text-[9px]">
              Exit
            </div>
          </div>
          <p className="text-[9px] font-handwriting text-[#64748B] italic pt-0.5">
            ✎ PCB saves registers & PC counter
          </p>
        </div>
      );
    }

    if (slug.includes('html') || slug.includes('css') || slug.includes('js') || slug.includes('javascript')) {
      return (
        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="flex items-center justify-between text-[#1E3A5F] font-bold border-b border-[#0B3561]/10 pb-1">
            <span>DOM Tree &amp; Layout</span>
            <span className="text-[#2563EB] font-semibold">CSS Grid</span>
          </div>
          <div className="p-1.5 bg-[#EFF6FF] border border-[#60A5FA]/30 rounded text-[#1E40AF]">
            <div className="flex items-center justify-between text-[9px]">
              <span className="font-bold">&lt;div class=&quot;grid&quot;&gt;</span>
              <span className="text-[#059669]">fr-units</span>
            </div>
            <div className="pl-2 text-[8px] text-[#64748B]">grid-template-columns: 1fr 2fr;</div>
          </div>
          <p className="text-[9px] font-handwriting text-[#64748B] italic pt-0.5">
            ✎ box-model: content + padding + border
          </p>
        </div>
      );
    }

    if (slug.includes('data-science') || slug.includes('datascience')) {
      return (
        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="flex items-center justify-between text-[#1E3A5F] font-bold border-b border-[#0B3561]/10 pb-1">
            <span>Data Matrix &amp; Pandas</span>
            <span className="text-[#059669] font-semibold">DataFrame</span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-0.5 text-center text-[9px]">
            <div className="p-1 bg-[#F0FDF4] border border-[#86EFAC] rounded font-bold text-[#15803D]">Feature 1</div>
            <div className="p-1 bg-[#F0FDF4] border border-[#86EFAC] rounded font-bold text-[#15803D]">Feature 2</div>
            <div className="p-1 bg-[#FEF3C7] border border-[#FCD34D] rounded font-bold text-[#B45309]">Target y</div>
          </div>
          <p className="text-[9px] font-handwriting text-[#64748B] italic pt-0.5">
            ✎ vectorization with NumPy C-extensions
          </p>
        </div>
      );
    }

    // Default C / Core Programming
    return (
      <div className="space-y-1.5 text-[10px] font-mono">
        <div className="flex items-center justify-between text-[#1E3A5F] font-bold border-b border-[#0B3561]/10 pb-1">
          <span>Pointer Memory Address</span>
          <span className="text-[#2563EB] font-semibold">0x7ffee4</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <div className="p-1.5 bg-[#EFF6FF] border border-[#93C5FD] rounded text-center flex-1">
            <span className="text-[8px] text-[#64748B] block font-sans">Variable a</span>
            <span className="font-bold text-[#1E40AF]">val: 100</span>
          </div>
          <span className="text-[#12A5B0] font-bold text-xs">➔</span>
          <div className="p-1.5 bg-[#FEF3C7] border border-[#FCD34D] rounded text-center flex-1">
            <span className="text-[8px] text-[#64748B] block font-sans">Pointer *p</span>
            <span className="font-bold text-[#92400E]">&amp;a</span>
          </div>
        </div>
        <p className="text-[9px] font-handwriting text-[#64748B] italic pt-0.5">
          ✎ dereferencing access directly in RAM
        </p>
      </div>
    );
  };

  return (
    <div className={`relative aspect-[3/4] w-full ${className}`}>
      {/* If real image provided and hasn't errored, display it inside the glossy frame */}
      {imageSrc && !imageError ? (
        <div className="book-cover-3d w-full h-full bg-[#0B3561] relative group rounded-2xl overflow-hidden shadow-lg">
          <img
            src={imageSrc}
            alt={slot?.altText || `${title} Handwritten Coding Notes Book Cover`}
            loading="lazy"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover block"
          />
          {/* Subtle glossy sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-white/10 to-transparent pointer-events-none" />
        </div>
      ) : (
        /* REVERSE DESIGN: Bright, Tactile Warm Cream Paper Notebook with Spiral Binding */
        <div
          className="w-full h-full bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 flex flex-col justify-between select-none relative overflow-hidden border border-[#0B3561]/12 shadow-md hover:shadow-xl transition-all duration-300"
          style={{
            boxShadow:
              '-4px 0 10px -2px rgba(10, 25, 47, 0.08), 0 10px 25px -5px rgba(10, 25, 47, 0.1), 0 0 0 1px rgba(10, 25, 47, 0.06)',
          }}
        >
          {/* Left Spiral Wire Rings Binding Effect */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#E5E0D4] to-[#FAF7F0] border-r border-[#0B3561]/15 flex flex-col justify-around py-2 z-20 pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex items-center pl-0.5">
                {/* Punched hole */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#334E68]/30 shadow-inner" />
                {/* Wire spiral ring */}
                <div className="w-3.5 h-1 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 rounded-full shadow-xs -ml-1 border-t border-white" />
              </div>
            ))}
          </div>

          {/* Faint Tactile Notebook Lined Paper Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0, transparent 23px, #CBD5E1 23px, #CBD5E1 24px)',
            }}
          />

          {/* Top Header Tag & Edition */}
          <div className="relative z-10 pl-3 space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded font-heading tracking-wide ${hlScheme.badge} border ${hlScheme.border}`}
              >
                100% Handwritten
              </span>
              <span className="text-[9px] font-mono text-[#627D98] font-semibold">
                {editionText}
              </span>
            </div>

            {/* Handwritten Title with realistic highlighter swipe effect */}
            <div className="pt-1">
              <p className="text-[9px] font-mono text-[#12A5B0] uppercase tracking-wider font-bold">
                PyNotes Series
              </p>
              <div className="relative inline-block mt-0.5">
                <span
                  className={`absolute inset-x-0 bottom-0.5 h-3 ${hlScheme.bg} opacity-90 rounded-sm -rotate-1 pointer-events-none`}
                />
                <h4 className="relative font-handwriting text-2xl sm:text-[26px] font-bold text-[#0B3561] leading-tight tracking-wide drop-shadow-xs">
                  {title}
                </h4>
              </div>
            </div>
          </div>

          {/* Middle: Clear White/Cream Paper Diagram Box with Hand-Drawn Algorithms */}
          <div className="relative z-10 pl-3 my-2 bg-white/95 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-[#0B3561]/12 shadow-xs">
            {renderSubjectDiagram()}
          </div>

          {/* Bottom Trust Stamp & Paper Quality Features */}
          <div className="relative z-10 pl-3 pt-2 border-t border-[#0B3561]/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[10px] text-[#0B3561] font-bold">
                <span className="text-[#12A5B0]">★</span>
                <span>Full Colour Print</span>
              </div>
              <div className="text-[9px] text-[#627D98] font-mono">
                100 GSM Cream Paper
              </div>
            </div>

            {/* Embossed Gold Paper Seal */}
            <div className="w-9 h-9 rounded-full border border-[#12A5B0]/50 bg-gradient-to-tr from-[#FEF3C7] to-[#FDE68A] flex flex-col items-center justify-center shadow-xs">
              <span className="text-[7px] font-black text-[#92400E] leading-none">PY</span>
              <span className="text-[6px] text-[#78350F] tracking-tighter uppercase font-mono font-bold">
                ORIGINAL
              </span>
            </div>
          </div>

          {/* Gentle Glossy Surface Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none z-30" />
        </div>
      )}
    </div>
  );
};
