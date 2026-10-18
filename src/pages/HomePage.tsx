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
      
      {/* SECTION C: HERO (Ruled paper background, teal margin rule) */}
      <section className="bg-ruled-paper pt-12 pb-16 px-4 sm:px-8 border-b border-[#0B3561]/10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column */}
          <div className="space-y-6 z-10">
            <span className="inline-block bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full border border-[#12A5B0]/30 shadow-xs">
              LEARN . WRITE . GROW
            </span>

            <h1 className="font-display font-black italic text-4xl sm:text-5xl lg:text-6xl text-[#0B3561] leading-[1.1] tracking-tight">
              Code, written the way you{' '}
              <span className="relative inline-block text-[#12A5B0]">
                learn
                <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
              </span>{' '}
              it.
            </h1>

            <p className="font-body text-base sm:text-lg text-[#3C5D81] max-w-lg leading-relaxed font-medium">
              Simplified handwritten coding books printed on high-quality paper. Color-coded syntax, clear visual diagrams, and exam-focused notes delivered across India.
            </p>

            {/* 4 Icon Tiles Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { label: 'Handwritten Notes', icon: <HandwrittenIcon className="w-5 h-5 text-[#12A5B0]" /> },
                { label: 'Easy to Understand', icon: <IdeaIcon className="w-5 h-5 text-[#12A5B0]" /> },
                { label: 'Exam Focused', icon: <NotesIcon className="w-5 h-5 text-[#12A5B0]" /> },
                { label: 'Printed & Delivered', icon: <TruckIcon className="w-5 h-5 text-[#12A5B0]" /> },
              ].map((tile, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-[#0B3561]/10 shadow-xs flex flex-col items-center text-center gap-1.5">
                  {tile.icon}
                  <span className="font-heading font-semibold text-[11px] text-[#0B3561] leading-tight">
                    {tile.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Row */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/bundles"
                className="bg-[#0B3561] text-white font-heading font-bold px-8 py-4 rounded-2xl text-base shadow-xl hover:bg-[#071E38] hover:shadow-2xl transition tracking-wide flex items-center gap-3 group"
              >
                <span>SHOP BUNDLES</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <span className="text-xs text-[#3C5D81] font-heading font-medium">
                ✓ Cash on Delivery Available across India
              </span>
            </div>
          </div>

          {/* Right Column: Hero Cover Fan Showcase */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="w-full max-w-md aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] bg-[#DDF3F4] rounded-3xl p-6 border-2 border-[#12A5B0]/30 shadow-2xl relative overflow-hidden flex items-center justify-center">
              {/* Fan of 3 placeholder covers */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute w-44 sm:w-52 transform -rotate-12 -translate-x-12 translate-y-2 opacity-90 transition hover:rotate-0 hover:z-30">
                  <PlaceholderCover title="Python" accentColor="#12A5B0" />
                </div>
                <div className="absolute w-44 sm:w-52 transform rotate-12 translate-x-12 translate-y-2 opacity-90 transition hover:rotate-0 hover:z-30">
                  <PlaceholderCover title="DSA" accentColor="#FFD54A" />
                </div>
                <div className="relative z-20 w-48 sm:w-56 shadow-2xl transform hover:scale-105 transition">
                  <PlaceholderCover title="C & C++" accentColor="#0B3561" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION D: FEATURE STRIP */}
      <FeatureStrip />

      {/* SECTION E: FEATURED COLLECTION (3 Columns Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561] inline-block relative">
            Featured{' '}
            <span className="relative inline-block text-[#12A5B0]">
              collection
              <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
            </span>
          </h2>
          <p className="font-body text-[#3C5D81] text-base max-w-md mx-auto">
            Explore our top-selling handwritten printed books designed for conceptual clarity and fast exam revision.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(prod => {
            const savingsPercent = Math.round(((prod.mrp_paise - prod.price_paise) / prod.mrp_paise) * 100);

            return (
              <div
                key={prod.slug}
                className="bg-white rounded-3xl p-6 border border-[#0B3561]/12 shadow-lg hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* 3D Book Image Cover */}
                  <div
                    onClick={() => navigate(`/product/${prod.slug}`)}
                    className="cursor-pointer mb-5 relative group/img"
                  >
                    <PlaceholderCover
                      title={prod.title.replace(' Simplified Handwritten Notes', '').replace(' Handwritten Notes', '')}
                      accentColor="#12A5B0"
                      imageUrl={prod.images && prod.images.length > 0 ? prod.images[0] : undefined}
                    />

                    {/* SAVE Chip at bottom-left of image */}
                    {savingsPercent > 0 && (
                      <div className="absolute top-4 left-4 bg-[#FFD54A] text-[#071E38] font-heading font-black text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 z-10 uppercase tracking-wider">
                        <span>SAVE {savingsPercent}%</span>
                      </div>
                    )}

                    {/* Badge Text Top Right */}
                    {prod.badge_text && (
                      <div className="absolute top-4 right-4 bg-[#0B3561] text-white font-heading font-bold text-[10px] px-2.5 py-1 rounded-full shadow-xs border border-white/20 uppercase tracking-wider z-10">
                        {prod.badge_text}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => navigate(`/product/${prod.slug}`)}
                    className="font-heading font-bold text-lg text-[#0B3561] line-clamp-2 hover:text-[#12A5B0] cursor-pointer transition min-h-[52px]"
                  >
                    {prod.title}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-[#FFD54A] text-xs">
                      ★★★★★
                    </div>
                    <span className="font-heading text-xs font-semibold text-[#0B3561]">4.9</span>
                    <span className="text-[11px] text-[#6D86A0] font-medium">(120+ student reviews)</span>
                  </div>

                  {/* Short Description & Bullet Highlights */}
                  <p className="font-body text-xs text-[#3C5D81] mt-2.5 leading-relaxed line-clamp-2">
                    {prod.short_desc}
                  </p>

                  <ul className="mt-3.5 space-y-1.5 font-body text-xs text-[#0B3561] border-t border-[#0B3561]/10 pt-3">
                    <li className="flex items-center gap-2 font-medium">
                      <span className="text-[#13834D] font-bold">✓</span> Full Semester Syllabus & Exam Notes
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <span className="text-[#13834D] font-bold">✓</span> Color-Coded Syntax & Diagrams
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <span className="text-[#13834D] font-bold">✓</span> Printed Physical Book Delivered
                    </li>
                  </ul>

                  {/* Stock & Express Delivery Banner */}
                  <div className="mt-3.5 bg-[#DDF3F4]/70 px-3 py-1.5 rounded-xl border border-[#12A5B0]/30 flex items-center justify-between text-[11px] font-heading font-semibold text-[#0B3561]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#13834D] animate-pulse" />
                      In Stock ({prod.stock_qty || 50} copies left)
                    </span>
                    <span className="text-[#12A5B0] font-bold">Express Shipping</span>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline justify-between mt-4 pt-3 border-t border-[#0B3561]/10">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-black italic text-2xl text-[#0B3561]">
                        Rs. {(prod.price_paise / 100).toFixed(2)}
                      </span>
                      <span className="font-body text-xs text-[#9DAEC0] line-through font-semibold">
                        Rs. {(prod.mrp_paise / 100).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] font-heading font-bold text-[#13834D] bg-[#13834D]/10 px-2 py-0.5 rounded-md">
                      GST Included
                    </span>
                  </div>
                </div>

                {/* Quick Add / View Button */}
                <div className="mt-6 pt-4 border-t border-[#0B3561]/10 flex gap-2">
                  <button
                    onClick={() => onAddToCart(prod.slug, 1)}
                    className="flex-1 bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs py-3 rounded-xl hover:brightness-105 transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/product/${prod.slug}`}
                    className="px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/20 text-[#0B3561] font-heading font-bold text-xs rounded-xl hover:bg-[#DDF3F4] transition flex items-center"
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
