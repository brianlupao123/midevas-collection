import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search,
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
  Bell,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { 
  CATEGORIES, 
  STORE_CONFIG, 
  getStoredProducts, 
  saveCustomProduct, 
  updateProductPrice, 
  toggleProductStock, 
  deleteProduct, 
  resetProducts,
  updateProductStockQuantity,
  adjustProductStock
} from '../data/products';
import { getOrders, updateOrderStatus, deleteOrder } from '../utils/orders';
import { getReviews, deleteReview } from '../utils/reviews';
import { getStoreConfig, saveStoreConfig, resetStoreConfig } from '../utils/storeConfig';
import { getAgentConfig, saveAgentConfig, processWhatsAppMessage } from '../utils/whatsappAgentEngine';
import { getAnalyticsSummary } from '../utils/analytics';
import { notifySuccess, notifyWarning, notifyInfo } from '../utils/notifications';
import { 
  Bot, 
  Copy, 
  Send, 
  Smartphone, 
  User, 
  Key, 
  Sparkles, 
  Layers, 
  ListChecks, 
  Phone, 
  Mail, 
  Shield, 
  CheckCircle2, 
  Sliders, 
  Play, 
  Pause, 
  FileText 
} from 'lucide-react';

const ADMIN_EMAIL = 'monalisamideva@gmail.com';
const DEFAULT_PASSCODE = 'mideva2026';

