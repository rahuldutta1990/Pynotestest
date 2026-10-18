import React, { useState, useRef, useCallback } from 'react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeTitle?: string;
  afterTitle?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeTitle = 'Standard Textbook / Plain Text',
  afterTitle = 'PyNotes Handwritten Colourful Notes',
}) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="my-10">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-[#0B3561]/20 select-none cursor-ew-resize bg-[#F7FAFC]"
      >
        {/* AFTER (Right / Bottom layer) - Handwritten Notes */}
        <div className="absolute inset-0 w-full h-full bg-[#DDF3F4] flex flex-col justify-between p-6 sm:p-10">
          {afterImage ? (
            <img src={afterImage} alt="After Notes" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col justify-between h-full bg-[#0B3561] text-white p-6 rounded-xl border-2 border-[#12A5B0]">
              <div className="flex justify-between items-center">
                <span className="font-heading font-bold text-xs uppercase text-[#12A5B0] tracking-wider">
                  {afterTitle}
                </span>
                <span className="bg-[#FFD54A] text-[#071E38] font-bold text-[10px] px-2 py-0.5 rounded">
                  PyNotes Way
                </span>
              </div>

              <div className="my-auto font-code text-xs sm:text-sm space-y-2 text-[#DDF3F4] bg-[#071E38] p-4 rounded-lg border border-[#12A5B0]/40">
                <p className="text-[#12A5B0] font-bold">// Clear Visual Memory Map</p>
                <p className="text-white font-bold">struct Node &#123; int data; Node* next; &#125;;</p>
                <p className="text-[#FFD54A] font-semibold font-display italic">
                  ★ Highlight: O(1) Insertion at Head!
                </p>
                <div className="w-full h-1.5 bg-[#12A5B0] rounded-full mt-2" />
              </div>

              <p className="font-body text-xs text-[#DDF3F4]/90 italic">
                Structured layout, color-coded syntax, and instant retention diagrams.
              </p>
            </div>
          )}
        </div>

        {/* BEFORE (Left / Top layer) - Plain Boring Book */}
        <div
          className="absolute inset-0 h-full overflow-hidden bg-[#E7EBEF] flex flex-col justify-between p-6 sm:p-10 border-r-2 border-[#12A5B0]"
          style={{ width: `${position}%` }}
        >
          {beforeImage ? (
            <img src={beforeImage} alt="Before Notes" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col justify-between h-full bg-white text-[#3C5D81] p-6 rounded-xl border border-gray-300 w-full">
              <div className="flex justify-between items-center">
                <span className="font-heading font-bold text-xs uppercase text-gray-500 tracking-wider">
                  {beforeTitle}
                </span>
                <span className="bg-gray-200 text-gray-700 font-bold text-[10px] px-2 py-0.5 rounded">
                  Confusing
                </span>
              </div>

              <div className="my-auto font-body text-xs sm:text-sm leading-relaxed text-gray-600 bg-gray-50 p-4 rounded border border-gray-200">
                <p>
                  A linked list is a linear data structure where elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers...
                </p>
                <p className="mt-2 text-gray-400 font-mono text-[11px]">
                  (Dense paragraphs, monochrome black text, hard to revise before exams)
                </p>
              </div>

              <p className="font-body text-xs text-gray-500 italic">
                Wastes hours trying to decipher long wall-of-text explanations.
              </p>
            </div>
          )}
        </div>

        {/* DRAG HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#12A5B0] shadow-2xl flex items-center justify-center pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="w-9 h-9 bg-[#0B3561] text-white border-2 border-[#12A5B0] rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2">
            <svg className="w-5 h-5 text-[#FFD54A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
            </svg>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-[#3C5D81] font-heading font-medium mt-3">
        👈 Drag handle to compare traditional textbooks vs PyNotes handwritten visual format 👉
      </p>
    </div>
  );
};
