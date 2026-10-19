import React, { useState } from 'react';
import { AbstractShapes } from '../components/AbstractShapes';
import { Link } from 'react-router-dom';
import { SiteSettings } from '../types';
import { SEO } from '../components/SEO';

interface OfferPageProps {
  settings: SiteSettings;
}

export const OfferPage: React.FC<OfferPageProps> = ({ settings }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const offers = settings?.offers || [];
  
  // Get unique subjects for filter
  const subjects = ['All', ...new Set(offers.map(o => o.subject))];

  const filteredOffers = selectedSubject === 'All' 
    ? offers 
    : offers.filter(o => o.subject === selectedSubject);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#0B3561] relative overflow-hidden">
      <SEO 
        title="Special Offers" 
        description="Exclusive discounts and deals on handwritten study notes and exam bundles. Save more on your preparation with PyNotes." 
        keywords="Study Deals, Exam Discounts, Handwritten Notes Offers, PyNotes Coupons"
      />
      <AbstractShapes />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-12 relative z-10 w-full space-y-12">
        <div className="text-center space-y-3 pt-6">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#0B3561]">Exclusive Study Offers & Deals</h1>
          <p className="font-body text-sm text-[#3C5D81] max-w-2xl mx-auto">
            Grab limited-time discounts on handwritten notes, exam bundles, and test series. 
            Level up your preparation without breaking the bank.
          </p>
        </div>

        {/* CONTROLS: FILTER & VIEW TOGGLE */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSubject === sub
                    ? 'bg-[#0B3561] text-[#FFD54A] shadow-md'
                    : 'bg-[#F7FAFC] text-[#0B3561] hover:bg-[#DDF3F4]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#F7FAFC] p-1 rounded-xl border border-[#0B3561]/5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#12A5B0]' : 'text-[#3C5D81]'}`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#12A5B0]' : 'text-[#3C5D81]'}`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* OFFERS DISPLAY */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#0B3561]/20">
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="font-heading font-bold text-[#0B3561]">No offers found for this subject</h3>
            <p className="text-[#3C5D81] text-sm mt-1">Try selecting a different category or check back later.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filteredOffers.map(offer => (
              <div 
                key={offer.id} 
                className={`bg-white rounded-3xl border border-[#0B3561]/10 shadow-sm overflow-hidden hover:shadow-md transition-all flex ${viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'}`}
              >
                {/* Offer Image */}
                <div className={`${viewMode === 'list' ? 'sm:w-64 h-48 sm:h-auto' : 'h-48'} relative shrink-0`}>
                  <img 
                    src={offer.image_url} 
                    alt={offer.title} 
                    className="w-full h-full object-cover"
                  />
                  {offer.badge && (
                    <div className="absolute top-4 left-4 bg-[#FFD54A] text-[#071E38] text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
                      {offer.badge}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#0B3561] text-[10px] font-bold px-2 py-1 rounded-lg border border-[#0B3561]/10">
                    {offer.subject}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1 space-y-3">
                    <div className="text-[#12A5B0] font-black text-xl leading-none">
                      {offer.discount_text}
                    </div>
                    <h3 className="font-heading font-bold text-lg leading-tight text-[#0B3561]">
                      {offer.title}
                    </h3>
                    <p className="text-[#3C5D81] text-xs line-clamp-2">
                      {offer.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#3C5D81]/70">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Valid until {offer.valid_until}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#0B3561]/5 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#3C5D81] font-bold uppercase tracking-widest">Coupon Code</span>
                      <span className="font-display font-black text-[#0B3561] tracking-wider select-all cursor-copy" title="Click to copy">
                        {offer.coupon_code}
                      </span>
                    </div>
                    <Link 
                      to="/"
                      className="bg-[#0B3561] text-[#FFD54A] px-6 py-2.5 rounded-xl font-heading font-bold text-xs hover:bg-[#071E38] transition shadow-sm"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TRUST BANNER */}
        <div className="bg-[#0B3561] rounded-[2rem] p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#12A5B0]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white relative z-10">
            Never Miss a Deal Again!
          </h2>
          <p className="text-[#DDF3F4] text-sm max-w-xl mx-auto relative z-10">
            Join our WhatsApp community for instant alerts on new offers, free sample notes, and exam notifications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <a 
              href={`https://wa.me/${settings?.whatsapp_number?.replace(/\+/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] text-white px-8 py-3.5 rounded-2xl font-heading font-bold flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg"
            >
              Join WhatsApp Deals Channel
            </a>
            <Link 
              to="/subscription"
              className="bg-[#FFD54A] text-[#071E38] px-8 py-3.5 rounded-2xl font-heading font-bold flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg"
            >
              Get All-Access Pass
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
