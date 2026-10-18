import React from 'react';
import { PenUnderlineSVG } from '../components/Icons';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs uppercase px-3 py-1 rounded-full border border-[#12A5B0]/30">
          LEARN . WRITE . GROW
        </span>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561]">
          About{' '}
          <span className="relative inline-block text-[#12A5B0]">
            PyNotes
            <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
          </span>
        </h1>
        <p className="font-body text-[#3C5D81] text-sm max-w-lg mx-auto">
          Simplifying computer science and coding education across India through handwritten, visual, printed study books.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#0B3561]/10 shadow-lg space-y-6 text-sm text-[#3C5D81] leading-relaxed">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Our Story & Vision</h3>
        <p>
          Coding education in India has long been dominated by dense 800-page textbooks and confusing digital PDFs that cause screen fatigue. PyNotes was born with a simple mission: bring human handwriting back to learning.
        </p>
        <p>
          Every PyNotes book is carefully crafted with color-coded syntax, step-by-step logic execution traces, and high-memory-retention visual diagrams. We print every book on premium paper and deliver them directly to students' doorsteps across every state in India.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-[#F7FAFC] p-4 rounded-2xl border border-[#0B3561]/10 text-center">
            <span className="font-display font-black text-2xl text-[#0B3561] block">13+</span>
            <span className="font-heading font-bold text-xs text-[#12A5B0]">Core Subjects</span>
          </div>
          <div className="bg-[#F7FAFC] p-4 rounded-2xl border border-[#0B3561]/10 text-center">
            <span className="font-display font-black text-2xl text-[#0B3561] block">100%</span>
            <span className="font-heading font-bold text-xs text-[#12A5B0]">Printed Books</span>
          </div>
          <div className="bg-[#F7FAFC] p-4 rounded-2xl border border-[#0B3561]/10 text-center">
            <span className="font-display font-black text-2xl text-[#0B3561] block">All India</span>
            <span className="font-heading font-bold text-xs text-[#12A5B0]">Express Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
};
