import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TruckIcon, SparkIcon } from './Icons';
import { Product, QuoteResponse } from '../types';
import { quoteCart, validateCoupon } from '../lib/api';

interface CartItem {
  slug: string;
  qty: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  onUpdateQty: (slug: string, qty: number) => void;
  onRemoveItem: (slug: string) => void;
  freeShippingThresholdPaise?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  onUpdateQty,
  onRemoveItem,
  freeShippingThresholdPaise = 0,
}) => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Re-quote cart whenever items change
  useEffect(() => {
    if (cart.length === 0) {
      setQuote(null);
      return;
    }
    quoteCart({
      items: cart,
      coupon_code: appliedCoupon || undefined,
      payment_method: 'prepaid',
    })
      .then(q => setQuote(q))
      .catch(err => console.error('Quote error:', err));
  }, [cart, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    setCouponSuccess(null);
    try {
      const res = await validateCoupon(couponCode.trim().toUpperCase(), {
        items: cart,
        payment_method: 'prepaid',
      });
      if (res.valid) {
        setAppliedCoupon(couponCode.trim().toUpperCase());
        setCouponSuccess(`Coupon ${couponCode.toUpperCase()} applied!`);
      } else {
        setCouponError(res.message || 'Invalid coupon code');
      }
    } catch (err: any) {
      setCouponError(err.message || 'Error checking coupon');
    }
  };

  const totalItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[#071E38]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container (440px max width) */}
      <div className="relative w-full max-w-[440px] bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
        
        {/* Header */}
        <div className="p-5 border-b border-[#0B3561]/10 flex items-center justify-between bg-white">
          <h3 className="font-heading font-bold text-lg text-[#0B3561]">
            Cart . {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-[#F7FAFC] border border-[#0B3561]/10 text-[#0B3561] hover:bg-[#DDF3F4] rounded-lg transition"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navy Info Band (No timer!) */}
        <div className="bg-[#0B3561] text-white px-5 py-2.5 text-xs font-heading font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFD54A] flex-shrink-0 animate-pulse" />
          <span>Free delivery & extra discount on prepaid orders</span>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#DDF3F4] px-5 py-3 border-b border-[#0B3561]/10">
          {freeShippingThresholdPaise === 0 || (quote && quote.is_free_shipping) ? (
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#0B3561]">
              <TruckIcon className="w-5 h-5 text-[#12A5B0]" />
              <span>Free shipping unlocked on every order!</span>
            </div>
          ) : quote ? (
            <div>
              <div className="flex items-center justify-between text-xs font-heading font-semibold text-[#0B3561] mb-1.5">
                <span>Spend ₹{(quote.amount_needed_for_free_shipping_paise / 100).toFixed(0)} more for free shipping</span>
                <TruckIcon className="w-4 h-4 text-[#12A5B0]" />
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#0B3561]/10">
                <div
                  className="bg-[#12A5B0] h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(10, ((freeShippingThresholdPaise - quote.amount_needed_for_free_shipping_paise) / freeShippingThresholdPaise) * 100))}%`,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <SparkIcon className="w-12 h-12 text-[#12A5B0] mb-3" />
              <p className="font-heading font-bold text-[#0B3561] text-lg">Your cart is empty</p>
              <p className="text-xs text-[#3C5D81] mt-1 mb-5">Explore our printed handwritten coding notes.</p>
              <button
                onClick={onClose}
                className="bg-[#0B3561] text-white font-heading font-bold px-6 py-2.5 rounded-xl hover:bg-[#071E38] transition shadow-md"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => {
              const prod = products.find(p => p.slug === item.slug);
              if (!prod) return null;

              const itemSaving = (prod.mrp_paise - prod.price_paise) * item.qty;

              return (
                <div key={item.slug} className="flex gap-3 bg-[#F7FAFC] p-3 rounded-2xl border border-[#0B3561]/10 relative">
                  {/* Thumbnail 3:4 */}
                  <div className="w-16 h-20 flex-shrink-0 bg-[#0B3561] rounded-lg overflow-hidden relative border border-[#0B3561]/20">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-black italic p-1 text-center">
                      {prod.title}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-heading font-bold text-xs text-[#0B3561] line-clamp-2 leading-snug">
                          {prod.title}
                        </h4>
                        <span className="text-[10px] text-[#12A5B0] font-heading font-semibold uppercase tracking-wider block mt-0.5">
                          {prod.type === 'bundle' ? 'Bundle Book Set' : 'Printed Book'}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.slug)}
                        className="text-[#3C5D81] hover:text-[#C0392B] p-1 transition"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty Stepper */}
                      <div className="flex items-center border border-[#0B3561]/20 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => onUpdateQty(item.slug, item.qty - 1)}
                          className="px-2 py-1 text-[#0B3561] hover:bg-[#DDF3F4] font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-[#0B3561]">{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item.slug, item.qty + 1)}
                          className="px-2 py-1 text-[#0B3561] hover:bg-[#DDF3F4] font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Price Block */}
                      <div className="text-right">
                        <div className="text-xs text-[#9DAEC0] line-through">
                          ₹{((prod.mrp_paise * item.qty) / 100).toFixed(2)}
                        </div>
                        <div className="font-display font-black text-sm text-[#0B3561]">
                          ₹{((prod.price_paise * item.qty) / 100).toFixed(2)}
                        </div>
                        {itemSaving > 0 && (
                          <div className="text-[10px] font-bold text-[#13834D]">
                            Save ₹{(itemSaving / 100).toFixed(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Coupon Field */}
          {cart.length > 0 && (
            <div className="pt-2 border-t border-[#0B3561]/10">
              <label className="text-xs font-heading font-semibold text-[#0B3561] block mb-1.5">
                Have a discount coupon?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. PY10)"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#F7FAFC] border border-[#0B3561]/20 rounded-lg uppercase font-code font-bold text-[#0B3561]"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs px-4 py-2 rounded-lg hover:brightness-105 transition"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-[#C0392B] font-medium mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-[#13834D] font-bold mt-1">{couponSuccess}</p>}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        {cart.length > 0 && quote && (
          <div className="p-5 bg-white border-t border-[#0B3561]/10 shadow-lg space-y-3">
            {quote.coupon_discount_paise > 0 && (
              <div className="flex justify-between items-center text-xs font-semibold text-[#13834D]">
                <span>Coupon Savings:</span>
                <span>-₹{(quote.coupon_discount_paise / 100).toFixed(2)}</span>
              </div>
            )}

            {quote.prepaid_discount_paise > 0 && (
              <div className="flex justify-between items-center text-xs font-semibold text-[#13834D]">
                <span>Prepaid Discount:</span>
                <span>-₹{(quote.prepaid_discount_paise / 100).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-1">
              <span className="font-heading font-bold text-[#0B3561] text-base">Subtotal</span>
              <span className="font-display font-black italic text-xl text-[#0B3561]">
                ₹{(quote.total_paise / 100).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full bg-[#0B3561] text-white font-heading font-bold py-3.5 rounded-xl text-base shadow-lg hover:bg-[#071E38] transition tracking-wide flex items-center justify-center gap-2"
            >
              <span>BUY IT NOW / CHECKOUT</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <div className="text-center">
              <button
                onClick={onClose}
                className="text-xs font-heading font-semibold text-[#0B3561] hover:underline"
              >
                Or Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
