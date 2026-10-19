import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, SiteSettings, Review, FAQ } from '../types';
import { PlaceholderCover } from '../components/PlaceholderCover';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { TruckIcon, CheckCircleIcon, CrossIcon } from '../components/Icons';

interface ProductDetailPageProps {
  products: Product[];
  settings: SiteSettings;
  reviews: Review[];
  faqs: FAQ[];
  onAddToCart: (slug: string, qty: number) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  products,
  settings,
  reviews,
  faqs,
  onAddToCart,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = products.find(p => p.slug === slug);
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [pageFlipKey, setPageFlipKey] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const buyBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading font-bold text-2xl text-[var(--navy)]">Book Product Not Found</h2>
        <p className="text-sm text-[#3C5D81]">The requested book or bundle slug does not exist.</p>
        <Link to="/subjects" className="inline-block bg-[var(--navy)] text-white px-6 py-2.5 rounded-xl font-bold text-xs">
          Browse All Subjects
        </Link>
      </div>
    );
  }

  const savingsPercent = Math.round(((product.mrp_paise - product.price_paise) / product.mrp_paise) * 100);

  const handleBuyNow = () => {
    onAddToCart(product.slug, selectedQty);
    navigate('/checkout');
  };

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="space-y-12 pb-16">
      
      {/* TOP SECTION: GALLERY + BUY BOX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[var(--navy)]/10 bg-white relative group/gallery">
              <div key={pageFlipKey} className="w-full h-full animate-page-turn">
                <PlaceholderCover
                  title={product.title.replace(' Simplified Handwritten Notes', '').replace(' Handwritten Notes', '')}
                  accentColor="var(--navy)"
                  imageUrl={images.length > 0 ? images[selectedImageIdx % images.length] : undefined}
                />
              </div>

              {/* Overlay Page Turnover Arrows < > */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setSelectedImageIdx(prev => (prev - 1 + images.length) % images.length);
                      setPageFlipKey(Date.now());
                    }}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--navy)]/80 hover:bg-[var(--navy)] text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition shadow-lg font-bold text-lg z-20 cursor-pointer backdrop-blur-xs"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImageIdx(prev => (prev + 1) % images.length);
                      setPageFlipKey(Date.now());
                    }}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--navy)]/80 hover:bg-[var(--navy)] text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition shadow-lg font-bold text-lg z-20 cursor-pointer backdrop-blur-xs"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-3 py-2 max-w-md mx-auto">
                <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImageIdx(idx);
                        setPageFlipKey(Date.now());
                      }}
                      className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition cursor-pointer shadow-sm ${
                        selectedImageIdx === idx ? 'border-[var(--navy)] scale-105 shadow-md' : 'border-[var(--navy)]/15 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Buy Box (5 cols) */}
          <div ref={buyBoxRef} className="lg:col-span-5 space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-[var(--navy)]/10 shadow-lg">
            
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="bg-[var(--margin-mint)] text-[#92400E] font-heading font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {product.stock_qty <= product.low_stock_threshold ? `LIMITED STOCK · ${product.stock_qty} COPIES LEFT` : 'IN STOCK · DISPATCHES IN 24H'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[var(--navy)] leading-tight">
              {product.title}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-heading font-bold text-3xl sm:text-4xl text-[var(--navy)]">
                ₹{(product.price_paise / 100).toFixed(0)}
              </span>
              <span className="font-mono text-base text-[#3C5D81] line-through">
                ₹{(product.mrp_paise / 100).toFixed(0)}
              </span>
              {savingsPercent > 0 && (
                <span className="bg-[var(--highlighter)] text-[var(--navy)] font-mono font-bold text-xs px-2.5 py-1 rounded shadow-xs">
                  SAVE {savingsPercent}%
                </span>
              )}
            </div>

            {/* Free Shipping Strip */}
            <div className="bg-[var(--paper-white)] border border-[var(--navy)]/10 rounded-2xl p-4 flex items-center gap-3">
              <TruckIcon className="w-7 h-7 text-[var(--navy)] flex-shrink-0" />
              <div className="text-xs font-heading text-[var(--navy)]">
                <p className="font-bold">Free Express Delivery &amp; COD Available</p>
                <p className="text-[11px] text-[#3C5D81]">Dispatches directly via express courier with live tracking.</p>
              </div>
            </div>

            {/* Qty & Add to Cart */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-[var(--navy)]/15 rounded-xl bg-[var(--paper-white)] overflow-hidden">
                <button
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  className="px-3 py-3 text-[var(--navy)] font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 font-bold text-[var(--navy)] text-sm">{selectedQty}</span>
                <button
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  className="px-3 py-3 text-[var(--navy)] font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onAddToCart(product.slug, selectedQty)}
                className="flex-1 bg-[var(--navy)] text-white font-heading font-bold py-3.5 rounded-xl text-sm hover:opacity-90 transition shadow-md tracking-wide cursor-pointer"
              >
                ADD TO CART
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-[var(--navy)] text-white font-heading font-bold py-3.5 rounded-xl text-sm hover:bg-[#132742] transition shadow-md tracking-wide cursor-pointer"
            >
              BUY IT NOW (EXPRESS CHECKOUT)
            </button>

            {/* Delivery Timeline Steps */}
            <div className="pt-4 border-t border-[var(--navy)]/10">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[var(--paper-white)] text-[var(--navy)] border border-[var(--navy)]/15 flex items-center justify-center mb-1 text-xs font-bold">
                    1
                  </div>
                  <span className="font-heading font-bold text-[11px] text-[var(--navy)]">Order Placed</span>
                  <span className="text-[10px] text-[#3C5D81]">Instant confirmation</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[var(--paper-white)] text-[var(--navy)] border border-[var(--navy)]/15 flex items-center justify-center mb-1 text-xs font-bold">
                    2
                  </div>
                  <span className="font-heading font-bold text-[11px] text-[var(--navy)]">Dispatched</span>
                  <span className="text-[10px] text-[#3C5D81]">Within 24 Hours</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[var(--paper-white)] text-[var(--navy)] border border-[var(--navy)]/15 flex items-center justify-center mb-1 text-xs font-bold">
                    3
                  </div>
                  <span className="font-heading font-bold text-[11px] text-[var(--navy)]">Delivered</span>
                  <span className="text-[10px] text-[#3C5D81]">2–4 Business Days</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* BEFORE & AFTER SLIDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <section className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-[var(--navy)]/10 shadow-sm">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[var(--navy)]">
              Before &amp; After Handwritten Clarity
            </h2>
            <p className="text-xs text-[#3C5D81]">
              Struggling with confusing typed lecture slides? Switch to clean, structured handwritten diagrams.
            </p>
          </div>
          <BeforeAfterSlider />
        </section>

        {/* SYLLABUS BREAKDOWN */}
        <section className="bg-[var(--paper-white)] p-6 sm:p-10 rounded-3xl border border-[var(--navy)]/8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--navy)]">
              Detailed Syllabus
            </span>
            <h2 className="font-heading font-bold text-2xl text-[var(--navy)]">
              What You Will Master
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                part: 'Module 01',
                title: 'Core Fundamentals & Syntax',
                topics: ['Variables & Memory Layout', 'Operators & Expressions', 'Formatted I/O Logic'],
              },
              {
                part: 'Module 02',
                title: 'Control Flow & Logic',
                topics: ['Decision Trees & Conditions', 'Loops & Iterations', 'Break & Continue State-Traces'],
              },
              {
                part: 'Module 03',
                title: 'Data Structures & Pointers',
                topics: ['Arrays & Matrices', 'Pointer Hex Addresses', 'Dynamic Memory Management'],
              },
              {
                part: 'Module 04',
                title: 'Functions & Exam Questions',
                topics: ['Recursion Call Stack', 'Structures & Memory Padding', 'University PYQ Solutions'],
              },
            ].map((mod, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-[var(--navy)]/10 space-y-3">
                <span className="font-mono font-bold text-[10px] bg-[var(--paper-white)] text-[var(--navy)] px-2 py-0.5 rounded border border-[var(--navy)]/10">
                  {mod.part}
                </span>
                <h3 className="font-heading font-bold text-sm text-[var(--navy)]">{mod.title}</h3>
                <ul className="space-y-1 text-xs text-[#3C5D81]">
                  {mod.topics.map((t, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-[var(--navy)]">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* WHY OUR NOTES ARE BETTER */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[var(--navy)]/10 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-heading font-bold text-2xl text-[var(--navy)]">
              Why Students Choose PyNotes
            </h2>
            <p className="text-xs text-[#3C5D81]">Comparing physical handwritten learning with standard study material.</p>
          </div>

          <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[var(--navy)]/10">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--navy)]/10 bg-[var(--paper-white)]">
                  <th className="p-3.5 font-heading font-bold text-[var(--navy)]">Feature</th>
                  <th className="p-3.5 font-heading font-bold text-white bg-[var(--navy)] text-center w-28">PyNotes</th>
                  <th className="p-3.5 font-heading font-semibold text-[#3C5D81] text-center w-24">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--navy)]/8 font-body">
                {[
                  'Handwritten Colorful Format',
                  'Step-by-step Pointer & Memory Tracing',
                  '100 GSM Bleed-Proof Paper',
                  'Zero Blue-Light Eye Strain',
                  'Rapid Exam Revision (under 30m)',
                ].map((feat, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[var(--paper-white)]/40'}>
                    <td className="p-3.5 font-heading font-semibold text-[var(--navy)]">{feat}</td>
                    <td className="p-3.5 bg-[var(--navy)]/5 text-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#16A34A] mx-auto" />
                    </td>
                    <td className="p-3.5 text-center">
                      <CrossIcon className="w-4 h-4 text-[#DC2626] mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* STICKY MINI-BAR ON SCROLL */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--navy)]/15 shadow-2xl p-3 z-40 animate-slideUp">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <h4 className="font-heading font-bold text-xs text-[var(--navy)] line-clamp-1">{product.title}</h4>
                <span className="font-heading font-bold text-sm text-[var(--navy)]">
                  ₹{(product.price_paise / 100).toFixed(0)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddToCart(product.slug, 1)}
                className="bg-[var(--navy)] text-white font-heading font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-[#B45309] shadow-sm cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
