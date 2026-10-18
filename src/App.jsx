import React, { useState, useMemo, useRef, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryPills from './components/CategoryPills';
import ProductGrid from './components/ProductGrid';
import QuoteDrawer from './components/QuoteDrawer';
import ChatWidget from './components/ChatWidget';
import MobileBottomBar from './components/MobileBottomBar';
import ReviewsModal from './components/ReviewsModal';
import AdminModal from './components/AdminModal';
import PaymentModal from './components/PaymentModal';
import FlyerGeneratorModal from './components/FlyerGeneratorModal';
import ProductDetailModal from './components/ProductDetailModal';
import AmazonSidebarNav from './components/AmazonSidebarNav';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';
import AuthModal from './components/AuthModal';
import { getStoredProducts } from './data/products';
import { getStoreConfig } from './utils/storeConfig';
import { trackEvent } from './utils/analytics';
import { initTheme, getStoredTheme, toggleTheme } from './utils/theme';
import { getCurrentCustomer } from './utils/customerAuth';
import { getActiveUser, setActiveUser, ROLES } from './utils/rbac';

export default function App() {
  const [productsList, setProductsList] = useState(() => getStoredProducts());
  const [storeConfig, setStoreConfig] = useState(() => getStoreConfig());
  const [theme, setTheme] = useState(() => getStoredTheme());
  const [activeUser, setActiveUserState] = useState(() => getActiveUser());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [comradeDealsOnly, setComradeDealsOnly] = useState(false);
  const [currency, setCurrency] = useState('$');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Modals state
  const [detailProduct, setDetailProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(() => getCurrentCustomer());
  const [installPrompt, setInstallPrompt] = useState(null);

  // Page View state ('store' | 'admin') synced with location hash
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'store';
  });

  const catalogRef = useRef(null);

  // Sync hash changes with currentView
  useEffect(() => {
    const handleHashSync = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '#store' || !window.location.hash) {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const handleNavigateView = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '#store';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Initialize theme and global event listeners
  useEffect(() => {
    initTheme();
    const handleThemeChange = (e) => setTheme(e.detail.theme);
    const handleCatalogUpdate = () => setProductsList(getStoredProducts());
    const handleCustomerUpdate = (e) => setCurrentCustomer(e.detail);
    const handleAuthUpdate = (e) => setActiveUserState(e.detail);

    window.addEventListener('midevas-theme-changed', handleThemeChange);
    window.addEventListener('midevas-catalog-updated', handleCatalogUpdate);
    window.addEventListener('midevas-customer-updated', handleCustomerUpdate);
    window.addEventListener('midevas-auth-updated', handleAuthUpdate);

    return () => {
      window.removeEventListener('midevas-theme-changed', handleThemeChange);
      window.removeEventListener('midevas-catalog-updated', handleCatalogUpdate);
      window.removeEventListener('midevas-customer-updated', handleCustomerUpdate);
      window.removeEventListener('midevas-auth-updated', handleAuthUpdate);
    };
  }, []);

  // Log page view on mount & check for product deep links
  useEffect(() => {
    trackEvent('page_view', { path: window.location.pathname });

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Deep link product view support
    try {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product');
      if (prodId) {
        const found = productsList.find((p) => p.id === prodId);
        if (found) setDetailProduct(found);
      }
    } catch (err) {
      // ignore
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    });
  };

  // Track search query with debounce
  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      const timer = setTimeout(() => {
        trackEvent('search', { query: searchTerm.trim() });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Refresh products & store settings from storage
  const handleCatalogUpdated = () => {
    setProductsList(getStoredProducts());
    setStoreConfig(getStoreConfig());
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedVariant === product.selectedVariant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, variant, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id, variant);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedVariant === variant
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (id, variant) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.selectedVariant === variant))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleCurrency = () => {
    setCurrency((prev) => {
      const next = prev === '$' ? 'KSh' : prev === 'KSh' ? 'EcoCash' : '$';
      trackEvent('currency_toggle', { to: next });
      return next;
    });
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setPriceFilter('all');
    setComradeDealsOnly(false);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    trackEvent('category_select', { categoryId: catId });
    scrollToCatalog();
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchBadge = item.badge?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchBadge) return false;
      }

      // Price filter
      if (priceFilter === 'under-4' && item.price >= 4.00) return false;
      if (priceFilter === 'under-5' && item.price >= 5.00) return false;
      if (priceFilter === 'under-10' && item.price > 10.00) return false;

      // Comrade deals only
      if (comradeDealsOnly && !item.isComradeDeal) return false;

      return true;
    });
  }, [productsList, activeCategory, searchTerm, priceFilter, comradeDealsOnly]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalUsd = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 sm:pb-0 transition-colors duration-200">
      
      {/* Top Banner with dynamic editable announcement - Full edge-to-edge */}
      <AnnouncementBar config={storeConfig} />

      {/* Main Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
        onOpenAdmin={() => handleNavigateView('admin')}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        config={storeConfig}
        onOpenFlyers={() => setIsFlyerOpen(true)}
        installPrompt={installPrompt}
        onInstallClick={handleInstallClick}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentCustomer={currentCustomer}
        activeUser={activeUser}
        currentView={currentView}
        onViewChange={handleNavigateView}
      />

      {/* Main Content: Integrated Admin Page View or Customer Storefront Workspace */}
      {currentView === 'admin' ? (
        <main className="flex-1 w-full px-2 sm:px-4 lg:px-6 py-6 space-y-6">
          <AdminModal
            isOpen={true}
            isPageView={true}
            activeUser={activeUser}
            onClose={() => handleNavigateView('store')}
            onCatalogUpdated={handleCatalogUpdated}
          />
        </main>
      ) : (
        <>
          {/* Hero Category Slides Carousel */}
          <HeroBanner
            onExploreClick={scrollToCatalog}
            onSelectCategory={handleCategorySelect}
            config={storeConfig}
          />

          {/* Main Catalog Workspace - Expansive Full-Width Layout */}
          <main ref={catalogRef} className="flex-1 w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Featured Collection &amp; Catalog
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Browse comrade-friendly fashion, scents, and everyday essentials ({filteredProducts.length} items available)
                </p>
              </div>
              <div className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 self-start sm:self-auto">
                <span>✨ Pay upon hostel drop-off</span>
              </div>
            </div>

            {/* Category & Sub-filters Tabs */}
            <CategoryPills
              activeCategory={activeCategory}
              onSelectCategory={(catId) => {
                setActiveCategory(catId);
                trackEvent('category_select', { categoryId: catId });
              }}
              priceFilter={priceFilter}
              onSelectPriceFilter={setPriceFilter}
              comradeDealsOnly={comradeDealsOnly}
              onToggleComradeDeals={() => setComradeDealsOnly((prev) => !prev)}
              totalMatching={filteredProducts.length}
            />

            {/* Product Cards Grid with Like hearts, Reviews and Quick View Detail */}
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              currency={currency}
              onResetFilters={handleResetFilters}
              onOpenReviews={(prod) => setReviewProduct(prod)}
              onOpenDetail={(prod) => setDetailProduct(prod)}
              config={storeConfig}
            />

          </main>
        </>
      )}

      {/* Quote / Order Slide-out Drawer */}
      <QuoteDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currency={currency}
        config={storeConfig}
        onOpenPayment={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      {/* Interactive Floating Chatbot Assistant */}
      <ChatWidget
        onAddToCart={handleAddToCart}
        onSelectCategory={handleCategorySelect}
        config={storeConfig}
      />

      {/* Sticky Mobile Bottom Bar for touch navigation */}
      <MobileBottomBar
        cartCount={totalCartCount}
        cartTotal={cartTotalUsd}
        currency={currency}
        onOpenCart={() => setIsCartOpen(true)}
        onExploreCatalog={scrollToCatalog}
        config={storeConfig}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentCustomer={currentCustomer}
      />

      {/* Express Payment & STK Push Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cartItems={cartItems}
        currency={currency}
        config={storeConfig}
        onClearCart={handleClearCart}
      />

      {/* Campus Marketing & WhatsApp Status Flyer Generator Modal */}
      <FlyerGeneratorModal
        isOpen={isFlyerOpen}
        onClose={() => setIsFlyerOpen(false)}
        config={storeConfig}
      />

      {/* Amazon-Style Department Sidebar Navigation */}
      <AmazonSidebarNav
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
        onOpenAdmin={() => handleNavigateView('admin')}
        comradeDealsOnly={comradeDealsOnly}
        onToggleComradeDeals={() => setComradeDealsOnly((prev) => !prev)}
        priceFilter={priceFilter}
        onSelectPriceFilter={setPriceFilter}
        config={storeConfig}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentCustomer={currentCustomer}
      />

      {/* Amazon-Style Product Detail & Comments Modal */}
      <ProductDetailModal
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        product={detailProduct}
        onAddToCart={handleAddToCart}
        currency={currency}
        config={storeConfig}
        allProducts={productsList}
        onSelectRelatedProduct={(rel) => setDetailProduct(rel)}
      />

      {/* Customer Reviews & Comments Modal */}
      <ReviewsModal
        isOpen={!!reviewProduct}
        onClose={() => setReviewProduct(null)}
        product={reviewProduct}
      />

      {/* Fallback popup Admin Modal if explicitly invoked while on store view */}
      {isAdminOpen && currentView !== 'admin' && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onCatalogUpdated={handleCatalogUpdated}
        />
      )}

      {/* Global Toast Alert Notifications */}
      <ToastNotification />

      {/* Comrade Student Auth & Delivery Pass Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Footer */}
      <Footer 
        onCategoryClick={handleCategorySelect} 
        onOpenAdmin={() => handleNavigateView('admin')}
      />

    </div>
  );
}
