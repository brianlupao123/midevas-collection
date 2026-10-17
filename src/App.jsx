import React, { useState, useMemo, useRef, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryPills from './components/CategoryPills';
import ProductGrid from './components/ProductGrid';
import QuoteDrawer from './components/QuoteDrawer';
import WhatsAppFloat from './components/WhatsAppFloat';
import MobileBottomBar from './components/MobileBottomBar';
import ReviewsModal from './components/ReviewsModal';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import { getStoredProducts, STORE_CONFIG } from './data/products';
import { trackEvent } from './utils/analytics';

export default function App() {
  const [productsList, setProductsList] = useState(() => getStoredProducts());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [comradeDealsOnly, setComradeDealsOnly] = useState(false);
  const [currency, setCurrency] = useState('$');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Modals state
  const [reviewProduct, setReviewProduct] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const catalogRef = useRef(null);

  // Log page view on mount
  useEffect(() => {
    trackEvent('page_view', { path: window.location.pathname });
  }, []);

  // Track search query with debounce
  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      const timer = setTimeout(() => {
        trackEvent('search', { query: searchTerm.trim() });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Refresh products from storage
  const handleCatalogUpdated = () => {
    setProductsList(getStoredProducts());
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
      const next = prev === '$' ? 'KSh' : '$';
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 sm:pb-0">
      
      {/* Top Banner */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Hero Section */}
      <HeroBanner
        onExploreClick={scrollToCatalog}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Catalog Workspace */}
      <main ref={catalogRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Featured Collection &amp; Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse comrade-friendly fashion, scents, and everyday essentials ({filteredProducts.length} items available)
            </p>
          </div>
          <div className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 self-start sm:self-auto">
            <span>✨ Pay upon hostel drop-off</span>
          </div>
        </div>

        {/* Category & Sub-filters Tabs */}
        <CategoryPills
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          priceFilter={priceFilter}
          onSelectPriceFilter={setPriceFilter}
          comradeDealsOnly={comradeDealsOnly}
          onToggleComradeDeals={() => setComradeDealsOnly((prev) => !prev)}
          totalMatching={filteredProducts.length}
        />

        {/* Product Cards Grid */}
        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          currency={currency}
          onResetFilters={handleResetFilters}
          onOpenReviews={(prod) => setReviewProduct(prod)}
        />

      </main>

      {/* Quote / Order Slide-out Drawer */}
      <QuoteDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currency={currency}
      />

      {/* Floating WhatsApp Chat Assistant */}
      <WhatsAppFloat />

      {/* Sticky Mobile Bottom Bar for touch navigation */}
      <MobileBottomBar
        cartCount={totalCartCount}
        cartTotal={cartTotalUsd}
        currency={currency}
        onOpenCart={() => setIsCartOpen(true)}
        onExploreCatalog={scrollToCatalog}
      />

      {/* Customer Reviews Modal */}
      <ReviewsModal
        isOpen={!!reviewProduct}
        onClose={() => setReviewProduct(null)}
        product={reviewProduct}
      />

      {/* Store Admin & Orders Manager Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onCatalogUpdated={handleCatalogUpdated}
      />

      {/* Footer */}
      <Footer 
        onCategoryClick={(cat) => {
          setActiveCategory(cat);
          scrollToCatalog();
        }} 
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

    </div>
  );
}
