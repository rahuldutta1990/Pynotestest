import { getIdToken } from './firebase';
import { QuoteRequest, QuoteResponse, HealthResponse, Order, Product, Subject, Coupon, SiteSettings, Review, IssueReport, ContactMessage, FAQ, Testimonial, PageContent } from '../types';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const savedStaff = sessionStorage.getItem('pynotes_admin_session') || localStorage.getItem('pynotes_staff_user');
  if (savedStaff) {
    try {
      const parsed = JSON.parse(savedStaff);
      const email = parsed.user ? parsed.user.email : parsed.email;
      if (email) {
        headers['x-staff-email'] = email;
        headers['x-user-email'] = email;
      }
    } catch {}
  }
  return headers;
}

async function safeJsonParse(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (err) {
    if (!res.ok) {
      throw new Error(text || `Server error (${res.status})`);
    }
    return {};
  }
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch('/api/health');
  return safeJsonParse(res);
}

export async function fetchCatalog(): Promise<{
  subjects: Subject[];
  products: Product[];
  settings: SiteSettings;
  faqs: FAQ[];
  reviews: Review[];
}> {
  try {
    const res = await fetch('/api/catalog');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Network catalog fetch fallback triggered:', err);
    return {
      subjects: [
        { slug: 'c', name: 'C Programming', menu_label: 'C', accent_color: '#0B3561', sort_order: 1, is_active: true },
        { slug: 'c-plus-plus', name: 'C++ Programming', menu_label: 'C++', accent_color: '#0B3561', sort_order: 2, is_active: true },
        { slug: 'java', name: 'Java Programming', menu_label: 'Java', accent_color: '#12A5B0', sort_order: 3, is_active: true },
        { slug: 'python', name: 'Python Programming', menu_label: 'Python', accent_color: '#12A5B0', sort_order: 4, is_active: true },
        { slug: 'dsa-with-java', name: 'DSA with Java', menu_label: 'DSA with Java', parent: 'dsa', accent_color: '#FFD54A', sort_order: 5, is_active: true },
        { slug: 'dsa-with-python', name: 'DSA with Python', menu_label: 'DSA with Python', parent: 'dsa', accent_color: '#FFD54A', sort_order: 6, is_active: true },
        { slug: 'data-science', name: 'Data Science', menu_label: 'Data Science', accent_color: '#12A5B0', sort_order: 7, is_active: true },
        { slug: 'sql', name: 'SQL & Database Design', menu_label: 'SQL', accent_color: '#0B3561', sort_order: 8, is_active: true },
        { slug: 'dbms', name: 'DBMS', menu_label: 'DBMS', accent_color: '#0B3561', sort_order: 9, is_active: true },
        { slug: 'operating-system', name: 'Operating System', menu_label: 'Operating System', accent_color: '#12A5B0', sort_order: 10, is_active: true },
        { slug: 'html', name: 'HTML5', menu_label: 'HTML', accent_color: '#0B3561', sort_order: 11, is_active: true },
        { slug: 'css', name: 'CSS3', menu_label: 'CSS', accent_color: '#12A5B0', sort_order: 12, is_active: true },
        { slug: 'javascript', name: 'JavaScript', menu_label: 'JavaScript', accent_color: '#FFD54A', sort_order: 13, is_active: true },
      ],
      products: [
        {
          type: 'book',
          subject_id: 'c',
          slug: 'c',
          sku: 'PN-BK-C',
          title: 'C Programming Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for C Programming with color-coded syntax and exam questions.',
          description: 'C Programming handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 39900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 1,
        },
        {
          type: 'book',
          subject_id: 'c-plus-plus',
          slug: 'c-plus-plus',
          sku: 'PN-BK-C-PLUS-PLUS',
          title: 'C++ Programming Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for C++ Programming with color-coded syntax and exam questions.',
          description: 'C++ Programming handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 2,
        },
        {
          type: 'book',
          subject_id: 'java',
          slug: 'java',
          sku: 'PN-BK-JAVA',
          title: 'Java Programming Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for Java Programming with color-coded syntax and exam questions.',
          description: 'Java Programming handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 3,
        },
        {
          type: 'book',
          subject_id: 'python',
          slug: 'python',
          sku: 'PN-BK-PYTHON',
          title: 'Python Programming Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for Python Programming with color-coded syntax and exam questions.',
          description: 'Python Programming handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 4,
        },
        {
          type: 'book',
          subject_id: 'dsa-with-java',
          slug: 'dsa-with-java',
          sku: 'PN-BK-DSA-WITH-JAVA',
          title: 'DSA with Java Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for DSA with Java with color-coded syntax and exam questions.',
          description: 'DSA with Java handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 59900,
          badge_text: 'BESTSELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 5,
        },
        {
          type: 'book',
          subject_id: 'dsa-with-python',
          slug: 'dsa-with-python',
          sku: 'PN-BK-DSA-WITH-PYTHON',
          title: 'DSA with Python Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for DSA with Python with color-coded syntax and exam questions.',
          description: 'DSA with Python handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 59900,
          badge_text: 'BESTSELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 6,
        },
        {
          type: 'book',
          subject_id: 'data-science',
          slug: 'data-science',
          sku: 'PN-BK-DATA-SCIENCE',
          title: 'Data Science Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for Data Science with color-coded syntax and exam questions.',
          description: 'Data Science handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 7,
        },
        {
          type: 'book',
          subject_id: 'sql',
          slug: 'sql',
          sku: 'PN-BK-SQL',
          title: 'SQL & Database Design Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for SQL & Database Design with color-coded syntax and exam questions.',
          description: 'SQL & Database Design handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 8,
        },
        {
          type: 'book',
          subject_id: 'dbms',
          slug: 'dbms',
          sku: 'PN-BK-DBMS',
          title: 'DBMS Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for DBMS with color-coded syntax and exam questions.',
          description: 'DBMS handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 9,
        },
        {
          type: 'book',
          subject_id: 'operating-system',
          slug: 'operating-system',
          sku: 'PN-BK-OPERATING-SYSTEM',
          title: 'Operating System Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for Operating System with color-coded syntax and exam questions.',
          description: 'Operating System handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 10,
        },
        {
          type: 'book',
          subject_id: 'html',
          slug: 'html',
          sku: 'PN-BK-HTML',
          title: 'HTML5 Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for HTML5 with color-coded syntax and exam questions.',
          description: 'HTML5 handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 11,
        },
        {
          type: 'book',
          subject_id: 'css',
          slug: 'css',
          sku: 'PN-BK-CSS',
          title: 'CSS3 Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for CSS3 with color-coded syntax and exam questions.',
          description: 'CSS3 handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 12,
        },
        {
          type: 'book',
          subject_id: 'javascript',
          slug: 'javascript',
          sku: 'PN-BK-JAVASCRIPT',
          title: 'JavaScript Simplified Handwritten Notes',
          short_desc: 'Complete printed handwritten book for JavaScript with color-coded syntax and exam questions.',
          description: 'JavaScript handwritten notes printed on high quality paper.',
          mrp_paise: 79900,
          price_paise: 49900,
          badge_text: 'HOT SELLER',
          stock_qty: 50,
          status: 'active',
          sort_order: 13,
        },
      ],
      settings: {
        announcement_messages: [
          { text: 'LIMITED PRINT COPIES AVAILABLE ACROSS INDIA', highlight: 'LIMITED STOCK' },
          { text: 'FREE EXPRESS SHIPPING ON ALL PREPAID ORDERS', highlight: 'FREE DELIVERY' },
          { text: 'USE CODE PY10 FOR 10% EXTRA DISCOUNT AT CHECKOUT', highlight: 'OFFER' },
        ],
        prepaid_discount_percent: 10,
        cod_enabled: true,
        cod_fee_paise: 4900,
        flat_shipping_paise: 6900,
        free_shipping_threshold_paise: 0,
        hold_minutes: 30,
        whatsapp_number: '+919876543210',
        support_email: 'support@pynotes.in',
        legal_name: 'PyNotes India Ltd.',
        gstin: '27AAAAA0000A1Z5',
        featured_collection_count: 13,
      },
      faqs: [],
      reviews: [],
    } as any;
  }
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

export async function trackOrder(orderNo: string, contact: string): Promise<any> {
  const res = await fetch(`/api/orders/track?order_no=${encodeURIComponent(orderNo)}&contact=${encodeURIComponent(contact)}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Invalid order number or contact details' }));
    throw new Error(data.error || 'Invalid order number or contact details');
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

export async function updateMyProfile(data: { name?: string; phone?: string; shipping_address?: any, addresses?: any[] }) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/me', {
    method: 'POST',
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
  const data = await safeJsonParse(res);
  if (!res.ok) {
    throw new Error(data?.error || data?.message || (typeof data === 'string' ? data : 'Admin request failed'));
  }
  return data;
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
  return data;
}

// Subscription APIs
export async function fetchPlans(): Promise<any[]> {
  const res = await fetch('/api/plans');
  if (!res.ok) throw new Error('Failed to fetch plans');
  return res.json();
}

export async function startSubscription(planId: string): Promise<{ subscription_id: string; razorpay_key_id: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/subscriptions/start', {
    method: 'POST',
    headers,
    body: JSON.stringify({ plan_id: planId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to start subscription');
  return data;
}

export async function cancelSubscription(subId: string, reason?: string): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/subscriptions/${subId}/cancel`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ reason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to cancel subscription');
  return data;
}

export async function fetchMySubscriptions(): Promise<any[]> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/subscriptions/me', { headers });
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  return res.json();
}

export async function fetchAdminPages(): Promise<any[]> {
  return adminFetch('/pages');
}

export async function saveAdminPage(page: any) {
  return adminFetch('/pages', {
    method: 'POST',
    body: JSON.stringify(page)
  });
}

export async function deleteAdminPage(slug: string) {
  return adminFetch(`/pages/${slug}`, {
    method: 'DELETE'
  });
}

export async function cancelCustomerOrder(orderNo: string, reason?: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/orders/${orderNo}/cancel-customer`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to cancel order');
  }
  return res.json();
}
