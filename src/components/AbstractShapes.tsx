import React from 'react';

export const AbstractShapes: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-35">
      {/* Glowing Teal Blob */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#12A5B0]/20 rounded-full blur-3xl animate-pulse-slow" />
      {/* Glowing Yellow Blob */}
      <div className="absolute top-1/3 -right-12 w-72 h-72 bg-[#FFD54A]/15 rounded-full blur-3xl animate-pulse-slow" />
      {/* Floating Code Brackets */}
      <div className="absolute top-16 left-8 text-[#12A5B0]/25 font-code font-bold text-3xl animate-float">
        {'{ }'}
      </div>
      <div className="absolute bottom-20 right-12 text-[#FFD54A]/30 font-code font-bold text-4xl animate-float" style={{ animationDelay: '2s' }}>
        {'</>'}
      </div>
      <div className="absolute top-1/2 left-1/4 text-[#0B3561]/10 font-code font-bold text-5xl animate-float" style={{ animationDelay: '1s' }}>
        {'#include'}
      </div>
    </div>
  );
};
