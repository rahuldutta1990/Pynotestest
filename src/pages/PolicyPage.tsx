import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPage } from '../lib/api';
import { PageContent } from '../types';

export const PolicyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPage(slug)
      .then(p => {
        setPage(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const policiesList = [
    { slug: 'privacy-policy', title: 'Privacy Policy' },
    { slug: 'terms-of-service', title: 'Terms of Service' },
    { slug: 'refund-policy', title: 'Return & Refund Policy' },
    { slug: 'shipping-policy', title: 'Shipping Policy' },
    { slug: 'contact-info', title: 'Contact Information' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Sidebar Menu */}
        <div className="md:col-span-1 space-y-2 font-heading text-xs font-semibold">
          <span className="text-[10px] uppercase font-bold text-[#9DAEC0] px-2 block mb-2">Legal Policies</span>
          {policiesList.map(pol => (
            <Link
              key={pol.slug}
              to={`/policies/${pol.slug}`}
              className={`block px-3 py-2 rounded-xl transition ${
                slug === pol.slug
                  ? 'bg-[#0B3561] text-white font-bold'
                  : 'text-[#0B3561] hover:bg-[#DDF3F4]'
              }`}
            >
              {pol.title}
            </Link>
          ))}
        </div>

        {/* Policy Body */}
        <div className="md:col-span-3 bg-white p-8 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#3C5D81]">Loading policy document...</div>
          ) : page ? (
            <>
              <h1 className="font-heading font-bold text-2xl text-[#0B3561]">{page.title}</h1>
              {page.is_draft && (
                <div className="bg-[#FFD54A] text-[#071E38] text-[10px] font-bold px-2 py-1 rounded inline-block">
                  Draft: replace with legally reviewed text
                </div>
              )}
              <div className="prose prose-sm text-[#3C5D81] font-body max-w-none whitespace-pre-wrap leading-relaxed">
                {page.body_md}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-[#3C5D81]">
              Policy content document not found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
