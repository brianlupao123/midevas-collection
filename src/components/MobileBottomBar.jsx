import React from 'react';
import { ShoppingBag, MessageCircle, Sparkles } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

export default function MobileBottomBar({ cartCount, cartTotal, currency, onOpenCart, onExploreCatalog }) {
  const displayTotal = currency === '$' 
    ? `$${cartTotal.toFixed(2)}`
    : `KSh ${Math.round(cartTotal * STORE_CONFIG.exchangeRate).toLocaleString()}`;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-2xl px-4 py-2.5 sm:hidden flex items-center justify-between gap-3">
      {/* Quick WhatsApp chat */}
      <a
        href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent("Hello Mideva! ❤️ I have an inquiry about items from your collection.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold active:scale-95 transition"
      >
        <MessageCircle className="w-4 h-4 text-emerald-600" />
        <span>Chat</span>
      </a>

      {/* Cart & Quote drawer trigger */}
      <button
        onClick={onOpenCart}
        className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 active:from-amber-600 active:to-amber-700 text-white shadow-md active:scale-98 transition"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-amber-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-xs font-extrabold tracking-tight">
            {cartCount === 0 ? 'Quote Cart' : `Quote (${cartCount})`}
          </span>
        </div>

        <span className="text-xs font-black bg-amber-700/50 px-2 py-0.5 rounded-md">
          {displayTotal}
        </span>
      </button>
    </div>
  );
}
