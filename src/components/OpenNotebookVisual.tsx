import React, { useState } from 'react';
import { getSlot } from '../config/imageSlots';

interface OpenNotebookVisualProps {
  className?: string;
}

export const OpenNotebookVisual: React.FC<OpenNotebookVisualProps> = ({ className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const slot = getSlot('hero_open_notebook');

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* If user provides a real image at slot.path, render it with glossy frame */}
      {slot.path && !imageError ? (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#0B3561]/10 bg-white">
          <img
            src={slot.path}
            alt={slot.altText}
            loading="lazy"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B3561]/20 via-transparent to-transparent pointer-events-none" />
        </div>
      ) : (
        /* High-fidelity Open Notebook Illustration with tactile spiral binding & colorful handwritten notes */
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#FAF7F0] p-4 sm:p-7 shadow-[0_25px_50px_-12px_rgba(10,25,47,0.22)] border border-[#0B3561]/12 overflow-hidden">
          {/* Notebook Spiral Spine Center */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-10 z-20 flex flex-col justify-between py-4 pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="w-5 sm:w-6 h-2 rounded-full bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-sm border border-slate-500/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800 -ml-1" />
              </div>
            ))}
          </div>

          {/* Left and Right Page Spread */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 relative z-10">
            {/* Left Page: Pointers & Memory Diagrams */}
            <div className="space-y-3 sm:space-y-4 pr-1 sm:pr-3 border-r border-[#0B3561]/8">
              <div className="flex items-center justify-between pb-2 border-b border-[#0B3561]/10">
                <span className="font-handwriting font-bold text-lg sm:text-2xl text-[#0B3561]">
                  Ch. 04: Pointers &amp; Memory
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-[#12A5B0] font-semibold">
                  pg. 42
                </span>
              </div>

              {/* Handwritten Note Snippet with Yellow Highlighter */}
              <div className="space-y-1">
                <p className="font-handwriting text-sm sm:text-base text-[#1E3A5F] leading-snug">
                  * A pointer stores the <span className="highlight-mark font-bold">memory address</span> of another variable in RAM.
                </p>
                <p className="font-handwriting text-xs sm:text-sm text-[#486581]">
                  Dereferencing (<code className="font-code text-xs text-[#DC2626] font-bold">*ptr</code>) reads the value stored at that address!
                </p>
              </div>

              {/* Memory Diagram with colored boxes */}
              <div className="p-2 sm:p-3 bg-white rounded-xl border border-[#0B3561]/10 shadow-xs space-y-2">
                <div className="text-[10px] font-mono text-[#486581] font-semibold">
                  MEMORY HEAP &amp; STACK TRACE:
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-[#FEF08A] p-1.5 rounded border border-[#FACC15] shadow-xs">
                    <div className="text-[9px] font-mono text-[#713F12]">0x7FFEE1</div>
                    <div className="font-bold text-xs text-[#0B3561]">x = 42</div>
                  </div>
                  <div className="bg-[#BBF7D0] p-1.5 rounded border border-[#86EFAC] shadow-xs">
                    <div className="text-[9px] font-mono text-[#14532D]">0x7FFEE8</div>
                    <div className="font-bold text-xs text-[#0B3561]">&amp;x (ptr)</div>
                  </div>
                  <div className="bg-[#FED7AA] p-1.5 rounded border border-[#FDBA74] shadow-xs">
                    <div className="text-[9px] font-mono text-[#7C2D12]">0x7FFEF0</div>
                    <div className="font-bold text-xs text-[#0B3561]">**ptr_ptr</div>
                  </div>
                </div>
                {/* Visual Arrow */}
                <div className="flex items-center justify-center text-[11px] font-handwriting text-[#12A5B0] font-bold">
                  ptr points directly to x ➔ [42]
                </div>
              </div>

              {/* Green Tip Box */}
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-2 rounded-lg">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#166534]">
                  <span>💡 Exam Tip:</span>
                  <span className="font-handwriting text-xs">Always initialize pointers to NULL to prevent dangling pointers!</span>
                </div>
              </div>
            </div>

            {/* Right Page: Flowchart & Recursive Call Tree */}
            <div className="space-y-3 sm:space-y-4 pl-1 sm:pl-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#0B3561]/10">
                <span className="font-handwriting font-bold text-lg sm:text-2xl text-[#0B3561]">
                  Recursion Call Stack
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-[#12A5B0] font-semibold">
                  pg. 43
                </span>
              </div>

              {/* Pink Highlighted Concept */}
              <div className="space-y-1">
                <p className="font-handwriting text-sm sm:text-base text-[#1E3A5F] leading-snug">
                  Base case is <span className="bg-[#FBCFE8] text-[#831843] px-1.5 py-0.5 rounded font-bold">mandatory</span> or recursion exceeds stack depth.
                </p>
              </div>

              {/* Visual Tree Diagram */}
              <div className="p-2 sm:p-3 bg-white rounded-xl border border-[#0B3561]/10 shadow-xs flex flex-col items-center">
                <div className="text-[10px] font-mono text-[#486581] font-semibold mb-1">
                  fibonacci(3) CALL TREE
                </div>
                {/* Node 1 */}
                <div className="px-2.5 py-1 rounded-md bg-[#FEF3C7] border border-[#F59E0B] text-xs font-mono font-bold text-[#92400E]">
                  fib(3) = 2
                </div>
                {/* Split Branches */}
                <div className="w-24 border-t-2 border-dashed border-[#12A5B0] my-1" />
                <div className="flex justify-between w-32 sm:w-40 text-center">
                  <div className="px-2 py-0.5 rounded bg-[#E0E7FF] border border-[#818CF8] text-[10px] font-mono font-semibold text-[#3730A3]">
                    fib(2) = 1
                  </div>
                  <div className="px-2 py-0.5 rounded bg-[#E0E7FF] border border-[#818CF8] text-[10px] font-mono font-semibold text-[#3730A3]">
                    fib(1) = 1
                  </div>
                </div>
              </div>

              {/* Orange Callout Box */}
              <div className="bg-[#FFF7ED] border border-[#FED7AA] p-2 rounded-lg">
                <div className="text-[10px] text-[#9A3412] font-semibold">
                  Time Complexity: <span className="font-code font-bold text-[#DC2626]">O(2ⁿ)</span> ➔ Memoize to <span className="font-code font-bold text-[#16A34A]">O(n)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ribbon Bookmark Accent */}
          <div className="absolute top-0 right-10 w-4 h-16 bg-gradient-to-b from-[#12A5B0] to-[#B45309] shadow-md rounded-b-sm pointer-events-none z-30" />
        </div>
      )}
    </div>
  );
};
