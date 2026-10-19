import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'wordmark' | 'icon';
  surface?: 'light' | 'dark' | 'highlight';
  customUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  surface = 'light',
  customUrl,
  className = '',
  size = 'md',
}) => {
  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt="PyNotes Logo"
        className={`object-contain ${className}`}
        style={{
          maxHeight: size === 'sm' ? '32px' : size === 'md' ? '48px' : size === 'lg' ? '64px' : '80px',
        }}
      />
    );
  }

  // Define colors based on surface rules:
  // light: Navy (var(--navy)), Teal (var(--teal))
  // dark: mono white
  // highlight: Navy
  let pyColor = surface === 'dark' ? '#FFFFFF' : 'var(--navy)';
  let notesColor = surface === 'dark' ? '#FFFFFF' : surface === 'highlight' ? 'var(--navy)' : 'var(--teal)';
  let taglineColor = surface === 'dark' ? 'var(--margin-mint)' : surface === 'highlight' ? 'var(--ink-night)' : '#3C5D81';

  // SVG Icon mark
  const IconMark = (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book base / pages */}
      <path
        d="M8 12C8 9.79086 9.79086 8 12 8H22V38H12C9.79086 38 8 36.2091 8 34V12Z"
        fill={surface === 'dark' ? '#FFFFFF' : '#0B3561'}
        fillOpacity={surface === 'dark' ? '0.2' : '0.1'}
        stroke={pyColor}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M40 12C40 9.79086 38.2091 8 36 8H26V38H36C38.2091 38 40 36.2091 40 34V12Z"
        fill={surface === 'dark' ? '#FFFFFF' : '#12A5B0'}
        fillOpacity={surface === 'dark' ? '0.2' : '0.15'}
        stroke={pyColor}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* Center spine */}
      <path d="M24 8V38" stroke={pyColor} strokeWidth="2.6" strokeLinecap="round" />
      {/* Code symbol on left page: < /> */}
      <path
        d="M13 20L10 23L13 26"
        stroke={notesColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 20L22 23L19 26"
        stroke={notesColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handwritten pen strokes on right page */}
      <path d="M29 18H37" stroke={notesColor} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29 23H35" stroke={notesColor} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29 28H37" stroke={notesColor} strokeWidth="2.2" strokeLinecap="round" />
      {/* Pen swoosh spark under right book */}
      <path
        d="M26 40C30 42 36 41 40 39"
        stroke={notesColor}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'icon') {
    const dim = size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-20 h-20';
    return <div className={`${dim} ${className}`}>{IconMark}</div>;
  }

  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex items-center font-display ${className}`}>
        <span className="font-black italic text-2xl tracking-tight" style={{ color: pyColor }}>
          Py
        </span>
        <span className="font-black italic text-2xl tracking-tight ml-0.5" style={{ color: notesColor }}>
          Notes
        </span>
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        <div className="w-12 h-12 mb-1">{IconMark}</div>
        <div className="font-display font-black italic text-2xl tracking-tight leading-none">
          <span style={{ color: pyColor }}>Py</span>
          <span style={{ color: notesColor }}>Notes</span>
        </div>
        <span
          className="font-heading font-semibold text-[10px] uppercase tracking-[0.18em] mt-1"
          style={{ color: taglineColor }}
        >
          Learn . Write . Grow
        </span>
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 flex-shrink-0">{IconMark}</div>
      <div className="flex flex-col leading-none">
        <div className="font-display font-black italic text-xl sm:text-2xl tracking-tight">
          <span style={{ color: pyColor }}>Py</span>
          <span style={{ color: notesColor }}>Notes</span>
        </div>
        <span
          className="font-heading font-semibold text-[9px] uppercase tracking-[0.18em] mt-0.5"
          style={{ color: taglineColor }}
        >
          Learn . Write . Grow
        </span>
      </div>
    </div>
  );
};
