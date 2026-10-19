import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, SiteSettings, Review, FAQ } from '../types';
import { PlaceholderCover } from '../components/PlaceholderCover';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { InstagramCarousel } from '../components/InstagramCarousel';
import { TruckIcon, CheckCircleIcon, CrossIcon, PenUnderlineSVG } from '../components/Icons';
import { RecentBuyersStrip } from '../components/RecentBuyersStrip';

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
        <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Book Product Not Found</h2>
        <p className="text-sm text-[#3C5D81]">The requested book or bundle slug does not exist.</p>
        <Link to="/subjects" className="inline-block bg-[#0B3561] text-white px-6 py-2.5 rounded-xl font-bold text-xs">
          Browse All Subjects
        </Link>
      </div>
    );
  }

  const containingBundles = products.filter(
    p => p.type === 'bundle' && p.bundle_items?.some(bi => bi.book_slug === product.slug)
  );

  const productApprovedReviews = reviews.filter(r => r.product_id === product.slug && r.status === 'approved');
  const avgRating =
    productApprovedReviews.length > 0
      ? (productApprovedReviews.reduce((sum, r) => sum + r.rating, 0) / productApprovedReviews.length).toFixed(1)
      : '4.9';

  const savingsPercent = Math.round(((product.mrp_paise - product.price_paise) / product.mrp_paise) * 100);

  const handleBuyNow = () => {
    onAddToCart(product.slug, selectedQty);
    navigate('/checkout');
  };

  const scrollToBuyBox = () => {
    buyBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const defaultSampleImages = [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
  ];
  const images = product.images && product.images.length > 0 ? product.images : defaultSampleImages;

  return (
    <div className="space-y-16 pb-16">
      
      {/* TOP SECTION: GALLERY + BUY BOX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#0B3561]/15 bg-white relative group/gallery">
              <div key={pageFlipKey} className="w-full h-full animate-page-turn">
                <PlaceholderCover
                  title={product.title.replace(' Simplified Handwritten Notes', '')}
                  accentColor="#12A5B0"
                  imageUrl={images.length > 0 ? images[selectedImageIdx % images.length] : undefined}
                />
              </div>

              {/* Floor Reflection Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-40" />

              {/* Overlay Page Turnover Arrows < > */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setSelectedImageIdx(prev => (prev - 1 + images.length) % images.length);
                      setPageFlipKey(Date.now());
                    }}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0B3561]/80 hover:bg-[#12A5B0] text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition shadow-lg font-bold text-lg z-20 cursor-pointer backdrop-blur-xs"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImageIdx(prev => (prev + 1) % images.length);
                      setPageFlipKey(Date.now());
                    }}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0B3561]/80 hover:bg-[#12A5B0] text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition shadow-lg font-bold text-lg z-20 cursor-pointer backdrop-blur-xs"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip with < > arrows and active triangle pointer */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-3 py-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    setSelectedImageIdx(prev => (prev - 1 + images.length) % images.length);
                    setPageFlipKey(Date.now());
                  }}
                  className="w-8 h-8 rounded-full bg-white border border-[#0B3561]/20 text-[#0B3561] flex items-center justify-center hover:bg-[#DDF3F4] transition cursor-pointer font-bold shadow-xs"
                >
                  ‹
                </button>

                <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative flex flex-col items-center">
                      <button
                        onClick={() => {
                          setSelectedImageIdx(idx);
                          setPageFlipKey(Date.now());
                        }}
                        className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer shadow-sm ${
                          selectedImageIdx === idx ? 'border-[#0B3561] scale-105 shadow-md' : 'border-[#0B3561]/20 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                      {selectedImageIdx === idx && (
                        <div className="absolute -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#0B3561]" />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedImageIdx(prev => (prev + 1) % images.length);
                    setPageFlipKey(Date.now());
                  }}
                  className="w-8 h-8 rounded-full bg-white border border-[#0B3561]/20 text-[#0B3561] flex items-center justify-center hover:bg-[#DDF3F4] transition cursor-pointer font-bold shadow-xs"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Buy Box (5 cols) */}
          <div ref={buyBoxRef} className="lg:col-span-5 space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-lg">
            
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="bg-[#13834D]/10 text-[#13834D] font-heading font-black text-xs px-3.5 py-1 rounded-full border border-[#13834D]/30 uppercase">
                {product.stock_qty <= product.low_stock_threshold ? `HOT PRODUCT | ONLY ${product.stock_qty} LEFT` : 'HOT PRODUCT | IN STOCK'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-black italic text-3xl sm:text-4xl text-[#0B3561] leading-tight">
              {product.title}
            </h1>

            {/* Star Rating */}
            <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#0B3561]">
              <div className="flex text-[#FFD54A] text-sm">★★★★★</div>
              <span>{avgRating} / 5.0</span>
              <span className="text-[#3C5D81]">Trusted by 12,547+ students</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-display font-black italic text-3xl sm:text-4xl text-[#0B3561]">
                Rs. {(product.price_paise / 100).toFixed(2)}
              </span>
              <span className="font-body text-base text-[#9DAEC0] line-through font-semibold">
                Rs. {(product.mrp_paise / 100).toFixed(2)}
              </span>
              {savingsPercent > 0 && (
                <span className="bg-[#12A5B0] text-white font-heading font-black text-xs px-2.5 py-1 rounded-full shadow-xs">
                  SAVE {savingsPercent}%
                </span>
              )}
            </div>

            {/* Active checkout counter */}
            <div className="text-xs font-heading font-bold text-[#12A5B0] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#12A5B0] animate-ping" />
              <span>11 people are checking out right now</span>
            </div>

            {/* Recent Buyers Strip */}
            <RecentBuyersStrip enabled={settings?.show_recent_buyers_strip} />

            {/* Prepaid Offer Box */}
            <div className="bg-[#DDF3F4] border-2 border-dashed border-[#12A5B0] rounded-2xl p-4 flex items-center gap-3">
              <TruckIcon className="w-8 h-8 text-[#12A5B0] flex-shrink-0" />
              <div className="text-xs font-heading font-semibold text-[#0B3561]">
                <p className="font-bold">🚚 Get Free Delivery & Extra 10% Instant OFF on Prepaid Orders</p>
              </div>
            </div>

            {/* Subject Selector Pills */}
            <div>
              <label className="text-xs font-heading font-bold text-[#0B3561] block mb-2">
                Subject - {product.title.split(' ')[0]}
              </label>
              <div className="flex flex-wrap gap-2">
                {['C', 'C+Plus', 'C+Plus+Java', 'C+Plus+Java+Python'].map((sub, i) => (
                  <button
                    key={sub}
                    className={`px-3.5 py-2 rounded-full text-xs font-heading font-bold transition ${
                      i === 0
                        ? 'bg-[#0B3561] text-white shadow-xs'
                        : 'bg-white text-[#0B3561] border border-[#0B3561]/20 hover:bg-[#DDF3F4]'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty & Add to Cart (Red button style matching screenshot) */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border-2 border-[#0B3561]/20 rounded-xl bg-[#F7FAFC] overflow-hidden">
                <button
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  className="px-3 py-3 text-[#0B3561] font-bold hover:bg-[#DDF3F4]"
                >
                  -
                </button>
                <span className="px-4 font-bold text-[#0B3561] text-sm">{selectedQty}</span>
                <button
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  className="px-3 py-3 text-[#0B3561] font-bold hover:bg-[#DDF3F4]"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onAddToCart(product.slug, selectedQty)}
                className="flex-1 bg-[#E74C3C] text-white font-heading font-black py-3.5 rounded-xl text-sm hover:brightness-105 transition shadow-lg tracking-wide uppercase"
              >
                ADD TO CART
              </button>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {['UPI', 'Mastercard', 'Visa', 'Google Pay', 'COD'].map(i => (
                <span key={i} className="text-[10px] font-code bg-[#F7FAFC] border border-[#0B3561]/15 px-2.5 py-1 rounded text-[#0B3561]">
                  {i}
                </span>
              ))}
            </div>

            {/* Delivery Timeline Steps */}
            <div className="pt-4 border-t border-[#0B3561]/10">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#0B3561] text-white flex items-center justify-center mb-1 text-xs">
                    🛒
                  </div>
                  <span className="font-heading font-bold text-[11px] text-[#0B3561]">Oct 19th</span>
                  <span className="text-[10px] text-[#3C5D81]">Ordered</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#0B3561] text-white flex items-center justify-center mb-1 text-xs">
                    📦
                  </div>
                  <span className="font-heading font-bold text-[11px] text-[#0B3561]">Oct 20th - 21st</span>
                  <span className="text-[10px] text-[#3C5D81]">Order Ready</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#0B3561] text-white flex items-center justify-center mb-1 text-xs">
                    🚚
                  </div>
                  <span className="font-heading font-bold text-[11px] text-[#0B3561]">Oct 24th - 27th</span>
                  <span className="text-[10px] text-[#3C5D81]">Delivered</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* BELOW THE FOLD: PART-BY-PART ATTACHMENTS & SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-20">
        
        {/* 1. Before & After Visual Transformation */}
        <section className="space-y-6 bg-white p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-3xl text-[#0B3561]">
              Before & After
            </h2>
            <p className="text-xs text-[#3C5D81]">
              Struggling with confusing notes and exam stress? → Switch to simple handwritten colorful notes and master concepts with clarity and confidence.
            </p>
          </div>
          <BeforeAfterSlider />
        </section>



        {/* 3. Why Our Notes Are Better (Comparison Table) */}
        <section className="bg-dot-grid p-6 sm:p-10 rounded-3xl border border-[#0B3561]/15 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-3xl text-[#0B3561]">
              Why Our Notes Are Better?
            </h2>
            <p className="text-xs text-[#3C5D81]">See the difference between smart handwritten learning and traditional study methods.</p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm border border-[#0B3561]/10">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#0B3561]/10">
                  <th className="p-4 font-heading font-bold text-[#0B3561]">Feature</th>
                  <th className="p-4 font-heading font-bold text-white bg-[#13834D] text-center w-36">PyNotes</th>
                  <th className="p-4 font-heading font-bold text-[#3C5D81] text-center w-28">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3561]/5 font-body">
                {[
                  'Simple Explanations',
                  'Handwritten Format',
                  'Fully Colorful',
                  'Exam Focused',
                  'Time Saving',
                ].map((feat, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#F7FAFC]' : 'bg-white'}>
                    <td className="p-4 font-heading font-semibold text-[#0B3561]">{feat}</td>
                    <td className="p-4 bg-[#13834D]/10 text-center">
                      <CheckCircleIcon className="w-5 h-5 text-[#13834D] mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <CrossIcon className="w-5 h-5 text-[#C0392B] mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Banner */}
        <div className="text-center space-y-3 py-6">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561]">
            Stop Wasting Time on Confusing Books. Switch to{' '}
            <span className="text-[#12A5B0] italic">Smart Handwritten Colorful Notes.</span>
          </h2>
        </div>

        {/* 5. Alternating Feature Blocks with "Get it Yours Now!" */}
        <section className="space-y-12">
          {[
            {
              title: 'Simple Explanations',
              desc: 'Learn programming with clear, beginner-friendly language that’s easy to follow.',
            },
            {
              title: 'Handwritten Format',
              desc: 'Neatly written notes that improve understanding and help you remember faster.',
            },
            {
              title: 'Practical Coding',
              desc: 'Includes real C programs with outputs so you understand how coding actually works.',
            },
            {
              title: 'Exam Focused',
              desc: 'Structured content designed for quick revision and better exam performance.',
            },
            {
              title: 'Time Saving',
              desc: 'No unnecessary theory—learn faster with only what you need.',
            },
            {
              title: 'Premium Printed Quality',
              desc: 'High-quality print with smooth pages for a comfortable reading experience.',
            },
          ].map((block, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-center gap-10 bg-white p-8 sm:p-12 rounded-3xl border border-[#0B3561]/10 shadow-sm ${
                idx % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full md:w-1/2 aspect-[4/3] bg-[#DDF3F4]/50 rounded-2xl flex items-center justify-center p-4 border border-[#12A5B0]/20">
                <PlaceholderCover title={block.title} accentColor="#12A5B0" />
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-[#3C5D81] block">
                  C Simplified Programming
                </span>
                <h3 className="font-heading font-bold text-3xl text-[#0B3561]">{block.title}</h3>
                <p className="font-body text-sm text-[#3C5D81] leading-relaxed">{block.desc}</p>
                <button
                  onClick={scrollToBuyBox}
                  className="bg-[#13834D] text-white font-heading font-bold px-7 py-3 rounded-xl text-xs hover:brightness-105 transition shadow-md cursor-pointer"
                >
                  Get it Yours Now!
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* 6. Instagram Feed Carousel */}
        <section className="bg-white p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm">
          <InstagramCarousel />
        </section>

        {/* 7. Best C Programming Book Ever */}
        <section className="bg-[#0B3561] text-white p-8 sm:p-14 rounded-3xl shadow-2xl space-y-10 text-center">
          <div className="space-y-2">
            <h2 className="font-display font-black italic text-3xl sm:text-4xl">
              Best {product.title} Book Ever
            </h2>
            <p className="text-xs text-[#DDF3F4]/80 max-w-lg mx-auto">
              Learn the easy way with clear handwritten notes, real programs, and quick revision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-left">
            <div className="space-y-6">
              <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-1">
                <h4 className="font-heading font-bold text-sm text-[#FFD54A]">✓ Easy Learning</h4>
                <p className="text-xs text-[#DDF3F4]">Simple and beginner-friendly explanations to understand programming quickly.</p>
              </div>
              <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-1">
                <h4 className="font-heading font-bold text-sm text-[#FFD54A]">✓ Code Practice</h4>
                <p className="text-xs text-[#DDF3F4]">Includes practical programs with outputs for better concept clarity.</p>
              </div>
            </div>

            <div className="max-w-xs mx-auto aspect-[3/4] w-full">
              <PlaceholderCover title={product.title} accentColor="#FFD54A" />
            </div>

            <div className="space-y-6 text-left">
              <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-1">
                <h4 className="font-heading font-bold text-sm text-[#FFD54A]">✓ Handwritten Notes</h4>
                <p className="text-xs text-[#DDF3F4]">Neatly written colorful handwritten notes that improve understanding and memory retention.</p>
              </div>
              <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-1">
                <h4 className="font-heading font-bold text-sm text-[#FFD54A]">✓ Exam Ready</h4>
                <p className="text-xs text-[#DDF3F4]">Structured content designed for quick revision and better exam performance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FAQ Accordion */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-[#0B3561] text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map(faq => (
              <details key={faq.id} className="bg-white p-4 rounded-xl border border-[#0B3561]/10 group">
                <summary className="font-heading font-bold text-sm text-[#0B3561] cursor-pointer flex justify-between items-center list-none">
                  <span>{faq.question}</span>
                  <span className="text-[#12A5B0] group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="font-body text-xs text-[#3C5D81] mt-3 leading-relaxed pt-2 border-t border-[#0B3561]/5">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

      </div>

      {/* STICKY MINI-BAR ON SCROLL */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#12A5B0] shadow-2xl p-3 z-40 animate-slideUp">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-12 bg-[#0B3561] rounded overflow-hidden flex-shrink-0">
                <PlaceholderCover title={product.title} accentColor="#12A5B0" />
              </div>
              <div className="hidden sm:block">
                <h4 className="font-heading font-bold text-xs text-[#0B3561] line-clamp-1">{product.title}</h4>
                <span className="font-display font-black italic text-sm text-[#0B3561]">
                  Rs. {(product.price_paise / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddToCart(product.slug, 1)}
                className="bg-[#E74C3C] text-white font-heading font-black text-xs px-6 py-3 rounded-xl hover:brightness-105 shadow-md uppercase"
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
