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
  Store,
  Crown,
  Briefcase,
  X
} from 'lucide-react';
import { STORE_CONFIG } from '../data/products';
import UserProfileDropdown from './UserProfileDropdown';
import { canAccessAdmin, ROLES } from '../utils/rbac';

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
  currentCustomer,
  activeUser,
  currentView = 'store',
  onViewChange
}) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const catalogUrl = config?.whatsappCatalogUrl || "https://wa.me/c/254748094795";
  const groupLink = config?.whatsappGroupInvite || STORE_CONFIG.whatsappGroupInvite;

  const hasManagementAccess = canAccessAdmin(activeUser);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Department Menu, Brand Identity & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onOpenSidebar}
            title="All Departments & Comrade Filters"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
          >
            <Menu className="w-4 h-4 text-slate-800 dark:text-slate-200" />
            <span className="hidden sm:inline text-xs">All</span>
          </button>

          <div 
            onClick={() => (onViewChange ? onViewChange('store') : null)}
            className="flex items-center gap-2.5 cursor-pointer select-none"
            title="Mideva's Collection — Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-black text-white text-xs sm:text-sm shadow-xs flex-shrink-0">
              MC
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-tight">
                MIDEVA'S <span className="text-amber-600 dark:text-amber-400 font-extrabold">COLLECTION</span>
              </h1>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Quality Campus Store • Comrade Affordable
              </p>
            </div>
          </div>

          {/* User Profile Avatar with RBAC Role Badge — positioned prominently on the header */}
          <div className="ml-1 sm:ml-2">
            <UserProfileDropdown
              user={activeUser}
              onViewChange={onViewChange}
              onOpenAuth={onOpenAuth}
              onOpenCart={onOpenCart}
              currentView={currentView}
            />
          </div>
        </div>

        {/* Center: Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search campus fashion, bags, perfumes, snacks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-inner"
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

        {/* Right: High-Quality Communicating Icon Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            aria-label="Toggle mobile search"
            className="md:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* Currency Switcher Pill */}
          <button
            onClick={onToggleCurrency}
            title="Toggle Currency (USD / KSh / EcoCash)"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            <span className="text-amber-600 dark:text-amber-400 font-extrabold">
              {currency === 'EcoCash' ? '⚡' : currency}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {currency === '$' ? 'USD' : currency === 'KSh' ? 'KES' : 'EcoCash'}
            </span>
          </button>

          {/* Light / Dark Mode Toggle with smooth transitions */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Role-Aware View Switcher (Dashboard vs Storefront) */}
          {hasManagementAccess ? (
            currentView === 'admin' ? (
              <button
                type="button"
                onClick={() => (onViewChange ? onViewChange('store') : onOpenAdmin())}
                title="Return to Public Storefront"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => (onViewChange ? onViewChange('admin') : onOpenAdmin())}
                title={`Open ${activeUser?.role === ROLES.ADMIN ? 'Admin' : 'Seller'} Workspace`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition text-xs font-bold"
              >
                {activeUser?.role === ROLES.ADMIN ? (
                  <Crown className="w-3.5 h-3.5 text-purple-500" />
                ) : (
                  <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span className="hidden sm:inline">
                  {activeUser?.role === ROLES.ADMIN ? 'Admin' : 'Seller'}
                </span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              title="Hostel Delivery Pass & Student Profile"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
            >
              <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Pass</span>
            </button>
          )}

          {/* Cart / Quote Hero CTA Button */}
          <button
            onClick={onOpenCart}
            title="View Quote & Checkout"
            className="relative flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md transition"
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

      {/* Collapsible Mobile Search Row */}
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
