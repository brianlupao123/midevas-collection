import React from 'react';
import { STORE_CONFIG } from '../data/products';
import { ShoppingBag, MessageCircle, Heart, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function Footer({ onCategoryClick }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-accent-600 flex items-center justify-center font-black text-white text-base">
                MC
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight">
                  MIDEVA'S COLLECTION
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {STORE_CONFIG.tagline}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              We sell comrade-affordable quality apparel, handbags, perfumes, and daily essentials for both ladies &amp; gentlemen. Serving students, hostels, and beyond with fast, friendly delivery.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={STORE_CONFIG.whatsappGroupInvite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold hover:bg-emerald-900 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Group (110+ Members)</span>
              </a>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onCategoryClick('mens')} className="hover:text-amber-400 transition">
                  👔 Men's Shirts &amp; T-Shirts (&lt; $8, &lt; $4)
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('ladies')} className="hover:text-amber-400 transition">
                  👜 Ladies' Handbags ($6 &amp; $10)
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('beauty')} className="hover:text-amber-400 transition">
                  🌸 Perfumes &amp; Hair Sprays (&lt; $5, &lt; $4)
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('basics')} className="hover:text-amber-400 transition">
                  🪥 Daily Campus Essentials &amp; Bottles
                </button>
              </li>
            </ul>
          </div>

          {/* How It Works & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Comrade Promise
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Fast hostel &amp; campus hall delivery</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Inspect items upon delivery before payment</span>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>M-Pesa, Cash, or Direct Mobile Transfer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Mideva's Collection. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Powered by modern catalog &amp; WhatsApp quote technology ❤️
          </p>
        </div>

      </div>
    </footer>
  );
}
