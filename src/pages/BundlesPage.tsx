import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full inline-block">
          Complete Curated Combos
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#0A192F]">
          Multi-Book Printed Study{' '}
          <span className="relative inline-block text-[#D97706] font-handwriting italic font-bold">
            Bundles
            <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#D97706" />
          </span>
        </h1>
        <p className="font-body text-[#486581] text-sm leading-relaxed">
          Save extra when you order curated book sets. Delivered together in one protective package with express dispatch and tracking across India.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bundleProducts.map(bundle => {
          const savingsPercent = Math.round(((bundle.mrp_paise - bundle.price_paise) / bundle.mrp_paise) * 100);

          return (
            <div
              key={bundle.slug}
              className="glossy-book-card rounded-3xl p-6 sm:p-7 border border-[#D97706]/20 bg-white flex flex-col sm:flex-row gap-6 items-center hover:shadow-2xl transition"
            >
              {/* Cover Preview */}
              <div className="w-full sm:w-1/2 aspect-[3/4] rounded-2xl flex items-center justify-center relative">
                <PlaceholderCover title={bundle.title} accentColor="#D97706" />
                {savingsPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#FEF08A] text-[#0A192F] font-mono font-bold text-xs px-2.5 py-1 rounded shadow-xs z-20">
                    SAVE {savingsPercent}%
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="w-full sm:w-1/2 space-y-4 flex flex-col justify-between h-full">
                <div>
                  <span className="bg-[#FEF3C7] text-[#92400E] font-heading font-bold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                    SPECIAL COMBO
                  </span>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#0A192F] mt-2 leading-snug">
                    {bundle.title}
                  </h3>
                  <p className="font-body text-xs text-[#627D98] mt-1.5 line-clamp-3 leading-relaxed">
                    {bundle.short_desc}
                  </p>

                  {/* Included Books List */}
                  {bundle.bundle_items && (
                    <div className="mt-3 bg-[#FAF7F0] p-3 rounded-xl border border-[#0A192F]/8">
                      <span className="font-heading font-bold text-[11px] text-[#0A192F] block mb-1">
                        Includes {bundle.bundle_items.length} Printed Books:
                      </span>
                      <ul className="text-[11px] text-[#486581] space-y-0.5 font-medium">
                        {bundle.bundle_items.map(bi => (
                          <li key={bi.book_slug}>✓ {bi.book_slug.toUpperCase().replace(/-/g, ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div className="pt-2 border-t border-[#0A192F]/8">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-heading font-bold text-2xl text-[#0A192F]">
                      ₹{(bundle.price_paise / 100).toFixed(0)}
                    </span>
                    <span className="font-mono text-xs text-[#9DAEC0] line-through">
                      ₹{(bundle.mrp_paise / 100).toFixed(0)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onAddToCart(bundle.slug, 1)}
                      className="flex-1 bg-[#D97706] text-white font-heading font-bold text-xs py-3 rounded-xl hover:bg-[#B45309] transition shadow-xs cursor-pointer"
                    >
                      Add Bundle
                    </button>
                    <button
                      onClick={() => {
                        onAddToCart(bundle.slug, 1);
                        navigate('/checkout');
                      }}
                      className="bg-[#0A192F] text-white font-heading font-bold text-xs px-4 py-3 rounded-xl hover:bg-[#132742] transition cursor-pointer"
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
