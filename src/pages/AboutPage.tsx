import React from 'react';
import { PenUnderlineSVG } from '../components/Icons';
import { EditorialVisual } from '../components/EditorialVisual';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="bg-[#FEF3C7] text-[#92400E] font-heading font-bold text-xs uppercase px-3 py-1 rounded-full border border-[#D97706]/30">
          LEARN · WRITE · GROW
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#0A192F]">
          About{' '}
          <span className="relative inline-block text-[#D97706] font-handwriting italic font-bold">
            PyNotes
            <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#D97706" />
          </span>
        </h1>
        <p className="font-body text-[#486581] text-sm max-w-lg mx-auto">
          Simplifying computer science and coding education across India through printed, colorful handwritten study books.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#0A192F]/10 shadow-lg space-y-6 text-sm text-[#334E68] leading-relaxed">
        <h2 className="font-heading font-bold text-xl text-[#0A192F]">Our Story &amp; Founder&apos;s Mission</h2>
        
        <p>
          In <strong>2015</strong>, founder <strong>Mr. Raibha Dutta</strong> recognized a universal frustration among computer science and engineering students across India: while programming is fundamentally visual and structural, traditional learning was bogged down in dry 800-page textbooks and confusing digital PDF slides that cause severe screen fatigue.
        </p>

        <p>
          Students were struggling to visualize how pointers traverse memory, how recursion unwinds on the stack, and how database queries join relational tables. Mr. Raibha Dutta began illustrating code execution line-by-line with fine-point ink pens and vibrant highlighters — turning abstract programming concepts into intuitive visual roadmaps.
        </p>

        <p>
          Today, <strong>PyNotes</strong> produces comprehensive, colorful printed compendiums across 13 core computer science subjects. Every book is printed on heavyweight 100 GSM natural cream paper that supports active highlighting and margin note-taking without ink bleed.
        </p>

        {/* Visual Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <EditorialVisual slotId="notes_macro_diagram" aspectRatio="4:3" />
          <EditorialVisual slotId="student_studying" aspectRatio="4:3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#0A192F]/10 text-center">
            <span className="font-heading font-black text-2xl text-[#0A192F] block">13</span>
            <span className="font-heading font-bold text-xs text-[#D97706]">Core CS Subjects</span>
          </div>
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#0A192F]/10 text-center">
            <span className="font-heading font-black text-2xl text-[#0A192F] block">100 GSM</span>
            <span className="font-heading font-bold text-xs text-[#D97706]">Bleed-Proof Paper</span>
          </div>
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#0A192F]/10 text-center">
            <span className="font-heading font-black text-2xl text-[#0A192F] block">All India</span>
            <span className="font-heading font-bold text-xs text-[#D97706]">Express Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
