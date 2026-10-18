import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  MessageCircle, 
  Lock, 
  Smartphone, 
  Menu, 
  Sun, 
  Moon, 
  User, 
  GraduationCap,
  X
} from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  searchTerm, 
  onSearchChange, 
  currency, 
  onToggleCurrency, 
  onOpenAdmin, 
  onOpenSidebar,
  config,
  onOpenFlyers,
  installPrompt,
  onInstallClick,
  theme = 'light',
  onToggleTheme,
  onOpenAuth,
  currentCustomer
}) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const catalogUrl = config?.whatsappCatalogUrl || "https://wa.me/c/254748094795";
  const groupLink = config?.whatsappGroupInvite || STORE_CONFIG.whatsappGroupInvite;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Department Menu & Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            title="All Departments & Comrade Filters"
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
          >
            <Menu className="w-4 h-4 text-slate-800 dark:text-slate-200" />
            <span className="hidden sm:inline text-xs">All</span>
          </button>

          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-sm flex-shrink-0">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center font-black text-amber-600 dark:text-amber-400 text-xs sm:text-base tracking-tighter">
              MC
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-xs sm:text-base text-slate-900 dark:text-white tracking-tight leading-tight">
                MIDEVA'S <span className="hidden xs:inline">COLLECTION</span>
              </h1>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded">
                For Him &amp; Her
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Great Quality Everyday • Comrade Affordable
            </p>
          </div>
        </div>

        {/* Center: Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search shirts, bags, perfumes, snacks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-8 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 dark:bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions & Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Mobile Search Toggle Icon */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            aria-label="Toggle mobile search"
            className="md:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
          >
            {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Comrade Sign-in / Profile Button */}
          <button
            type="button"
            onClick={onOpenAuth}
            title={currentCustomer ? `Comrade Profile: ${currentCustomer.name}` : "Comrade Sign In & Delivery Pass"}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1"
          >
            <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden lg:inline">
              {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            title="Store Admin (Mideva Only)"
            className="p-1.5 sm:px-2 sm:py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 transition flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden xl:inline text-[11px]">Admin</span>
          </button>

          {/* Currency Switcher */}
          <button
            onClick={onToggleCurrency}
            title="Toggle Currency (USD / KSh / EcoCash)"
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition flex items-center gap-1"
          >
            <span className="text-amber-600 dark:text-amber-400 font-extrabold">{currency === 'EcoCash' ? '⚡' : currency}</span>
            <span className="hidden sm:inline text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              {currency === '$' ? 'USD' : currency === 'KSh' ? 'KSh' : 'EcoCash'}
            </span>
          </button>

          {/* Cart / Order Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Quote</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-black text-amber-950 bg-white rounded-full shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Collapsible Mobile Search Row (Only shown when user taps the search icon!) */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-3 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 animate-fade-in">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search shirts, bags, perfumes, snacks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
