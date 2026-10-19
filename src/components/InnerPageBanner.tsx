import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface InnerPageBannerProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  hideBreadcrumbs?: boolean;
}

const PAGE_BACKGROUNDS: Record<string, string> = {
  '/subjects': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&auto=format&fit=crop&q=80',
  '/bundles': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1600&auto=format&fit=crop&q=80',
  '/checkout': 'https://images.unsplash.com/photo-1556742049-0a67d553c2a8?w=1600&auto=format&fit=crop&q=80',
  '/track': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&auto=format&fit=crop&q=80',
  '/account': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&auto=format&fit=crop&q=80',
  '/about': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80',
  '/contact': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=80',
  '/faq': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=80',
};

export const InnerPageBanner: React.FC<InnerPageBannerProps> = ({
  title,
  subtitle,
  backgroundImage,
  hideBreadcrumbs = false,
}) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const matchedBg = backgroundImage || PAGE_BACKGROUNDS[location.pathname] || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1600&auto=format&fit=crop&q=80';
  const displayTitle = title || (pathnames.length > 0 ? (pathnames[pathnames.length - 1] === 'auth' ? 'User account' : pathnames[pathnames.length - 1].replace(/-/g, ' ')) : 'Store');

  return (
    <div className="relative overflow-hidden text-white py-24 px-4 sm:px-8 border-b-4 border-[#12A5B0] shadow-2xl bg-[#071E38]">
      {/* Crystal Clear High-Visibility Background Image (90% Opacity) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 transform scale-102 transition-transform duration-1000 filter brightness-95"
        style={{ backgroundImage: `url(${matchedBg})` }}
      />
      {/* Soft Text Backdrop (Only behind text for readability while keeping picture fully visible) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      <div className="relative max-w-7xl mx-auto space-y-3 z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left bg-[#071E38]/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl max-w-2xl">
          {!hideBreadcrumbs && (
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-heading font-bold text-[#FFD54A] uppercase tracking-widest drop-shadow">
              <Link to="/" className="hover:underline text-[#DDF3F4]">Home</Link>
              {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                return (
                  <React.Fragment key={name}>
                    <span>/</span>
                    <Link to={routeTo} className="hover:underline capitalize text-[#12A5B0]">
                      {name === 'auth' ? 'User account' : name.replace(/-/g, ' ')}
                    </Link>
                  </React.Fragment>
                );
              })}
            </div>
          )}
          <h1 className="font-display font-black italic text-3xl sm:text-5xl text-white tracking-wide drop-shadow-xl capitalize">
            {displayTitle}
          </h1>
          {subtitle && (
            <p className="font-body text-sm sm:text-base text-[#DDF3F4] max-w-xl drop-shadow-md">
              {subtitle}
            </p>
          )}
        </div>

        {/* Floating Interactive Badge */}
        <div className="bg-[#0B3561]/90 border-2 border-[#12A5B0] backdrop-blur-md px-6 py-4 rounded-3xl text-center shadow-2xl animate-float">
          <span className="font-heading font-black text-xs text-[#FFD54A] uppercase tracking-wider block">
            100% Physical Print
          </span>
          <span className="font-body text-xs text-white font-bold">Express Shipped in India</span>
        </div>
      </div>
    </div>
  );
};
