import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, SiteSettings, Review, FAQ } from '../types';
import { PlaceholderCover } from '../components/PlaceholderCover';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { TruckIcon, CheckCircleIcon, SparkIcon, PenUnderlineSVG } from '../components/Icons';
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
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [readMoreDesc, setReadMoreDesc] = useState(false);

  const buyBoxRef = useRef<HTMLDivElement>(null);

  // Scroll listener for sticky mini-bar
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
        <Link to="/subjects" className="inline-block bg-[#0B3561] text-white px-6 py-2.5 rounded-xl font-bold">
          Browse All Subjects
        </Link>
      </div>
    );
  }

  // Find all bundles that contain this book
  const containingBundles = products.filter(
    p => p.type === 'bundle' && p.bundle_items?.some(bi => bi.book_slug === product.slug)
  );

  const productApprovedReviews = reviews.filter(r => r.product_id === product.slug && r.status === 'approved');
  const avgRating =
    productApprovedReviews.length > 0
      ? (productApprovedReviews.reduce((sum, r) => sum + r.rating, 0) / productApprovedReviews.length).toFixed(1)
      : null;

  const savingsPercent = Math.round(((product.mrp_paise - product.price_paise) / product.mrp_paise) * 100);

  const handleBuyNow = () => {
    onAddToCart(product.slug, selectedQty);
    navigate('/checkout');
  };

  const scrollToBuyBox = () => {
    buyBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* TOP SECTION: GALLERY + BUY BOX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Gallery (55%) -> 7 cols */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-[#0B3561]/10 bg-white">
              <PlaceholderCover
                title={product.title.replace(' Simplified Handwritten Notes', '')}
                accentColor="#12A5B0"
                imageUrl={product.images && product.images.length > 0 ? product.images[selectedImageIdx] : undefined}
              />
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImageIdx === idx ? 'border-[#12A5B0] shadow-md' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buy Box (45%) -> 5 cols */}
          <div ref={buyBoxRef} className="lg:col-span-5 space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-lg">
            
            {/* Outlined Badge Chip */}
            <div className="flex items-center gap-2">
              <span className="bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs px-3 py-1 rounded-full border border-[#12A5B0]/40">
                {product.badge_text || (product.stock_qty <= product.low_stock_threshold ? `ONLY ${product.stock_qty} LEFT` : 'PRINTED BOOK')}
              </span>
            </div>

            {/* H1 Title */}
            <h1 className="font-display font-black italic text-3xl sm:text-4xl text-[#0B3561] leading-tight">
              {product.title}
            </h1>

            {/* Star Rating Summary (Approved reviews only) */}
            {avgRating && (
              <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#0B3561]">
                <div className="flex text-[#FFD54A]">
                  {'★'.repeat(Math.round(Number(avgRating)))}
                </div>
                <span>{avgRating} / 5.0</span>
                <span className="text-[#3C5D81]">({productApprovedReviews.length} reviews)</span>
              </div>
            )}

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-display font-black italic text-3xl sm:text-4xl text-[#0B3561]">
                Rs. {(product.price_paise / 100).toFixed(2)}
              </span>
              <span className="font-body text-base text-[#9DAEC0] line-through font-semibold">
                Rs. {(product.mrp_paise / 100).toFixed(2)}
              </span>
              {savingsPercent > 0 && (
                <span className="bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs px-2.5 py-1 rounded-full border border-[#12A5B0]/30">
                  SAVE {savingsPercent}%
                </span>
              )}
            </div>

            {/* Real Consent Recent Buyers Strip */}
            <RecentBuyersStrip enabled={settings?.show_recent_buyers_strip} />

            {/* Offer Box (Dashed Teal border, Mint background, truck icon) */}
            <div className="bg-[#DDF3F4] border-2 border-dashed border-[#12A5B0] rounded-2xl p-4 flex items-center gap-3">
              <TruckIcon className="w-8 h-8 text-[#12A5B0] flex-shrink-0" />
              <div className="text-xs font-heading font-semibold text-[#0B3561]">
                <p className="font-bold">Prepaid Special Offer:</p>
                <p className="text-[#3C5D81]">{settings?.prepaid_offer_text || 'Free delivery and extra 10% instant discount on prepaid orders.'}</p>
              </div>
            </div>

            {/* Option Selector Pills (Book alone + Containing Bundles) */}
            <div>
              <label className="text-xs font-heading font-bold text-[#0B3561] block mb-2">
                Select Format / Variant:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2.5 rounded-xl text-xs font-heading font-bold bg-[#0B3561] text-white shadow-xs"
                >
                  {product.title} (Rs. {(product.price_paise / 100).toFixed(0)})
                </button>
                {containingBundles.map(bundle => (
                  <button
                    key={bundle.slug}
                    onClick={() => navigate(`/product/${bundle.slug}`)}
                    className="px-4 py-2.5 rounded-xl text-xs font-heading font-bold bg-white text-[#0B3561] border border-[#0B3561]/30 hover:bg-[#DDF3F4] transition"
                  >
                    {bundle.title} (Rs. {(bundle.price_paise / 100).toFixed(0)})
                  </button>
                ))}
              </div>
            </div>

            {/* Qty Stepper & Add To Cart */}
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
                className="flex-1 bg-[#12A5B0] text-[#071E38] font-heading font-bold py-3.5 rounded-xl text-sm hover:brightness-105 transition shadow-md"
              >
                ADD TO CART
              </button>
            </div>

            {/* Full-width BUY IT NOW */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-[#0B3561] text-white font-heading font-bold py-4 rounded-xl text-base shadow-xl hover:bg-[#071E38] transition tracking-wide"
            >
              BUY IT NOW
            </button>

            {/* Payment Icons */}
            <div className="pt-2 text-center">
              <span className="text-[10px] font-heading font-bold uppercase text-[#3C5D81] tracking-wider block mb-1.5">
                Guaranteed Safe & Secure Checkout
              </span>
              <div className="flex items-center justify-center gap-2">
                {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Google Pay'].map(i => (
                  <span key={i} className="text-[10px] font-code bg-[#F7FAFC] border border-[#0B3561]/15 px-2 py-0.5 rounded text-[#0B3561]">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            {/* Delivery Strip with 3 Connected Steps */}
            <div className="pt-4 border-t border-[#0B3561]/10">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#DDF3F4] text-[#0B3561] flex items-center justify-center mb-1 border border-[#12A5B0]">
                    ✓
                  </div>
                  <span className="font-heading font-bold text-[11px] text-[#0B3561]">1. Ordered</span>
                  <span className="text-[10px] text-[#3C5D81]">Today</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#DDF3F4] text-[#0B3561] flex items-center justify-center mb-1 border border-[#12A5B0]">
                    📦
                  </div>
                  <span className="font-heading font-bold text-[11px] text-[#0B3561]">2. Dispatched</span>
                  <span className="text-[10px] text-[#3C5D81]">In 24-48 hrs</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#DDF3F4] text-[#0B3561] flex items-center justify-center mb-1 border border-[#12A5B0]">
                    🚚
                  </div>
                  <span className="font-heading font-bold text-[11px] text-[#0B3561]">3. Delivered</span>
                  <span className="text-[10px] text-[#3C5D81]">3-7 Days</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* BELOW THE FOLD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Short Description */}
        <section className="bg-white p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-3">
          <h3 className="font-heading font-bold text-xl text-[#0B3561]">About this Book</h3>
          <p className="font-body text-sm text-[#3C5D81] leading-relaxed">
            {product.description || product.short_desc}
          </p>
        </section>

        {/* Before and After Drag Slider */}
        <section className="space-y-4">
          <div className="text-center">
            <h2 className="font-heading font-bold text-3xl text-[#0B3561]">
              Before & After:{' '}
              <span className="relative inline-block text-[#12A5B0]">
                Visual Transformation
                <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
              </span>
            </h2>
          </div>
          <BeforeAfterSlider />
        </section>

        {/* 6 Alternating Feature Blocks with "Get it yours now" button */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-3xl text-[#0B3561]">
              Stop wasting time on confusing books. Switch to smart handwritten colourful notes.
            </h2>
          </div>

          {[
            {
              title: 'Simple Explanations',
              desc: 'Complex algorithms broken down into plain language with step-by-step logic traces.',
            },
            {
              title: 'Handwritten Format',
              desc: 'Human handwriting style that builds visual memory far faster than cold typed text.',
            },
            {
              title: 'Practical Coding',
              desc: 'Includes real interview code snippets, line-by-line outputs, and edge cases.',
            },
            {
              title: 'Exam Focused',
              desc: 'Highlighted key formulas, time complexities, and university exam questions.',
            },
            {
              title: 'Time Saving',
              desc: 'Revise complete semesters in days instead of struggling through 800-page textbooks.',
            },
            {
              title: 'Premium Printed Quality',
              desc: 'High-density color printing on durable paper bound for long-term study.',
            },
          ].map((block, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm ${
                idx % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full md:w-1/2 aspect-[4/3] bg-[#DDF3F4] rounded-2xl flex items-center justify-center p-6 border border-[#12A5B0]/30">
                <PlaceholderCover title={block.title} accentColor="#12A5B0" />
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                <span className="bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.title}
                </span>
                <h3 className="font-heading font-bold text-2xl text-[#0B3561]">{block.title}</h3>
                <p className="font-body text-sm text-[#3C5D81] leading-relaxed">{block.desc}</p>
                <button
                  onClick={scrollToBuyBox}
                  className="inline-block bg-[#0B3561] text-white font-heading font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#071E38] transition shadow-md"
                >
                  Get yours now
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Best Book Ever 3-Column Band */}
        <section className="bg-[#0B3561] text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-8">
          <div className="text-center">
            <h2 className="font-display font-black italic text-3xl sm:text-4xl">
              Best {product.title} Book Ever
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-4 text-right">
              <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                <h4 className="font-heading font-bold text-sm text-[#FFD54A]">Easy Learning</h4>
                <p className="text-xs text-[#DDF3F4] mt-1">Written specifically for beginners and college students.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                <h4 className="font-heading font-bold text-sm text-[#FFD54A]">Handwritten Format</h4>
                <p className="text-xs text-[#DDF3F4] mt-1">Improves retention and makes studying enjoyable.</p>
              </div>
            </div>

            <div className="max-w-xs mx-auto">
              <PlaceholderCover title={product.title} accentColor="#FFD54A" />
            </div>

            <div className="space-y-4 text-left">
              <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                <h4 className="font-heading font-bold text-sm text-[#FFD54A]">Code Practice</h4>
                <p className="text-xs text-[#DDF3F4] mt-1">Real exercises with step-by-step visual solutions.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                <h4 className="font-heading font-bold text-sm text-[#FFD54A]">Exam Ready</h4>
                <p className="text-xs text-[#DDF3F4] mt-1">Covers standard university syllabus and placement tests.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
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
                className="bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs px-5 py-2.5 rounded-xl hover:brightness-105"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-[#0B3561] text-white font-heading font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-[#071E38]"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
