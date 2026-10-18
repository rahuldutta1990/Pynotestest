import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInWithGoogle, signOutUser, auth } from '../lib/firebase';
import { fetchMyOrders, submitReview, submitIssueReport } from '../lib/api';
import { Order } from '../types';

export const AccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'review' | 'issue'>('orders');

  const [reviewProductSlug, setReviewProductSlug] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);

  const [issueOrderNo, setIssueOrderNo] = useState('');
  const [issueType, setIssueType] = useState('damaged');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueMsg, setIssueMsg] = useState<string | null>(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchMyOrders()
        .then(res => {
          setOrders(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMsg(null);
    try {
      await submitReview({
        product_id: reviewProductSlug,
        display_name: user?.displayName || 'Student',
        rating: reviewRating,
        title: reviewTitle,
        body: reviewBody,
      });
      setReviewMsg('Thank you! Your review has been submitted for moderation.');
      setReviewTitle('');
      setReviewBody('');
    } catch (err: any) {
      setReviewMsg(err.message || 'Failed to submit review');
    }
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssueMsg(null);
    try {
      await submitIssueReport({
        order_no: issueOrderNo,
        type: issueType,
        description: issueDesc,
      });
      setIssueMsg('Issue report submitted. Our support team will review within 24 hours.');
      setIssueDesc('');
    } catch (err: any) {
      setIssueMsg(err.message || 'Failed to submit report');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-[#0B3561]/15 shadow-xl space-y-4">
          <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Customer Account Sign In</h2>
          <p className="font-body text-xs text-[#3C5D81]">
            Sign in with your Google Account to view your order history, write book reviews, and report issues.
          </p>

          <button
            onClick={async () => {
              await signInWithGoogle();
              window.location.reload();
            }}
            className="w-full bg-[#0B3561] text-white font-heading font-bold py-3.5 rounded-xl hover:bg-[#071E38] transition shadow-md flex items-center justify-center gap-2 text-xs"
          >
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* User Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#0B3561]">
            Welcome, {user.displayName || user.email}
          </h1>
          <p className="text-xs text-[#3C5D81]">{user.email}</p>
        </div>

        <button
          onClick={async () => {
            await signOutUser();
            window.location.reload();
          }}
          className="text-xs font-heading font-bold text-[#C0392B] border border-[#C0392B]/20 px-4 py-2 rounded-xl hover:bg-[#C0392B]/10 transition"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#0B3561]/10 gap-4 text-xs font-heading font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'orders' ? 'border-[#0B3561] text-[#0B3561]' : 'border-transparent text-[#9DAEC0]'
          }`}
        >
          My Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'review' ? 'border-[#0B3561] text-[#0B3561]' : 'border-transparent text-[#9DAEC0]'
          }`}
        >
          Write a Review
        </button>
        <button
          onClick={() => setActiveTab('issue')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'issue' ? 'border-[#0B3561] text-[#0B3561]' : 'border-transparent text-[#9DAEC0]'
          }`}
        >
          Report Damaged/Wrong Item
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center text-xs text-[#3C5D81]">
              No past orders found under this account.
            </div>
          ) : (
            orders.map(ord => (
              <div key={ord.order_no} className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-[#0B3561]/5 pb-3">
                  <div>
                    <span className="font-bold text-[#0B3561] block">Order #{ord.order_no}</span>
                    <span className="text-[10px] text-[#9DAEC0]">{new Date(ord.placed_at).toLocaleDateString()}</span>
                  </div>
                  <span className="font-bold text-[#13834D] uppercase bg-[#DDF3F4] px-3 py-1 rounded-full text-[10px]">
                    {ord.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#3C5D81]">
                  {ord.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.title} x {item.qty}</span>
                      <span className="font-bold text-[#0B3561]">₹{(item.line_total_paise / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#0B3561]/5 text-xs">
                  <span className="font-bold text-[#0B3561]">Total Amount: ₹{(ord.total_paise / 100).toFixed(2)}</span>
                  <a
                    href={`/track?order_no=${ord.order_no}&phone=${ord.ship_phone}`}
                    className="text-[#12A5B0] font-bold hover:underline"
                  >
                    Track Parcel ↗
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Write a Review */}
      {activeTab === 'review' && (
        <form onSubmit={handleReviewSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 space-y-4">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">Write a Verified Book Review</h3>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Select Book / Subject *</label>
            <input
              type="text"
              required
              value={reviewProductSlug}
              onChange={e => setReviewProductSlug(e.target.value)}
              placeholder="e.g. python, c-plus-plus, dsa-with-java"
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Rating (1 to 5 Stars) *</label>
            <select
              value={reviewRating}
              onChange={e => setReviewRating(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
            >
              <option value={5}>★★★★★ (5 Stars - Excellent)</option>
              <option value={4}>★★★★☆ (4 Stars - Good)</option>
              <option value={3}>★★★☆☆ (3 Stars - Average)</option>
              <option value={2}>★★☆☆☆ (2 Stars - Poor)</option>
              <option value={1}>★☆☆☆☆ (1 Star - Terrible)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Headline / Title *</label>
            <input
              type="text"
              required
              value={reviewTitle}
              onChange={e => setReviewTitle(e.target.value)}
              placeholder="e.g. Best Python handwritten notes for college exams!"
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Review Description *</label>
            <textarea
              required
              rows={4}
              value={reviewBody}
              onChange={e => setReviewBody(e.target.value)}
              placeholder="How did these notes help your studies?"
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
            />
          </div>

          {reviewMsg && <p className="text-xs font-bold text-[#13834D]">{reviewMsg}</p>}

          <button
            type="submit"
            className="w-full bg-[#0B3561] text-white font-heading font-bold py-3.5 rounded-xl hover:bg-[#071E38] text-xs"
          >
            Submit Book Review
          </button>
        </form>
      )}

      {/* Tab 3: Report Issue */}
      {activeTab === 'issue' && (
        <form onSubmit={handleIssueSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 space-y-4">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">Report Damaged or Incorrect Item</h3>
          <p className="text-xs text-[#3C5D81]">Must be reported within 48 hours of delivery for immediate replacement or refund.</p>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Order Number *</label>
            <input
              type="text"
              required
              value={issueOrderNo}
              onChange={e => setIssueOrderNo(e.target.value)}
              placeholder="PN-1001"
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs font-mono font-bold text-[#0B3561] uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Issue Type *</label>
            <select
              value={issueType}
              onChange={e => setIssueType(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
            >
              <option value="damaged">Damaged Book / Torn Pages</option>
              <option value="wrong_item">Wrong Item Received</option>
              <option value="other">Missing Pages / Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Describe Issue in Detail *</label>
            <textarea
              required
              rows={4}
              value={issueDesc}
              onChange={e => setIssueDesc(e.target.value)}
              placeholder="Explain the damage or mismatch..."
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
            />
          </div>

          {issueMsg && <p className="text-xs font-bold text-[#13834D]">{issueMsg}</p>}

          <button
            type="submit"
            className="w-full bg-[#0B3561] text-white font-heading font-bold py-3.5 rounded-xl hover:bg-[#071E38] text-xs"
          >
            Submit Issue Claim
          </button>
        </form>
      )}

    </div>
  );
};
