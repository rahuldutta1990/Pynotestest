import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Product, QuoteResponse, PaymentMethod } from '../types';
import { quoteCart, createOrder, verifyPayment, fetchMyProfile, updateMyProfile } from '../lib/api';
import { auth } from '../lib/firebase';
import { trackBeginCheckout } from '../lib/analytics';

interface CheckoutPageProps {
  cart: { slug: string; qty: number }[];
  products: Product[];
  onClearCart: () => void;
  holdMinutes?: number;
  razorpayKeyId?: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  products,
  onClearCart,
  holdMinutes = 30,
  razorpayKeyId,
}) => {
  const navigate = useNavigate();

  // Selected Address State
  const [selectedAddrId, setSelectedAddrId] = useState<string>('');
  const [profile, setProfile] = useState<any>(null);
  
  // Manual/New Address Form State (Populated if selected or manual)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('prepaid');
  const [couponCode, setCouponCode] = useState('');
  const [showNamePublicly, setShowNamePublicly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load Profile & Addresses
  useEffect(() => {
    fetchMyProfile()
      .then(p => {
        setProfile(p);
        setEmail(p.email || auth.currentUser?.email || '');
        if (p.addresses && p.addresses.length > 0) {
          const def = p.addresses.find((a: any) => a.is_default) || p.addresses[0];
          handleSelectAddress(def);
        } else {
          setName(p.name || auth.currentUser?.displayName || '');
          setPhone(p.phone || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectAddress = (addr: any) => {
    setSelectedAddrId(addr.id);
    setName(addr.name);
    setPhone(addr.phone);
    setLine1(addr.line1);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
  };

  // Re-quote whenever cart or payment method changes
  useEffect(() => {
    if (cart.length === 0) return;
    quoteCart({
      items: cart,
      coupon_code: couponCode || undefined,
      payment_method: paymentMethod,
    })
      .then(q => {
        setQuote(q);
        const gaItems = q.lines.map(line => ({
          item_id: line.slug,
          item_name: line.title,
          price: Number((line.unit_price_paise / 100).toFixed(2)),
          quantity: line.qty,
        }));
        trackBeginCheckout(gaItems, q.total_paise / 100, couponCode);
      })
      .catch(err => setErrorMsg(err.message));
  }, [cart, paymentMethod, couponCode]);


  const handlePincodeChange = async (val: string) => {
    setPincode(val);
    if (val.length === 6 && /^\d+$/.test(val)) {
      setPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.[0]) {
          const po = data[0].PostOffice[0];
          setCity(po.District || po.Name);
          setState(po.State);
        }
      } catch (e) {
        console.warn('Pincode lookup failed:', e);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    setSubmitting(true);

    try {
      // Create Order
      const orderRes = await createOrder({
        contact: { email, phone, name },
        shipping_address: { name, phone, line1, line2, pincode, city, state },
        items: cart,
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined,
        show_name_publicly: showNamePublicly,
      });

      if (paymentMethod === 'cod') {
        onClearCart();
        navigate(`/order/${orderRes.order_no}/thank-you?t=${orderRes.token}`);
        return;
      }

      // Razorpay Flow
      const options = {
        key: orderRes.razorpay_key_id || razorpayKeyId,
        amount: orderRes.total_paise,
        currency: 'INR',
        name: 'PyNotes India',
        description: `Order #${orderRes.order_no}`,
        order_id: orderRes.razorpay_order_id,
        prefill: { name, email, contact: phone },
        theme: { color: '#0B3561' },
        handler: async (response: any) => {
          try {
            await verifyPayment({
              order_no: orderRes.order_no,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            onClearCart();
            navigate(`/order/${orderRes.order_no}/thank-you?t=${orderRes.token}`);
          } catch (err: any) {
            setErrorMsg(err.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setErrorMsg('Payment cancelled. You can retry or choose COD.');
          },
        },
      };

      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center"><div className="w-10 h-10 border-4 border-[#12A5B0] border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Your Cart is Empty</h2>
        <Link to="/subjects" className="inline-block bg-[#0B3561] text-white px-8 py-3 rounded-xl font-bold text-xs">Browse Books</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div className="border-b border-[#0B3561]/10 pb-6">
        <h1 className="font-heading font-bold text-2xl text-[#0B3561]">Final Checkout</h1>
        <p className="text-xs text-[#3C5D81]">Review your order and select delivery address.</p>
      </div>

      {/* Order Summary */}
      {quote && (
        <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#0B3561] uppercase tracking-wider">Order Summary</h3>
          <div className="space-y-2">
            {quote.lines.map(line => (
              <div key={line.slug} className="flex justify-between text-xs">
                <span className="text-[#3C5D81]">{line.title} x {line.qty}</span>
                <span className="font-bold text-[#0B3561]">₹{(line.line_total_paise / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-[#0B3561]/5 flex justify-between items-center">
            <span className="text-sm font-bold text-[#0B3561]">Total Amount</span>
            <span className="text-xl font-black text-[#12A5B0]">₹{(quote.total_paise / 100).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Address Selection */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-[#0B3561]">Select Delivery Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile?.addresses?.map((addr: any) => (
            <div 
              key={addr.id}
              onClick={() => handleSelectAddress(addr)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddrId === addr.id ? 'border-[#12A5B0] bg-[#DDF3F4]/20 shadow-md' : 'border-[#0B3561]/10 bg-white hover:border-[#0B3561]/30'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-[#0B3561] text-sm">{addr.name}</p>
                {selectedAddrId === addr.id && <span className="text-[#12A5B0] text-[10px] font-black uppercase">Selected</span>}
              </div>
              <p className="text-[11px] text-[#3C5D81] leading-relaxed mb-3">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
              <button 
                type="button"
                className={`w-full py-2 rounded-xl text-[10px] font-black uppercase transition ${selectedAddrId === addr.id ? 'bg-[#12A5B0] text-white' : 'bg-[#F7FAFC] text-[#0B3561] hover:bg-[#DDF3F4]'}`}
              >
                {selectedAddrId === addr.id ? 'Using This Address' : 'Use This Delivery Address'}
              </button>
            </div>
          ))}
          <Link to="/account?tab=address" className="p-5 rounded-2xl border-2 border-dashed border-[#0B3561]/20 flex flex-col items-center justify-center text-center gap-2 hover:bg-[#F7FAFC] transition">
             <span className="text-xl">➕</span>
             <span className="text-[10px] font-bold text-[#3C5D81] uppercase">Add New Address</span>
          </Link>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-8">
        {/* Delivery Details Confirmation */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#0B3561]/10 shadow-lg space-y-6">
           <h3 className="font-heading font-bold text-base text-[#0B3561]">Verify Delivery Details</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#3C5D81] uppercase ml-1">Recipient Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#3C5D81] uppercase ml-1">Contact Number</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs font-medium" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-[#3C5D81] uppercase ml-1">Shipping Address</label>
                <textarea required rows={2} value={line1} onChange={e => setLine1(e.target.value)} placeholder="Street, House No, Area" className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#3C5D81] uppercase ml-1">Pincode</label>
                <input type="text" required value={pincode} onChange={e => handlePincodeChange(e.target.value)} placeholder="6 Digits" className="w-full px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#3C5D81] uppercase ml-1">City / State</label>
                <div className="flex gap-2">
                  <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="w-1/2 px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs font-medium" />
                  <input type="text" required value={state} onChange={e => setState(e.target.value)} placeholder="State" className="w-1/2 px-4 py-3 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs font-medium" />
                </div>
              </div>
           </div>
        </div>

        {/* Payment Choice */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#0B3561]/10 shadow-lg space-y-6">
           <h3 className="font-heading font-bold text-base text-[#0B3561]">Payment Method</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'prepaid' ? 'border-[#12A5B0] bg-[#DDF3F4]/20' : 'border-[#0B3561]/10'}`}>
                <input type="radio" className="hidden" name="pm" checked={paymentMethod === 'prepaid'} onChange={() => setPaymentMethod('prepaid')} />
                <p className="font-bold text-[#0B3561] text-sm">Online Payment</p>
                <p className="text-[10px] text-[#13834D] font-bold">Priority Shipping + Discount</p>
              </label>
              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#12A5B0] bg-[#DDF3F4]/20' : 'border-[#0B3561]/10'}`}>
                <input type="radio" className="hidden" name="pm" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <p className="font-bold text-[#0B3561] text-sm">Cash on Delivery</p>
                <p className="text-[10px] text-[#3C5D81]">Pay when delivered</p>
              </label>
           </div>
        </div>

        {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 text-center">{errorMsg}</div>}

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-[#0B3561] text-[#FFD54A] font-heading font-black py-5 rounded-[2rem] text-lg shadow-2xl hover:bg-[#071E38] transition disabled:opacity-50"
        >
          {submitting ? 'Placing Order...' : (paymentMethod === 'prepaid' ? 'PAY & PLACE ORDER' : 'CONFIRM COD ORDER')}
        </button>
      </form>
    </div>
  );
};
