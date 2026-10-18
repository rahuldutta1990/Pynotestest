import { getIdToken } from './firebase';
import { QuoteRequest, QuoteResponse, HealthResponse, Order, Product, Subject, Coupon, SiteSettings, Review, IssueReport, ContactMessage, FAQ, Testimonial, PageContent } from '../types';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch('/api/health');
  return res.json();
}

export async function fetchCatalog(): Promise<{
  subjects: Subject[];
  products: Product[];
  settings: SiteSettings;
  faqs: FAQ[];
  reviews: Review[];
}> {
  const res = await fetch('/api/catalog');
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}

export async function fetchPage(slug: string): Promise<PageContent> {
  const res = await fetch(`/api/pages/${slug}`);
  if (!res.ok) throw new Error('Page not found');
  return res.json();
}

export async function quoteCart(quoteReq: QuoteRequest): Promise<QuoteResponse> {
  const res = await fetch('/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteReq),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Quote failed' }));
    throw new Error(err.error || 'Quote failed');
  }
  return res.json();
}

export async function validateCoupon(code: string, quoteReq: QuoteRequest): Promise<{ valid: boolean; discount_paise: number; message?: string }> {
  const res = await fetch('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, ...quoteReq }),
  });
  return res.json();
}

export async function createOrder(orderPayload: any): Promise<{
  order_no: string;
  token: string;
  razorpay_order_id?: string;
  razorpay_key_id?: string;
  total_paise: number;
  message?: string;
}> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(orderPayload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to place order');
  }
  return data;
}

export async function verifyPayment(paymentPayload: {
  order_no: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<{ success: boolean; order_no: string }> {
  const res = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentPayload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Payment verification failed');
  }
  return data;
}

export async function fetchOrderDetails(orderNo: string, token: string): Promise<Order> {
  const res = await fetch(`/api/orders/${orderNo}?t=${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}

export async function trackOrder(orderNo: string, phone: string): Promise<Order> {
  const res = await fetch(`/api/orders/track?order_no=${encodeURIComponent(orderNo)}&phone=${encodeURIComponent(phone)}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Order not found' }));
    throw new Error(data.error || 'Order tracking failed');
  }
  return res.json();
}

export async function postContactMessage(payload: { name: string; email: string; phone?: string; message: string }) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit message');
  return data;
}

export async function postWaitlistEntry(payload: { product_slug: string; email?: string; phone?: string }) {
  const res = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to join waitlist');
  return data;
}

// User Customer Account APIs
export async function fetchMyProfile() {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/me', { headers });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateMyProfile(data: { name?: string; phone?: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/me', {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function fetchMyOrders(): Promise<Order[]> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/me/orders', { headers });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function submitReview(payload: { product_id: string; order_id?: string; display_name: string; rating: number; title: string; body: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit review');
  return data;
}

export async function submitIssueReport(payload: { order_no: string; type: string; description: string; photos?: string[] }) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/issues', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit report');
  return data;
}

// Admin API helper
export async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Admin request failed');
  }
  return data;
}
