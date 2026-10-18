import React, { useState, useEffect, useRef } from 'react';
import { PenUnderlineSVG } from './Icons';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  city: string;
  bookTitle: string;
  rating: number;
  quote: string;
  avatarBg: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Aarav Sharma',
    role: 'B.Tech CSE Student',
    city: 'New Delhi',
    bookTitle: 'C + C++ + Python Starter Bundle',
    rating: 5,
    quote:
      'The handwritten format is a complete game changer! I was struggling with pointer arithmetic and recursion tree diagrams in C++, but these visual step-by-step notes made the concepts click instantly before my semester exams.',
    avatarBg: '#0B3561',
  },
  {
    id: 't2',
    name: 'Priya Nair',
    role: '3rd Year Software Eng.',
    city: 'Bengaluru',
    bookTitle: 'DSA with Java Book',
    rating: 5,
    quote:
      'The physical paper quality and vibrant color printing exceeded my expectations. Having printed handwritten books to write margin notes during late-night study sessions helped me clear my placement coding rounds!',
    avatarBg: '#12A5B0',
  },
  {
    id: 't3',
    name: 'Rohan Verma',
    role: '2nd Year CS, NIT Trichy',
    city: 'Tamil Nadu',
    bookTitle: 'SQL & Database Design Book',
    rating: 5,
    quote:
      'Revising SQL joins, indexing, and B-trees used to take me days. With PyNotes color-coded tables and query execution traces, I finished revising the entire semester syllabus in under 4 hours!',
    avatarBg: '#071E38',
  },
  {
    id: 't4',
    name: 'Ananya Gupta',
    role: 'IT Undergrad',
    city: 'Pune, Maharashtra',
    bookTitle: 'Ultimate 4-Language Master Bundle',
    rating: 5,
    quote:
      'Ordered the 4-Book Master Bundle. The parcel arrived in 3 days in pristine packaging with express tracking. The handwriting is clean, crisp, and 10x easier to remember than dry textbook PDF slides.',
    avatarBg: '#0B3561',
  },
  {
    id: 't5',
    name: 'Karthik Raju',
    role: 'BCA Final Year',
    city: 'Hyderabad',
    bookTitle: 'Python Programming Book',
    rating: 5,
    quote:
      'Every single code snippet includes expected console output and dry-run variable state tables. It literally feels like studying from the top university topper handwritten notebooks!',
    avatarBg: '#12A5B0',
  },
];

export const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = DEFAULT_TESTIMONIALS;

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isAutoplay) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isAutoplay, currentIndex]);

  const activeItem = testimonials[currentIndex];

  return (
    <section className="bg-ruled-paper py-16 px-4 sm:px-8 border-y border-[#0B3561]/10 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="inline-block bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full border border-[#12A5B0]/30 shadow-xs">
            STUDENT REVIEWS & SOCIAL PROOF
          </span>

          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#0B3561] leading-tight">
            Loved by{' '}
            <span className="relative inline-block text-[#12A5B0]">
              5,000+ Students
              <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
            </span>{' '}
            Across India
          </h2>
          <p className="font-body text-[#3C5D81] text-sm sm:text-base max-w-lg mx-auto font-medium">
            Read honest feedback from engineering students who revised faster and aced their exams with PyNotes.
          </p>
        </div>

        {/* Testimonial Card Container */}
        <div
          className="relative bg-white rounded-3xl p-6 sm:p-10 border border-[#0B3561]/15 shadow-2xl transition-all duration-300"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          {/* Quote Icon Background Accent */}
          <div className="absolute top-6 right-8 text-[#DDF3F4] pointer-events-none select-none">
            <svg className="w-24 h-24 sm:w-32 sm:h-32 opacity-60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
            
            {/* Student Avatar & Verified Badge */}
            <div className="flex-shrink-0 flex flex-col items-center text-center space-y-2">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white font-display font-black text-2xl sm:text-3xl shadow-lg border-2 border-white"
                style={{ backgroundColor: activeItem.avatarBg }}
              >
                {activeItem.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-[#13834D] bg-[#13834D]/10 px-2.5 py-1 rounded-full">
                <span>✓</span> Verified Buyer
              </span>
            </div>

            {/* Content Column */}
            <div className="flex-1 space-y-4">
              
              {/* Star Rating & Book Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0B3561]/10 pb-3">
                <div className="flex items-center gap-1 text-[#FFD54A] text-base">
                  {'★'.repeat(activeItem.rating)}
                  <span className="font-heading text-xs font-bold text-[#0B3561] ml-1">
                    5.0 / 5.0
                  </span>
                </div>
                <span className="bg-[#DDF3F4] text-[#0B3561] font-heading font-bold text-xs px-3 py-1 rounded-full border border-[#12A5B0]/30">
                  Book: {activeItem.bookTitle}
                </span>
              </div>

              {/* Quote Text */}
              <blockquote className="font-body text-base sm:text-lg text-[#0B3561] italic leading-relaxed font-medium">
                "{activeItem.quote}"
              </blockquote>

              {/* Author Bio */}
              <div>
                <h4 className="font-heading font-bold text-base text-[#0B3561]">
                  {activeItem.name}
                </h4>
                <p className="font-heading text-xs text-[#3C5D81]">
                  {activeItem.role} • {activeItem.city}
                </p>
              </div>

            </div>

          </div>

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-[#0B3561]/10 flex items-center justify-between">
            
            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-[#12A5B0]'
                      : 'w-2.5 bg-[#0B3561]/20 hover:bg-[#0B3561]/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next / Prev Arrow Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-[#F7FAFC] border border-[#0B3561]/20 text-[#0B3561] hover:bg-[#0B3561] hover:text-white transition flex items-center justify-center shadow-xs"
                title="Previous Testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-[#0B3561] text-white hover:bg-[#071E38] transition flex items-center justify-center shadow-md"
                title="Next Testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>

        </div>

        {/* Footer Trust Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[
            { metric: '100%', label: 'Physical Printed Books' },
            { metric: '24-48 Hrs', label: 'Express Order Dispatch' },
            { metric: '4.9 ★', label: 'Average Student Rating' },
            { metric: 'India-Wide', label: 'Cash on Delivery Available' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-3.5 rounded-2xl border border-[#0B3561]/10 text-center shadow-xs">
              <div className="font-display font-black italic text-lg sm:text-xl text-[#0B3561]">
                {item.metric}
              </div>
              <div className="font-heading font-semibold text-[11px] text-[#3C5D81] mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
