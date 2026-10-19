import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface InnerPageBannerProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export const InnerPageBanner: React.FC<InnerPageBannerProps> = ({
  title,
  subtitle,
  backgroundImage = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1600&auto=format&fit=crop&q=80',
}) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const displayTitle = title || (pathnames.length > 0 ? pathnames[pathnames.length - 1].replace(/-/g, ' ') : 'Store');

  return (
    <div className="relative overflow-hidden bg-[#071E38] text-white py-16 px-4 sm:px-8 border-b-4 border-[#12A5B0] shadow-xl">
      {/* Parallax / Gradient Overlay Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 transform scale-105 transition-transform duration-1000 animate-pulse-slow"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071E38] via-[#0B3561]/90 to-[#071E38]/95" />

      <div className="relative max-w-7xl mx-auto space-y-3 z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-heading font-bold text-[#FFD54A] uppercase tracking-widest">
            <Link to="/" className="hover:underline text-[#DDF3F4]">Home</Link>
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              return (
                <React.Fragment key={name}>
                  <span>/</span>
                  <Link to={routeTo} className="hover:underline capitalize text-[#12A5B0]">
                    {name.replace(/-/g, ' ')}
                  </Link>
                </React.Fragment>
              );
            })}
          </div>
          <h1 className="font-display font-black italic text-3xl sm:text-5xl text-white tracking-wide drop-shadow-md capitalize">
            {displayTitle}
          </h1>
          {subtitle && (
            <p className="font-body text-sm sm:text-base text-[#DDF3F4]/90 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Floating Interactive Badge */}
        <div className="bg-[#12A5B0]/25 border border-[#12A5B0]/50 backdrop-blur-md px-6 py-4 rounded-3xl text-center shadow-2xl animate-float">
          <span className="font-heading font-black text-xs text-[#FFD54A] uppercase tracking-wider block">
            100% Physical Print
          </span>
          <span className="font-body text-xs text-white font-bold">Express Shipped in India</span>
        </div>
      </div>
    </div>
  );
};
