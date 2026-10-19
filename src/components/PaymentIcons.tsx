import React from 'react';

export const UPIIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="UPI">
    <rect width="120" height="40" rx="6" fill="#FFFFFF"/>
    {/* UPI Arrows */}
    <path d="M42 8L54 20L42 32L46 32L58 20L46 8H42Z" fill="#097939"/>
    <path d="M32 8L44 20L32 32L36 32L48 20L36 8H32Z" fill="#ED752E"/>
    {/* Text 'UPI' */}
    <text x="64" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" fill="#0B3561" letterSpacing="0.5">UPI</text>
  </svg>
);

export const GooglePayIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Google Pay">
    <rect width="120" height="40" rx="6" fill="#FFFFFF"/>
    {/* Google G */}
    <g transform="translate(14, 10)">
      <path d="M19.6 10.23c0-.71-.06-1.39-.18-2.05H10v3.87h5.38a4.6 4.6 0 01-2 3.02v2.51h3.24c1.89-1.74 2.98-4.31 2.98-7.35z" fill="#4285F4"/>
      <path d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.11H1.05v2.59A9.99 9.99 0 0010 20z" fill="#34A853"/>
      <path d="M4.41 11.92a6 6 0 010-3.84V5.49H1.05a10 10 0 000 9.02l3.36-2.59z" fill="#FBBC05"/>
      <path d="M10 3.96c1.47 0 2.78.5 3.82 1.49l2.86-2.86C14.96.99 12.7 0 10 0 6.09 0 2.7 2.25 1.05 5.49l3.36 2.59c.79-2.36 2.99-4.12 5.59-4.12z" fill="#EA4335"/>
    </g>
    {/* Pay Text */}
    <text x="42" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="18" fill="#5F6368" letterSpacing="-0.5">Pay</text>
  </svg>
);

export const PhonePeIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="PhonePe">
    <rect width="120" height="40" rx="6" fill="#FFFFFF"/>
    {/* PhonePe Purple Circle & Logo */}
    <circle cx="24" cy="20" r="14" fill="#5F259F"/>
    <text x="18" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" fill="#FFFFFF">पे</text>
    {/* PhonePe text */}
    <text x="44" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="15" fill="#5F259F">PhonePe</text>
  </svg>
);

export const VisaIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Visa">
    <rect width="100" height="40" rx="6" fill="#FFFFFF"/>
    <text x="15" y="29" fontFamily="sans-serif" fontStyle="italic" fontWeight="900" fontSize="26" fill="#1A1F71" letterSpacing="1">VISA</text>
    <path d="M15 12L20 28H15L15 12Z" fill="#F7B600" opacity="0.9"/>
  </svg>
);

export const MastercardIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Mastercard">
    <rect width="100" height="40" rx="6" fill="#FFFFFF"/>
    <g transform="translate(24, 6)">
      <circle cx="16" cy="14" r="14" fill="#EB001B"/>
      <circle cx="36" cy="14" r="14" fill="#F79E1B" fillOpacity="0.92"/>
    </g>
  </svg>
);

export const RuPayIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg viewBox="0 0 110 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="RuPay">
    <rect width="110" height="40" rx="6" fill="#FFFFFF"/>
    <text x="12" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" fill="#0B3561" letterSpacing="-0.5">RuPay</text>
    {/* RuPay tricolor stripes */}
    <path d="M84 10L94 20L84 30H89L99 20L89 10H84Z" fill="#F47920"/>
    <path d="M92 10L102 20L92 30H97L107 20L97 10H92Z" fill="#00A551"/>
  </svg>
);
