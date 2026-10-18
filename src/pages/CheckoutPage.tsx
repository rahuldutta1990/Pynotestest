import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, QuoteResponse, PaymentMethod } from '../types';
import { quoteCart, createOrder, verifyPayment } from '../lib/api';
import { signInWithGoogle, auth } from '../lib/firebase';
import { TruckIcon } from '../components/Icons';

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

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync logged in user details if available
  useEffect(() => {
    if (auth.currentUser) {
      if (!name) setName(auth.currentUser.displayName || '');
      if (!email) setEmail(auth.currentUser.email || '');
    }
  }, [auth.currentUser]);

  // Re-quote whenever cart or payment method changes
  useEffect(() => {
    if (cart.length === 0) return;
    quoteCart({
      items: cart,
      coupon_code: couponCode || undefined,
      payment_method: paymentMethod,
    })
      .then(q => setQuote(q))
      .catch(err => setErrorMsg(err.message));
  }, [cart, paymentMethod, couponCode]);

  // Pincode auto-fill lookup from api.postalpincode.in
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
        console.warn('Pincode lookup fallback:', e);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setName(user.displayName || name);
        setEmail(user.email || email);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number starting with 6-9');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setSubmitting(true);

    try {
      const orderRes = await createOrder({
        contact: { email, phone, name },
        shipping_address: {
          name,
          phone,
          line1,
          line2,
          pincode,
          city,
          state,
        },
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

      // Prepaid Razorpay Payment Flow
      if (paymentMethod === 'prepaid' && orderRes.razorpay_order_id) {
        const keyToUse = orderRes.razorpay_key_id || razorpayKeyId;

        // If Razorpay SDK script is available or load it dynamically
        const options = {
          key: keyToUse,
          amount: orderRes.total_paise,
          currency: 'INR',
          name: 'PyNotes India',
          description: `Order #${orderRes.order_no}`,
          order_id: orderRes.razorpay_order_id,
          prefill: {
            name,
            email,
            contact: phone,
          },
          theme: {
            color: '#0B3561',
          },
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
              setErrorMsg('Payment popup closed. You can retry or choose Cash on Delivery.');
            },
          },
        };

        // If Razorpay is window script
        if ((window as any).Razorpay) {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          // Dynamically load Razorpay script
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          };
          script.onerror = () => {
            setErrorMsg('Failed to load Razorpay payment SDK. Please try Cash on Delivery.');
            setSubmitting(false);
          };
          document.body.appendChild(script);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order');
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Your Cart is Empty</h2>
        <p className="text-xs text-[#3C5D81]">Please add some handwritten books before checking out.</p>
        <button
          onClick={() => navigate('/subjects')}
          className="bg-[#0B3561] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
        >
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top Title & Google Auth suggestion */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#0B3561]/10 pb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#0B3561]">Checkout</h1>
          <p className="font-body text-xs text-[#3C5D81] mt-0.5">Express shipping across India.</p>
        </div>

        {!auth.currentUser && (
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 bg-white border border-[#0B3561]/20 px-4 py-2 rounded-xl text-xs font-heading font-semibold text-[#0B3561] hover:bg-[#DDF3F4] transition shadow-xs"
          >
            <span>Google Sign-In (Optional)</span>
          </button>
        )}
      </div>

      {/* Collapsible Order Summary Box */}
      {quote && (
        <details className="bg-white p-5 rounded-2xl border border-[#0B3561]/10 shadow-sm group">
          <summary className="font-heading font-bold text-sm text-[#0B3561] cursor-pointer flex justify-between items-center list-none">
            <span className="flex items-center gap-2">
              <span>Order Summary ({quote.lines.length} items)</span>
              <span className="text-[#13834D] text-xs">Total: ₹{(quote.total_paise / 100).toFixed(2)}</span>
            </span>
            <span className="text-[#12A5B0] group-open:rotate-180 transition">▼</span>
          </summary>

          <div className="pt-4 border-t border-[#0B3561]/10 mt-3 space-y-3">
            {quote.lines.map(line => (
              <div key={line.slug} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#0B3561]">
                  {line.title} x {line.qty}
                </span>
                <span className="font-bold text-[#0B3561]">₹{(line.line_total_paise / 100).toFixed(2)}</span>
              </div>
            ))}

            <div className="pt-2 border-t border-[#0B3561]/5 text-xs space-y-1">
              <div className="flex justify-between text-[#3C5D81]">
                <span>Subtotal</span>
                <span>₹{(quote.subtotal_paise / 100).toFixed(2)}</span>
              </div>
              {quote.coupon_discount_paise > 0 && (
                <div className="flex justify-between text-[#13834D] font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{(quote.coupon_discount_paise / 100).toFixed(2)}</span>
                </div>
              )}
              {quote.prepaid_discount_paise > 0 && (
                <div className="flex justify-between text-[#13834D] font-semibold">
                  <span>Prepaid Instant Off</span>
                  <span>-₹{(quote.prepaid_discount_paise / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#3C5D81]">
                <span>Shipping</span>
                <span>{quote.is_free_shipping ? 'FREE' : `₹${(quote.shipping_paise / 100).toFixed(2)}`}</span>
              </div>
              {quote.cod_fee_paise > 0 && paymentMethod === 'cod' && (
                <div className="flex justify-between text-[#3C5D81]">
                  <span>COD Fee</span>
                  <span>₹{(quote.cod_fee_paise / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#0B3561] pt-2 border-t border-[#0B3561]/10">
                <span>Total Amount Payable</span>
                <span className="font-display font-black text-lg">₹{(quote.total_paise / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </details>
      )}

      <form onSubmit={handlePlaceOrder} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3561]/10 shadow-lg">
        
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">1. Contact Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">
              Indian Mobile Number (for delivery SMS & COD check) *
            </label>
            <div className="flex gap-2">
              <span className="px-3 py-2.5 bg-[#E7EBEF] border border-[#0B3561]/20 rounded-xl text-xs font-bold text-[#0B3561]">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10 digits starting with 6-9"
                className="flex-1 px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561] font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="space-y-4 pt-4 border-t border-[#0B3561]/10">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">2. Delivery Address</h3>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Flat, House No., Building / Street *</label>
            <input
              type="text"
              required
              value={line1}
              onChange={e => setLine1(e.target.value)}
              placeholder="e.g. Flat 402, Sunshine Apartments, MG Road"
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">Landmark / Sector (Optional)</label>
            <input
              type="text"
              value={line2}
              onChange={e => setLine2(e.target.value)}
              placeholder="e.g. Near Metro Station"
              className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">PIN Code *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={e => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                  placeholder="6 digits"
                  className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561] font-mono font-bold"
                />
                {pincodeLoading && (
                  <span className="absolute right-3 top-2.5 text-[10px] text-[#12A5B0] animate-pulse">
                    Checking...
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-[#0B3561] mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="State"
                className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
              />
            </div>
          </div>
        </div>

        {/* Payment Selection */}
        <div className="space-y-4 pt-4 border-t border-[#0B3561]/10">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">3. Payment Choice</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prepaid Option */}
            <label
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                paymentMethod === 'prepaid'
                  ? 'border-[#0B3561] bg-[#DDF3F4]/40 shadow-xs'
                  : 'border-[#0B3561]/20 bg-[#F7FAFC]'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="prepaid"
                  checked={paymentMethod === 'prepaid'}
                  onChange={() => setPaymentMethod('prepaid')}
                  className="mt-1"
                />
                <div>
                  <span className="font-heading font-bold text-sm text-[#0B3561] block">Prepaid (Online Payment)</span>
                  <span className="text-xs text-[#13834D] font-bold mt-0.5 block">
                    ⚡ Extra Instant Discount + Priority Delivery
                  </span>
                  <p className="text-[11px] text-[#3C5D81] mt-1">UPI (GPay, PhonePe, Paytm), Cards, NetBanking.</p>
                </div>
              </div>
            </label>

            {/* COD Option */}
            <label
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                paymentMethod === 'cod'
                  ? 'border-[#0B3561] bg-[#DDF3F4]/40 shadow-xs'
                  : 'border-[#0B3561]/20 bg-[#F7FAFC]'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1"
                />
                <div>
                  <span className="font-heading font-bold text-sm text-[#0B3561] block">Cash on Delivery (COD)</span>
                  <p className="text-[11px] text-[#3C5D81] mt-1">Pay in cash when courier delivers the books.</p>
                </div>
              </div>
            </label>
          </div>

          {/* Plain Text Note as required */}
          <div className="bg-[#E7EBEF] p-3 rounded-xl text-xs text-[#0B3561] font-heading font-medium flex items-center gap-2">
            <span>ℹ️</span>
            <span>We hold your books for {holdMinutes} minutes while you pay.</span>
          </div>
        </div>

        {/* Public Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#3C5D81] font-heading font-medium">
            <input
              type="checkbox"
              checked={showNamePublicly}
              onChange={e => setShowNamePublicly(e.target.checked)}
              className="mt-0.5"
            />
            <span>Show my first name and city in the recent orders strip on the site</span>
          </label>
        </div>

        {errorMsg && (
          <div className="bg-[#C0392B]/10 border border-[#C0392B]/30 text-[#C0392B] p-3 rounded-xl text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#0B3561] text-white font-heading font-bold py-4 rounded-2xl text-base shadow-xl hover:bg-[#071E38] transition tracking-wide disabled:opacity-50"
        >
          {submitting
            ? 'Processing Order...'
            : paymentMethod === 'prepaid'
            ? `PAY NOW (₹${quote ? (quote.total_paise / 100).toFixed(2) : ''})`
            : 'PLACE CASH ON DELIVERY ORDER'}
        </button>

      </form>
    </div>
  );
};
