export type UserRole = 'owner' | 'manager' | 'editor' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label?: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  pincode: string;
  city: string;
  state: string;
  is_default: boolean;
}

export interface Subject {
  slug: string;
  name: string;
  menu_label: string;
  parent?: string | null;
  icon?: string;
  accent_color: string;
  seo_intro: string;
  sort_order: number;
  is_active: boolean;
}

export type ProductType = 'book' | 'bundle';
export type ProductStatus = 'draft' | 'active' | 'archived';

export interface BundleItem {
  book_slug: string;
  qty: number;
}

export interface ProductFeature {
  image?: string;
  heading: string;
  text: string;
  button_label?: string;
}

export interface ComparisonRow {
  label: string;
  ours: string;
  others: string;
}

export interface Product {
  slug: string;
  type: ProductType;
  subject_id?: string | null;
  sku: string;
  title: string;
  short_desc: string;
  description: string;
  mrp_paise: number;
  price_paise: number;
  badge_text?: string;
  stock_qty: number; // for books
  low_stock_threshold: number;
  weight_g: number;
  hsn_code: string;
  gst_rate_bp: number; // e.g. 0
  images: string[]; // media ids or data urls
  before_media?: string;
  after_media?: string;
  features?: ProductFeature[];
  comparison_rows?: ComparisonRow[];
  bundle_items?: BundleItem[]; // for bundles
  status: ProductStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
  is_sample?: boolean;
}

export interface Coupon {
  code: string;
  kind: 'percent' | 'flat';
  value: number; // percentage (e.g. 10) or paise (e.g. 5000)
  min_subtotal_paise: number;
  max_discount_paise?: number;
  applies_to: 'any' | 'prepaid' | 'cod';
  usage_limit?: number;
  used_count: number;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_failed'
  | 'awaiting_confirmation'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'rto'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'prepaid' | 'cod';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'partially_refunded' | 'refunded';

export interface OrderItemSnapshot {
  slug: string;
  title: string;
  type: ProductType;
  qty: number;
  unit_price_paise: number;
  mrp_paise: number;
  line_total_paise: number;
  hsn_code: string;
  gst_rate_bp: number;
  bundle_contents?: BundleItem[];
}

export interface OrderEvent {
  id: string;
  at: string;
  actor: string;
  kind: string;
  from_status?: string;
  to_status?: string;
  note?: string;
}

export interface Order {
  order_no: string;
  user_id?: string | null;
  email: string;
  phone: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal_paise: number;
  coupon_code?: string;
  coupon_discount_paise: number;
  prepaid_discount_paise: number;
  shipping_paise: number;
  cod_fee_paise: number;
  tax_paise: number;
  total_paise: number;
  ship_name: string;
  ship_phone: string;
  ship_line1: string;
  ship_line2?: string;
  ship_pincode: string;
  ship_city: string;
  ship_state: string;
  razorpay_order_id?: string;
  reserved_until?: string;
  invoice_no?: string;
  courier?: string;
  awb?: string;
  tracking_url?: string;
  shiprocket_order_id?: string;
  shiprocket_shipment_id?: string;
  cod_confirmed_at?: string;
  cod_confirmed_by?: string;
  placed_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancel_reason?: string;
  attention?: string | null;
  admin_note?: string;
  items: OrderItemSnapshot[];
  show_name_publicly?: boolean;
  events?: OrderEvent[];
}

export interface QuoteRequest {
  items: { slug: string; qty: number }[];
  coupon_code?: string;
  payment_method: PaymentMethod;
}

export interface QuoteResponse {
  lines: {
    slug: string;
    title: string;
    qty: number;
    unit_price_paise: number;
    mrp_paise: number;
    line_total_paise: number;
    saving_paise: number;
  }[];
  subtotal_paise: number;
  coupon_code?: string;
  coupon_discount_paise: number;
  prepaid_discount_paise: number;
  shipping_paise: number;
  cod_fee_paise: number;
  tax_paise: number;
  total_paise: number;
  is_free_shipping: boolean;
  amount_needed_for_free_shipping_paise: number;
}

export interface ResultStat {
  value: string;
  label: string;
  sample_size?: string;
  source_note?: string;
  survey_date?: string;
  is_sample?: boolean;
}

export interface FeaturedLogo {
  id: string;
  name: string;
  image: string;
  url?: string;
  is_sample?: boolean;
}

export interface Testimonial {
  id: string;
  author_name: string;
  avatar_media_id?: string;
  quote: string;
  platform?: string;
  posted_date?: string;
  screenshot_media_id?: string;
  is_active: boolean;
  is_sample?: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  order_id?: string;
  user_id?: string;
  display_name: string;
  rating: number; // 1 to 5
  title: string;
  body: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  is_sample?: boolean;
}

export interface FAQ {
  id: string;
  group_name: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export interface PageContent {
  slug: string;
  title: string;
  body_md: string;
  is_draft: boolean;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  created_at: string;
  handled_by?: string;
}

export interface IssueReport {
  id: string;
  order_no: string;
  type: 'damaged' | 'wrong_item' | 'other';
  description: string;
  photos: string[];
  within_window: boolean;
  status: 'open' | 'replacement' | 'refunded' | 'rejected';
  resolution_note?: string;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  product_slug: string;
  email?: string;
  phone?: string;
  created_at: string;
  notified_at?: string;
}

export interface SiteSettings {
  announcement_messages: { text: string; highlight?: string }[];
  prepaid_discount_percent: number;
  stack_prepaid_with_coupon: boolean;
  cod_enabled: boolean;
  cod_fee_paise: number;
  cod_max_total_paise: number;
  free_shipping_threshold_paise: number;
  flat_shipping_paise: number;
  hold_minutes: number;
  shiprocket_pickup_location: string;
  default_weight_g: number;
  parcel_dims_cm: string;
  processing_days_min: number;
  processing_days_max: number;
  delivery_days_min: number;
  delivery_days_max: number;
  return_window_hours: number;
  delivery_note: string;
  free_shipping_note: string;
  prepaid_offer_text: string;
  coupon_banner_code: string;
  whatsapp_number: string;
  support_email: string;
  social_links: { platform: string; url: string }[];
  footer_about: string;
  store_address: string;
  payment_icons: string[];
  legal_name: string;
  gstin: string;
  gst_registered: boolean;
  store_state: string;
  invoice_prefix: string;
  default_hsn: string;
  default_gst_rate_bp: number;
  tracking_url_template: string;
  ga4_id: string;
  meta_pixel_id: string;
  hero_slides: { desktop_image: string; mobile_image?: string; link?: string; title?: string; subtitle?: string }[];
  ticker_items: { label: string; icon: string }[];
  trust_row: { title: string; desc: string; icon: string }[];
  usp_blocks: { title: string; desc: string; icon: string }[];
  featured_collection_count: number;
  default_comparison_rows: ComparisonRow[];
  result_stats: ResultStat[];
  featured_on_logos: FeaturedLogo[];
  show_total_orders_badge: boolean;
  total_orders_badge_min: number;
  show_low_stock_badge: boolean;
  show_recent_buyers_strip: boolean;
  custom_logo_url?: string;
}

export interface HealthResponse {
  status: 'ok';
  integrations: {
    razorpay: boolean;
    shiprocket: boolean;
    smtp: boolean;
    order_token_secret: boolean;
    owner_setup_code: boolean;
    firebase: boolean;
  };
  test_mode: boolean;
}
