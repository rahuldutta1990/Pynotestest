/**
 * GA4 & Data Layer E-commerce Event Tracking Helper Utility
 * Standardized for Google Analytics 4 (gtag.js / dataLayer)
 */

export interface GA4Item {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
  currency?: string;
}

export interface PurchaseEventParams {
  transaction_id: string;
  value: number;
  currency?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  items: GA4Item[];
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Pushes event to dataLayer and triggers gtag if available
 */
export function trackGA4Event(eventName: string, params: Record<string, any>) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  // Push standard GA4 e-commerce payload into dataLayer
  window.dataLayer.push({
    event: eventName,
    ecommerce: { ...params },
  });

  // Call gtag directly if configured
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    window.dataLayer.push(['event', eventName, params]);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[GA4 E-commerce Event]: ${eventName}`, params);
  }
}

/**
 * Event: view_item
 * Triggered when a user views a product detail page
 */
export function trackViewItem(product: {
  slug: string;
  title: string;
  price_paise: number;
  type?: string;
}) {
  const itemPrice = Number((product.price_paise / 100).toFixed(2));
  trackGA4Event('view_item', {
    currency: 'INR',
    value: itemPrice,
    items: [
      {
        item_id: product.slug,
        item_name: product.title,
        price: itemPrice,
        quantity: 1,
        item_category: product.type || 'book',
      },
    ],
  });
}

/**
 * Event: add_to_cart
 * Triggered when a user adds a book or bundle to the cart
 */
export function trackAddToCart(product: {
  slug: string;
  title: string;
  price_paise: number;
  type?: string;
}, qty: number = 1) {
  const itemPrice = Number((product.price_paise / 100).toFixed(2));
  const totalValue = Number((itemPrice * qty).toFixed(2));

  trackGA4Event('add_to_cart', {
    currency: 'INR',
    value: totalValue,
    items: [
      {
        item_id: product.slug,
        item_name: product.title,
        price: itemPrice,
        quantity: qty,
        item_category: product.type || 'book',
      },
    ],
  });
}

/**
 * Event: remove_from_cart
 * Triggered when a user removes an item from the cart
 */
export function trackRemoveFromCart(product: {
  slug: string;
  title: string;
  price_paise: number;
  type?: string;
}, qty: number = 1) {
  const itemPrice = Number((product.price_paise / 100).toFixed(2));
  const totalValue = Number((itemPrice * qty).toFixed(2));

  trackGA4Event('remove_from_cart', {
    currency: 'INR',
    value: totalValue,
    items: [
      {
        item_id: product.slug,
        item_name: product.title,
        price: itemPrice,
        quantity: qty,
        item_category: product.type || 'book',
      },
    ],
  });
}

/**
 * Event: begin_checkout
 * Triggered when user enters checkout
 */
export function trackBeginCheckout(items: GA4Item[], totalValue: number, coupon?: string) {
  trackGA4Event('begin_checkout', {
    currency: 'INR',
    value: Number(totalValue.toFixed(2)),
    coupon: coupon || '',
    items,
  });
}

/**
 * Event: purchase
 * Triggered on order completion / thank you page load
 */
export function trackPurchase(params: PurchaseEventParams) {
  trackGA4Event('purchase', {
    currency: params.currency || 'INR',
    transaction_id: params.transaction_id,
    value: Number(params.value.toFixed(2)),
    tax: params.tax ? Number(params.tax.toFixed(2)) : 0,
    shipping: params.shipping ? Number(params.shipping.toFixed(2)) : 0,
    coupon: params.coupon || '',
    items: params.items,
  });
}
