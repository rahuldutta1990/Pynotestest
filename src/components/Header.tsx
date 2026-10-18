import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { SearchIcon, CartIcon, UserIcon, WhatsappIcon } from './Icons';
import { Subject, Product } from '../types';

interface HeaderProps {
  subjects: Subject[];
  products: Product[];
  cartCount: number;
  onOpenCart: () => void;
  userEmail?: string | null;
  customLogoUrl?: string;
  whatsappNumber?: string;
}

export const Header: React.FC<HeaderProps> = ({
  subjects,
  products,
  cartCount,
  onOpenCart,
  userEmail,
  customLogoUrl,
  whatsappNumber = '+919876543210',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

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
      category: 'Programming Languages',
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
      category: 'Databases & CS Core',
      items: [
        { slug: 'sql', label: 'SQL & Database' },
        { slug: 'dbms', label: 'DBMS' },
        { slug: 'operating-system', label: 'Operating System' },
        { slug: 'data-science', label: 'Data Science' },
      ],
    },
    {
      category: 'Web Development',
      items: [
        { slug: 'html', label: 'HTML5' },
        { slug: 'css', label: 'CSS3' },
        { slug: 'javascript', label: 'JavaScript' },
      ],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#0B3561]/10 shadow-xs h-[72px] flex items-center px-4 sm:px-8 transition-all">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#0B3561] hover:bg-[#DDF3F4] rounded-lg transition"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo Left */}
          <Link to="/" className="flex-shrink-0">
            <Logo variant="horizontal" surface="light" customUrl={customLogoUrl} size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 font-heading text-[14px] font-semibold text-[#0B3561]">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                isCurrent('/') ? 'bg-[#0B3561] text-white shadow-xs' : 'hover:bg-[#DDF3F4] hover:text-[#0B3561]'
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                  location.pathname.startsWith('/product') || location.pathname.startsWith('/subjects')
                    ? 'bg-[#0B3561] text-white'
                    : 'hover:bg-[#DDF3F4]'
                }`}
              >
                <span>Subject</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${subjectDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Categorized Dropdown Panel */}
              {subjectDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[560px] bg-white rounded-2xl shadow-2xl border border-[#0B3561]/15 p-5 z-50 animate-fadeIn grid grid-cols-2 gap-6">
                  {subjectCategories.map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="font-heading font-bold text-xs uppercase tracking-wider text-[#12A5B0] pb-1 border-b border-[#0B3561]/10">
                        {cat.category}
                      </div>
                      <ul className="space-y-1 text-xs">
                        {cat.items.map(item => (
                          <li key={item.slug}>
                            <Link
                              to={`/product/${item.slug}`}
                              className="block py-1.5 px-2 rounded-lg text-[#0B3561] font-medium hover:bg-[#DDF3F4] hover:text-[#0B3561] transition"
                              onClick={() => setSubjectDropdownOpen(false)}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="col-span-2 pt-2 border-t border-[#0B3561]/10 flex justify-between items-center text-xs">
                    <span className="text-[#3C5D81] font-medium">All 13 handwritten subject books printed in full color.</span>
                    <Link
                      to="/subjects"
                      className="font-bold text-[#0B3561] hover:text-[#12A5B0] hover:underline"
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
              className={`px-3 py-1.5 rounded-full transition-colors ${
                isCurrent('/bundles') ? 'bg-[#0B3561] text-white' : 'hover:bg-[#DDF3F4]'
              }`}
            >
              Bundles
            </Link>

            <Link
              to="/track"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                isCurrent('/track') ? 'bg-[#0B3561] text-white' : 'hover:bg-[#DDF3F4]'
              }`}
            >
              Track Order
            </Link>
          </nav>

          {/* INLINE HEADER SEARCH BAR (Desktop & Tablet) */}
          <div ref={searchContainerRef} className="relative hidden md:block flex-1 max-w-xs xl:max-w-md mx-2">
            <div className="relative flex items-center">
              <SearchIcon className="w-4 h-4 text-[#0B3561]/60 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search 13 books, Python, SQL, DSA..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-9 pr-8 py-2 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-full text-xs font-medium text-[#0B3561] placeholder:text-[#3C5D81]/70 focus:outline-none focus:border-[#12A5B0] focus:ring-2 focus:ring-[#12A5B0]/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchFocused(false);
                  }}
                  className="absolute right-3 text-[#3C5D81] hover:text-[#0B3561] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Live Autocomplete Dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#0B3561]/15 overflow-hidden z-50 animate-fadeIn">
                <div className="max-h-80 overflow-y-auto divide-y divide-[#0B3561]/10">
                  
                  {/* Matching Subjects Section */}
                  {matchingSubjects.length > 0 && (
                    <div className="p-3 bg-[#DDF3F4]/30">
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
                              navigate(`/product/${sub.slug}`);
                            }}
                            className="p-2 rounded-xl hover:bg-[#DDF3F4] cursor-pointer flex items-center justify-between transition text-xs font-semibold text-[#0B3561]"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.accent_color || '#12A5B0' }} />
                              <span>{sub.name}</span>
                            </div>
                            <span className="text-[10px] text-[#12A5B0] font-bold">Explore Book →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Printed Books Section */}
                  {matchingProducts.length > 0 && (
                    <div className="p-3">
                      <span className="text-[10px] font-bold text-[#0B3561] uppercase tracking-wider block mb-2 px-1">
                        Printed Books & Bundles ({matchingProducts.length})
                      </span>
                      <div className="space-y-1">
                        {matchingProducts.map(prod => (
                          <div
                            key={prod.slug}
                            onClick={() => {
                              setSearchQuery('');
                              setSearchFocused(false);
                              navigate(`/product/${prod.slug}`);
                            }}
                            className="p-2.5 rounded-xl hover:bg-[#DDF3F4] cursor-pointer flex items-center justify-between transition"
                          >
                            <div className="space-y-0.5">
                              <h4 className="font-heading font-bold text-xs text-[#0B3561] line-clamp-1">{prod.title}</h4>
                              <p className="text-[10px] text-[#3C5D81] line-clamp-1">{prod.short_desc}</p>
                            </div>
                            <span className="font-display font-black italic text-xs text-[#0B3561] ml-2 flex-shrink-0">
                              ₹{(prod.price_paise / 100).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingSubjects.length === 0 && matchingProducts.length === 0 && (
                    <div className="p-6 text-center text-xs text-[#3C5D81]">
                      No subjects or books found for "<span className="font-bold text-[#0B3561]">{searchQuery}</span>"
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => setMobileSearchExpanded(!mobileSearchExpanded)}
              className="md:hidden p-2 text-[#0B3561] hover:bg-[#DDF3F4] rounded-full transition"
              title="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            {/* Account Icon */}
            <Link
              to={userEmail ? '/account' : '/account?login=true'}
              className="p-2 text-[#0B3561] hover:bg-[#DDF3F4] rounded-full transition"
              title={userEmail ? 'Account' : 'Sign In'}
            >
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            {/* Cart Icon with count badge */}
            <button
              onClick={onOpenCart}
              className="p-2 text-[#0B3561] hover:bg-[#DDF3F4] rounded-full transition relative"
              title="Cart"
            >
              <CartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#12A5B0] text-[#071E38] font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Expandable Search Input for Mobile View */}
      {mobileSearchExpanded && (
        <div className="md:hidden bg-white border-b border-[#0B3561]/10 p-3 animate-fadeIn">
          <div className="relative flex items-center">
            <SearchIcon className="w-4 h-4 text-[#0B3561]/60 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search Python, SQL, DSA..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-full text-xs font-medium text-[#0B3561] focus:outline-none focus:border-[#12A5B0]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#3C5D81] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mobile Search Results */}
          {searchQuery.trim().length > 0 && (
            <div className="mt-2 bg-white rounded-xl border border-[#0B3561]/15 max-h-60 overflow-y-auto divide-y divide-[#0B3561]/10 text-xs">
              {matchingProducts.map(prod => (
                <div
                  key={prod.slug}
                  onClick={() => {
                    setSearchQuery('');
                    setMobileSearchExpanded(false);
                    navigate(`/product/${prod.slug}`);
                  }}
                  className="p-2.5 hover:bg-[#DDF3F4] flex items-center justify-between"
                >
                  <span className="font-semibold text-[#0B3561]">{prod.title}</span>
                  <span className="font-bold text-[#12A5B0]">₹{(prod.price_paise / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Left Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#071E38]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-[86%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#0B3561]/10">
              <Logo variant="horizontal" surface="light" customUrl={customLogoUrl} size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#0B3561] hover:bg-[#DDF3F4] rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-2 font-heading font-semibold text-sm text-[#0B3561]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl transition ${isCurrent('/') ? 'bg-[#0B3561] text-white' : 'hover:bg-[#DDF3F4]'}`}
              >
                Home
              </Link>

              {/* Categorized Subjects Accordion for Mobile */}
              <div className="py-2 border-y border-[#0B3561]/10 my-2 space-y-4">
                <span className="text-[11px] font-bold text-[#3C5D81] uppercase tracking-wider px-4 block">
                  Subject Categories
                </span>

                {subjectCategories.map((cat, idx) => (
                  <div key={idx} className="px-4 space-y-1">
                    <span className="text-xs font-bold text-[#12A5B0] uppercase block">
                      {cat.category}
                    </span>
                    <div className="pl-2 space-y-1 pt-1">
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
                  className="block px-4 py-2 text-xs font-bold text-[#0B3561] hover:underline"
                >
                  View All 13 Subjects →
                </Link>
              </div>

              <Link
                to="/bundles"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-[#DDF3F4]"
              >
                Book Bundles
              </Link>

              <Link
                to="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-[#DDF3F4]"
              >
                Track Order
              </Link>

              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-[#DDF3F4]"
              >
                {userEmail ? 'My Account' : 'Sign In'}
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold shadow-md hover:brightness-105"
              >
                <WhatsappIcon className="w-5 h-5" />
                <span>WhatsApp Support</span>
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
