import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { SearchIcon, CartIcon, UserIcon, WhatsappIcon, HeartIcon } from './Icons';
import { Subject, Product } from '../types';

interface HeaderProps {
  subjects: Subject[];
  products: Product[];
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  userEmail?: string | null;
  customLogoUrl?: string;
  whatsappNumber?: string;
}

export const Header: React.FC<HeaderProps> = ({
  subjects,
  products,
  cartCount,
  wishlistCount,
  onOpenCart,
  userEmail,
  customLogoUrl,
  whatsappNumber = '+919876543210',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search popup on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);

  // Filter subjects and products based on user search query
  const matchingSubjects = searchQuery.trim()
    ? subjects.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const matchingProducts = searchQuery.trim()
    ? products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const isCurrent = (path: string) => location.pathname === path;

  // Categorized subject definitions for header dropdown
  const subjectCategories = [
    {
      category: 'Core Programming',
      items: [
        { slug: 'c', label: 'C Programming' },
        { slug: 'c-plus-plus', label: 'C++ Programming' },
        { slug: 'java', label: 'Java Programming' },
        { slug: 'python', label: 'Python Programming' },
      ],
    },
    {
      category: 'Data Structures & Algorithms',
      items: [
        { slug: 'dsa-with-java', label: 'DSA with Java' },
        { slug: 'dsa-with-python', label: 'DSA with Python' },
      ],
    },
    {
      category: 'Databases & CS Systems',
      items: [
        { slug: 'sql', label: 'SQL & Database' },
        { slug: 'dbms', label: 'DBMS Architecture' },
        { slug: 'operating-system', label: 'Operating System' },
        { slug: 'data-science', label: 'Data Science' },
      ],
    },
    {
      category: 'Web Technologies',
      items: [
        { slug: 'html', label: 'HTML5' },
        { slug: 'css', label: 'CSS3' },
        { slug: 'javascript', label: 'JavaScript' },
      ],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0B3561]/10 shadow-[0_2px_10px_-3px_rgba(10,25,47,0.05)] h-[70px] flex items-center px-4 sm:px-8 transition-all">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#0B3561] hover:bg-[#FAF7F0] rounded-xl transition"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo variant="horizontal" surface="light" customUrl={customLogoUrl} size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-heading text-[13.5px] font-medium text-[#0B3561]">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full transition-all ${
                isCurrent('/')
                  ? 'bg-[#0B3561] text-white shadow-xs font-semibold'
                  : 'hover:bg-[#FAF7F0] hover:text-[#0B3561]'
              }`}
            >
              Home
            </Link>

            {/* Subject Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setSubjectDropdownOpen(true)}
              onMouseLeave={() => setSubjectDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  location.pathname.startsWith('/product') || location.pathname.startsWith('/subjects')
                    ? 'bg-[#0B3561] text-white font-semibold'
                    : 'hover:bg-[#FAF7F0]'
                }`}
              >
                <span>Subjects</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${subjectDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Categorized Dropdown Panel */}
              {subjectDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-[580px] bg-white rounded-2xl shadow-2xl border border-[#0B3561]/10 p-5 z-50 animate-fadeIn grid grid-cols-2 gap-5">
                  {subjectCategories.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="font-heading font-bold text-[11px] uppercase tracking-wider text-[#12A5B0] pb-1 border-b border-[#0B3561]/10">
                        {cat.category}
                      </div>
                      <ul className="space-y-0.5 text-xs">
                        {cat.items.map(item => (
                          <li key={item.slug}>
                            <Link
                              to={`/product/${item.slug}`}
                              className="block py-1.5 px-2.5 rounded-lg text-[#0B3561] font-medium hover:bg-[#FAF7F0] hover:text-[#12A5B0] transition"
                              onClick={() => setSubjectDropdownOpen(false)}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="col-span-2 pt-3 border-t border-[#0B3561]/10 flex justify-between items-center text-xs">
                    <span className="text-[#627D98] font-medium">All 13 handwritten subject books printed in rich color.</span>
                    <Link
                      to="/subjects"
                      className="font-bold text-[#12A5B0] hover:text-[#B45309] hover:underline"
                      onClick={() => setSubjectDropdownOpen(false)}
                    >
                      View All Subjects →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/bundles"
              className={`px-3 py-1.5 rounded-full transition-all ${
                isCurrent('/bundles') ? 'bg-[#0B3561] text-white font-semibold' : 'hover:bg-[#FAF7F0]'
              }`}
            >
              Bundles
            </Link>

            <Link
              to="/subscription"
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                isCurrent('/subscription') ? 'bg-[#0B3561] text-white font-semibold' : 'hover:bg-[#FAF7F0]'
              }`}
            >
              <span>Current Affairs</span>
            </Link>

            <Link
              to="/offers"
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                isCurrent('/offers') ? 'bg-[#0B3561] text-white font-semibold' : 'hover:bg-[#FAF7F0]'
              }`}
            >
              <span>Offers</span>
            </Link>

            <Link
              to="/track"
              className={`px-3 py-1.5 rounded-full transition-all ${
                isCurrent('/track') ? 'bg-[#0B3561] text-white font-semibold' : 'hover:bg-[#FAF7F0]'
              }`}
            >
              Track Order
            </Link>
          </nav>

          {/* HEADER ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle Button */}
            <button
              onClick={() => {
                setSearchVisible(!searchVisible);
                if (!searchVisible) setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className={`p-2.5 rounded-full transition ${
                searchVisible
                  ? 'bg-[#12A5B0] text-white shadow-md'
                  : 'text-[#0B3561] hover:bg-[#FAF7F0]'
              }`}
              aria-label="Toggle search"
            >
              <SearchIcon className="w-4.5 h-4.5" />
            </button>

            {/* My Account Link */}
            <Link
              to={userEmail ? '/account' : '/auth?mode=login'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-heading font-semibold ${
                userEmail
                  ? (isCurrent('/account') ? 'bg-[#0B3561] text-white shadow-xs' : 'text-[#0B3561] hover:bg-[#FAF7F0]')
                  : (isCurrent('/auth') ? 'bg-[#FAF7F0] text-[#0B3561] border border-[#0B3561]/20' : 'text-[#0B3561] hover:bg-[#FAF7F0]')
              }`}
              aria-label="My Account"
              title="My Account"
            >
              <UserIcon className="w-4.5 h-4.5" showDot={!!userEmail} />
              <span className="hidden sm:inline">My Account</span>
            </Link>

            {/* Wishlist Button */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2.5 text-[#0B3561] hover:bg-[#FAF7F0] rounded-full transition cursor-pointer"
              aria-label="View wishlist"
            >
              <HeartIcon className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-[#0B3561] hover:bg-[#FAF7F0] rounded-full transition cursor-pointer"
              aria-label="View shopping cart"
            >
              <CartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#12A5B0] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* EXPANDABLE SEARCH BAR */}
      {searchVisible && (
        <div className="sticky top-[70px] z-30 bg-white border-b border-[#0B3561]/10 shadow-lg animate-slideDown overflow-visible">
          <div ref={searchContainerRef} className="max-w-4xl mx-auto px-4 py-3.5 relative">
            <div className="relative flex items-center">
              <SearchIcon className="w-4.5 h-4.5 text-[#627D98] absolute left-4 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search handwritten notes: C++, Python, SQL, DSA, DBMS..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-11 pr-12 py-2.5 bg-[#FAF7F0] border border-[#0B3561]/15 rounded-xl text-sm font-medium text-[#0B3561] placeholder:text-[#627D98] focus:outline-none focus:border-[#12A5B0] focus:ring-2 focus:ring-[#12A5B0]/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-[#627D98] hover:text-[#0B3561] bg-white p-1 rounded-full shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Instant Live Autocomplete Dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-[calc(100%-4px)] left-4 right-4 bg-white rounded-b-2xl shadow-2xl border-x border-b border-[#0B3561]/15 overflow-hidden z-50 animate-fadeIn">
                <div className="max-h-80 overflow-y-auto divide-y divide-[#0B3561]/10">
                  
                  {/* Matching Subjects Section */}
                  {matchingSubjects.length > 0 && (
                    <div className="p-3 bg-[#FAF7F0]/60">
                      <span className="text-[10px] font-bold text-[#12A5B0] uppercase tracking-wider block mb-2 px-1">
                        Matching Subjects ({matchingSubjects.length})
                      </span>
                      <div className="space-y-1">
                        {matchingSubjects.map(sub => (
                          <div
                            key={sub.slug}
                            onClick={() => {
                              setSearchQuery('');
                              setSearchFocused(false);
                              setSearchVisible(false);
                              navigate(`/product/${sub.slug}`);
                            }}
                            className="p-2.5 rounded-lg hover:bg-white cursor-pointer flex items-center justify-between transition text-xs font-bold text-[#0B3561] shadow-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.accent_color || '#12A5B0' }} />
                              <span>{sub.name}</span>
                            </div>
                            <span className="text-xs text-[#12A5B0] font-semibold">View Book →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Printed Books Section */}
                  {matchingProducts.length > 0 && (
                    <div className="p-3">
                      <span className="text-[10px] font-bold text-[#0B3561] uppercase tracking-wider block mb-2 px-1">
                        Books &amp; Bundles ({matchingProducts.length})
                      </span>
                      <div className="space-y-1">
                        {matchingProducts.map(prod => (
                          <div
                            key={prod.slug}
                            onClick={() => {
                              setSearchQuery('');
                              setSearchFocused(false);
                              setSearchVisible(false);
                              navigate(`/product/${prod.slug}`);
                            }}
                            className="p-2.5 rounded-lg hover:bg-[#FAF7F0] cursor-pointer flex items-center justify-between transition"
                          >
                            <div className="space-y-0.5">
                              <h4 className="font-heading font-semibold text-xs text-[#0B3561] line-clamp-1">{prod.title}</h4>
                              <p className="text-[10px] text-[#627D98] line-clamp-1">{prod.short_desc}</p>
                            </div>
                            <span className="font-heading font-bold text-xs text-[#0B3561] ml-3 flex-shrink-0">
                              ₹{(prod.price_paise / 100).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingSubjects.length === 0 && matchingProducts.length === 0 && (
                    <div className="p-6 text-center text-xs text-[#627D98]">
                      No results found for &quot;<span className="font-bold text-[#0B3561]">{searchQuery}</span>&quot;
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Left Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#070F1E]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-[86%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto p-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#0B3561]/10">
              <Logo variant="horizontal" surface="light" customUrl={customLogoUrl} size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#0B3561] hover:bg-[#FAF7F0] rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-1.5 font-heading font-semibold text-sm text-[#0B3561]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl transition ${isCurrent('/') ? 'bg-[#0B3561] text-white' : 'hover:bg-[#FAF7F0]'}`}
              >
                Home
              </Link>

              {/* Categorized Subjects Accordion for Mobile */}
              <div className="py-2 border-y border-[#0B3561]/10 my-1 space-y-3">
                <span className="text-[10px] font-bold text-[#627D98] uppercase tracking-wider px-3 block">
                  Subject Categories
                </span>

                {subjectCategories.map((cat, idx) => (
                  <div key={idx} className="px-3 space-y-1">
                    <span className="text-xs font-bold text-[#12A5B0] uppercase block">
                      {cat.category}
                    </span>
                    <div className="pl-2 space-y-0.5 pt-0.5">
                      {cat.items.map(item => (
                        <Link
                          key={item.slug}
                          to={`/product/${item.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1 text-xs text-[#0B3561] hover:text-[#12A5B0]"
                        >
                          • {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <Link
                  to="/subjects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-xs font-bold text-[#12A5B0] hover:underline"
                >
                  View All 13 Subjects →
                </Link>
              </div>

              <Link
                to="/bundles"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl hover:bg-[#FAF7F0]"
              >
                Placement &amp; Semester Bundles
              </Link>

              <Link
                to="/offers"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl hover:bg-[#FAF7F0] text-[#12A5B0] font-bold"
              >
                Special Offers 🏷️
              </Link>

              <Link
                to="/subscription"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl hover:bg-[#FAF7F0]"
              >
                Current Affairs Subscription
              </Link>

              <Link
                to="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl hover:bg-[#FAF7F0]"
              >
                Track Order
              </Link>

              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl hover:bg-[#FAF7F0]"
              >
                My Account
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm hover:brightness-105"
              >
                <WhatsappIcon className="w-4 h-4" />
                <span>WhatsApp Support</span>
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
