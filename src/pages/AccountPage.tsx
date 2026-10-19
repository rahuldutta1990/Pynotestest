import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { signOutUser, auth } from '../lib/firebase';
import { fetchMyOrders, submitReview, submitIssueReport, fetchMySubscriptions, cancelSubscription, fetchMyProfile, updateMyProfile } from '../lib/api';
import { Order } from '../types';

type TabType = 'dashboard' | 'account' | 'profile' | 'address' | 'orders' | 'subscriptions' | 'review' | 'issue';

export const AccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Account Edit State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Address State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: '', phone: '', line1: '', city: '', state: '', pincode: '' });

  // Review State
  const [reviewProductSlug, setReviewProductSlug] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);

  // Issue State
  const [issueOrderNo, setIssueOrderNo] = useState('');
  const [issueType, setIssueType] = useState('damaged');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueMsg, setIssueMsg] = useState<string | null>(null);

  const [cancellingSub, setCancellingSub] = useState<string | null>(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      Promise.all([fetchMyOrders(), fetchMySubscriptions(), fetchMyProfile()])
        .then(([ordersRes, subsRes, profileRes]) => {
          setOrders(ordersRes);
          setSubscriptions(subsRes);
          setProfile(profileRes);
          setEditName(profileRes.name || '');
          setEditPhone(profileRes.phone || '');
          setAddresses(profileRes.addresses || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      const updated = await updateMyProfile({
        name: editName,
        phone: editPhone
      });
      setProfile(updated);
      setProfileMsg('Account details updated!');
    } catch (err: any) {
      setProfileMsg(err.message || 'Update failed');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const addressWithId = { ...newAddr, id: Math.random().toString(36).substr(2, 9), is_default: addresses.length === 0 };
    const updatedAddresses = [...addresses, addressWithId];
    try {
      const updated = await updateMyProfile({ addresses: updatedAddresses });
      setProfile(updated);
      setAddresses(updatedAddresses);
      setShowAddAddress(false);
      setNewAddr({ name: '', phone: '', line1: '', city: '', state: '', pincode: '' });
    } catch (err: any) {
      alert(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    const updatedAddresses = addresses.filter(a => a.id !== id);
    try {
      const updated = await updateMyProfile({ addresses: updatedAddresses });
      setProfile(updated);
      setAddresses(updatedAddresses);
    } catch (err: any) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    const updatedAddresses = addresses.map(a => ({ ...a, is_default: a.id === id }));
    try {
      const updated = await updateMyProfile({ addresses: updatedAddresses });
      setProfile(updated);
      setAddresses(updatedAddresses);
    } catch (err: any) {
      alert(err.message || 'Failed to set default address');
    }
  };

  const handleCancelSub = async (subId: string) => {
    if (!confirm('Are you sure you want to cancel? If you are in trial, you will not be charged.')) return;
    setCancellingSub(subId);
    try {
      await cancelSubscription(subId);
      const subs = await fetchMySubscriptions();
      setSubscriptions(subs);
      alert('Subscription cancelled successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to cancel subscription');
    } finally {
      setCancellingSub(null);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMsg(null);
    try {
      await submitReview({
        product_id: reviewProductSlug,
        display_name: user?.displayName || profile?.name || 'Student',
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
          <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Account Required</h2>
          <p className="font-body text-xs text-[#3C5D81]">Please sign in to access your dashboard and saved addresses.</p>
          <button onClick={() => navigate('/auth')} className="w-full bg-[#0B3561] text-[#FFD54A] font-heading font-bold py-3.5 rounded-xl hover:bg-[#071E38] transition shadow-md">Sign In</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#12A5B0] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header with Logout */}
      <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-[#0B3561]">
            {activeTab === 'dashboard' ? 'My Dashboard' : 'Account Management'}
          </h1>
          <p className="text-xs text-[#3C5D81] font-medium">{profile?.name || user.email} • {user.email}</p>
        </div>
        <button
          onClick={async () => {
            await signOutUser();
            window.location.href = '/';
          }}
          className="text-xs font-heading font-bold text-red-600 bg-red-50 border border-red-100 px-5 py-2.5 rounded-xl hover:bg-red-100 transition"
        >
          Logout (Sign Out)
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#0B3561]/10 gap-3 text-xs font-heading font-bold overflow-x-auto pb-1">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'account', label: 'My Account' },
          { id: 'profile', label: 'My Profile' },
          { id: 'address', label: 'My Address' },
          { id: 'orders', label: 'My Orders' },
          { id: 'subscriptions', label: 'My Subscription' },
          { id: 'review', label: 'Reviews' },
          { id: 'issue', label: 'Support' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`pb-3 border-b-2 whitespace-nowrap transition-all px-2 ${
              activeTab === tab.id ? 'border-[#0B3561] text-[#0B3561]' : 'border-transparent text-[#9DAEC0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD SUMMARY */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#DDF3F4]/30 p-5 rounded-2xl border border-[#12A5B0]/20">
              <span className="text-[10px] font-black text-[#12A5B0] uppercase block mb-1">Status</span>
              <p className="text-sm font-bold text-[#0B3561]">
                {subscriptions.some(s => s.status === 'active' || s.status === 'trialling') ? '🚀 Pro Member' : '🎓 Student'}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#0B3561]/10">
              <span className="text-[10px] font-bold text-[#3C5D81] uppercase block mb-1">Orders</span>
              <p className="text-sm font-bold text-[#0B3561]">{orders.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#0B3561]/10">
              <span className="text-[10px] font-bold text-[#3C5D81] uppercase block mb-1">Addresses</span>
              <p className="text-sm font-bold text-[#0B3561]">{addresses.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#0B3561]/10">
              <span className="text-[10px] font-bold text-[#3C5D81] uppercase block mb-1">Reviews</span>
              <p className="text-sm font-bold text-[#0B3561]">Verified</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Sub Box */}
             <div className="bg-[#0B3561] text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
               <div className="relative z-10 space-y-4">
                 <h3 className="font-heading font-bold text-lg">Subscription Overview</h3>
                 {subscriptions.some(s => s.status === 'active' || s.status === 'trialling') ? (
                   <div className="space-y-3">
                     <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                       <p className="text-[10px] uppercase font-bold text-white/60">Active Plan Access</p>
                       <p className="text-sm font-bold text-[#FFD54A]">Valid until {new Date(subscriptions.find(s => s.status === 'active' || s.status === 'trialling')?.current_end).toLocaleDateString()}</p>
                     </div>
                     <button onClick={() => setActiveTab('subscriptions')} className="text-xs font-bold text-[#12A5B0] bg-white px-4 py-2 rounded-xl hover:bg-[#DDF3F4] transition">View Billing Details</button>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     <p className="text-xs text-white/70">Upgrade to Pro for full access to handwritten exam notes and daily quizzes.</p>
                     <a href="/subscription" className="inline-block bg-[#FFD54A] text-[#0B3561] text-xs font-black px-6 py-2.5 rounded-xl">Unlock Pro Access ⚡</a>
                   </div>
                 )}
               </div>
             </div>

             {/* Recent Order */}
             <div className="bg-white p-6 rounded-[2rem] border border-[#0B3561]/10 shadow-sm space-y-4">
               <div className="flex justify-between items-center">
                 <h3 className="font-heading font-bold text-lg text-[#0B3561]">Last Order</h3>
                 <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold text-[#12A5B0] hover:underline uppercase">History</button>
               </div>
               {orders.length > 0 ? (
                 <div className="p-4 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/5 flex justify-between items-center">
                   <div>
                     <p className="text-sm font-bold text-[#0B3561]">Order #{orders[0].order_no}</p>
                     <p className="text-[10px] text-[#3C5D81]">{new Date(orders[0].placed_at).toLocaleDateString()}</p>
                   </div>
                   <span className="text-[10px] font-black text-[#13834D] bg-[#DDF3F4] px-3 py-1 rounded-full uppercase">{orders[0].status}</span>
                 </div>
               ) : (
                 <p className="text-sm text-[#9DAEC0] italic py-4 text-center">No orders yet.</p>
               )}
             </div>
          </div>
        </div>
      )}

      {/* MY ACCOUNT (Edit) */}
      {activeTab === 'account' && (
        <form onSubmit={handleUpdateAccount} className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-[#0B3561]/10 shadow-sm space-y-6 animate-fadeIn max-w-2xl">
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-xl text-[#0B3561]">Edit Account Details</h3>
            <p className="text-xs text-[#3C5D81]">Update your display name and registered phone number.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0B3561] ml-1">Full Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#12A5B0]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#0B3561] ml-1">Phone Number</label>
              <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full px-5 py-3.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#12A5B0]" />
            </div>
          </div>
          {profileMsg && <p className="text-xs font-bold text-[#13834D]">{profileMsg}</p>}
          <button type="submit" className="w-full bg-[#0B3561] text-white font-heading font-bold py-4 rounded-2xl hover:bg-[#071E38] transition">Save Changes</button>
        </form>
      )}

      {/* MY PROFILE (View Only) */}
      {activeTab === 'profile' && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#0B3561]/10 space-y-8 animate-fadeIn max-w-2xl">
           <h3 className="font-heading font-bold text-xl text-[#0B3561]">My Student Profile</h3>
           <div className="space-y-4 divide-y divide-[#0B3561]/5">
             <div className="pt-0 pb-4 flex justify-between">
               <span className="text-xs text-[#3C5D81]">Full Name</span>
               <span className="text-xs font-bold text-[#0B3561]">{profile?.name || 'N/A'}</span>
             </div>
             <div className="py-4 flex justify-between">
               <span className="text-xs text-[#3C5D81]">Email Address</span>
               <span className="text-xs font-bold text-[#0B3561]">{user.email}</span>
             </div>
             <div className="py-4 flex justify-between">
               <span className="text-xs text-[#3C5D81]">Mobile Number</span>
               <span className="text-xs font-bold text-[#0B3561]">{profile?.phone || 'N/A'}</span>
             </div>
             <div className="py-4 flex justify-between">
               <span className="text-xs text-[#3C5D81]">Member Since</span>
               <span className="text-xs font-bold text-[#0B3561]">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</span>
             </div>
             <div className="py-4 flex justify-between border-b border-[#0B3561]/5">
               <span className="text-xs text-[#3C5D81]">Account Role</span>
               <span className="text-xs font-black text-[#12A5B0] uppercase">{profile?.role || 'Student'}</span>
             </div>
           </div>
           <button onClick={() => setActiveTab('account')} className="text-xs font-bold text-[#12A5B0] hover:underline">Edit Profile Info →</button>
        </div>
      )}

      {/* MY ADDRESS (Multiple Addresses) */}
      {activeTab === 'address' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-xl text-[#0B3561]">Delivery Addresses</h3>
            <button onClick={() => setShowAddAddress(!showAddAddress)} className="bg-[#12A5B0] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm hover:brightness-105 transition">
              {showAddAddress ? 'Cancel' : '+ Add New Address'}
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="bg-[#F7FAFC] p-6 rounded-3xl border border-[#0B3561]/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><h4 className="text-xs font-bold text-[#0B3561] uppercase tracking-wider mb-2">Recipient Details</h4></div>
              <input type="text" placeholder="Full Name *" required value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} className="px-4 py-3 bg-white border border-[#0B3561]/15 rounded-xl text-xs" />
              <input type="tel" placeholder="Phone Number *" required value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} className="px-4 py-3 bg-white border border-[#0B3561]/15 rounded-xl text-xs" />
              
              <div className="sm:col-span-2"><h4 className="text-xs font-bold text-[#0B3561] uppercase tracking-wider mt-2 mb-2">Location</h4></div>
              <textarea placeholder="Flat, House No, Building, Street *" required rows={2} value={newAddr.line1} onChange={e => setNewAddr({...newAddr, line1: e.target.value})} className="px-4 py-3 bg-white border border-[#0B3561]/15 rounded-xl text-xs sm:col-span-2" />
              <input type="text" placeholder="City *" required value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="px-4 py-3 bg-white border border-[#0B3561]/15 rounded-xl text-xs" />
              <input type="text" placeholder="State *" required value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} className="px-4 py-3 bg-white border border-[#0B3561]/15 rounded-xl text-xs" />
              <input type="text" placeholder="PIN Code *" required value={newAddr.pincode} onChange={e => setNewAddr({...newAddr, pincode: e.target.value})} className="px-4 py-3 bg-white border border-[#0B3561]/15 rounded-xl text-xs" />
              <button type="submit" className="sm:col-span-2 bg-[#0B3561] text-[#FFD54A] font-bold py-3.5 rounded-xl mt-2">Save This Address</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.length === 0 ? (
              <div className="md:col-span-2 py-12 bg-white border-2 border-dashed border-[#0B3561]/10 rounded-3xl text-center">
                <p className="text-sm text-[#3C5D81]">You haven't saved any addresses yet.</p>
              </div>
            ) : (
              addresses.map(addr => (
                <div key={addr.id} className={`p-6 bg-white rounded-3xl border ${addr.is_default ? 'border-[#12A5B0] shadow-md ring-1 ring-[#12A5B0]/20' : 'border-[#0B3561]/10 shadow-sm'} space-y-4`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[#0B3561] flex items-center gap-2">
                        {addr.name}
                        {addr.is_default && <span className="bg-[#12A5B0]/10 text-[#12A5B0] text-[9px] px-2 py-0.5 rounded-full uppercase">Default</span>}
                      </p>
                      <p className="text-[10px] text-[#3C5D81] font-medium">{addr.phone}</p>
                    </div>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:text-red-700 transition"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                  <p className="text-xs text-[#3C5D81] leading-relaxed">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  {!addr.is_default && (
                    <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-[10px] font-bold text-[#12A5B0] hover:underline uppercase">Set as Default</button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fadeIn">
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center text-xs text-[#3C5D81]">No past orders found.</div>
          ) : (
            orders.map(ord => (
              <div key={ord.order_no} className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-[#0B3561]/5 pb-3">
                  <div>
                    <span className="font-bold text-[#0B3561] block">Order #{ord.order_no}</span>
                    <span className="text-[10px] text-[#9DAEC0]">{new Date(ord.placed_at).toLocaleDateString()}</span>
                  </div>
                  <span className="font-bold text-[#13834D] uppercase bg-[#DDF3F4] px-3 py-1 rounded-full text-[10px]">{ord.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="space-y-1 text-xs text-[#3C5D81]">
                  {ord.items.map((item, i) => (
                    <div key={i} className="flex justify-between"><span>{item.title} x {item.qty}</span><span className="font-bold text-[#0B3561]">₹{(item.line_total_paise / 100).toFixed(2)}</span></div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#0B3561]/5 text-xs">
                  <span className="font-bold text-[#0B3561]">Total: ₹{(ord.total_paise / 100).toFixed(2)}</span>
                  <a href={`/track?order_no=${ord.order_no}&phone=${ord.ship_phone}`} className="text-[#12A5B0] font-bold hover:underline">Track Parcel ↗</a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MY SUBSCRIPTION (Details) */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4 animate-fadeIn">
          {subscriptions.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center space-y-4 border border-[#0B3561]/10">
              <p className="text-sm text-[#3C5D81]">You don't have any active subscriptions yet.</p>
              <a href="/subscription" className="inline-block bg-[#0B3561] text-[#FFD54A] px-8 py-3 rounded-xl font-bold text-xs">Explore Pro Plans</a>
            </div>
          ) : (
            subscriptions.map(sub => (
              <div key={sub.razorpay_subscription_id} className="bg-white p-8 rounded-[2.5rem] border border-[#0B3561]/10 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-xl text-[#0B3561]">PyNotes Pro Access</h4>
                    <p className="text-[10px] text-[#9DAEC0] font-mono">ID: {sub.razorpay_subscription_id}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    sub.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                    sub.status === 'trialling' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                    'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#F7FAFC] p-6 rounded-3xl">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-[#3C5D81] uppercase tracking-widest">Next Billing</p>
                     <p className="text-sm font-black text-[#0B3561]">{sub.current_end ? new Date(sub.current_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p>
                   </div>
                   <div className="space-y-1 text-center">
                     <p className="text-[10px] font-bold text-[#3C5D81] uppercase tracking-widest">Billing Cycle</p>
                     <p className="text-sm font-black text-[#0B3561]">Monthly Recurring</p>
                   </div>
                   <div className="space-y-1 text-right">
                     <p className="text-[10px] font-bold text-[#3C5D81] uppercase tracking-widest">Current Period</p>
                     <p className="text-xs font-bold text-[#0B3561]">{sub.current_start ? new Date(sub.current_start).toLocaleDateString() : 'N/A'} - {sub.current_end ? new Date(sub.current_end).toLocaleDateString() : 'N/A'}</p>
                   </div>
                </div>

                <div className="pt-6 border-t border-[#0B3561]/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-[10px] text-[#3C5D81] font-medium max-w-md">Payment automatically debited from your saved card/UPI on the billing date. You can cancel at any time to stop further charges.</p>
                  {sub.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelSub(sub.razorpay_subscription_id)}
                      disabled={cancellingSub === sub.razorpay_subscription_id}
                      className="text-red-600 font-black text-[10px] uppercase hover:underline disabled:opacity-50 flex-shrink-0"
                    >
                      {cancellingSub === sub.razorpay_subscription_id ? 'Wait...' : 'Cancel Subscription'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* REVIEWS & SUPPORT (Placeholder/Existing logic) */}
      {activeTab === 'review' && (
        <form onSubmit={handleReviewSubmit} className="bg-white p-8 rounded-3xl border border-[#0B3561]/10 space-y-4 animate-fadeIn max-w-2xl">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">Submit Book Review</h3>
          <input type="text" required placeholder="Subject / Book Slug" value={reviewProductSlug} onChange={e => setReviewProductSlug(e.target.value)} className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs" />
          <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs">
            {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} Stars</option>)}
          </select>
          <input type="text" required placeholder="Headline" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs" />
          <textarea required rows={4} placeholder="Your thoughts..." value={reviewBody} onChange={e => setReviewBody(e.target.value)} className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs" />
          {reviewMsg && <p className="text-xs font-bold text-[#13834D]">{reviewMsg}</p>}
          <button type="submit" className="w-full bg-[#0B3561] text-white py-3.5 rounded-xl font-bold text-xs">Post Review</button>
        </form>
      )}

      {activeTab === 'issue' && (
        <form onSubmit={handleIssueSubmit} className="bg-white p-8 rounded-3xl border border-[#0B3561]/10 space-y-4 animate-fadeIn max-w-2xl">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">Report Parcel Issue</h3>
          <input type="text" required placeholder="Order No (PN-xxxx)" value={issueOrderNo} onChange={e => setIssueOrderNo(e.target.value)} className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs" />
          <textarea required rows={4} placeholder="Describe the damage or mismatch..." value={issueDesc} onChange={e => setIssueDesc(e.target.value)} className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs" />
          {issueMsg && <p className="text-xs font-bold text-[#13834D]">{issueMsg}</p>}
          <button type="submit" className="w-full bg-[#0B3561] text-white py-3.5 rounded-xl font-bold text-xs">Submit Claim</button>
        </form>
      )}
    </div>
  );
};
