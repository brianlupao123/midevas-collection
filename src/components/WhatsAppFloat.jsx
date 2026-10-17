import React, { useState } from 'react';
import { MessageCircle, Users, X, Send } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

export default function WhatsAppFloat() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Popover options menu */}
      {showMenu && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 animate-fade-in text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-900">Mideva's Collection</span>
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Need help choosing sizes, want to request a quote, or ready to join our comrade fashion circle?
          </p>

          <div className="space-y-2 pt-1">
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent("Hello Mideva! ❤️ I'm checking out your collection and would like to ask a question.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Chat Directly with Mideva</span>
            </a>

            <a
              href={STORE_CONFIG.whatsappGroupInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Join WhatsApp Group (110+)</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all transform active:scale-95 group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs font-extrabold hidden sm:inline tracking-wide">
          WhatsApp Mideva
        </span>
      </button>
    </div>
  );
}
