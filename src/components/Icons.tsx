import React from 'react';

interface IconProps {
  className?: string;
  navyColor?: string;
  tealColor?: string;
}

export const NotesIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 10C6 8.89543 6.89543 8 8 8H22V38H8C6.89543 38 6 37.1046 6 36V10Z" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42 10C42 8.89543 41.1046 8 40 8H26V38H40C41.1046 38 42 37.1046 42 36V10Z" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 8V38" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M11 16H17" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M11 22H17" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M31 16H37" stroke={tealColor} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M31 22H35" stroke={tealColor} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 14L6 24L16 34" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 14L42 24L32 34" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M27 10L21 38" stroke={tealColor} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const HandwrittenIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 34L32 14L38 20L18 40H12V34Z" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M28 18L34 24" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M8 44C16 42 28 45 40 43" stroke={tealColor} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const TruckIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12H30V32H6V12Z" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30 18H38L42 24V32H30V18Z" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="34" r="4" stroke={navyColor} strokeWidth="2.6" />
    <circle cx="34" cy="34" r="4" stroke={tealColor} strokeWidth="2.6" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" stroke={navyColor} strokeWidth="2.6" />
    <path d="M15 24L21 30L33 18" stroke={tealColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CrossIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" stroke={navyColor} strokeWidth="2.6" opacity="0.4" />
    <path d="M16 16L32 32M32 16L16 32" stroke={tealColor} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const CartIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10H14L18 30H36L40 16H16" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="38" r="3" stroke={navyColor} strokeWidth="2.6" />
    <circle cx="34" cy="38" r="3" stroke={tealColor} strokeWidth="2.6" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="12" stroke={navyColor} strokeWidth="2.6" />
    <path d="M29 29L40 40" stroke={tealColor} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

interface UserIconProps extends IconProps {
  showDot?: boolean;
}

export const UserIcon: React.FC<UserIconProps> = ({ className = 'w-6 h-6', navyColor = 'currentColor', tealColor = '#12A5B0', showDot = true }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="16" r="8" stroke={navyColor} strokeWidth="2.6" />
    <path d="M10 38C10 30 16 28 24 28C32 28 38 30 38 38" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" />
    {showDot && <circle cx="34" cy="12" r="2" fill={tealColor} />}
  </svg>
);

export const TagIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8H22L40 26L26 40L8 22V8Z" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="16" r="3" fill={tealColor} />
  </svg>
);

export const WhatsappIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 6C14.0589 6 6 14.0589 6 24C6 27.4872 6.9939 30.742 8.71887 33.5133L6.5 41.5L14.7303 39.3402C17.4093 40.9202 20.5332 41.8333 23.8667 41.8333C33.8078 41.8333 41.8667 33.7744 41.8667 23.8333C41.8667 13.8922 33.9411 6 24 6Z"
      fill="#25D366"
    />
    <path
      d="M18 15C17.4477 15 16.5 15.5 16 17C15.5 18.5 15.5 20.5 17.5 24.5C19.5 28.5 23 31.5 27 32.5C29 33 30.5 32.5 31.5 31.5C32.5 30.5 33 29.5 32.5 28.5L30.5 26.5C30 26 29 26 28.5 26.5L27.5 27.5C27 28 26 28 25.5 27.5C23.5 25.5 22.5 24 22 23.5C21.5 23 21.5 22 22 21.5L23 20.5C23.5 20 23.5 19 23 18.5L21 16.5C20.5 16 19.5 16 19 16.5L18 15Z"
      fill="white"
    />
  </svg>
);

export const IdeaIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28C14 24 14 18 18 14C22 10 28 10 32 14C36 18 36 24 32 28C30 30 28 32 28 36H20C20 32 18 30 16 28Z" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 42H28" stroke={tealColor} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const SparkIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', tealColor = '#12A5B0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8V16M24 32V40M8 24H16M32 24H40" stroke={tealColor} strokeWidth="3" strokeLinecap="round" />
    <path d="M12.6863 12.6863L18.3431 18.3431M29.6569 29.6569L35.3137 35.3137" stroke={tealColor} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const PenUnderlineSVG: React.FC<{ className?: string; color?: string }> = ({ className = 'w-full h-3', color = '#12A5B0' }) => (
  <svg viewBox="0 0 200 12" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M3 8C45 3 110 2 197 9C155 11 80 11 12 7" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', navyColor = '#0B3561' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 18C12 13 16 9 20 9C24 9 26 12 26 14C26 12 28 9 32 9C36 9 40 13 40 18C40 24 34 31 26 39L24 41L22 39C14 31 8 24 8 18C8 14 10 12 12 12Z" stroke={navyColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
