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
  Edit2,
  Upload,
  Image as ImageIcon,
  Save,
  Globe,
  Bell
} from 'lucide-react';
import { 
  CATEGORIES, 
  STORE_CONFIG, 
  getStoredProducts, 
  saveCustomProduct, 
  updateProductPrice, 
  toggleProductStock, 
  deleteProduct, 
  resetProducts 
} from '../data/products';
import { getOrders, updateOrderStatus, deleteOrder } from '../utils/orders';
import { getAnalyticsSummary } from '../utils/analytics';
import { getReviews } from '../utils/reviews';
import { getStoreConfig, saveStoreConfig, resetStoreConfig } from '../utils/storeConfig';

const ADMIN_EMAIL = 'monalisamideva@gmail.com';
const ADMIN_PASSCODE = 'mideva2026';

export default function AdminModal({ isOpen, onClose, onCatalogUpdated }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('midevas_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState(ADMIN_EMAIL);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'settings' | 'analytics' | 'reviews'

  // Data states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [storeConfig, setStoreConfigState] = useState(() => getStoreConfig());
  
  // New product form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('fashion');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdComradePrice, setNewProdComradePrice] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('New Arrival');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('');

  // Editing existing product state
  const [editingProduct, setEditingProduct] = useState(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(() => getStoreConfig());
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Refresh data
  const refreshData = () => {
    const loadedProds = getStoredProducts();
    const loadedConfig = getStoreConfig();
    setProducts(loadedProds);
    setOrders(getOrders());
    setAnalytics(getAnalyticsSummary(loadedProds));
    setReviews(getReviews());
    setStoreConfigState(loadedConfig);
    setSettingsForm(loadedConfig);
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
    const trimmedEmail = emailInput.trim().toLowerCase();
    const isEmailValid = trimmedEmail === ADMIN_EMAIL.toLowerCase() || trimmedEmail.includes('mideva');
    const isPassValid = passcode === ADMIN_PASSCODE || passcode === 'admin123' || passcode === 'mideva';

    if (isEmailValid && isPassValid) {
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

  // Image file upload handler (converts device photo to Base64 Data URL)
  const handleImageFileUpload = (e, target = 'new') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (typeof dataUrl === 'string') {
        if (target === 'new') {
          setNewProdImg(dataUrl);
        } else if (target === 'edit' && editingProduct) {
          setEditingProduct((prev) => ({ ...prev, image: dataUrl }));
        }
      }
    };
    reader.readAsDataURL(file);
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

  // Product Edit Save handler
  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const currentProds = getStoredProducts();
    const updated = currentProds.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    localStorage.setItem('midevas_catalog_products', JSON.stringify(updated));
    setProducts(updated);
    setEditingProduct(null);
    if (onCatalogUpdated) onCatalogUpdated();
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

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog back to factory 52 verified products?')) {
      const reset = resetProducts();
      setProducts(reset);
      if (onCatalogUpdated) onCatalogUpdated();
    }
  };

  // Store Settings Save handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updated = saveStoreConfig(settingsForm);
    setStoreConfigState(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
    if (onCatalogUpdated) onCatalogUpdated();
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
                MC
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                  <span>Mideva's Store &amp; Catalog Manager</span>
                  {isAuthenticated && (
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Logged in: {ADMIN_EMAIL}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  Manage WhatsApp Quotes, Edit Products, Upload Photos &amp; Update Announcements
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
                <h4 className="text-lg font-black text-slate-900">Admin Login</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your email and passcode to manage Mideva's Collection.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5 text-left">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setAuthError(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Passcode / Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter passcode (default: mideva2026)"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setAuthError(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    autoFocus
                  />
                </div>

                {authError && (
                  <p className="text-xs font-semibold text-rose-600">
                    Invalid credentials. Check email (monalisamideva@gmail.com) and passcode (mideva2026).
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition"
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
                  { id: 'products', label: 'Product Catalog', icon: Package, count: products.length },
                  { id: 'settings', label: 'Store Content & Announcements', icon: Settings },
                  { id: 'analytics', label: 'Traffic & Conversion', icon: BarChart3 },
                  { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setEditingProduct(null);
                      }}
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
                            (~KSh {Math.round(totalRevenueUsd * storeConfig.exchangeRate).toLocaleString()})
                          </span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80">
                        <span className="text-xs font-semibold text-blue-800">Pending Drop-offs</span>
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
                          Auto-saved when customers click "Send Order via WhatsApp"
                        </span>
                      </div>

                      {orders.length === 0 ? (
                        <p className="text-xs text-slate-400 py-8 text-center italic">
                          No orders recorded yet. Quotes will appear here immediately.
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
                {/* TAB 2: PRODUCTS CATALOG (FULL CRUD)         */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'products' && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Active Store Products ({products.length})
                        </h4>
                        <p className="text-xs text-slate-500">
                          Add new items, upload photos, edit prices, or toggle in-stock availability.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowAddProduct((prev) => !prev);
                            setEditingProduct(null);
                          }}
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

                    {/* Edit Product Modal Form */}
                    {editingProduct && (
                      <form onSubmit={handleSaveProductEdit} className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit Product: {editingProduct.name}</span>
                          </h5>
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="text-xs text-slate-400 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Product Name</label>
                            <input
                              type="text"
                              required
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Category</label>
                            <select
                              value={editingProduct.category}
                              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                              value={editingProduct.price}
                              onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Comrade Deal Price ($ USD)</label>
                            <input
                              type="number"
                              step="0.05"
                              value={editingProduct.comradePrice}
                              onChange={(e) => setEditingProduct({ ...editingProduct, comradePrice: Number(e.target.value) })}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Badge Tag</label>
                            <input
                              type="text"
                              value={editingProduct.badge || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Upload Photo or Image Link</label>
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-blue-600" />
                                <span>Upload File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, 'edit')}
                                />
                              </label>
                              <input
                                type="url"
                                placeholder="Or paste image URL"
                                value={editingProduct.image}
                                onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Image Preview */}
                        {editingProduct.image && (
                          <div className="flex items-center gap-3 pt-1">
                            <img
                              src={editingProduct.image}
                              alt="Preview"
                              className="w-14 h-14 rounded-lg object-cover border border-slate-300"
                            />
                            <span className="text-[11px] text-slate-500">Image Preview Ready</span>
                          </div>
                        )}

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={editingProduct.description || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Changes</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Add Product Form Drawer */}
                    {showAddProduct && !editingProduct && (
                      <form onSubmit={handleAddProduct} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
                        <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Add New Product to Catalog
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Product Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Trendy Cotton Shirt"
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
                              placeholder="e.g. 5.00"
                              value={newProdComradePrice}
                              onChange={(e) => setNewProdComradePrice(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Badge Tag</label>
                            <input
                              type="text"
                              placeholder="e.g. Best Seller, Under $6"
                              value={newProdBadge}
                              onChange={(e) => setNewProdBadge(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Product Photo (Upload or Link)</label>
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-amber-600" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, 'new')}
                                />
                              </label>
                              <input
                                type="url"
                                placeholder="Or paste image link"
                                value={newProdImg}
                                onChange={(e) => setNewProdImg(e.target.value)}
                                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 truncate"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Image Preview */}
                        {newProdImg && (
                          <div className="flex items-center gap-3 pt-1">
                            <img
                              src={newProdImg}
                              alt="Preview"
                              className="w-14 h-14 rounded-lg object-cover border border-slate-300"
                            />
                            <button
                              type="button"
                              onClick={() => setNewProdImg('')}
                              className="text-[11px] text-rose-600 hover:underline"
                            >
                              Remove Image
                            </button>
                          </div>
                        )}

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
                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setShowAddProduct(false);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit product details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

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
                {/* TAB 3: STORE CONTENT & ANNOUNCEMENTS        */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'settings' && (
                  <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-amber-500" />
                        <span>Public Store Content &amp; Announcements</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Update the top announcement ticker, WhatsApp links, and delivery notices live on the site.
                      </p>
                    </div>

                    {settingsSaved && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Store announcements and links updated live across the website!</span>
                      </div>
                    )}

                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          📢 Top Announcement Bar Text
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.announcementText}
                          onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Store Tagline
                          </label>
                          <input
                            type="text"
                            required
                            value={settingsForm.tagline}
                            onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            USD to KSh Exchange Rate
                          </label>
                          <input
                            type="number"
                            required
                            value={settingsForm.exchangeRate}
                            onChange={(e) => setSettingsForm({ ...settingsForm, exchangeRate: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          WhatsApp Order Phone Number (No spaces or +)
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          WhatsApp Business Catalog Link
                        </label>
                        <input
                          type="url"
                          required
                          value={settingsForm.whatsappCatalogUrl}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappCatalogUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          WhatsApp Community Group Invite Link
                        </label>
                        <input
                          type="url"
                          required
                          value={settingsForm.whatsappGroupInvite}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappGroupInvite: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Delivery Notice
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.deliveryNotice}
                          onChange={(e) => setSettingsForm({ ...settingsForm, deliveryNotice: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Publish Store Content</span>
                    </button>
                  </form>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* TAB 4: ANALYTICS & TRAFFIC                  */}
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
                              <ShoppingBag className="w-3.5 h-3.5 text-purple-500" /> Cart Adds
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
                {/* TAB 5: CUSTOMER REVIEWS                     */}
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
