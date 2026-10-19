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
        className="fixed inset-0 bg-[#070F1E]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container (440px max width) */}
      <div className="relative w-full max-w-[440px] bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
        
        {/* Header */}
        <div className="p-5 border-b border-[#0A192F]/10 flex items-center justify-between bg-white">
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#0A192F]">
            Your Bag · {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-[#FAF7F0] border border-[#0A192F]/10 text-[#0A192F] hover:bg-slate-100 rounded-lg transition cursor-pointer"
            aria-label="Close cart"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Strip */}
        <div className="bg-[#FAF7F0] px-5 py-3 border-b border-[#0A192F]/8">
          {freeShippingThresholdPaise === 0 || (quote && quote.is_free_shipping) ? (
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#16A34A]">
              <span>✨</span>
              <span>Free express shipping unlocked on your order!</span>
            </div>
          ) : quote ? (
            <div>
              <div className="flex items-center justify-between text-xs font-heading font-medium text-[#0A192F] mb-1.5">
                <span>Spend ₹{(quote.amount_needed_for_free_shipping_paise / 100).toFixed(0)} more for free express shipping</span>
                <TruckIcon className="w-3.5 h-3.5 text-[#D97706]" />
              </div>
              <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-[#0A192F]/10">
                <div
                  className="bg-[#D97706] h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(10, ((freeShippingThresholdPaise - quote.amount_needed_for_free_shipping_paise) / freeShippingThresholdPaise) * 100))}%`,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <SparkIcon className="w-10 h-10 text-[#D97706] mb-3" />
              <p className="font-heading font-bold text-[#0A192F] text-base">Your cart is empty</p>
              <p className="text-xs text-[#627D98] mt-1 mb-5">Explore our printed handwritten coding notes.</p>
              <button
                onClick={onClose}
                className="bg-[#0A192F] text-white font-heading font-bold px-6 py-2.5 rounded-xl hover:bg-[#132742] transition shadow-xs text-xs cursor-pointer"
              >
                Browse Subject Books
              </button>
            </div>
          ) : (
            cart.map(item => {
              const prod = products.find(p => p.slug === item.slug);
              if (!prod) return null;

              const itemSaving = (prod.mrp_paise - prod.price_paise) * item.qty;

              return (
                <div key={item.slug} className="flex gap-3 bg-[#FAF7F0] p-3 rounded-2xl border border-[#0A192F]/8 relative">
                  {/* Thumbnail 3:4 */}
                  <div className="w-14 h-18 flex-shrink-0 bg-[#0A192F] rounded-lg overflow-hidden relative border border-[#0A192F]/20 book-cover-3d">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[9px] font-handwriting font-bold p-1 text-center">
                      {prod.title.replace(' Simplified Handwritten Notes', '')}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-heading font-bold text-xs text-[#0A192F] line-clamp-2 leading-snug">
                          {prod.title}
                        </h4>
                        <span className="text-[10px] text-[#D97706] font-mono font-semibold uppercase tracking-wider block mt-0.5">
                          {prod.type === 'bundle' ? 'Bundle Combo' : 'Printed Book'}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.slug)}
                        className="text-[#627D98] hover:text-[#DC2626] p-1 transition cursor-pointer"
                        title="Remove"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty Stepper */}
                      <div className="flex items-center border border-[#0A192F]/15 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => onUpdateQty(item.slug, item.qty - 1)}
                          className="px-2 py-0.5 text-[#0A192F] hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-[#0A192F]">{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item.slug, item.qty + 1)}
                          className="px-2 py-0.5 text-[#0A192F] hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Price Block */}
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-[#9DAEC0] line-through">
                          ₹{((prod.mrp_paise * item.qty) / 100).toFixed(0)}
                        </div>
                        <div className="font-heading font-bold text-sm text-[#0A192F]">
                          ₹{((prod.price_paise * item.qty) / 100).toFixed(0)}
                        </div>
                        {itemSaving > 0 && (
                          <div className="text-[9px] font-mono font-bold text-[#16A34A]">
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
            <div className="pt-2 border-t border-[#0A192F]/10">
              <label className="text-xs font-heading font-semibold text-[#0A192F] block mb-1">
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. PY10"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F0] border border-[#0A192F]/15 rounded-lg uppercase font-mono font-bold text-[#0A192F] focus:border-[#D97706] focus:outline-none"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-[#0A192F] text-white font-heading font-bold text-xs px-4 py-1.5 rounded-lg hover:bg-[#132742] transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] text-[#DC2626] font-medium mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-[#16A34A] font-bold mt-1">{couponSuccess}</p>}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        {cart.length > 0 && quote && (
          <div className="p-5 bg-white border-t border-[#0A192F]/10 shadow-lg space-y-2.5">
            {quote.coupon_discount_paise > 0 && (
              <div className="flex justify-between items-center text-xs font-semibold text-[#16A34A]">
                <span>Coupon Savings:</span>
                <span>-₹{(quote.coupon_discount_paise / 100).toFixed(2)}</span>
              </div>
            )}

            {quote.prepaid_discount_paise > 0 && (
              <div className="flex justify-between items-center text-xs font-semibold text-[#16A34A]">
                <span>Prepaid Savings:</span>
                <span>-₹{(quote.prepaid_discount_paise / 100).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-1">
              <span className="font-heading font-bold text-[#0A192F] text-base">Subtotal</span>
              <span className="font-heading font-bold text-xl text-[#0A192F]">
                ₹{(quote.total_paise / 100).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full bg-[#0A192F] text-white font-heading font-bold py-3.5 rounded-xl text-sm shadow-md hover:bg-[#132742] transition tracking-wide flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <div className="text-center">
              <button
                onClick={onClose}
                className="text-xs font-heading font-semibold text-[#627D98] hover:text-[#0A192F] cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
