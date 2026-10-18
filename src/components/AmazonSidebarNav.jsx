import React from 'react';
import { 
  X, 
  Menu, 
  Tag, 
  Sparkles, 
  ShoppingBag, 
  Shirt, 
  Droplets, 
  Heart, 
  Coffee, 
  UtensilsCrossed, 
  BookOpen, 
  Package, 
  MessageCircle, 
  Users, 
  ChevronRight, 
  Lock, 
  ShieldCheck, 
  DollarSign, 
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { CATEGORIES, STORE_CONFIG } from '../data/products';

const CATEGORY_ICON_MAP = {
  all: Sparkles,
  fashion: Shirt,
  bags: ShoppingBag,
  beauty: Droplets,
  hygiene: Heart,
  snacks: Coffee,
  groceries: UtensilsCrossed,
  stationery: BookOpen,
  essentials: Package,
};

export default function AmazonSidebarNav({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  currency,
  onToggleCurrency,
  onOpenAdmin,
  comradeDealsOnly,
  onToggleComradeDeals,
  priceFilter,
  onSelectPriceFilter,
  config
}) {
  if (!isOpen) return null;

  const catalogUrl = config?.whatsappCatalogUrl || STORE_CONFIG.whatsappCatalogUrl || "https://wa.me/c/254748094795";
  const groupLink = config?.whatsappGroupInvite || STORE_CONFIG.whatsappGroupInvite;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-out drawer from left (Amazon style) */}
      <div className="fixed inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300">
        
        {/* Amazon-style Dark Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-black text-white text-base shadow-sm">
              MC
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Mideva's Collection</span>
              </h3>
              <p className="text-[11px] text-amber-400 font-medium">
                Campus Mall • Free Hostel Drop-Off
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
          
          {/* Section 1: Quick Currency Switcher */}
          <div className="p-4 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Currency Display</span>
              <span className="text-[11px] text-slate-500">
                Active: {currency === '$' ? 'USD ($)' : currency === 'KSh' ? 'Kenyan Shilling (KSh)' : 'EcoCash (USD / ZiG)'}
              </span>
            </div>
            <button
              onClick={onToggleCurrency}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition"
            >
              Switch ({currency})
            </button>
          </div>

          {/* Section 2: Comrade Deals & Quick Filters */}
          <div className="p-4 space-y-2">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Trending &amp; Comrade Filters
            </h4>
            
            <button
              onClick={() => {
                onToggleComradeDeals();
                onClose();
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition ${
                comradeDealsOnly 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-500" />
                <span>🔥 Comrade Deals Only</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Price Quick Filters */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: 'under-4', label: '< $4 Steals' },
                { id: 'under-5', label: '< $5 Deals' },
                { id: 'under-10', label: '< $10 Bags' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    onSelectPriceFilter(priceFilter === filter.id ? 'all' : filter.id);
                    onClose();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition text-center ${
                    priceFilter === filter.id
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Shop By Department (Categories) */}
          <div className="p-4 space-y-2">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Shop by Department
            </h4>

            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICON_MAP[cat.id] || Sparkles;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl font-semibold transition ${
                      isSelected
                        ? 'bg-amber-500 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: WhatsApp Hub & Direct Links */}
          <div className="p-4 space-y-2">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              WhatsApp &amp; Campus Community
            </h4>

            <a
              href={catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition font-bold"
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Mideva's WhatsApp Catalog</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            </a>

            <a
              href={groupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-600" />
                <span>Join Student Group (110+ members)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Section 5: Delivery & Security Info */}
          <div className="p-4 space-y-2 text-slate-600">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Delivery &amp; Payment
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <p className="flex items-center gap-1.5 font-medium text-slate-700">
                📍 <strong>Free Delivery:</strong> All campus student halls &amp; hostels
              </p>
              <p className="flex items-center gap-1.5 font-medium text-slate-700">
                ⚡ <strong>EcoCash Line:</strong> {config?.ecocashNumber || '0774809479'}
              </p>
              <p className="flex items-center gap-1.5 font-medium text-slate-700">
                📲 <strong>WhatsApp Order:</strong> +254 748 094795
              </p>
            </div>
          </div>

          {/* Section 6: Admin Management */}
          <div className="p-4">
            <button
              onClick={() => {
                onOpenAdmin();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 font-bold transition shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Mideva Store Admin Login</span>
            </button>
          </div>

        </div>

        {/* Footer in Drawer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400 font-semibold">
          Mideva's Collection © 2026 • Comrade Affordable
        </div>

      </div>
    </div>
  );
}
