import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Subject, Product, SiteSettings, Review, FAQ, HeroBannerItem } from '../types';
import { FeatureStrip } from '../components/FeatureStrip';
import { BookCoverVisual } from '../components/BookCoverVisual';
import { OpenNotebookVisual } from '../components/OpenNotebookVisual';
import { EditorialVisual } from '../components/EditorialVisual';
import { PenUnderlineSVG, CheckCircleIcon, CrossIcon, CartIcon } from '../components/Icons';
import { postContactMessage } from '../lib/api';

interface HomePageProps {
  subjects: Subject[];
  products: Product[];
  settings: SiteSettings;
  reviews?: Review[];
  faqs?: FAQ[];
  onAddToCart: (slug: string, qty: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  subjects,
  products,
  settings,
  reviews = [],
  faqs = [],
  onAddToCart,
}) => {
  const navigate = useNavigate();

  // Active sample page for "Look inside" carousel
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  // FAQ accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Hero Banner Carousel State & Fallbacks
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  const defaultHeroBanners: HeroBannerItem[] = [
    {
      id: 'banner_1',
      badge: '✨ 2026 Revised Student Edition • 100 GSM Colour Print',
      headline: 'Master Coding with Printed, Colourful Handwritten Notes.',
      writeup: 'Step-by-step algorithms, visual syntax trees, and color-coded memory traces on premium 100 GSM cream paper — built to crack semester exams and placement interviews without screen fatigue.',
      cta_text: 'Shop Notes',
      cta_link: '#subjects-grid',
      secondary_cta_text: 'Placement Bundles SAVE 50%',
      secondary_cta_link: '/bundles',
      image: '',
      accent_color: '#0B3561',
      active: true,
    },
    {
      id: 'banner_2',
      badge: '🚀 Complete Placement Prep • Visual DSA & Systems',
      headline: 'Crack Tech Interviews with Diagrammatic Logic & Solved Problems.',
      writeup: 'Over 850+ pages of handwritten problem breakdowns, visual recursion trees, Big-O proofs, and dynamic programming tabular patterns across Java, Python, and SQL.',
      cta_text: 'Explore Placement Bundles',
      cta_link: '/bundles',
      secondary_cta_text: 'View All 13 Subjects',
      secondary_cta_link: '/subjects',
      image: '',
      accent_color: '#12A5B0',
      active: true,
    },
    {
      id: 'banner_3',
      badge: '📖 Bleed-Proof 100 GSM Archival Cream Sheets',
      headline: 'Physical Notes Built for Long Study Sessions & Zero Glare.',
      writeup: 'High-opacity, smudge-resistant cream paper designed for highlighters and pens. Annotate, trace algorithms, and study without blue-light screen headache.',
      cta_text: 'Browse Books',
      cta_link: '/subjects',
      secondary_cta_text: 'Look Inside Pages',
      secondary_cta_link: '#look-inside',
      image: '',
      accent_color: '#FFD54A',
      active: true,
    },
    {
      id: 'banner_4',
      badge: '⚡ Pan-India Express Delivery • COD Available',
      headline: 'Order with Cash on Delivery — Arrives in 2–4 Business Days.',
      writeup: 'Dispatched in reinforced weather-proof packaging with live SMS and WhatsApp tracking so you can receive your books before semester test week.',
      cta_text: 'Order with Cash on Delivery',
      cta_link: '#subjects-grid',
      secondary_cta_text: 'Check PIN Code ETA',
      secondary_cta_link: '/track',
      image: '',
      accent_color: '#10B981',
      active: true,
    },
  ];

  const activeBanners = (settings?.hero_banners && settings.hero_banners.length > 0)
    ? settings.hero_banners.filter(b => b.active !== false)
    : defaultHeroBanners;

  const currentBanner = activeBanners[activeBannerIdx] || activeBanners[0] || defaultHeroBanners[0];

  // Auto-rotate hero banners every 6 seconds unless hovered
  useEffect(() => {
    if (activeBanners.length <= 1 || isBannerHovered) return;
    const interval = setInterval(() => {
      setActiveBannerIdx(prev => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length, isBannerHovered]);

  // Filter book products
  const bookProducts = products.filter(p => p.status === 'active' && p.type === 'book');
  const bundleProducts = products.filter(p => p.status === 'active' && p.type === 'bundle');

  // Subject filter category state
  const [subjectCategoryFilter, setSubjectCategoryFilter] = useState<'all' | 'core' | 'placements' | 'systems' | 'web'>('all');

  // 12 Requested Core Subjects with Category & Feature Tags
  const coreSubjectSlugs = [
    {
      slug: 'c',
      name: 'C Programming',
      category: 'core' as const,
      slot: 'subject_c',
      hl: 'yellow' as const,
      tag: 'Bestseller',
      desc: 'Pointers, memory addresses, dynamic allocation & structure unions.',
      highlights: ['Pointers & RAM Map', 'Flowcharts', 'Exam Solved'],
    },
    {
      slug: 'c-plus-plus',
      name: 'C++ Programming',
      category: 'core' as const,
      slot: 'subject_cpp',
      hl: 'pink' as const,
      tag: 'OOP Essential',
      desc: 'Classes, templates, virtual functions, STL vectors & memory heap.',
      highlights: ['STL Containers', 'Virtual Tables', 'Object Slicing'],
    },
    {
      slug: 'java',
      name: 'Java Programming',
      category: 'core' as const,
      slot: 'subject_java',
      hl: 'amber' as const,
      tag: 'Industry Standard',
      desc: 'JVM internals, collections framework, multi-threading & streams.',
      highlights: ['JVM Architecture', 'Collections Map', 'Multithreading'],
    },
    {
      slug: 'python',
      name: 'Python Programming',
      category: 'core' as const,
      slot: 'subject_python',
      hl: 'green' as const,
      tag: 'Top Rated',
      desc: 'Syntax quirks, list comprehensions, decorators, OOP & generators.',
      highlights: ['Visual Tracing', 'Decorators', 'Interview FAQ'],
    },
    {
      slug: 'dsa-with-java',
      name: 'DSA with Java',
      category: 'placements' as const,
      slot: 'subject_dsa',
      hl: 'orange' as const,
      tag: 'Placement Must',
      desc: 'Arrays, LinkedLists, Trees, Graphs, DP & Big-O cheat sheets.',
      highlights: ['Tree Traversals', 'Graph Visuals', 'Big-O Proofs'],
    },
    {
      slug: 'sql',
      name: 'SQL & Database',
      category: 'systems' as const,
      slot: 'subject_sql',
      hl: 'yellow' as const,
      tag: 'High Demand',
      desc: 'Joins, subqueries, grouping, indexing & schema architecture.',
      highlights: ['Visual Joins', 'Window Functions', 'Index Tuning'],
    },
    {
      slug: 'dbms',
      name: 'DBMS Architecture',
      category: 'systems' as const,
      slot: 'subject_dbms',
      hl: 'green' as const,
      tag: 'Semester Core',
      desc: 'ER diagrams, 1NF-BCNF normalization, ACID transactions & concurrency.',
      highlights: ['ER Diagrams', 'Normalization', 'ACID Concurrency'],
    },
    {
      slug: 'operating-system',
      name: 'Operating System',
      category: 'systems' as const,
      slot: 'subject_os',
      hl: 'pink' as const,
      tag: 'System Concepts',
      desc: 'Processes, CPU scheduling, deadlocks, paging & virtual memory.',
      highlights: ['Process Lifecycle', 'Deadlock Graphs', 'Paging Memory'],
    },
    {
      slug: 'html',
      name: 'HTML5 Semantic Web',
      category: 'web' as const,
      slot: 'subject_html',
      hl: 'orange' as const,
      tag: 'Frontend Base',
      desc: 'Semantic tags, accessibility, forms, media APIs & DOM structure.',
      highlights: ['Semantic Tree', 'Forms & Inputs', 'SEO Markup'],
    },
    {
      slug: 'css',
      name: 'CSS3 Flex & Grid',
      category: 'web' as const,
      slot: 'subject_css',
      hl: 'amber' as const,
      tag: 'Modern Layouts',
      desc: 'Box-model, flexbox axes, 12-col grid, media queries & transitions.',
      highlights: ['Flexbox Cheat Sheet', 'Grid fr-Units', 'Animations'],
    },
    {
      slug: 'javascript',
      name: 'JavaScript Modern',
      category: 'web' as const,
      slot: 'subject_js',
      hl: 'yellow' as const,
      tag: 'Full-Stack Core',
      desc: 'Closures, event loop, promises, async/await, DOM & ES6+ syntax.',
      highlights: ['Event Loop Diagram', 'Closures Scope', 'Async/Await'],
    },
    {
      slug: 'data-science',
      name: 'Data Science & Python',
      category: 'web' as const,
      slot: 'subject_datascience',
      hl: 'green' as const,
      tag: 'AI & Analytics',
      desc: 'NumPy vectors, Pandas DataFrames, Matplotlib & model pipelines.',
      highlights: ['NumPy Matrices', 'Pandas DataFrames', 'Feature Pipeline'],
    },
  ];

  // Look inside samples
  const lookInsidePages = [
    {
      id: 'sample_page_algorithms',
      title: 'Pointers & Dynamic Memory Stack',
      subject: 'C & C++',
      chapter: 'Chapter 04 · Memory Hierarchy',
      desc: 'Clear visual allocation breakdown showing Stack frames vs Heap allocations, pointer dereferencing step-traces, and NULL guard patterns.',
      highlights: ['RAM address hex-tracing', 'Visual pointer arrows', 'Free/malloc leak warnings'],
    },
    {
      id: 'sample_page_trees',
      title: 'Binary Search Trees & Graph Traversals',
      subject: 'Data Structures',
      chapter: 'Chapter 07 · Non-Linear Structures',
      desc: 'Color-coded node traversals (In-order, Pre-order, Post-order) with call-stack unwinding diagrams and Big-O cheat sheets.',
      highlights: ['Color-coded node visits', 'Balanced tree rotations', 'O(log N) proof summary'],
    },
    {
      id: 'sample_page_sql',
      title: 'SQL Relational Joins & Execution Traces',
      subject: 'SQL & DBMS',
      chapter: 'Chapter 05 · Relational Algebra',
      desc: 'Venn diagrams paired with real side-by-side SQL output matrices for INNER, LEFT, RIGHT, and FULL OUTER joins.',
      highlights: ['Visual Venn relationships', 'Primary-foreign key lines', 'Indexing speed tips'],
    },
  ];

  // Real FAQs with curated fallbacks
  const displayFaqs = faqs && faqs.length > 0 ? faqs : [
    {
      id: 'faq-1',
      question: 'How fast will my printed notebook parcel arrive?',
      answer: 'We dispatch all book orders within 24 business hours from our central fulfillment hub. Delivery typically takes 2 to 4 business days depending on your pincode across India, backed by real-time Shiprocket tracking.',
      group_name: 'Shipping',
      sort_order: 1,
      is_active: true,
    },
    {
      id: 'faq-2',
      question: 'Is Cash on Delivery (COD) available for student orders?',
      answer: 'Yes! We support Cash on Delivery across 19,000+ Indian pincodes. You can inspect the outer courier packaging and pay cash or UPI directly to the delivery courier upon arrival.',
      group_name: 'Payment',
      sort_order: 2,
      is_active: true,
    },
    {
      id: 'faq-3',
      question: 'What is the physical paper and ink quality?',
      answer: 'Every notebook is printed on heavyweight 100 GSM natural cream paper that prevents ink bleed-through. The pages feature vibrant 4-colour industrial offset printing, durable wire-o binding, and soft-touch protective cover laminations.',
      group_name: 'Product',
      sort_order: 3,
      is_active: true,
    },
    {
      id: 'faq-4',
      question: 'Can I write my own annotations and highlight these notes?',
      answer: 'Absolutely. The paper texture was chosen specifically for active study — highlighters, ballpoint pens, and gel pens glide smoothly without smudging or showing through to the reverse page.',
      group_name: 'Study',
      sort_order: 4,
      is_active: true,
    },
    {
      id: 'faq-5',
      question: 'Can I buy individual subject books, or do I have to buy bundles?',
      answer: 'You can purchase any single subject book independently for ₹399–₹499, or choose one of our discounted Placement or Semester bundles to save up to 55%.',
      group_name: 'Orders',
      sort_order: 5,
      is_active: true,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* =========================================================================
          SECTION 2: HERO SECTION
          Big headline, one-line promise, Shop Notes button, glossy book mockups
          floating next to an open notebook image.
          * "The hero banner image will not touch at all. Keep it."
         ========================================================================= */}
      {/* =========================================================================
          SECTION 2: HERO SECTION
          Rotating Hero Banner Carousel (3–4 big images with write-up)
          Connected to and manageable from the Admin Panel.
         ========================================================================= */}
      <section
        className="relative overflow-hidden pt-4 sm:pt-8"
        onMouseEnter={() => setIsBannerHovered(true)}
        onMouseLeave={() => setIsBannerHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="relative bg-gradient-to-b from-[#F7FAFC] via-[#FAF7F0]/40 to-white rounded-3xl p-6 sm:p-10 border border-[#0B3561]/5 shadow-xs">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center min-h-[460px]">
              
              {/* Left Column: Headline, Kicker & Action */}
              <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left transition-all duration-500">
                
                {/* Highlight Kicker / Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/30 text-[#92400E] text-xs font-heading font-semibold shadow-2xs">
                  <span>{currentBanner.badge || '✨ 2026 Revised Student Edition • 100 GSM Colour Print'}</span>
                </div>

                {/* Big Headline */}
                <h1 className="font-heading font-black text-3xl sm:text-5xl xl:text-6xl text-[#0B3561] tracking-tight leading-[1.12]">
                  {currentBanner.headline ? (
                    currentBanner.headline.includes('Handwritten') ? (
                      <>
                        {currentBanner.headline.split('Handwritten')[0]}
                        <span className="relative inline-block text-[#12A5B0] font-handwriting italic font-bold">
                          Handwritten
                          <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
                        </span>
                        {currentBanner.headline.split('Handwritten')[1]}
                      </>
                    ) : (
                      currentBanner.headline
                    )
                  ) : (
                    <>
                      Master Coding with Printed, Colourful{' '}
                      <span className="relative inline-block text-[#12A5B0] font-handwriting italic font-bold">
                        Handwritten
                        <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
                      </span>{' '}
                      Notes.
                    </>
                  )}
                </h1>

                {/* One-Line Promise / Writeup */}
                <p className="font-body text-base sm:text-lg text-[#486581] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {currentBanner.writeup ||
                    'Step-by-step algorithms, visual syntax trees, and color-coded memory traces on premium 100 GSM cream paper — built to crack semester exams and placement interviews without screen fatigue.'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <a
                    href={currentBanner.cta_link || '#subjects-grid'}
                    className="w-full sm:w-auto px-8 py-4 bg-[#0B3561] text-white font-heading font-bold text-sm rounded-xl hover:bg-[#132742] transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>{currentBanner.cta_text || 'Shop Notes'}</span>
                    <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                  </a>

                  {currentBanner.secondary_cta_text && (
                    <Link
                      to={currentBanner.secondary_cta_link || '/bundles'}
                      className="w-full sm:w-auto px-7 py-4 bg-white text-[#0B3561] border border-[#0B3561]/15 font-heading font-bold text-sm rounded-xl hover:bg-[#FAF7F0] transition shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>{currentBanner.secondary_cta_text}</span>
                    </Link>
                  )}
                </div>

                {/* Micro Trust Points */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#627D98] font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#16A34A] font-bold">✓</span> Cash on Delivery
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#16A34A] font-bold">✓</span> 2–4 Day Express Delivery
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#16A34A] font-bold">✓</span> Bleed-Proof 100 GSM
                  </span>
                </div>

              </div>

              {/* Right Column: Rotating Big Visual Artwork or 3D Mockups */}
              <div className="lg:col-span-6 relative flex items-center justify-center">
                {currentBanner.image ? (
                  <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-[#0B3561]/10 shadow-2xl bg-white group">
                    <img
                      src={currentBanner.image}
                      alt={currentBanner.headline}
                      className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-heading font-bold drop-shadow-md">
                      <span className="bg-[#0B3561]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        100 GSM Handwritten Notes
                      </span>
                      <span className="bg-[#12A5B0]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        2026 Edition
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Central Open Notebook with Floating Glossy Books */
                  <div className="relative w-full">
                    <div className="relative z-10 mx-auto max-w-lg sm:max-w-xl">
                      <OpenNotebookVisual />
                    </div>

                    {/* Floating Glossy 3D Python Book (Left Bottom) */}
                    <div className="hidden sm:block absolute -left-6 bottom-4 w-36 sm:w-44 z-20 animate-float-soft transform -rotate-6 filter drop-shadow-2xl">
                      <BookCoverVisual
                        slotId="subject_python"
                        title="Python"
                        subjectSlug="python"
                        accentColor="#10B981"
                        highlighterColor="green"
                      />
                    </div>

                    {/* Floating Glossy 3D DSA Book (Right Top) */}
                    <div
                      className="hidden sm:block absolute -right-6 -top-6 w-36 sm:w-44 z-20 animate-float-soft transform rotate-6 filter drop-shadow-2xl"
                      style={{ animationDelay: '1.5s' }}
                    >
                      <BookCoverVisual
                        slotId="subject_dsa"
                        title="DSA with Java"
                        subjectSlug="dsa-with-java"
                        accentColor="#12A5B0"
                        highlighterColor="yellow"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Carousel Controls: Arrows & Indicators */}
            {activeBanners.length > 1 && (
              <div className="mt-8 pt-4 border-t border-[#0B3561]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Dots / Pills */}
                <div className="flex items-center gap-2">
                  {activeBanners.map((banner, idx) => (
                    <button
                      key={banner.id || idx}
                      onClick={() => setActiveBannerIdx(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeBannerIdx
                          ? 'w-8 bg-[#0B3561]'
                          : 'w-2.5 bg-[#0B3561]/25 hover:bg-[#0B3561]/50'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[11px] font-mono text-[#627D98] ml-2">
                    {activeBannerIdx + 1} / {activeBanners.length}
                  </span>
                </div>

                {/* Previous & Next Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveBannerIdx(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
                    className="w-9 h-9 rounded-full bg-white border border-[#0B3561]/15 text-[#0B3561] hover:bg-[#0B3561] hover:text-white transition flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer"
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setActiveBannerIdx(prev => (prev + 1) % activeBanners.length)}
                    className="w-9 h-9 rounded-full bg-white border border-[#0B3561]/15 text-[#0B3561] hover:bg-[#0B3561] hover:text-white transition flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer"
                    aria-label="Next slide"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TRUST STRIP
          Premium print, beginner-friendly, fast shipping, cash on delivery
         ========================================================================= */}
      <FeatureStrip />

      {/* =========================================================================
          SECTION 4: SUBJECTS GRID WITH REVERSE DESIGN CARDS
          (C, C++, Java, Python, DSA, SQL, DBMS, OS, HTML, CSS, JavaScript, Data Science)
         ========================================================================= */}
      <section id="subjects-grid" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#12A5B0] bg-[#FEF3C7] px-3.5 py-1 rounded-full inline-block border border-[#F59E0B]/20">
            Comprehensive Curriculum
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#0B3561] tracking-tight">
            Explore All 12{' '}
            <span className="relative inline-block text-[#12A5B0] font-handwriting italic font-bold">
              Handwritten
              <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-2.5" color="#12A5B0" />
            </span>{' '}
            Subjects
          </h2>
          <p className="font-body text-sm sm:text-base text-[#486581] leading-relaxed">
            Every subject notebook is hand-written, visual-first, and printed in 4-colour ink on 100 GSM bleed-proof cream paper. Pick individual subjects or grab the semester pack.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {[
              { id: 'all' as const, label: 'All 12 Subjects', count: 12 },
              { id: 'core' as const, label: 'Core Coding', count: 4 },
              { id: 'placements' as const, label: 'DSA & Placements', count: 1 },
              { id: 'systems' as const, label: 'Databases & Systems', count: 3 },
              { id: 'web' as const, label: 'Web & Data Science', count: 4 },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSubjectCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                  subjectCategoryFilter === cat.id
                    ? 'bg-[#0B3561] text-[#FEF08A] shadow-md scale-105'
                    : 'bg-white text-[#486581] hover:text-[#0B3561] border border-[#0B3561]/10 hover:border-[#12A5B0]/40'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid: Clean, Bright, High-Conversion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {coreSubjectSlugs
            .filter(
              (subj) =>
                subjectCategoryFilter === 'all' || subj.category === subjectCategoryFilter
            )
            .map((subj) => {
              const productMatch = products.find(
                (p) => p.slug === subj.slug || p.subject_id === subj.slug
              );
              const pricePaise = productMatch ? productMatch.price_paise : 39900;
              const mrpPaise = productMatch ? productMatch.mrp_paise : 79900;
              const savingsPercent = Math.round(
                ((mrpPaise - pricePaise) / mrpPaise) * 100
              );
              const savingsAmount = Math.round((mrpPaise - pricePaise) / 100);

              return (
                <div
                  key={subj.slug}
                  className="bg-white rounded-3xl p-5 border border-[#0B3561]/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Top Notebook Visual Container */}
                    <div
                      onClick={() => navigate(`/product/${subj.slug}`)}
                      className="relative mb-4 cursor-pointer"
                    >
                      <BookCoverVisual
                        slotId={subj.slot}
                        title={subj.name.replace(' Programming', '').replace(' Architecture', '')}
                        subjectSlug={subj.slug}
                        highlighterColor={subj.hl}
                      />

                      {/* Tag Badge */}
                      <span className="absolute top-3 left-3 bg-[#0B3561]/85 backdrop-blur-xs text-white font-mono font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-xs z-20">
                        {subj.tag}
                      </span>

                      {/* Discount Badge */}
                      <span className="absolute top-3 right-3 bg-[#FEF08A] text-[#713F12] border border-[#FACC15] font-mono font-black text-[10px] px-2 py-0.5 rounded shadow-xs z-20">
                        SAVE {savingsPercent > 0 ? savingsPercent : 50}%
                      </span>
                    </div>

                    {/* Metadata Pill */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#627D98] mb-1.5">
                      <span className="text-[#12A5B0] font-bold uppercase tracking-wider">
                        Printed Book
                      </span>
                      <span>180+ Pages · 100 GSM</span>
                    </div>

                    {/* Subject Name */}
                    <h3
                      onClick={() => navigate(`/product/${subj.slug}`)}
                      className="font-heading font-black text-lg text-[#0B3561] group-hover:text-[#12A5B0] cursor-pointer transition-colors leading-snug line-clamp-1"
                    >
                      {subj.name}
                    </h3>

                    {/* Subject Description */}
                    <p className="font-body text-xs text-[#486581] mt-1 line-clamp-2 leading-relaxed">
                      {subj.desc}
                    </p>

                    {/* Topic Highlights Chips */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {subj.highlights.map((item) => (
                        <span
                          key={item}
                          className="text-[9px] font-mono font-medium bg-[#FAF7F0] text-[#334E68] border border-[#0B3561]/8 px-2 py-0.5 rounded"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="mt-5 pt-3.5 border-t border-[#0B3561]/8 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading font-black text-2xl text-[#0B3561]">
                          ₹{(pricePaise / 100).toFixed(0)}
                        </span>
                        <span className="font-mono text-xs text-[#9DAEC0] line-through">
                          ₹{(mrpPaise / 100).toFixed(0)}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#059669]">
                        Save ₹{savingsAmount}
                      </span>
                    </div>

                    {/* Dual Action Buttons: Add to Cart + Look Inside */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(subj.slug, 1);
                        }}
                        className="flex-1 bg-[#12A5B0] hover:bg-[#B45309] text-white font-heading font-bold text-xs py-2.5 px-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        aria-label={`Add ${subj.name} to Cart`}
                      >
                        <CartIcon className="w-3.5 h-3.5 text-white" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={() => navigate(`/product/${subj.slug}`)}
                        className="px-3 py-2.5 bg-[#FAF7F0] hover:bg-white text-[#0B3561] border border-[#0B3561]/15 hover:border-[#12A5B0]/40 font-heading font-semibold text-xs rounded-xl transition cursor-pointer whitespace-nowrap"
                        aria-label={`View details for ${subj.name}`}
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* View All Button */}
        <div className="text-center pt-2">
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF7F0] text-[#0B3561] border border-[#0B3561]/15 rounded-xl font-heading font-semibold text-xs sm:text-sm hover:bg-white transition shadow-xs"
          >
            <span>Browse Complete Subject Library</span>
            <span>→</span>
          </Link>
        </div>

      </section>

      {/* =========================================================================
          SECTION 5: BESTSELLERS
          Price, discount badge and quick "Add to cart"
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#0B3561]/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#12A5B0]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#12A5B0]">Student Favourites</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#0B3561] tracking-tight mt-1">
              Bestseller Printed Books
            </h2>
          </div>

          <Link
            to="/subjects"
            className="text-xs font-heading font-bold text-[#12A5B0] hover:text-[#B45309] hover:underline"
          >
            View all books →
          </Link>
        </div>

        {/* Bestsellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookProducts.slice(0, 3).map((prod) => {
            const savingsPercent = Math.round(((prod.mrp_paise - prod.price_paise) / prod.mrp_paise) * 100);

            return (
              <div
                key={prod.slug}
                className="glossy-book-card p-5 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  {/* Glossy Book Cover */}
                  <div
                    onClick={() => navigate(`/product/${prod.slug}`)}
                    className="cursor-pointer mb-4 relative"
                  >
                    <BookCoverVisual
                      title={prod.title.replace(' Simplified Handwritten Notes', '').replace(' Handwritten Notes', '')}
                      subjectSlug={prod.slug}
                      imageUrl={prod.images && prod.images.length > 0 ? prod.images[0] : undefined}
                      highlighterColor="yellow"
                    />

                    {savingsPercent > 0 && (
                      <span className="absolute top-3 left-3 bg-[#12A5B0] text-white font-mono font-bold text-[10px] px-2.5 py-1 rounded shadow-sm z-20">
                        SAVE {savingsPercent}%
                      </span>
                    )}
                  </div>

                  {/* Title & Short Description */}
                  <h3
                    onClick={() => navigate(`/product/${prod.slug}`)}
                    className="font-heading font-bold text-base text-[#0B3561] hover:text-[#12A5B0] cursor-pointer transition-colors line-clamp-1"
                  >
                    {prod.title}
                  </h3>
                  <p className="font-body text-xs text-[#627D98] mt-1.5 line-clamp-2 leading-relaxed">
                    {prod.short_desc}
                  </p>
                </div>

                {/* Price Baseline & Quick Add To Cart */}
                <div className="mt-5 pt-4 border-t border-[#0B3561]/8 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-heading font-bold text-xl text-[#0B3561]">
                      ₹{(prod.price_paise / 100).toFixed(0)}
                    </div>
                    <div className="font-mono text-xs text-[#9DAEC0] line-through">
                      ₹{(prod.mrp_paise / 100).toFixed(0)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAddToCart(prod.slug, 1)}
                      className="px-4 py-2.5 bg-[#0B3561] text-white font-heading font-bold text-xs rounded-xl hover:bg-[#132742] transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Add to Cart</span>
                      <span>+</span>
                    </button>
                    <Link
                      to={`/product/${prod.slug}`}
                      className="px-3 py-2.5 bg-[#FAF7F0] text-[#0B3561] font-heading font-semibold text-xs rounded-xl hover:bg-white transition border border-[#0B3561]/10"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* =========================================================================
          SECTION 6: "LOOK INSIDE" CAROUSEL SHOWING SAMPLE PAGES
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#12A5B0] bg-[#FEF3C7] px-3 py-1 rounded-full inline-block">
            Examine the Quality
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#0B3561] tracking-tight">
            Look Inside Sample Pages
          </h2>
          <p className="font-body text-sm text-[#486581]">
            Flip through real sample excerpts showcasing our multi-color handwritten syntax and memory diagrams.
          </p>
        </div>

        {/* Look Inside Tab Controller */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#FAF7F0] rounded-2xl max-w-2xl mx-auto border border-[#0B3561]/8">
          {lookInsidePages.map((sample, idx) => (
            <button
              key={sample.id}
              onClick={() => setActiveSampleIdx(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer ${
                activeSampleIdx === idx
                  ? 'bg-white text-[#0B3561] shadow-sm font-bold border border-[#0B3561]/10'
                  : 'text-[#627D98] hover:text-[#0B3561]'
              }`}
            >
              {sample.subject}: {sample.title.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* Active Sample Page Showcase */}
        {lookInsidePages[activeSampleIdx] && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0B3561]/10 shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Visual Sample Page Preview Slot */}
            <div className="md:col-span-6">
              <EditorialVisual
                slotId={lookInsidePages[activeSampleIdx].id}
                aspectRatio="3:4"
                className="max-w-sm mx-auto shadow-2xl"
              />
            </div>

            {/* Editorial Information */}
            <div className="md:col-span-6 space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#12A5B0]">
                  {lookInsidePages[activeSampleIdx].chapter}
                </span>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#0B3561] leading-tight">
                  {lookInsidePages[activeSampleIdx].title}
                </h3>
              </div>

              <p className="font-body text-sm text-[#486581] leading-relaxed">
                {lookInsidePages[activeSampleIdx].desc}
              </p>

              {/* Highlight bullet points */}
              <div className="space-y-2 pt-2">
                {lookInsidePages[activeSampleIdx].highlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#0B3561] font-medium">
                    <span className="w-4 h-4 rounded-full bg-[#FEF08A] text-[#0B3561] flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

              {/* Sample Page Trust Stamp */}
              <div className="pt-4 border-t border-[#0B3561]/8 flex items-center justify-between text-xs text-[#627D98]">
                <span>100 GSM Natural Cream Finish</span>
                <Link
                  to="/subjects"
                  className="font-heading font-bold text-[#12A5B0] hover:underline"
                >
                  Order This Book →
                </Link>
              </div>
            </div>

          </div>
        )}

      </section>

      {/* =========================================================================
          SECTION 7: OUR STORY
          Why handwritten notes, who made them, and what problem students face
          with typed material. Written with admin editable [Mr Raibha Dutta and 2015].
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-12 border border-[#0B3561]/8 shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Story Text - Full width now */}
            <div className="lg:col-span-12 space-y-6">
              
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#12A5B0] bg-[#FEF3C7] px-3 py-1 rounded-full inline-block">
                  Our Origin Story
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#0B3561] tracking-tight">
                  Why We Chose Handcrafted Ink Over Cold Typed Slides
                </h2>
              </div>

              {/* Story Narrative */}
              <div className="font-body text-sm sm:text-base text-[#334E68] space-y-4 leading-relaxed">
                <p>
                  In <strong>2015</strong>, founder <strong>Mr. Raibha Dutta</strong> observed a quiet crisis unfolding in computer science lecture halls across India: brilliant engineering students were drowning in hundreds of pages of monochromatic, typed textbook slides that failed to explain how code actually executes in memory.
                </p>

                <p>
                  Typed slides feel distant and sterile. When you study a complex topic like <em>Graph Traversals</em>, <em>B-Trees</em>, or <em>Pointer Arithmetic</em>, your brain craves spatial mapping: colored arrows showing pointer jumps, hand-drawn memory grids, and margin tips that mimic how a senior engineer sketches ideas on a whiteboard.
                </p>

                <p>
                  That insight gave birth to <strong>PyNotes</strong>. What began as hand-inked spiral notebooks passed between classmates before semester exams has grown into printed, colorful compendiums delivered to students in every state — proving that the tactile connection between pen, paper, and colorful ink remains the fastest way to real conceptual mastery.
                </p>
              </div>

              {/* Founder Sign-off */}
              <div className="pt-4 border-t border-[#0B3561]/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0B3561] text-white flex items-center justify-center font-heading font-bold text-base shadow-sm">
                  RD
                </div>
                <div>
                  <div className="font-heading font-bold text-sm text-[#0B3561]">
                    Mr. Raibha Dutta
                  </div>
                  <div className="text-xs text-[#627D98]">
                    Founder &amp; Author, PyNotes · Est. 2015
                  </div>
                </div>
              </div>

            </div>


          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: HOW IT'S MADE (4-STEP VISUAL TIMELINE)
          Handwritten -> Designed -> Printed in colour -> Delivered
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#12A5B0] bg-[#FEF3C7] px-3 py-1 rounded-full inline-block">
            Craftsmanship &amp; Fulfillment
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#0B3561] tracking-tight">
            How Every Book is Crafted
          </h2>
          <p className="font-body text-sm text-[#486581]">
            From handwritten ink notes to express doorstep delivery across India.
          </p>
        </div>

        {/* 4-Step Visual Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm hover:-translate-y-1 transition-transform relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              01
            </div>
            <h3 className="font-heading font-bold text-base text-[#0B3561]">
              Handwritten
            </h3>
            <p className="font-body text-xs text-[#627D98] leading-relaxed">
              Every syntax rule, tree diagram, and algorithm trace is written by hand with multi-colored ink pens for optimal visual memory encoding.
            </p>
            <div className="text-[11px] font-mono font-semibold text-[#12A5B0]">
              • Step-by-step logic
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm hover:-translate-y-1 transition-transform relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#BBF7D0] text-[#064E3B] flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              02
            </div>
            <h3 className="font-heading font-bold text-base text-[#0B3561]">
              Designed
            </h3>
            <p className="font-body text-xs text-[#627D98] leading-relaxed">
              Digital proofing ensures high contrast, crystal-clear line weights, generous margins for personal study notes, and intuitive chapter indexes.
            </p>
            <div className="text-[11px] font-mono font-semibold text-[#16A34A]">
              • Precision calibration
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm hover:-translate-y-1 transition-transform relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBCFE8] text-[#831843] flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              03
            </div>
            <h3 className="font-heading font-bold text-base text-[#0B3561]">
              Printed in Colour
            </h3>
            <p className="font-body text-xs text-[#627D98] leading-relaxed">
              Industrial offset machines print in vibrant 4-colour inks onto heavyweight 100 GSM bleed-proof cream paper with sturdy coil binding.
            </p>
            <div className="text-[11px] font-mono font-semibold text-[#DB2777]">
              • Bleed-proof paper
            </div>
          </div>

          {/* Step 4: Uses parcel_shipping slot */}
          <div className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm hover:-translate-y-1 transition-transform relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FED7AA] text-[#7C2D12] flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              04
            </div>
            <h3 className="font-heading font-bold text-base text-[#0B3561]">
              Delivered
            </h3>
            <p className="font-body text-xs text-[#627D98] leading-relaxed">
              Carefully wrapped in protective moisture-proof packaging and dispatched via express couriers with live SMS &amp; web tracking to your door.
            </p>
            <div className="text-[11px] font-mono font-semibold text-[#EA580C]">
              • 2–4 Day Dispatch
            </div>
          </div>

        </div>

        {/* Parcel Shipping Visual Showcase */}
        <div className="max-w-md mx-auto pt-2">
          <EditorialVisual slotId="parcel_shipping" aspectRatio="16:9" />
        </div>

      </section>

      {/* =========================================================================
          SECTION 9: TYPED NOTES VS HANDWRITTEN NOTES COMPARISON, WITH VISUALS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#12A5B0] bg-[#FEF3C7] px-3 py-1 rounded-full inline-block">
            Evidence-Based Learning
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#0B3561] tracking-tight">
            Typed Notes vs. Handwritten Notes
          </h2>
          <p className="font-body text-sm text-[#486581]">
            Why students retain 3× more computer science concepts on physical paper.
          </p>
        </div>

        {/* Clean, Polished Comparison Table */}
        <div className="bg-white rounded-3xl border border-[#0B3561]/10 shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#0B3561]/10 bg-[#FAF7F0]">
                  <th className="p-4 sm:p-5 font-heading font-bold text-[#0B3561] w-1/3">
                    Study Dimension
                  </th>
                  <th className="p-4 sm:p-5 font-heading font-bold text-white bg-[#0B3561] text-center w-1/3">
                    PyNotes Handwritten
                  </th>
                  <th className="p-4 sm:p-5 font-heading font-semibold text-[#627D98] text-center w-1/3">
                    Standard Typed PDFs
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3561]/8 font-body">
                {[
                  {
                    factor: 'Memory Recall & Retention',
                    pynotes: 'High (Spatial neural pathways)',
                    typed: 'Low (Passive skimming)',
                    pynotesGood: true,
                  },
                  {
                    factor: 'Screen Fatigue & Blue Light',
                    pynotes: 'Zero Eye Strain (Natural cream paper)',
                    typed: 'High (Causes headache & eye strain)',
                    pynotesGood: true,
                  },
                  {
                    factor: 'Complex Algorithm Diagrams',
                    pynotes: 'Color-coded step traces & arrows',
                    typed: 'Dry monospaced text blocks',
                    pynotesGood: true,
                  },
                  {
                    factor: 'Exam Night Rapid Revision',
                    pynotes: '20–30 mins per full subject',
                    typed: 'Hours of scrolling endless pages',
                    pynotesGood: true,
                  },
                  {
                    factor: 'Personal Margin Annotations',
                    pynotes: 'Direct pen, pencil & sticky notes',
                    typed: 'Clumsy PDF digital markups',
                    pynotesGood: true,
                  },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F0]/40'}>
                    <td className="p-4 sm:p-5 font-heading font-semibold text-[#0B3561]">
                      {row.factor}
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-[#0B3561]/5 font-medium text-[#0B3561]">
                      <div className="flex items-center justify-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                        <span>{row.pynotes}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-center text-[#627D98]">
                      <div className="flex items-center justify-center gap-1.5">
                        <CrossIcon className="w-4 h-4 text-[#DC2626] flex-shrink-0" />
                        <span>{row.typed}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 10: BUNDLES (PLACEMENT PACK, SEMESTER PACK)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#12A5B0] bg-[#FEF3C7] px-3 py-1 rounded-full inline-block">
            Curated Study Combos
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#0B3561] tracking-tight">
            Complete Prep Bundles
          </h2>
          <p className="font-body text-sm text-[#486581]">
            Curated book bundles designed for placement interviews and university semesters with maximum savings.
          </p>
        </div>

        {/* Bundle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundleProducts.slice(0, 3).map((bundle) => {
            const savingsPercent = Math.round(((bundle.mrp_paise - bundle.price_paise) / bundle.mrp_paise) * 100);

            return (
              <div
                key={bundle.slug}
                className="glossy-book-card p-6 rounded-3xl flex flex-col justify-between group border-2 border-[#12A5B0]/30 bg-gradient-to-b from-white to-[#FAF7F0]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#12A5B0] text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase">
                      Bundle Deal
                    </span>
                    <span className="font-mono text-xs font-bold text-[#16A34A]">
                      SAVE {savingsPercent}%
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#0B3561] group-hover:text-[#12A5B0] transition-colors">
                    {bundle.title}
                  </h3>
                  <p className="font-body text-xs text-[#627D98] mt-2 leading-relaxed">
                    {bundle.short_desc}
                  </p>

                  {/* Included Books Preview */}
                  <div className="mt-4 pt-3 border-t border-[#0B3561]/10 space-y-1.5">
                    <div className="text-[10px] font-mono font-bold uppercase text-[#627D98]">Includes printed books:</div>
                    <ul className="text-xs font-medium text-[#0B3561] space-y-1">
                      {bundle.bundle_items?.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-[#12A5B0]">✓</span>
                          <span>{item.qty || 1}× {item.book_slug.toUpperCase().replace(/-/g, ' ')}</span>
                        </li>
                      )) || (
                        <li className="text-xs text-[#627D98]">Multiple subject compendiums included</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Bundle Price & Add to Cart */}
                <div className="mt-6 pt-4 border-t border-[#0B3561]/10 flex items-center justify-between">
                  <div>
                    <div className="font-heading font-bold text-2xl text-[#0B3561]">
                      ₹{(bundle.price_paise / 100).toFixed(0)}
                    </div>
                    <div className="font-mono text-xs text-[#9DAEC0] line-through">
                      ₹{(bundle.mrp_paise / 100).toFixed(0)}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(bundle.slug, 1)}
                    className="px-5 py-3 bg-[#12A5B0] text-white font-heading font-bold text-xs rounded-xl hover:bg-[#B45309] transition shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Add Bundle</span>
                    <span>+</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* =========================================================================
          SECTION 11: STUDENT REVIEWS
          Show only real reviews from the database.
          If none, show a clean empty state, not fake testimonials or invented numbers.
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#12A5B0] bg-[#FEF3C7] px-3 py-1 rounded-full inline-block">
            Verified Feedback
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#0B3561] tracking-tight">
            Student Reviews
          </h2>
          <p className="font-body text-sm text-[#486581]">
            Real feedback from verified students studying with our physical printed books.
          </p>
        </div>

        {/* Real Reviews from Database or Dignified Empty State */}
        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex text-[#F59E0B] text-sm">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#627D98]">Verified Student</span>
                </div>

                <h4 className="font-heading font-bold text-sm text-[#0B3561]">
                  {rev.title}
                </h4>
                <p className="font-body text-xs text-[#486581] leading-relaxed">
                  &quot;{rev.body}&quot;
                </p>

                <div className="pt-3 border-t border-[#0B3561]/8 text-xs font-semibold text-[#0B3561]">
                  — {rev.display_name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Clean, Honest Empty State — No Fake Testimonials or Invented Numbers */
          <div className="bg-[#FAF7F0] p-8 sm:p-12 rounded-3xl border border-[#0B3561]/10 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#0B3561]/10 flex items-center justify-center text-xl mx-auto text-[#12A5B0] shadow-xs">
              ✍️
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-[#0B3561]">
                Verified Student Reviews
              </h3>
              <p className="font-body text-xs text-[#627D98] leading-relaxed max-w-md mx-auto">
                We believe in 100% genuine transparency. Every review published here is submitted directly by students who ordered and studied with our physical notes.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/subjects"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B3561] text-white rounded-xl text-xs font-heading font-semibold hover:bg-[#132742] transition shadow-xs"
              >
                <span>Order Notes &amp; Share Your Review</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

      </section>

      {/* =========================================================================
          SECTION 12: CURRENT AFFAIRS SUBSCRIPTION TEASER
          "Start 7-day free trial"
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-[#070F1E] via-[#0B3561] to-[#132742] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12A5B0]/20 border border-[#12A5B0]/40 text-[#F59E0B] text-xs font-mono font-bold">
                <span>📰 PyNotes Pro Subscription</span>
              </div>

              <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
                Stay Ahead in Campus Placements with Current Affairs &amp; Tech Digests
              </h2>

              <p className="font-body text-xs sm:text-sm text-[#BCCCDC] leading-relaxed max-w-2xl">
                Get monthly printed revision compendiums delivered to your hostel, plus weekly curated technology news, interview question breakdowns, and system design tear-downs.
              </p>

              <div className="flex flex-wrap gap-4 text-xs text-[#FEF3C7] pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#34D399]">✓</span> Monthly Printed Capsule
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#34D399]">✓</span> Weekly Tech Newsletter
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#34D399]">✓</span> Cancel Anytime Online
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <Link
                to="/subscription"
                className="w-full sm:w-auto px-8 py-4 bg-[#12A5B0] text-white font-heading font-bold text-sm rounded-xl hover:bg-[#B45309] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Start 7-Day Free Trial</span>
                <span>→</span>
              </Link>
              <span className="text-[11px] text-[#BCCCDC]/70 mt-2">
                No commitment · Free 7-day access
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 13: FAQ
          Accordion with polished presentation
         ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#12A5B0] bg-[#FEF3C7] px-3 py-1 rounded-full inline-block">
            Got Questions?
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#0B3561] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-sm text-[#486581]">
            Everything you need to know about our physical books, COD, and delivery.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {displayFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#0B3561]/10 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-sm sm:text-base text-[#0B3561] hover:text-[#12A5B0] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className={`text-base font-bold text-[#12A5B0] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-body text-[#486581] leading-relaxed border-t border-[#0B3561]/6 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/faq"
            className="text-xs font-heading font-bold text-[#12A5B0] hover:underline"
          >
            Read all frequently asked questions →
          </Link>
        </div>

      </section>

    </div>
  );
};
