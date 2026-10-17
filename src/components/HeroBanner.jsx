import React from 'react';
import { Sparkles, MessageCircle, ShoppingBag, ShieldCheck, Zap, ArrowDown, Users } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

export default function HeroBanner({ onExploreClick, onOpenCart }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-white to-slate-50 border-b border-slate-200/60 py-10 sm:py-16">
      {/* Background ambient decorative blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-accent-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Official Digital Catalog for WhatsApp Group Members</span>
            <span className="text-amber-500">•</span>
            <span className="flex items-center gap-1 font-semibold text-amber-800">
              <Users className="w-3.5 h-3.5" /> 110+ Members
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Great Quality Everyday.{' '}
            <span className="block mt-1 bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 bg-clip-text text-transparent">
              Comrade Affordable Prices.
            </span>
          </h1>

          {/* Subtitle with exact items from WhatsApp group */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Affordable styles and daily essentials for both ladies &amp; gentlemen. Select your items, 
            build your quote, and send your order directly to Mideva via WhatsApp in one tap.
          </p>

          {/* Highlights Pills Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              👔 Men's Shirts &lt; $8
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              👕 T-Shirts &lt; $4
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              👜 Handbags $6 &amp; $10
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              🌸 Perfumes &lt; $5
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              🪥 Toothbrushes 3 for $1
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              🔥 Hot Water Bottles $4
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg hover:shadow-xl transition transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Explore Catalog &amp; Quote Items</span>
              <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            
            <a
              href={STORE_CONFIG.whatsappGroupInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>Join WhatsApp Group (110 Members)</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">Direct WhatsApp Orders</p>
                <p className="text-slate-500">Instant confirmation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">Verified Quality</p>
                <p className="text-slate-500">Pay upon hostel delivery</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">Comrade Pricing</p>
                <p className="text-slate-500">Student-friendly rates</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
