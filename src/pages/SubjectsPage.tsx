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
    filteredProducts = filteredProducts.filter(p => p.slug.includes(selectedSubjectFilter) || p.subject_id === selectedSubjectFilter);
  }

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price_paise - b.price_paise);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price_paise - a.price_paise);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full inline-block">
          Complete Subject Library
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#0A192F]">
          All Handwritten Printed{' '}
          <span className="relative inline-block text-[#D97706] font-handwriting italic font-bold">
            Books
            <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#D97706" />
          </span>
        </h1>
        <p className="font-body text-[#486581] text-sm leading-relaxed">
          Browse our complete catalog of 13 printed handwritten coding subject notes across C, C++, Java, Python, DSA, SQL, DBMS, OS, and Web Technologies.
        </p>
      </div>

      {/* Filters & Sort Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#0A192F]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Subject Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1 scrollbar-hide">
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition cursor-pointer whitespace-nowrap ${
              selectedSubjectFilter === 'all'
                ? 'bg-[#0A192F] text-white shadow-xs'
                : 'bg-[#FAF7F0] text-[#0A192F] hover:bg-white border border-[#0A192F]/10'
            }`}
          >
            All ({products.filter(p => p.type === 'book').length})
          </button>
          {subjects.map(sub => (
            <button
              key={sub.slug}
              onClick={() => setSelectedSubjectFilter(sub.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSubjectFilter === sub.slug
                  ? 'bg-[#0A192F] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#0A192F] hover:bg-white border border-[#0A192F]/10'
              }`}
            >
              {sub.menu_label || sub.name}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="text-xs font-heading font-semibold text-[#627D98]">Sort By:</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[#FAF7F0] border border-[#0A192F]/15 text-xs font-heading font-medium text-[#0A192F] rounded-xl px-3 py-1.5 focus:border-[#D97706] focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map(prod => {
          const savingsPercent = Math.round(((prod.mrp_paise - prod.price_paise) / prod.mrp_paise) * 100);

          return (
            <div
              key={prod.slug}
              className="glossy-book-card p-5 rounded-2xl flex flex-col justify-between group bg-white"
            >
              <div>
                <div
                  onClick={() => navigate(`/product/${prod.slug}`)}
                  className="cursor-pointer mb-4 relative"
                >
                  <PlaceholderCover
                    title={prod.title.replace(' Simplified Handwritten Notes', '').replace(' Handwritten Notes', '')}
                    accentColor="#D97706"
                    imageUrl={prod.images && prod.images.length > 0 ? prod.images[0] : undefined}
                  />

                  {savingsPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-[#FEF08A] text-[#0A192F] font-mono font-bold text-[10px] px-2.5 py-0.5 rounded shadow-xs z-20">
                      <span>SAVE {savingsPercent}%</span>
                    </div>
                  )}
                </div>

                <h3
                  onClick={() => navigate(`/product/${prod.slug}`)}
                  className="font-heading font-bold text-base text-[#0A192F] hover:text-[#D97706] cursor-pointer transition line-clamp-2 min-h-[44px]"
                >
                  {prod.title}
                </h3>

                <p className="font-body text-xs text-[#627D98] mt-1 line-clamp-2 leading-relaxed">
                  {prod.short_desc}
                </p>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-heading font-bold text-xl text-[#0A192F]">
                    ₹{(prod.price_paise / 100).toFixed(0)}
                  </span>
                  <span className="font-mono text-xs text-[#9DAEC0] line-through">
                    ₹{(prod.mrp_paise / 100).toFixed(0)}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#0A192F]/8 flex gap-2">
                <button
                  onClick={() => onAddToCart(prod.slug, 1)}
                  className="flex-1 bg-[#D97706] text-white font-heading font-bold text-xs py-2.5 rounded-xl hover:bg-[#B45309] transition shadow-xs cursor-pointer"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/product/${prod.slug}`}
                  className="px-4 py-2.5 bg-[#FAF7F0] border border-[#0A192F]/10 text-[#0A192F] font-heading font-semibold text-xs rounded-xl hover:bg-white transition"
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
