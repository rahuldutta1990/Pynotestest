import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product, Subject } from '../types';
import { PlaceholderCover } from '../components/PlaceholderCover';
import { PenUnderlineSVG } from '../components/Icons';

interface SubjectsPageProps {
  subjects: Subject[];
  products: Product[];
  onAddToCart: (slug: string, qty: number) => void;
}

export const SubjectsPage: React.FC<SubjectsPageProps> = ({
  subjects,
  products,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  let filteredProducts = products.filter(p => p.type === 'book' && p.status === 'active');

  if (selectedSubjectFilter !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.slug.includes(selectedSubjectFilter));
  }

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price_paise - b.price_paise);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price_paise - a.price_paise);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561]">
          All Handwritten Printed{' '}
          <span className="relative inline-block text-[#12A5B0]">
            Books
            <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
          </span>
        </h1>
        <p className="font-body text-[#3C5D81] text-sm max-w-lg mx-auto">
          Browse our complete catalog of 13 printed handwritten coding subject notes across C, C++, Java, Python, DSA, SQL, DBMS, OS, and Web Dev.
        </p>
      </div>

      {/* Filters & Sort Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#0B3561]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1">
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition ${
              selectedSubjectFilter === 'all'
                ? 'bg-[#0B3561] text-white shadow-xs'
                : 'bg-[#F7FAFC] text-[#0B3561] border border-[#0B3561]/20 hover:bg-[#DDF3F4]'
            }`}
          >
            All (13)
          </button>
          {subjects.map(sub => (
            <button
              key={sub.slug}
              onClick={() => setSelectedSubjectFilter(sub.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold whitespace-nowrap transition ${
                selectedSubjectFilter === sub.slug
                  ? 'bg-[#0B3561] text-white shadow-xs'
                  : 'bg-[#F7FAFC] text-[#0B3561] border border-[#0B3561]/20 hover:bg-[#DDF3F4]'
              }`}
            >
              {sub.menu_label || sub.name}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="text-xs font-heading font-bold text-[#0B3561]">Sort By:</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[#F7FAFC] border border-[#0B3561]/20 text-xs font-heading font-semibold text-[#0B3561] rounded-xl px-3 py-1.5 focus:border-[#12A5B0]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(prod => {
          const savingsPercent = Math.round(((prod.mrp_paise - prod.price_paise) / prod.mrp_paise) * 100);

          return (
            <div
              key={prod.slug}
              className="bg-white rounded-2xl p-6 border border-[#0B3561]/10 shadow-md hover:-translate-y-1 hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => navigate(`/product/${prod.slug}`)}
                  className="cursor-pointer mb-5 relative group"
                >
                  <PlaceholderCover
                    title={prod.title.replace(' Simplified Handwritten Notes', '')}
                    accentColor="#12A5B0"
                    imageUrl={prod.images && prod.images.length > 0 ? prod.images[0] : undefined}
                  />

                  {savingsPercent > 0 && (
                    <div className="absolute bottom-3 left-3 bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs px-3 py-1 rounded-full border border-[#12A5B0]/40 shadow-sm flex items-center gap-1.5">
                      <span>SAVE {savingsPercent}%</span>
                    </div>
                  )}
                </div>

                <h3
                  onClick={() => navigate(`/product/${prod.slug}`)}
                  className="font-heading font-bold text-base text-[#0B3561] text-center line-clamp-2 hover:text-[#12A5B0] cursor-pointer transition min-h-[48px]"
                >
                  {prod.title}
                </h3>

                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="font-body text-xs text-[#9DAEC0] line-through font-semibold">
                    Rs. {(prod.mrp_paise / 100).toFixed(2)}
                  </span>
                  <span className="font-display font-black italic text-lg text-[#0B3561]">
                    From Rs. {(prod.price_paise / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#0B3561]/5 flex gap-2">
                <button
                  onClick={() => onAddToCart(prod.slug, 1)}
                  className="flex-1 bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs py-3 rounded-xl hover:brightness-105 transition shadow-xs"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/product/${prod.slug}`}
                  className="px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/20 text-[#0B3561] font-heading font-bold text-xs rounded-xl hover:bg-[#DDF3F4] transition"
                >
                  View
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