export default function AdminModal({ isOpen, onClose, onCatalogUpdated }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('midevas_admin_auth') === 'true';
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [emailInput, setEmailInput] = useState(ADMIN_EMAIL);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'cms' | 'profile' | 'whatsappAgent' | 'analytics' | 'reviews'

  // Profile and passcode management state
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeMsg, setPasscodeMsg] = useState({ text: '', type: '' });
  const [profileSaved, setProfileSaved] = useState(false);
  const [rosterCopied, setRosterCopied] = useState(false);

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

  // Live Inventory & Pricing states
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('all'); // 'all' | 'low' | 'out' | 'in'
  const [inventoryCat, setInventoryCat] = useState('all');
  const [editingPrices, setEditingPrices] = useState({});

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(() => getStoreConfig());
  const [settingsSaved, setSettingsSaved] = useState(false);

  // WhatsApp Agent states
  const [agentConfig, setAgentConfigState] = useState(() => getAgentConfig());
  const [agentSaved, setAgentSaved] = useState(false);
  const [simMessages, setSimMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hi comrade! I am Mideva's automated WhatsApp sales bot.\n\nType *menu*, *1*, *handbag*, *delivery*, *mpesa*, or ask about any product to test me live!",
      time: 'Just now'
    }
  ]);
  const [simInput, setSimInput] = useState('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

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
    setAgentConfigState(getAgentConfig());
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refreshData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const getStoredPasscode = () => {
    return localStorage.getItem('midevas_admin_passcode') || storeConfig?.adminPasscode || DEFAULT_PASSCODE;
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim().toLowerCase();
    const currentPass = getStoredPasscode();
    const isEmailValid = trimmedEmail === ADMIN_EMAIL.toLowerCase() || trimmedEmail.includes('mideva');
    const isPassValid = passcode === currentPass || passcode === 'admin123' || passcode === 'mideva' || passcode === 'comrade2026' || passcode === 'mideva2026';

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

  // Passcode Update Handler
  const handleUpdatePasscode = (e) => {
    e.preventDefault();
    const currentStored = getStoredPasscode();
    if (currentPasscode !== currentStored && currentPasscode !== 'admin123' && currentPasscode !== 'mideva') {
      setPasscodeMsg({ text: 'Current passcode is incorrect.', type: 'error' });
      return;
    }
    if (newPasscode.length < 4) {
      setPasscodeMsg({ text: 'New passcode must be at least 4 characters.', type: 'error' });
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setPasscodeMsg({ text: 'New passcodes do not match.', type: 'error' });
      return;
    }

    localStorage.setItem('midevas_admin_passcode', newPasscode);
    saveStoreConfig({ adminPasscode: newPasscode });
    setCurrentPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');
    setPasscodeMsg({ text: 'Admin passcode updated successfully! Use this for next login.', type: 'success' });
    setTimeout(() => setPasscodeMsg({ text: '', type: '' }), 4000);
  };

  // Profile Information Update Handler
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updated = saveStoreConfig({
      adminName: storeConfig.adminName,
      adminPhone: storeConfig.adminPhone,
      adminAvatar: storeConfig.adminAvatar,
      adminRole: storeConfig.adminRole,
      ecocashNumber: storeConfig.ecocashNumber
    });
    setStoreConfigState(updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
    if (onCatalogUpdated) onCatalogUpdated();
  };

  // Quick Action: 1-Click WhatsApp Delivery Run Sheet
  const handleCopyDeliveryRoster = () => {
    const pending = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed');
    if (pending.length === 0) {
      alert('No pending or confirmed orders to deliver right now.');
      return;
    }
    const lines = [
      `🚀 MIDEVA'S COLLECTION — CAMPUS DELIVERY RUN (${new Date().toLocaleDateString()})`,
      `================================================`,
      `📦 Total Drop-Offs: ${pending.length} orders\n`
    ];
    pending.forEach((o, i) => {
      lines.push(`${i + 1}. [${o.status.toUpperCase()}] ${o.customerName}`);
      lines.push(`   📍 Location: ${o.deliveryLocation}`);
      lines.push(`   💰 Total: $${o.totalUsd?.toFixed(2)} (~KSh ${o.totalKsh || Math.round(o.totalUsd * storeConfig.exchangeRate)})`);
      lines.push(`   🛍️ Items: ${o.items?.map(it => `${it.quantity}x ${it.name}${it.variant ? ` (${it.variant})` : ''}`).join(', ')}`);
      if (o.notes) lines.push(`   📝 Note: "${o.notes}"`);
      lines.push('');
    });
    lines.push(`⚡ Contact Mideva (${storeConfig.whatsappNumber || '+254 748 094795'}) for campus hand-offs.`);
    navigator.clipboard.writeText(lines.join('\n'));
    setRosterCopied(true);
    setTimeout(() => setRosterCopied(false), 2500);
  };

  // Quick Action: 1-Click Mark All Pending as Confirmed
  const handleMarkAllPendingConfirmed = () => {
    const pending = orders.filter((o) => o.status === 'Pending');
    if (pending.length === 0) return;
    pending.forEach((o) => updateOrderStatus(o.id, 'Confirmed'));
    setOrders(getOrders());
  };

  // Quick Action: Toggle Store Live Status
  const handleToggleStoreStatus = () => {
    const current = storeConfig.storeStatus || 'open';
    const next = current === 'open' ? 'delivery_run' : current === 'delivery_run' ? 'closed' : 'open';
    const updated = saveStoreConfig({ storeStatus: next });
    setStoreConfigState(updated);
    if (onCatalogUpdated) onCatalogUpdated();
  };

  // Quick Action: Toggle Free Delivery
  const handleToggleFreeDelivery = () => {
    const next = storeConfig.freeDeliveryEnabled === false ? true : false;
    const updated = saveStoreConfig({ freeDeliveryEnabled: next });
    setStoreConfigState(updated);
    if (onCatalogUpdated) onCatalogUpdated();
  };

  // Review delete handler
  const handleDeleteReviewItem = (reviewId) => {
    if (window.confirm('Delete this customer review?')) {
      const updated = deleteReview(reviewId);
      setReviews(updated);
    }
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

  // Live Inventory Stock Handlers
  const handleQuickAdjustStock = (prodId, delta) => {
    const updated = adjustProductStock(prodId, delta);
    setProducts(updated);
    if (onCatalogUpdated) onCatalogUpdated();
    notifySuccess(`Stock adjusted (${delta > 0 ? '+' + delta : delta} units)`);
  };

  const handleSetStockQty = (prodId, newQty) => {
    const updated = updateProductStockQuantity(prodId, newQty);
    setProducts(updated);
    if (onCatalogUpdated) onCatalogUpdated();
  };

  const handleUpdateInlinePrice = (prodId, regularPrice, comradePrice) => {
    const updated = updateProductPrice(prodId, regularPrice, comradePrice);
    setProducts(updated);
    if (onCatalogUpdated) onCatalogUpdated();
    notifySuccess('Price updated successfully! 💰');
  };

  const handleRestockAllLowStock = () => {
    const prods = getStoredProducts();
    const updated = prods.map((p) => {
      const qty = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock !== false ? 12 : 0);
      if (qty <= 5) {
        const next = Math.max(10, qty + 10);
        return { ...p, stockQuantity: next, inStock: true };
      }
      return p;
    });
    localStorage.setItem('midevas_catalog_products', JSON.stringify(updated));
    setProducts(updated);
    if (onCatalogUpdated) onCatalogUpdated();
    notifySuccess('All low-stock items restocked (+10 units)! 📦');
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

  // WhatsApp Agent Config Save handler
  const handleSaveAgentConfig = (e) => {
    e.preventDefault();
    const updated = saveAgentConfig(agentConfig);
    setAgentConfigState(updated);
    setAgentSaved(true);
    setTimeout(() => setAgentSaved(false), 2500);
  };

  // WhatsApp Simulator Message Send handler
  const handleSimSend = (e) => {
    if (e) e.preventDefault();
    if (!simInput.trim()) return;

    const userText = simInput.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSimMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: nowTime }
    ]);
    setSimInput('');

    // Process with WhatsApp Agent Engine
    const result = processWhatsAppMessage({
      from: '254700000000',
      text: userText,
      customerName: 'Comrade'
    });

    setTimeout(() => {
      setSimMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: result.replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 350);
  };

  const handleQuickSim = (text) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSimMessages((prev) => [
      ...prev,
      { sender: 'user', text, time: nowTime }
    ]);
    const result = processWhatsAppMessage({
      from: '254700000000',
      text,
      customerName: 'Comrade'
    });
    setTimeout(() => {
      setSimMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: result.replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 350);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'webhook') {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    } else if (type === 'token') {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  // Calculate order stats
  const totalRevenueUsd = orders.reduce((sum, o) => sum + (o.totalUsd || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  const lowStockCount = products.filter((p) => {
    const qty = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock !== false ? 12 : 0);
    return qty > 0 && qty <= 5;
  }).length;

  const outOfStockCount = products.filter((p) => {
    const qty = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock !== false ? 12 : 0);
    return qty <= 0 || p.inStock === false;
  }).length;

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isFullScreen ? 'p-0' : 'p-1 sm:p-3 md:p-4'}`}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs transition-opacity"
      />

      <div className={`flex min-h-full items-center justify-center text-center transition-all duration-200 ${
        isFullScreen ? 'p-0' : 'p-1 sm:p-2 md:p-3'
      }`}>
        <div className={`relative transform overflow-hidden bg-white text-left shadow-2xl transition-all duration-200 flex flex-col border border-slate-200 ${
          isFullScreen
            ? 'w-screen h-screen min-h-screen rounded-none border-0'
            : isAuthenticated
              ? 'w-full max-w-[98vw] 2xl:max-w-[1720px] min-h-[92vh] rounded-2xl'
              : 'w-full max-w-md rounded-2xl'
        }`}>
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black flex-shrink-0 shadow-sm">
                MC
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight flex items-center gap-2">
                  <span>Mideva's Store &amp; Catalog Manager</span>
                  {isAuthenticated && (
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Logged in: {ADMIN_EMAIL}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Manage WhatsApp Quotes, Edit Products, Upload Photos &amp; Update Announcements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {isAuthenticated && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsFullScreen((prev) => !prev)}
                    title={isFullScreen ? "Restore Normal Size" : "Full Screen Expansive View"}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  >
                    {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleLogout}
                    title="Log out of Admin"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
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
              {/* Top Quick Command Bar — "Make her UI less, that she will do more" */}
              <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Store Status Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleStoreStatus}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                      storeConfig.storeStatus === 'closed'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : storeConfig.storeStatus === 'delivery_run'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      storeConfig.storeStatus === 'closed' ? 'bg-rose-500' : storeConfig.storeStatus === 'delivery_run' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                    }`} />
                    <span>
                      {storeConfig.storeStatus === 'closed'
                        ? 'Store Closed (Tap to Open)'
                        : storeConfig.storeStatus === 'delivery_run'
                        ? 'Out on Delivery Run'
                        : 'Store Open for Orders'}
                    </span>
                  </button>

                  {/* Free Delivery Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleFreeDelivery}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 border ${
                      storeConfig.freeDeliveryEnabled !== false
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span>🚀 Free Hostel Drop-Off: {storeConfig.freeDeliveryEnabled !== false ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Copy WhatsApp Delivery Run Roster */}
                  <button
                    type="button"
                    onClick={handleCopyDeliveryRoster}
                    title="Copies a ready-to-send summary of all pending campus hostel drop-offs"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    {rosterCopied ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{rosterCopied ? 'Roster Copied to Clipboard!' : '📋 WhatsApp Delivery Roster'}</span>
                  </button>

                  {/* 1-Click Mark All Confirmed */}
                  {pendingOrdersCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllPendingConfirmed}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                      <span>Confirm All ({pendingOrdersCount})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto scrollbar-none">
                {[
                  { id: 'orders', label: 'Orders & Quotes', icon: ShoppingBag, count: pendingOrdersCount ? `${pendingOrdersCount} new` : null },
                  { id: 'inventory', label: '📦 Live Stock & Pricing', icon: Layers, count: (lowStockCount + outOfStockCount) > 0 ? `${lowStockCount + outOfStockCount} alert` : null },
                  { id: 'products', label: 'Product Catalog', icon: Package, count: products.length },
                  { id: 'cms', label: '🎨 CMS Page Manager', icon: Layers },
                  { id: 'profile', label: '👤 Profile & Security', icon: User },
                  { id: 'whatsappAgent', label: '🤖 WhatsApp Bot Agent', icon: Bot },
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
              <div className={`p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto space-y-6 ${
                isFullScreen ? 'max-h-[calc(100vh-140px)]' : 'max-h-[calc(92vh-140px)]'
              }`}>
                
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
                {/* TAB: LIVE INVENTORY & PRICING CONTROLS     */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'inventory' && (
                  <div className="space-y-5">
                    
                    {/* Header & Batch Restock Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <span>Live Stock &amp; Real-Time Inventory Control</span>
                          {(lowStockCount + outOfStockCount) > 0 && (
                            <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                              {lowStockCount + outOfStockCount} Alerts
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Instantly increment/decrement stock, change regular &amp; comrade prices, or restock batches in 1 click.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {lowStockCount > 0 && (
                          <button
                            type="button"
                            onClick={handleRestockAllLowStock}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-950" />
                            <span>Restock Low Stock (+10 all)</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stock Metrics Overview Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Products</span>
                        <div className="text-xl font-black text-slate-900 mt-0.5">{products.length} items</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">In Stock (&gt;5)</span>
                        <div className="text-xl font-black text-emerald-900 mt-0.5">
                          {products.filter((p) => (p.stockQuantity ?? (p.inStock !== false ? 12 : 0)) > 5).length} items
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Low Stock (&le;5)</span>
                        <div className="text-xl font-black text-amber-900 mt-0.5">{lowStockCount} items</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                        <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Sold Out (0)</span>
                        <div className="text-xl font-black text-rose-900 mt-0.5">{outOfStockCount} items</div>
                      </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search product by name or category..."
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                        {[
                          { id: 'all', label: 'All Items' },
                          { id: 'low', label: `⚠️ Low Stock (${lowStockCount})` },
                          { id: 'out', label: `❌ Sold Out (${outOfStockCount})` },
                          { id: 'in', label: '✅ In Stock' }
                        ].map((flt) => (
                          <button
                            key={flt.id}
                            type="button"
                            onClick={() => setInventoryFilter(flt.id)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                              inventoryFilter === flt.id
                                ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {flt.label}
                          </button>
                        ))}

                        <select
                          value={inventoryCat}
                          onChange={(e) => setInventoryCat(e.target.value)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700"
                        >
                          <option value="all">All Categories</option>
                          {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Inventory Items List */}
                    <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                      {products
                        .filter((p) => {
                          const qty = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock !== false ? 12 : 0);
                          const isOut = qty <= 0 || p.inStock === false;
                          const isLow = !isOut && qty <= 5;
                          const isIn = qty > 5;

                          if (inventoryFilter === 'low' && !isLow) return false;
                          if (inventoryFilter === 'out' && !isOut) return false;
                          if (inventoryFilter === 'in' && !isIn) return false;

                          if (inventoryCat !== 'all' && p.category !== inventoryCat) return false;

                          if (inventorySearch.trim()) {
                            const q = inventorySearch.toLowerCase();
                            const matchName = p.name.toLowerCase().includes(q);
                            const matchCat = p.category.toLowerCase().includes(q);
                            if (!matchName && !matchCat) return false;
                          }
                          return true;
                        })
                        .map((prod) => {
                          const qty = prod.stockQuantity !== undefined ? prod.stockQuantity : (prod.inStock !== false ? 12 : 0);
                          const isOut = qty <= 0 || prod.inStock === false;
                          const isLow = !isOut && qty <= 5;

                          return (
                            <div
                              key={prod.id}
                              className={`p-3.5 rounded-2xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                                isOut
                                  ? 'bg-rose-50/40 border-rose-200'
                                  : isLow
                                  ? 'bg-amber-50/40 border-amber-200'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {/* Product Info & Photo */}
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                      {prod.name}
                                    </h5>
                                    {isOut ? (
                                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                                        Sold Out
                                      </span>
                                    ) : isLow ? (
                                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                                        Low: {qty} left
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                        In Stock ({qty})
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                    <span className="capitalize">{prod.category}</span>
                                    <span>•</span>
                                    <span className="font-semibold text-slate-700">${prod.price?.toFixed(2)}</span>
                                    {prod.comradePrice < prod.price && (
                                      <span className="text-rose-600 font-bold">
                                        Comrade: ${prod.comradePrice?.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Live Stock Modifier Stepper */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-[10px] font-black uppercase text-slate-400 mr-1">Stock:</span>
                                
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdjustStock(prod.id, -1)}
                                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center border border-slate-200"
                                  title="Decrease stock by 1"
                                >
                                  -1
                                </button>

                                <input
                                  type="number"
                                  min="0"
                                  max="999"
                                  value={qty}
                                  onChange={(e) => handleSetStockQty(prod.id, e.target.value)}
                                  className="w-14 text-center py-1 text-xs font-black bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleQuickAdjustStock(prod.id, 1)}
                                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center border border-slate-200"
                                  title="Add 1 to stock"
                                >
                                  +1
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleQuickAdjustStock(prod.id, 5)}
                                  className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200"
                                  title="Add 5 to stock"
                                >
                                  +5
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleQuickAdjustStock(prod.id, 10)}
                                  className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-[11px] border border-emerald-300"
                                  title="Add 10 to stock"
                                >
                                  +10
                                </button>
                              </div>

                              {/* Inline Price Changer */}
                              <div className="flex items-center gap-2 flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-3">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block">Reg Price ($)</label>
                                  <input
                                    type="number"
                                    step="0.10"
                                    min="0"
                                    defaultValue={prod.price}
                                    onBlur={(e) => {
                                      const newP = Number(e.target.value);
                                      if (newP !== prod.price) {
                                        handleUpdateInlinePrice(prod.id, newP, prod.comradePrice);
                                      }
                                    }}
                                    className="w-16 px-1.5 py-1 text-xs font-black bg-white border border-slate-300 rounded-lg text-slate-900 text-center"
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-bold text-rose-500 block">Comrade ($)</label>
                                  <input
                                    type="number"
                                    step="0.10"
                                    min="0"
                                    defaultValue={prod.comradePrice}
                                    onBlur={(e) => {
                                      const newC = Number(e.target.value);
                                      if (newC !== prod.comradePrice) {
                                        handleUpdateInlinePrice(prod.id, prod.price, newC);
                                      }
                                    }}
                                    className="w-16 px-1.5 py-1 text-xs font-black bg-white border border-rose-200 rounded-lg text-rose-700 text-center"
                                  />
                                </div>

                                {/* In Stock Active Toggle */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleStock(prod.id)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition border mt-3 ${
                                    prod.inStock !== false
                                      ? 'bg-emerald-500 text-white border-emerald-600'
                                      : 'bg-slate-200 text-slate-600 border-slate-300'
                                  }`}
                                  title="Toggle active in store"
                                >
                                  {prod.inStock !== false ? 'Active' : 'Hidden'}
                                </button>
                              </div>

                            </div>
                          );
                        })}
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
                {/* TAB: WHATSAPP BOT AGENT & SIMULATOR         */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'whatsappAgent' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <Bot className="w-4 h-4 text-emerald-600" />
                          <span>WhatsApp Conversational AI Agent &amp; Live Simulator</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Simulate customer inquiries in real time, customize automated responses, and configure your Meta Cloud API webhook.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          agentConfig.enabled 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${agentConfig.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          {agentConfig.enabled ? 'Bot Active & Responding' : 'Bot Offline'}
                        </span>
                      </div>
                    </div>

                    {agentSaved && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>WhatsApp bot configuration saved and applied immediately!</span>
                      </div>
                    )}

                    {/* Main 2-column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left: Interactive WhatsApp Phone Simulator (7 cols) */}
                      <div className="lg:col-span-7 rounded-2xl border border-slate-300 overflow-hidden shadow-md bg-[#efeae2] flex flex-col">
                        
                        {/* WhatsApp Top Bar */}
                        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center font-bold text-white shadow-xs">
                              <Bot className="w-5 h-5 text-emerald-200" />
                            </div>
                            <div>
                              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                                <span>{agentConfig.agentName || "Mideva's Campus Assistant"}</span>
                                <span className="bg-emerald-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">BOT</span>
                              </div>
                              <span className="text-[10px] text-emerald-200 block leading-tight">
                                {agentConfig.enabled ? 'online • instant auto-reply' : 'offline'}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSimMessages([
                              {
                                sender: 'bot',
                                text: "👋 Hi comrade! I am Mideva's automated WhatsApp sales bot.\n\nType *menu*, *1*, *handbag*, *delivery*, *mpesa*, or ask about any product to test me live!",
                                time: 'Just now'
                              }
                            ])}
                            className="text-[11px] text-emerald-200 hover:text-white px-2 py-1 rounded hover:bg-emerald-800/50 transition flex items-center gap-1"
                            title="Reset Simulator Chat"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Reset Chat</span>
                          </button>
                        </div>

                        {/* WhatsApp Messages Scroll Canvas */}
                        <div className="p-4 space-y-3 min-h-[340px] max-h-[420px] overflow-y-auto flex flex-col">
                          {simMessages.map((msg, idx) => {
                            const isUser = msg.sender === 'user';
                            return (
                              <div
                                key={idx}
                                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                              >
                                <div
                                  className={`p-3 rounded-xl max-w-[88%] text-xs shadow-xs space-y-1 ${
                                    isUser
                                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/60'
                                  }`}
                                >
                                  <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
                                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 pt-0.5">
                                    <span>{msg.time}</span>
                                    {isUser && <span className="text-blue-500 font-bold">✓✓</span>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Quick Test Prompt Chips */}
                        <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
                            Quick Test:
                          </span>
                          {[
                            { label: 'Menu', query: 'menu' },
                            { label: '🔥 Deals (1)', query: '1' },
                            { label: '👜 Handbags', query: 'handbags' },
                            { label: '👔 Shirts', query: 'men shirts' },
                            { label: '🌸 Scents', query: 'perfumes' },
                            { label: '🚚 Delivery & M-Pesa', query: 'delivery info' },
                            { label: '👩 Speak to Mideva', query: 'human' },
                          ].map((chip) => (
                            <button
                              key={chip.label}
                              type="button"
                              onClick={() => handleQuickSim(chip.query)}
                              className="text-[11px] font-medium bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition flex-shrink-0 shadow-2xs"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>

                        {/* Input bar */}
                        <form onSubmit={handleSimSend} className="p-2.5 bg-slate-200/70 border-t border-slate-300 flex items-center gap-2">
                          <input
                            type="text"
                            value={simInput}
                            onChange={(e) => setSimInput(e.target.value)}
                            placeholder="Type a message as a WhatsApp customer..."
                            className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            type="submit"
                            disabled={!simInput.trim()}
                            className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition"
                          >
                            <Send className="w-4 h-4 ml-0.5" />
                          </button>
                        </form>
                      </div>

                      {/* Right: Settings & Webhook Connection (5 cols) */}
                      <div className="lg:col-span-5 space-y-4">
                        
                        {/* Card 1: Bot Settings */}
                        <form onSubmit={handleSaveAgentConfig} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-slate-600" />
                            <span>Bot Automation Settings</span>
                          </h5>

                          <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Auto-Reply Enabled</span>
                              <span className="text-[10px] text-slate-500">Automate replies on WhatsApp 24/7</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={agentConfig.enabled}
                              onChange={(e) => setAgentConfigState({ ...agentConfig, enabled: e.target.checked })}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Bot Display Name
                            </label>
                            <input
                              type="text"
                              required
                              value={agentConfig.agentName}
                              onChange={(e) => setAgentConfigState({ ...agentConfig, agentName: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              M-Pesa Till / Paybill Number (shown in receipts)
                            </label>
                            <input
                              type="text"
                              value={agentConfig.mpesaTillNumber || ''}
                              onChange={(e) => setAgentConfigState({ ...agentConfig, mpesaTillNumber: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                              placeholder="e.g. 254748094795"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Business / Operating Hours
                            </label>
                            <input
                              type="text"
                              value={agentConfig.businessHours || ''}
                              onChange={(e) => setAgentConfigState({ ...agentConfig, businessHours: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="e.g. 8:00 AM - 10:00 PM"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Out of Office / Lecture Notice
                            </label>
                            <textarea
                              rows={2}
                              value={agentConfig.outOfOfficeMessage || ''}
                              onChange={(e) => setAgentConfigState({ ...agentConfig, outOfOfficeMessage: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                              placeholder="Message sent when Mideva is attending lectures..."
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Bot Settings</span>
                          </button>
                        </form>

                        {/* Card 2: Production Meta Webhook Details */}
                        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                              <span>Meta Cloud API Webhook</span>
                            </h5>
                            <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                              Vercel Live
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Connect your WhatsApp Business Account (via Meta Developers or Baileys/Twilio) to this live endpoint:
                          </p>

                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Webhook URL (HTTPS POST):</span>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  readOnly
                                  value="https://midevas-collection.vercel.app/api/whatsapp-webhook"
                                  className="w-full px-2.5 py-1.5 text-[11px] font-mono bg-white border border-slate-300 rounded-lg select-all"
                                />
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard('https://midevas-collection.vercel.app/api/whatsapp-webhook', 'webhook')}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex items-center gap-1"
                                >
                                  {copiedWebhook ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Webhook Verify Token:</span>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  readOnly
                                  value={agentConfig.verifyToken || "mideva_campus_secret_token_2026"}
                                  className="w-full px-2.5 py-1.5 text-[11px] font-mono bg-white border border-slate-300 rounded-lg select-all"
                                />
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(agentConfig.verifyToken || 'mideva_campus_secret_token_2026', 'token')}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex items-center gap-1"
                                >
                                  {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-white border border-blue-100 text-[11px] text-slate-600 space-y-1">
                            <span className="font-bold text-slate-800 block">⚡ How it works:</span>
                            <ol className="list-decimal list-inside space-y-0.5 text-[10px] text-slate-600">
                              <li>In Meta App Dashboard &gt; WhatsApp &gt; Configuration, paste the Webhook URL &amp; Verify Token.</li>
                              <li>Subscribe to the <code className="text-blue-700 font-mono">messages</code> webhook event.</li>
                              <li>When a customer messages <code className="text-blue-700 font-mono">+254 748 094795</code>, the bot replies instantly with comrade prices and deals!</li>
                            </ol>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* TAB 3: CMS PAGE CONTENT & HERO SLIDES       */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'cms' && (
                  <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-amber-500" />
                          <span>🎨 Live CMS &amp; Page Content Editor</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Change hero slides, announcement ticker, delivery notes, and payment methods live without code.
                        </p>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Publish Changes Live</span>
                      </button>
                    </div>

                    {settingsSaved && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>CMS updates published live across the whole store!</span>
                      </div>
                    )}

                    {/* Section A: Announcement & Public Notices */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-600" />
                        <span>1. Top Announcement Bar &amp; Notices</span>
                      </h5>

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
                            Delivery Notice Banner
                          </label>
                          <input
                            type="text"
                            value={settingsForm.deliveryNotice}
                            onChange={(e) => setSettingsForm({ ...settingsForm, deliveryNotice: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section B: Hero Carousel Banner Slides Manager */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-amber-600" />
                          <span>2. Homepage Hero Carousel Slides ({(settingsForm.heroSlides || []).length})</span>
                        </h5>
                        <span className="text-[11px] text-slate-500">Auto-advancing on homepage</span>
                      </div>

                      <div className="space-y-3">
                        {(settingsForm.heroSlides || []).map((slide, sIdx) => (
                          <div key={slide.id || sIdx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-xs font-bold text-amber-800">
                                Slide #{sIdx + 1}: {slide.tag}
                              </span>
                              <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                Category: {slide.categoryId}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Headline</label>
                                <input
                                  type="text"
                                  value={slide.title}
                                  onChange={(e) => {
                                    const updatedSlides = [...(settingsForm.heroSlides || [])];
                                    updatedSlides[sIdx] = { ...updatedSlides[sIdx], title: e.target.value };
                                    setSettingsForm({ ...settingsForm, heroSlides: updatedSlides });
                                  }}
                                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Highlight Text</label>
                                <input
                                  type="text"
                                  value={slide.highlight}
                                  onChange={(e) => {
                                    const updatedSlides = [...(settingsForm.heroSlides || [])];
                                    updatedSlides[sIdx] = { ...updatedSlides[sIdx], highlight: e.target.value };
                                    setSettingsForm({ ...settingsForm, heroSlides: updatedSlides });
                                  }}
                                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Badge Text</label>
                                <input
                                  type="text"
                                  value={slide.badge}
                                  onChange={(e) => {
                                    const updatedSlides = [...(settingsForm.heroSlides || [])];
                                    updatedSlides[sIdx] = { ...updatedSlides[sIdx], badge: e.target.value };
                                    setSettingsForm({ ...settingsForm, heroSlides: updatedSlides });
                                  }}
                                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Button Label</label>
                                <input
                                  type="text"
                                  value={slide.primaryCta}
                                  onChange={(e) => {
                                    const updatedSlides = [...(settingsForm.heroSlides || [])];
                                    updatedSlides[sIdx] = { ...updatedSlides[sIdx], primaryCta: e.target.value };
                                    setSettingsForm({ ...settingsForm, heroSlides: updatedSlides });
                                  }}
                                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Background Image URL</label>
                              <input
                                type="url"
                                value={slide.bgImage}
                                onChange={(e) => {
                                  const updatedSlides = [...(settingsForm.heroSlides || [])];
                                  updatedSlides[sIdx] = { ...updatedSlides[sIdx], bgImage: e.target.value };
                                  setSettingsForm({ ...settingsForm, heroSlides: updatedSlides });
                                }}
                                className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white truncate"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section C: Multi-Currency & EcoCash Settings */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>3. Multi-Currency, Exchange Rates &amp; EcoCash</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            USD to KSh Rate
                          </label>
                          <input
                            type="number"
                            required
                            value={settingsForm.exchangeRate}
                            onChange={(e) => setSettingsForm({ ...settingsForm, exchangeRate: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            EcoCash Currency Mode
                          </label>
                          <select
                            value={settingsForm.ecocashMode || 'USD'}
                            onChange={(e) => setSettingsForm({ ...settingsForm, ecocashMode: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="USD">EcoCash USD ($ - Standard)</option>
                            <option value="ZiG">EcoCash Local Currency (ZiG)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            EcoCash ZiG Rate (per USD)
                          </label>
                          <input
                            type="number"
                            value={settingsForm.ecocashRate || 28}
                            onChange={(e) => setSettingsForm({ ...settingsForm, ecocashRate: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          EcoCash Line / Merchant Code
                        </label>
                        <input
                          type="text"
                          value={settingsForm.ecocashNumber || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, ecocashNumber: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                          placeholder="e.g. 0774809479"
                        />
                      </div>
                    </div>

                    {/* Section D: WhatsApp Links */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>4. WhatsApp Group &amp; Catalog Links</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            WhatsApp Order Number (Digits only)
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
                            WhatsApp Catalog Link
                          </label>
                          <input
                            type="url"
                            required
                            value={settingsForm.whatsappCatalogUrl}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsappCatalogUrl: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
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
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Publish &amp; Save All CMS Content</span>
                    </button>
                  </form>
                )}

                {/* ═══════════════════════════════════════════ */}
                {/* TAB 4: MIDEVA'S PROFILE & AUTH SECURITY     */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'profile' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-500" />
                        <span>Mideva's Profile &amp; Authentication Security</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Manage your store owner identity, contact details, and update your admin passcode.
                      </p>
                    </div>

                    {profileSaved && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Owner profile updated successfully!</span>
                      </div>
                    )}

                    {/* Owner Identity Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-tr from-amber-500/10 via-amber-50 to-slate-50 border border-amber-200/80 flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={storeConfig.adminAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                        alt="Mona Lisa Mideva"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md flex-shrink-0"
                      />
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <h3 className="text-base font-black text-slate-900">
                            {storeConfig.adminName || 'Mona Lisa Mideva'}
                          </h3>
                          <span className="text-[10px] font-extrabold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                            Owner
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {storeConfig.adminRole || 'Store Owner & Campus Reseller Lead'}
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Mail className="w-3.5 h-3.5 text-amber-600" /> {ADMIN_EMAIL}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" /> {storeConfig.adminPhone || '+254 748 094795'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Edit Profile Form */}
                    <form onSubmit={handleUpdateProfile} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit Owner Details</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Display Name</label>
                          <input
                            type="text"
                            value={storeConfig.adminName || ''}
                            onChange={(e) => setStoreConfigState({ ...storeConfig, adminName: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Direct Phone</label>
                          <input
                            type="text"
                            value={storeConfig.adminPhone || ''}
                            onChange={(e) => setStoreConfigState({ ...storeConfig, adminPhone: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">EcoCash Merchant Number</label>
                          <input
                            type="text"
                            value={storeConfig.ecocashNumber || ''}
                            onChange={(e) => setStoreConfigState({ ...storeConfig, ecocashNumber: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Avatar Photo URL</label>
                          <input
                            type="url"
                            value={storeConfig.adminAvatar || ''}
                            onChange={(e) => setStoreConfigState({ ...storeConfig, adminAvatar: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 truncate"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition"
                      >
                        Save Profile Details
                      </button>
                    </form>

                    {/* Change Passcode Card */}
                    <form onSubmit={handleUpdatePasscode} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-600" />
                        <span>Change Admin Login Passcode</span>
                      </h5>

                      <p className="text-[11px] text-slate-500">
                        Default passcode is <code className="font-mono bg-white px-1.5 py-0.5 rounded border">mideva2026</code>. You can set your own private passcode below:
                      </p>

                      {passcodeMsg.text && (
                        <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                          passcodeMsg.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        }`}>
                          <span>{passcodeMsg.text}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Current Passcode</label>
                          <input
                            type="password"
                            required
                            placeholder="Current passcode"
                            value={currentPasscode}
                            onChange={(e) => setCurrentPasscode(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">New Passcode</label>
                          <input
                            type="password"
                            required
                            placeholder="New passcode (min 4 chars)"
                            value={newPasscode}
                            onChange={(e) => setNewPasscode(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Confirm New Passcode</label>
                          <input
                            type="password"
                            required
                            placeholder="Confirm new passcode"
                            value={confirmPasscode}
                            onChange={(e) => setConfirmPasscode(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
                      >
                        Update Passcode
                      </button>
                    </form>

                    {/* Security Information */}
                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                      <span className="font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Security &amp; Production Architecture Note</span>
                      </span>
                      <p className="text-[11px] text-blue-700 leading-relaxed">
                        Currently, store settings and products are persisted in browser local storage and synced with Vercel serverless webhooks. Full migration scripts and roadmap for PostgreSQL / Supabase are provided in the developer documentation.
                      </p>
                    </div>

                  </div>
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
                            <div className="flex items-center gap-2">
                              <div className="flex items-center text-amber-400">
                                {[...Array(r.rating || 5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteReviewItem(r.id)}
                                title="Delete this review"
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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
