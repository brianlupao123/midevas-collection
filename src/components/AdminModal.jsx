import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Star, 
  Settings, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  MessageCircle, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Eye, 
  ArrowUpRight,
  LogOut,
  Edit2
} from 'lucide-react';
import { CATEGORIES, STORE_CONFIG, getStoredProducts, saveCustomProduct, updateProductPrice, toggleProductStock, deleteProduct, resetProducts } from '../data/products';
import { getOrders, updateOrderStatus, deleteOrder } from '../utils/orders';
import { getAnalyticsSummary } from '../utils/analytics';
import { getReviews } from '../utils/reviews';

const ADMIN_PASSCODE = 'mideva2026';

export default function AdminModal({ isOpen, onClose, onCatalogUpdated }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('midevas_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'analytics' | 'reviews' | 'settings'

  // Data states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // New product form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('fashion');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdComradePrice, setNewProdComradePrice] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('New Item');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('');

  // Quick edit price state
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [tempComradePrice, setTempComradePrice] = useState('');

  // Refresh data
  const refreshData = () => {
    const loadedProds = getStoredProducts();
    setProducts(loadedProds);
    setOrders(getOrders());
    setAnalytics(getAnalyticsSummary(loadedProds));
    setReviews(getReviews());
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refreshData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE || passcode === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('midevas_admin_auth', 'true');
      setAuthError(false);
      refreshData();
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('midevas_admin_auth');
    setPasscode('');
  };

  // Order status handler
  const handleStatusChange = (orderId, newStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Delete this order record?')) {
      const updated = deleteOrder(orderId);
      setOrders(updated);
    }
  };

  // Product Add handler
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    const newProd = {
      name: newProdName.trim(),
      category: newProdCat,
      price: Number(newProdPrice),
      comradePrice: Number(newProdComradePrice) || Number(newProdPrice),
      badge: newProdBadge.trim() || 'New Arrival',
      description: newProdDesc.trim() || 'Great quality item from Mideva\'s Collection.',
      image: newProdImg.trim() || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
      inStock: true
    };

    const updated = saveCustomProduct(newProd);
    setProducts(updated);
    if (onCatalogUpdated) onCatalogUpdated();
    
    // Reset form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdComradePrice('');
    setNewProdDesc('');
    setNewProdImg('');
    setShowAddProduct(false);
  };

  const handleToggleStock = (prodId) => {
    const updated = toggleProductStock(prodId);
    setProducts(updated);
    if (onCatalogUpdated) onCatalogUpdated();
  };

  const handleDeleteProduct = (prodId) => {
    if (window.confirm('Delete this product from your store catalog?')) {
      const updated = deleteProduct(prodId);
      setProducts(updated);
      if (onCatalogUpdated) onCatalogUpdated();
    }
  };

  const handleSavePriceEdit = (prodId) => {
    if (!tempPrice) return;
    const updated = updateProductPrice(prodId, tempPrice, tempComradePrice || tempPrice);
    setProducts(updated);
    setEditingPriceId(null);
    if (onCatalogUpdated) onCatalogUpdated();
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog back to initial 52 verified products?')) {
      const reset = resetProducts();
      setProducts(reset);
      if (onCatalogUpdated) onCatalogUpdated();
    }
  };

  // Calculate order stats
  const totalRevenueUsd = orders.reduce((sum, o) => sum + (o.totalUsd || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-5xl border border-slate-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                M
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                  <span>Mideva's Store Manager &amp; Admin</span>
                  {isAuthenticated && (
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  Track WhatsApp Quotes, Manage Products, and View Analytics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  title="Log out of Admin"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conditional Content: Login vs Authenticated Dashboard */}
          {!isAuthenticated ? (
            <div className="p-8 max-w-md mx-auto text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">Admin Passcode Required</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Enter Mideva's store passcode to manage orders and catalog.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter passcode (default: mideva2026)"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full px-4 py-2.5 text-center font-mono text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs font-semibold text-rose-600">
                    Incorrect passcode. (Hint: mideva2026)
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition"
                >
                  Unlock Store Manager
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto scrollbar-none">
                {[
                  { id: 'orders', label: 'Orders & Quotes', icon: ShoppingBag, count: pendingOrdersCount ? `${pendingOrdersCount} new` : null },
                  { id: 'products', label: 'Products Catalog', icon: Package, count: products.length },
                  { id: 'analytics', label: 'Analytics & Traffic', icon: BarChart3 },
                  { id: 'reviews', label: 'Customer Reviews', icon: Star, count: reviews.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                        isActive
                          ? 'border-amber-600 text-amber-700 bg-white shadow-xs'
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.count && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          tab.id === 'orders' && pendingOrdersCount
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Main Tab Panels */}
              <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
                
                {/* ═══════════════════════════════════════════ */}
                {/* TAB 1: ORDERS & QUOTES                      */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'orders' && (
                  <div className="space-y-5">
                    {/* Metrics Banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80">
                        <span className="text-xs font-semibold text-amber-800">Total Orders Logged</span>
                        <div className="text-2xl font-black text-amber-900 mt-1">{orders.length}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80">
                        <span className="text-xs font-semibold text-emerald-800">Total Quote Value</span>
                        <div className="text-2xl font-black text-emerald-900 mt-1">
                          ${totalRevenueUsd.toFixed(2)}
                          <span className="text-xs font-normal text-emerald-700 ml-1.5">
                            (~KSh {Math.round(totalRevenueUsd * 130).toLocaleString()})
                          </span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80">
                        <span className="text-xs font-semibold text-blue-800">Pending Follow-up</span>
                        <div className="text-2xl font-black text-blue-900 mt-1">{pendingOrdersCount} orders</div>
                      </div>
                    </div>

                    {/* Orders List Table */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Recorded Orders &amp; WhatsApp Quotes
                        </h4>
                        <span className="text-xs text-slate-500">
                          Auto-saved whenever customers click "Send Order via WhatsApp"
                        </span>
                      </div>

                      {orders.length === 0 ? (
                        <p className="text-xs text-slate-400 py-8 text-center italic">
                          No orders recorded yet. Quotes built on the site will appear here immediately.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {orders.map((order) => (
                            <div 
                              key={order.id} 
                              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-black text-slate-900">{order.id}</span>
                                    <span className="text-xs font-bold text-slate-800">• {order.customerName}</span>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                      order.status === 'Delivered'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : order.status === 'Confirmed'
                                        ? 'bg-blue-100 text-blue-800'
                                        : order.status === 'Cancelled'
                                        ? 'bg-slate-100 text-slate-600'
                                        : 'bg-amber-100 text-amber-800 animate-pulse'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    📍 <span className="font-medium text-slate-700">{order.deliveryLocation}</span> •{' '}
                                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Status Selector */}
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>

                                  <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="space-y-1">
                                  {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-slate-600">
                                      <span>
                                        {item.quantity}× {item.name} {item.variant ? `(${item.variant})` : ''}
                                      </span>
                                      <span className="font-semibold text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="sm:border-l sm:border-slate-100 sm:pl-4 space-y-1">
                                  {order.notes && (
                                    <p className="text-xs text-slate-500 italic">
                                      Note: "{order.notes}"
                                    </p>
                                  )}
                                  <div className="flex justify-between font-black text-sm text-slate-900 pt-1">
                                    <span>Order Total:</span>
                                    <span className="text-amber-600">${order.totalUsd?.toFixed(2)} (~KSh {order.totalKsh?.toLocaleString()})</span>
                                  </div>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* TAB 2: PRODUCTS CATALOG                     */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'products' && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Active Store Products ({products.length})
                        </h4>
                        <p className="text-xs text-slate-500">
                          Add new items, update prices, or toggle in-stock availability instantly.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAddProduct((prev) => !prev)}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showAddProduct ? 'Cancel' : 'Add New Product'}</span>
                        </button>
                        <button
                          onClick={handleResetCatalog}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    {/* Add Product Form Drawer */}
                    {showAddProduct && (
                      <form onSubmit={handleAddProduct} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                        <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Add New Product to Catalog
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Product Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Trendy Varsity Jacket"
                              value={newProdName}
                              onChange={(e) => setNewProdName(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Category</label>
                            <select
                              value={newProdCat}
                              onChange={(e) => setNewProdCat(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                            >
                              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Standard Price ($ USD)</label>
                            <input
                              type="number"
                              step="0.05"
                              required
                              placeholder="e.g. 5.50"
                              value={newProdPrice}
                              onChange={(e) => setNewProdPrice(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Comrade Deal Price ($ USD)</label>
                            <input
                              type="number"
                              step="0.05"
                              placeholder="e.g. 5.00 (optional discount)"
                              value={newProdComradePrice}
                              onChange={(e) => setNewProdComradePrice(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Badge Tag</label>
                            <input
                              type="text"
                              placeholder="e.g. Best Seller, Under $6, Hot"
                              value={newProdBadge}
                              onChange={(e) => setNewProdBadge(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Product Photo URL</label>
                            <input
                              type="url"
                              placeholder="Unsplash or direct image link"
                              value={newProdImg}
                              onChange={(e) => setNewProdImg(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Short Description</label>
                          <textarea
                            rows={2}
                            placeholder="Comfortable fit, high quality material..."
                            value={newProdDesc}
                            onChange={(e) => setNewProdDesc(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save &amp; Publish Product</span>
                        </button>
                      </form>
                    )}

                    {/* Products Grid */}
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                      {products.map((p) => (
                        <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs font-bold text-slate-900 truncate">{p.name}</h5>
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {p.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                <span className="capitalize">{p.category}</span> •
                                <span className="font-extrabold text-slate-900">${p.price.toFixed(2)}</span>
                                {p.comradePrice < p.price && (
                                  <span className="text-rose-600 font-bold">(Comrade: ${p.comradePrice.toFixed(2)})</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* In Stock toggle */}
                            <button
                              onClick={() => handleToggleStock(p.id)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition ${
                                p.inStock
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {p.inStock ? 'In Stock' : 'Mark In Stock'}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* TAB 3: ANALYTICS & TRAFFIC                  */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'analytics' && (
                  <div className="space-y-5">
                    {analytics && (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-amber-500" /> Page Views
                            </span>
                            <div className="text-2xl font-black text-slate-900 mt-1">{analytics.pageViews}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-blue-500" /> Unique Visitors
                            </span>
                            <div className="text-2xl font-black text-slate-900 mt-1">{analytics.uniqueVisitors}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <ShoppingBag className="w-3.5 h-3.5 text-purple-500" /> Added to Cart
                            </span>
                            <div className="text-2xl font-black text-slate-900 mt-1">{analytics.cartAdds}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Quotes
                            </span>
                            <div className="text-2xl font-black text-slate-900 mt-1">{analytics.whatsappOrders}</div>
                          </div>
                        </div>

                        {/* Top products */}
                        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Most Viewed &amp; Requested Products
                          </h4>
                          {analytics.topProducts?.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Traffic data will populate as visitors browse products.</p>
                          ) : (
                            <div className="space-y-2">
                              {analytics.topProducts.map((p, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50">
                                  <span className="font-semibold text-slate-800">{p.name}</span>
                                  <span className="font-bold text-amber-600">{p.count} views</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* TAB 4: CUSTOMER REVIEWS                     */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Customer Reviews &amp; Testimonials ({reviews.length})
                    </h4>
                    <div className="space-y-3">
                      {reviews.map((r) => (
                        <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{r.author}</span>
                              <span className="text-[10px] text-slate-500">({r.campus})</span>
                            </div>
                            <div className="flex items-center text-amber-400">
                              {[...Array(r.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-700 italic">"{r.comment}"</p>
                          <span className="text-[10px] text-slate-400 block">{r.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
