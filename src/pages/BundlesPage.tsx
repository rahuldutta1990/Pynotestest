import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { PlaceholderCover } from '../components/PlaceholderCover';
import { PenUnderlineSVG } from '../components/Icons';

interface BundlesPageProps {
  products: Product[];
  onAddToCart: (slug: string, qty: number) => void;
}

export const BundlesPage: React.FC<BundlesPageProps> = ({ products, onAddToCart }) => {
  const navigate = useNavigate();
  const bundleProducts = products.filter(p => p.type === 'bundle');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561]">
          Multi-Book Printed Study{' '}
          <span className="relative inline-block text-[#12A5B0]">
            Bundles
            <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
          </span>
        </h1>
        <p className="font-body text-[#3C5D81] text-sm max-w-lg mx-auto">
          Save extra when you order curated book sets. Delivered together in one parcel with free shipping across India.
        </p>
      </div>

      {/* 2x2 or 3 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bundleProducts.map(bundle => {
          const savingsPercent = Math.round(((bundle.mrp_paise - bundle.price_paise) / bundle.mrp_paise) * 100);

          return (
            <div
              key={bundle.slug}
              className="bg-white rounded-3xl p-6 border-2 border-[#12A5B0]/30 shadow-xl flex flex-col sm:flex-row gap-6 items-center hover:shadow-2xl transition"
            >
              {/* Cover Fan / Preview */}
              <div className="w-full sm:w-1/2 aspect-[3/4] bg-[#DDF3F4] rounded-2xl p-4 flex items-center justify-center border border-[#12A5B0]/20 relative">
                <PlaceholderCover title={bundle.title} accentColor="#12A5B0" />
                {savingsPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#FFD54A] text-[#071E38] font-heading font-black text-xs px-3 py-1 rounded-full shadow">
                    SAVE {savingsPercent}%
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="w-full sm:w-1/2 space-y-4 flex flex-col justify-between h-full">
                <div>
                  <span className="bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    SPECIAL COMBO BUNDLE
                  </span>
                  <h3 className="font-heading font-bold text-xl text-[#0B3561] mt-2 leading-snug">
                    {bundle.title}
                  </h3>
                  <p className="font-body text-xs text-[#3C5D81] mt-1 line-clamp-3">
                    {bundle.short_desc}
                  </p>

                  {/* Included Books List */}
                  {bundle.bundle_items && (
                    <div className="mt-3 bg-[#F7FAFC] p-3 rounded-xl border border-[#0B3561]/10">
                      <span className="font-heading font-bold text-[11px] text-[#0B3561] block mb-1">
                        Includes {bundle.bundle_items.length} Printed Books:
                      </span>
                      <ul className="text-[11px] text-[#3C5D81] space-y-0.5 font-medium">
                        {bundle.bundle_items.map(bi => (
                          <li key={bi.book_slug}>✓ {bi.book_slug.toUpperCase().replace(/-/g, ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-body text-xs text-[#9DAEC0] line-through font-semibold">
                      Rs. {(bundle.mrp_paise / 100).toFixed(2)}
                    </span>
                    <span className="font-display font-black italic text-2xl text-[#0B3561]">
                      Rs. {(bundle.price_paise / 100).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onAddToCart(bundle.slug, 1)}
                      className="flex-1 bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs py-3 rounded-xl hover:brightness-105 transition shadow-sm"
                    >
                      Add Bundle
                    </button>
                    <button
                      onClick={() => {
                        onAddToCart(bundle.slug, 1);
                        navigate('/checkout');
                      }}
                      className="bg-[#0B3561] text-white font-heading font-bold text-xs px-4 py-3 rounded-xl hover:bg-[#071E38] transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
