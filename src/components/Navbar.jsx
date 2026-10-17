import React from 'react';
import { ShoppingBag, Search, Sparkles, MessageCircle, Heart, Lock } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

export default function Navbar({ cartCount, onOpenCart, searchTerm, onSearchChange, currency, onToggleCurrency, onOpenAdmin }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-accent-600 p-0.5 shadow-md flex-shrink-0">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-amber-600 text-lg tracking-tighter">
              MC
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                MIDEVA'S COLLECTION
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                For Him &amp; Her
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Great Quality Everyday • Comrade Affordable
            </p>
          </div>
        </div>

        {/* Search Bar - hidden on tiny screens, expanded in middle */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search shirts, bags, perfumes, essentials..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            title="Store Admin (Mideva Only)"
            className="p-2 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 text-slate-600 transition flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden xl:inline text-[11px]">Admin</span>
          </button>

          {/* Currency Switcher */}
          <button
            onClick={onToggleCurrency}
            title="Toggle Currency ($ USD / KSh)"
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1"
          >
            <span className="text-amber-600 font-extrabold">{currency}</span>
            <span className="text-[10px] text-slate-400">{currency === '$' ? 'USD' : 'KSh'}</span>
          </button>

          {/* Join WhatsApp Group button */}
          <a
            href={STORE_CONFIG.whatsappGroupInvite}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Join 110+ Group</span>
          </a>

          {/* Quote / Order Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-full shadow-md hover:shadow-lg transition transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Quote &amp; Order</span>
            <span className="sm:hidden">Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-black leading-none text-amber-900 bg-white rounded-full ml-0.5 shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar below header */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search shirts, bags, perfumes, essentials..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
        </div>
      </div>
    </header>
  );
}
