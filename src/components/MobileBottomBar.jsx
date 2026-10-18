import React from 'react';
import { ShoppingBag, MessageCircle, GraduationCap } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';
import { formatPrice } from '../utils/storeConfig';

export default function MobileBottomBar({ 
  cartCount, 
  cartTotal, 
  currency, 
  onOpenCart, 
  onExploreCatalog, 
  config,
  onOpenAuth,
  currentCustomer 
}) {
  const displayTotal = formatPrice(cartTotal, currency, config);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-2xl px-3 py-2 sm:hidden flex items-center justify-between gap-2 transition-colors">
      
      {/* Comrade Student Pass button */}
      <button
        type="button"
        onClick={onOpenAuth}
        title={currentCustomer ? `Comrade Profile: ${currentCustomer.name}` : "Comrade Sign In & Delivery Pass"}
        className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold active:scale-95 transition flex-shrink-0"
      >
        <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-[11px] font-extrabold truncate max-w-[65px]">
          {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Sign In'}
        </span>
      </button>

      {/* Quick WhatsApp chat */}
      <a
        href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent("Hello Mideva! ❤️ I have an inquiry about items from your collection.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold active:scale-95 transition flex-shrink-0"
      >
        <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-[11px]">Chat</span>
      </a>

      {/* Cart & Quote drawer trigger */}
      <button
        onClick={onOpenCart}
        className="flex-1 flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 active:from-amber-600 active:to-amber-700 text-white shadow-md active:scale-98 transition"
      >
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-amber-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-xs font-extrabold tracking-tight">
            {cartCount === 0 ? 'Quote' : `Quote (${cartCount})`}
          </span>
        </div>

        <span className="text-[11px] font-black bg-amber-700/60 px-2 py-0.5 rounded-md">
          {displayTotal}
        </span>
      </button>
    </div>
  );
}
