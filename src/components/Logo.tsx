import React, { useState } from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'wordmark' | 'icon';
  surface?: 'light' | 'dark' | 'highlight';
  customUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  surface = 'light',
  customUrl,
  className = '',
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);
  // Default to official uploaded primary stacked full-color logo
  const logoSrc = customUrl || '/PyNotes_Primary-Stacked_FullColor.png';

  const heightClass = {
    sm: 'h-10 sm:h-12',
    md: 'h-12 sm:h-16',
    lg: 'h-18 sm:h-22',
    xl: 'h-28 sm:h-36',
  }[size];

  // If on dark surface (e.g. footer), wrap in a clean white capsule card so full-color logo pops
  if (surface === 'dark') {
    return (
      <div className={`inline-flex items-center bg-white px-3.5 py-2 rounded-2xl border border-white/30 shadow-md ${className}`}>
        {!imageError ? (
          <img
            src={logoSrc}
            alt="PyNotes - Learn . Write . Grow"
            onError={() => setImageError(true)}
            className={`${heightClass} w-auto object-contain block`}
          />
        ) : (
          <div className="font-display font-black text-2xl tracking-tight text-[#0B3561]">
            Py<span className="text-[#12A5B0]">Notes</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      {!imageError ? (
        <img
          src={logoSrc}
          alt="PyNotes - Learn . Write . Grow"
          onError={() => setImageError(true)}
          className={`${heightClass} w-auto object-contain block drop-shadow-xs`}
        />
      ) : (
        /* Fallback text badge if image fails to load */
        <div className="font-display font-black text-2xl tracking-tight text-[#0B3561]">
          Py<span className="text-[#12A5B0]">Notes</span>
        </div>
      )}
    </div>
  );
};
