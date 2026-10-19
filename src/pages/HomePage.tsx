import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Subject, Product, SiteSettings, ContactMessage } from '../types';
import { PlaceholderCover } from '../components/PlaceholderCover';
import { FeatureStrip } from '../components/FeatureStrip';
import { TestimonialSlider } from '../components/TestimonialSlider';
import { PenUnderlineSVG, CheckCircleIcon, CrossIcon, NotesIcon, HandwrittenIcon, TruckIcon, IdeaIcon } from '../components/Icons';
import { postContactMessage } from '../lib/api';

interface HomePageProps {
  subjects: Subject[];
  products: Product[];
  settings: SiteSettings;
  onAddToCart: (slug: string, qty: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  subjects,
  products,
  settings,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<Record<string, number>>({});
  const [pageFlipKey, setPageFlipKey] = useState<Record<string, number>>({});

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -380, behavior: 'smooth' });
  };
  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 380, behavior: 'smooth' });
  };

  const featuredProducts = products.filter(p => p.status === 'active' && p.type === 'book');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    setContactSuccess(null);
    setContactSubmitting(true);
    try {
      await postContactMessage({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        message: contactMessage,
      });
      setContactSuccess('Thank you! Your message has been sent. We will reply shortly.');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    } catch (err: any) {
      setContactError(err.message || 'Failed to send message');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* SECTION C: HERO BANNER */}
      <section className="w-full relative">
        <img
          src="/hero-banner.png"
          alt="PyNotes Hero Banner"
          className="w-full h-auto object-cover block"
        />
        <button
          onClick={() => navigate('/bundles')}
          className="absolute bottom-[20%] left-[5%] w-[18%] h-[10%] cursor-pointer hover:bg-white/20 transition-colors"
          aria-label="Shop Bundle Now"
        />
      </section>

      {/* SECTION D: FEATURE STRIP */}
      <FeatureStrip />

      {/* SECTION E: FEATURED COLLECTION WITH CAROUSEL ARROWS & PAGE TURNING MULTI-IMAGE GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561] inline-block relative">
              Featured{' '}
              <span className="relative inline-block text-[#12A5B0]">
                collection
                <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
              </span>
            </h2>
            <p className="font-body text-[#3C5D81] text-base max-w-md">
              Explore our top-selling handwritten printed books designed for conceptual clarity and fast exam revision.
            </p>
          </div>

          {/* Carousel Navigation Arrows < > */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="w-12 h-12 rounded-full bg-[#0B3561] text-white flex items-center justify-center hover:bg-[#12A5B0] hover:text-[#071E38] transition shadow-md font-bold text-lg cursor-pointer"
            >
              ‹
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="w-12 h-12 rounded-full bg-[#0B3561] text-white flex items-center justify-center hover:bg-[#12A5B0] hover:text-[#071E38] transition shadow-md font-bold text-lg cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide scroll-smooth">
          {featuredProducts.map(prod => {
            const savingsPercent = Math.round(((prod.mrp_paise - prod.price_paise) / prod.mrp_paise) * 100);
            const images = prod.images && prod.images.length > 0 ? prod.images : [];
            const currIdx = activeImageIdx[prod.slug] || 0;
            const currentImg = images.length > 0 ? images[currIdx % images.length] : undefined;

            return (
              <div
                key={prod.slug}
                className="bg-white rounded-3xl p-6 border border-[#0B3561]/12 shadow-lg hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden snap-start min-w-[300px] sm:min-w-[350px]"
              >
                <div>
                  {/* 3D Book Image Cover with Page Turning Animation & Overlay <> Carousel Buttons */}
                  <div className="mb-4 relative group/img">
                    <div
                      key={pageFlipKey[prod.slug] || 0}
                      onClick={() => navigate(`/product/${prod.slug}`)}
                      className="cursor-pointer transform-gpu transition-all duration-500 ease-out group-hover/img:scale-102 animate-page-turn"
                    >
                      <PlaceholderCover
                        title={prod.title.replace(' Simplified Handwritten Notes', '').replace(' Handwritten Notes', '')}
                        accentColor="#12A5B0"
                        imageUrl={currentImg}
                      />
                    </div>

                    {/* Overlay Page Turning Carousel Arrows < > on the Image Card */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIdx(prev => ({
                              ...prev,
                              [prod.slug]: ((prev[prod.slug] || 0) - 1 + images.length) % images.length,
                            }));
                            setPageFlipKey(prev => ({ ...prev, [prod.slug]: Date.now() }));
                          }}
                          aria-label="Previous image"
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0B3561]/80 hover:bg-[#12A5B0] text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition shadow-lg font-bold text-base z-20 cursor-pointer backdrop-blur-xs"
                        >
                          ‹
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIdx(prev => ({
                              ...prev,
                              [prod.slug]: ((prev[prod.slug] || 0) + 1) % images.length,
                            }));
                            setPageFlipKey(prev => ({ ...prev, [prod.slug]: Date.now() }));
                          }}
                          aria-label="Next image"
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0B3561]/80 hover:bg-[#12A5B0] text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition shadow-lg font-bold text-base z-20 cursor-pointer backdrop-blur-xs"
                        >
                          ›
                        </button>
                      </>
                    )}

                    {/* SAVE Chip at top-left */}
                    {savingsPercent > 0 && (
                      <div className="absolute top-4 left-4 bg-[#FFD54A] text-[#071E38] font-heading font-black text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 z-10 uppercase tracking-wider pointer-events-none">
                        <span>SAVE {savingsPercent}%</span>
                      </div>
                    )}
                  </div>

                  {/* Under the Image Card: Multi-Picture Switcher & Page Turning Navigation */}
                  {images.length > 1 && (
                    <div className="mb-4 flex items-center justify-between bg-[#F7FAFC] px-3 py-2 rounded-xl border border-[#0B3561]/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIdx(prev => ({
                            ...prev,
                            [prod.slug]: ((prev[prod.slug] || 0) - 1 + images.length) % images.length,
                          }));
                          setPageFlipKey(prev => ({ ...prev, [prod.slug]: Date.now() }));
                        }}
                        className="text-xs font-bold text-[#0B3561] hover:text-[#12A5B0] px-2 py-1 rounded bg-white shadow-xs cursor-pointer"
                      >
                        ‹ Prev Page
                      </button>

                      <div className="flex items-center gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIdx(prev => ({ ...prev, [prod.slug]: i }));
                              setPageFlipKey(prev => ({ ...prev, [prod.slug]: Date.now() }));
                            }}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                              i === (currIdx % images.length) ? 'bg-[#12A5B0] w-4' : 'bg-[#0B3561]/30'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIdx(prev => ({
                            ...prev,
                            [prod.slug]: ((prev[prod.slug] || 0) + 1) % images.length,
                          }));
                          setPageFlipKey(prev => ({ ...prev, [prod.slug]: Date.now() }));
                        }}
                        className="text-xs font-bold text-[#0B3561] hover:text-[#12A5B0] px-2 py-1 rounded bg-white shadow-xs cursor-pointer"
                      >
                        Next Page ›
                      </button>
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    onClick={() => navigate(`/product/${prod.slug}`)}
                    className="font-heading font-bold text-lg text-[#0B3561] line-clamp-2 hover:text-[#12A5B0] cursor-pointer transition min-h-[52px]"
                  >
                    {prod.title}
                  </h3>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display font-black italic text-2xl text-[#0B3561]">
                      Rs. {(prod.price_paise / 100).toFixed(2)}
                    </span>
                    <span className="font-body text-xs text-[#9DAEC0] line-through font-semibold">
                      Rs. {(prod.mrp_paise / 100).toFixed(2)}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="font-body text-xs text-[#3C5D81] mt-2 leading-relaxed line-clamp-2">
                    {prod.short_desc}
                  </p>
                </div>

                {/* View Details Button */}
                <div className="mt-4 pt-4 border-t border-[#0B3561]/10">
                  <Link
                    to={`/product/${prod.slug}`}
                    className="block w-full text-center py-3 bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs rounded-xl hover:brightness-105 transition shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center pt-4">
          <Link
            to="/subjects"
            className="inline-block bg-[#0B3561] text-white font-heading font-bold px-8 py-3.5 rounded-2xl text-sm shadow-lg hover:bg-[#071E38] hover:shadow-xl transition tracking-wide"
          >
            Explore All 13 Handwritten Subject Books →
          </Link>
        </div>
      </section>

      {/* SECTION F: "WHY STUDENTS CHOOSE US" COMPARISON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Description */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561] leading-tight">
              Why Students{' '}
              <span className="relative inline-block text-[#12A5B0]">
                Choose Us
                <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
              </span>
            </h2>
            <p className="font-body text-[#3C5D81] text-base leading-relaxed">
              Most coding materials are typed, cluttered, and hard to revise. Our handwritten structured notes are designed for real understanding and faster exam recall.
            </p>
          </div>

          {/* Right Comparison Card on Dot-Grid background */}
          <div className="bg-dot-grid p-4 sm:p-6 rounded-3xl border border-[#0B3561]/15 shadow-xl">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#0B3561]/10">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#0B3561]/10">
                    <th className="p-3 sm:p-4 font-heading font-bold text-[#0B3561]">Feature</th>
                    <th className="p-3 sm:p-4 font-heading font-bold text-white bg-[#0B3561] text-center w-28 sm:w-36 rounded-t-xl">
                      PyNotes
                    </th>
                    <th className="p-3 sm:p-4 font-heading font-bold text-[#3C5D81] text-center w-24">Others</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B3561]/5 font-body">
                  {[
                    { label: 'Concept Clarity', pynotes: true, others: false },
                    { label: 'Fast Revision', pynotes: true, others: false },
                    { label: 'Beginner Friendly', pynotes: true, others: false },
                    { label: 'Visual Learning', pynotes: true, others: false },
                    { label: 'Exam Ready', pynotes: true, others: false },
                    { label: 'Organized Notes', pynotes: true, others: false },
                    { label: 'Handwritten Notes', pynotes: true, others: false },
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-[#F7FAFC]' : 'bg-white'}>
                      <td className="p-3 sm:p-4 font-heading font-semibold text-[#0B3561]">{row.label}</td>
                      <td className="p-3 sm:p-4 bg-[#0B3561]/5 text-center">
                        <CheckCircleIcon className="w-5 h-5 text-[#13834D] mx-auto" />
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        <CrossIcon className="w-5 h-5 text-[#C0392B] mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION G: "BUILT FOR CONCEPT CLARITY" */}
      <section className="bg-[#DDF3F4]/50 py-16 px-4 sm:px-8 border-y border-[#12A5B0]/20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561]">
              Built for Concept Clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Structured Notes',
                desc: 'Colorful, handwritten organized and chapter-wise notes for quick recall.',
              },
              {
                title: 'Fast Revision',
                desc: 'Designed for rapid review before exams and placement interviews.',
              },
              {
                title: 'Beginner Friendly',
                desc: 'Simple language with step-by-step code execution traces.',
              },
              {
                title: 'Premium Print',
                desc: 'Printed on durable high-quality paper with vibrant 4-color ink.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm flex flex-col items-center text-center space-y-3">
                <CheckCircleIcon className="w-10 h-10 text-[#12A5B0]" />
                <h3 className="font-heading font-bold text-lg text-[#0B3561]">{item.title}</h3>
                <p className="font-body text-xs text-[#3C5D81] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION H: "WHAT STUDENTS ACHIEVED" SURVEY BAND */}
      {settings?.result_stats && settings.result_stats.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          <div className="text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561]">
              Real Results from{' '}
              <span className="relative inline-block text-[#12A5B0]">
                Real
                <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
              </span>{' '}
              Students
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.result_stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm flex flex-col items-center text-center relative">
                {stat.is_sample && (
                  <span className="absolute top-2 right-2 bg-gray-200 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    Sample
                  </span>
                )}
                {/* Circular Progress Ring */}
                <div className="relative w-24 h-24 flex items-center justify-center my-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#E7EBEF]"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#12A5B0]"
                      strokeDasharray="90, 100"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-display font-black italic text-xl text-[#0B3561]">
                    {stat.value}
                  </span>
                </div>
                <p className="font-heading font-semibold text-xs text-[#0B3561] mt-2">{stat.label}</p>
                {stat.source_note && (
                  <p className="text-[10px] text-[#9DAEC0] mt-1">{stat.source_note}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION H2: TESTIMONIAL SLIDER */}
      <TestimonialSlider />

      {/* SECTION I: CONTACT FORM (Ruled paper background) */}
      <section className="bg-ruled-paper py-16 px-4 sm:px-8 border-t border-[#0B3561]/10">
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-[#0B3561]/15 shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="font-heading font-bold text-3xl text-[#0B3561]">Contact Form</h2>
            <p className="font-body text-xs text-[#3C5D81] mt-1">Have a question? Send us a message and we'll reply right away.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561] focus:border-[#12A5B0]"
                />
              </div>
              <div>
                <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561] focus:border-[#12A5B0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Mobile Number</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="10-digit phone number"
                className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561] focus:border-[#12A5B0]"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Comment / Message *</label>
              <textarea
                required
                rows={4}
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                placeholder="How can we help you?"
                className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561] focus:border-[#12A5B0]"
              />
            </div>

            {contactError && <p className="text-xs text-[#C0392B] font-bold">{contactError}</p>}
            {contactSuccess && <p className="text-xs text-[#13834D] font-bold">{contactSuccess}</p>}

            <button
              type="submit"
              disabled={contactSubmitting}
              className="w-full bg-[#0B3561] text-white font-heading font-bold py-3.5 rounded-xl hover:bg-[#071E38] transition shadow-md disabled:opacity-50"
            >
              {contactSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};
