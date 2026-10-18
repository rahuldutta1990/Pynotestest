import React, { useState } from 'react';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering products & subjects for live search suggestions
  const searchResults = searchQuery.trim()
    ? products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const isCurrent = (path: string) => location.pathname === path;

  // Categorized subject definitions
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
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
          
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
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 font-heading text-[14px] font-semibold text-[#0B3561]">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-full transition-colors ${
                isCurrent('/') ? 'bg-[#0B3561] text-white shadow-xs' : 'hover:bg-[#DDF3F4] hover:text-[#0B3561]'
              }`}
            >
              Home
            </Link>

            {/* Subject Dropdown Menu with Category and Subcategories */}
            <div
              className="relative"
              onMouseEnter={() => setSubjectDropdownOpen(true)}
              onMouseLeave={() => setSubjectDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-colors ${
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
              className={`px-3.5 py-2 rounded-full transition-colors ${
                isCurrent('/bundles') ? 'bg-[#0B3561] text-white' : 'hover:bg-[#DDF3F4]'
              }`}
            >
              Bundles
            </Link>

            <Link
              to="/track"
              className={`px-3.5 py-2 rounded-full transition-colors ${
                isCurrent('/track') ? 'bg-[#0B3561] text-white' : 'hover:bg-[#DDF3F4]'
              }`}
            >
              Track Order
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[#0B3561] hover:bg-[#DDF3F4] rounded-full transition"
              title="Search"
            >
              <SearchIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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

      {/* Search Modal Panel */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#071E38]/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#0B3561]/10 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#0B3561]/10">
              <h3 className="font-heading font-bold text-lg text-[#0B3561]">Search Handwritten Notes</h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-[#0B3561] hover:bg-[#DDF3F4] rounded-full"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 relative">
              <input
                type="text"
                autoFocus
                placeholder="Type subject (e.g. Python, SQL, DSA)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl focus:border-[#12A5B0] text-[#0B3561] font-medium"
              />
            </div>

            {/* Suggestions list */}
            <div className="mt-4 max-h-72 overflow-y-auto divide-y divide-[#0B3561]/5">
              {searchQuery.trim() === '' ? (
                <div className="py-4 text-center text-sm text-[#3C5D81]">
                  Try searching for <span className="font-semibold text-[#0B3561]">Python</span>, <span className="font-semibold text-[#0B3561]">DSA</span>, or <span className="font-semibold text-[#0B3561]">SQL</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-6 text-center text-sm text-[#3C5D81]">
                  No printed notes matching "{searchQuery}"
                </div>
              ) : (
                searchResults.map(prod => (
                  <div
                    key={prod.slug}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      navigate(`/product/${prod.slug}`);
                    }}
                    className="p-3 hover:bg-[#DDF3F4] cursor-pointer rounded-lg flex items-center justify-between transition"
                  >
                    <div>
                      <h4 className="font-heading font-semibold text-[#0B3561] text-sm">{prod.title}</h4>
                      <p className="text-xs text-[#3C5D81]">{prod.short_desc}</p>
                    </div>
                    <span className="font-display font-bold text-[#0B3561] text-sm ml-2">
                      ₹{(prod.price_paise / 100).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Left Drawer Menu with Categorized Subjects */}
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
