import React, { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { fetchCatalog, fetchHealth } from './lib/api';
import { Subject, Product, SiteSettings, FAQ, Review, HealthResponse } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AnnouncementBar } from './components/AnnouncementBar';
import { CartDrawer } from './components/CartDrawer';
import { TestModeBanner } from './components/TestModeBanner';
import { CookieBanner } from './components/CookieBanner';
import { InnerPageLayout } from './components/InnerPageLayout';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { SubjectsPage } from './pages/SubjectsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BundlesPage } from './pages/BundlesPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { TrackPage } from './pages/TrackPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PolicyPage } from './pages/PolicyPage';
import { PaymentPage } from './pages/PaymentPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { OfferPage } from './pages/OfferPage';
import { AuthPage } from './pages/AuthPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminSetupPage } from './admin/AdminSetupPage';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminOrders } from './admin/AdminOrders';
import { AdminProducts } from './admin/AdminProducts';
import { AdminInventory } from './admin/AdminInventory';
import { AdminSystemCheck } from './admin/AdminSystemCheck';
import { AdminCMS } from './admin/AdminCMS';
import { AdminStatusMappings } from './admin/AdminStatusMappings';
import { AdminWebhookLogs } from './admin/AdminWebhookLogs';
import { AdminLogisticsReports } from './admin/AdminLogisticsReports';
import { AdminNotificationsPage } from './admin/AdminNotificationsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#12A5B0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(pathname)}`} replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/auth?mode=verify" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  const [cart, setCart] = useState<{ slug: string; qty: number }[]>(() => {
    try {
      const saved = localStorage.getItem('pynotes_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pynotes_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Initial catalog load
  useEffect(() => {
    fetchCatalog()
      .then(res => {
        setSubjects(res.subjects || []);
        setProducts(res.products || []);
        setSettings(res.settings || null);
        setFaqs(res.faqs || []);
        setReviews(res.reviews || []);
      })
      .catch(err => console.error('Failed to load catalog:', err));

    fetchHealth()
      .then(h => setHealth(h))
      .catch(() => {});
  }, []);

  const handleAddToCart = (slug: string, qty: number = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.slug === slug);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].qty += qty;
        return updated;
      }
      return [...prev, { slug, qty }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (slug: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(slug);
      return;
    }
    setCart(prev => prev.map(item => (item.slug === slug ? { ...item, qty } : item)));
  };

  const handleRemoveCartItem = (slug: string) => {
    setCart(prev => prev.filter(item => item.slug !== slug));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Separate Admin Routes */}
        <Route path="/admin/setup" element={<AdminSetupPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="status-mappings" element={<AdminStatusMappings />} />
          <Route path="logistics-reports" element={<AdminLogisticsReports />} />
          <Route path="courier-webhooks" element={<AdminWebhookLogs />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="product-list" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="subjects" element={<AdminCMS section="subjects" />} />
          <Route path="coupons" element={<AdminCMS section="coupons" />} />
          <Route path="pricing" element={<AdminCMS section="pricing" />} />
          <Route path="content" element={<AdminCMS section="content" />} />
          <Route path="reviews" element={<AdminCMS section="reviews" />} />
          <Route path="pages" element={<AdminCMS section="pages" />} />
          <Route path="support" element={<AdminCMS section="support" />} />
          <Route path="reports" element={<AdminCMS section="reports" />} />
          <Route path="system-check" element={<AdminSystemCheck />} />
          <Route path="subscriptions" element={<AdminCMS section="subscriptions" />} />
          <Route path="cancellations" element={<AdminCMS section="cancellations" />} />
          <Route path="offers" element={<AdminCMS section="offers" />} />
          <Route path="settings" element={<AdminCMS section="settings" />} />
          <Route path="logo" element={<AdminCMS section="logo" />} />
          <Route path="hero-banners" element={<AdminCMS section="hero-banners" />} />
          <Route path="announcements" element={<AdminCMS section="announcements" />} />
          <Route path="instagram" element={<AdminCMS section="instagram" />} />
          <Route path="payments" element={<AdminCMS section="payments" />} />
          <Route path="payment-page" element={<AdminCMS section="payment-page" />} />
          <Route path="webhook-log" element={<AdminCMS section="webhook-log" />} />
          <Route path="users" element={<AdminCMS section="users" />} />
        </Route>

        {/* Public Storefront Routes */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#0B3561]">
              <TestModeBanner isTestMode={health?.test_mode} />
              
              {settings && (
                <AnnouncementBar messages={settings.announcement_messages || []} />
              )}

              <Header
                subjects={subjects}
                products={products}
                cartCount={totalCartCount}
                onOpenCart={() => setIsCartOpen(true)}
                customLogoUrl={settings?.custom_logo_url}
                whatsappNumber={settings?.whatsapp_number}
              />

              <main className="flex-1">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage
                        subjects={subjects}
                        products={products}
                        settings={settings!}
                        reviews={reviews}
                        faqs={faqs}
                        onAddToCart={handleAddToCart}
                      />
                    }
                  />
                  <Route element={<InnerPageLayout />}>
                    <Route
                      path="/subjects"
                      element={
                        <SubjectsPage
                          subjects={subjects}
                          products={products}
                          onAddToCart={handleAddToCart}
                        />
                      }
                    />
                    <Route
                      path="/product/:slug"
                      element={
                        <ProductDetailPage
                          products={products}
                          settings={settings!}
                          reviews={reviews}
                          faqs={faqs}
                          onAddToCart={handleAddToCart}
                        />
                      }
                    />
                    <Route
                      path="/bundles"
                      element={
                        <BundlesPage
                          products={products}
                          onAddToCart={handleAddToCart}
                        />
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage
                            cart={cart}
                            products={products}
                            onClearCart={() => setCart([])}
                            holdMinutes={settings?.hold_minutes}
                          />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/order/:orderNo/thank-you" element={<ThankYouPage />} />
                    <Route path="/track" element={<TrackPage />} />
                    <Route path="/pay" element={<PaymentPage settings={settings!} />} />
                     <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
                     <Route path="/offers" element={<OfferPage settings={settings!} />} />
                     <Route path="/auth" element={<AuthPage />} />
                     <Route path="/user-account" element={<AuthPage />} />
                     <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage settings={settings!} />} />
                    <Route path="/faq" element={<FaqPage faqs={faqs} />} />
                    <Route path="/policies/:slug" element={<PolicyPage />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer settings={settings!} />

              <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                products={products}
                onUpdateQty={handleUpdateCartQty}
                onRemoveItem={handleRemoveCartItem}
                freeShippingThresholdPaise={settings?.free_shipping_threshold_paise}
              />

              <CookieBanner ga4Id={settings?.ga4_id} metaPixelId={settings?.meta_pixel_id} />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
