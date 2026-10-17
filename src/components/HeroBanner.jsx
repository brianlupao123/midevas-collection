import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MessageCircle, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  ArrowDown, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Tag
} from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

const SLIDES = [
  {
    id: 1,
    tag: "Men's Wear & Streetwear",
    tagColor: "bg-blue-100 text-blue-900 border-blue-300",
    title: "Great Quality Everyday.",
    highlight: "Comrade Affordable Styles for Him.",
    description: "Breathable cotton button-up shirts (< $8), heavyweight graphic streetwear tees (< $4), and textured casual polos built for campus life.",
    primaryCta: "Explore Men's Wear",
    categoryId: "fashion",
    bgGradient: "from-blue-900/80 via-slate-900/90 to-slate-950",
    bgImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=80",
    badge: "Shirts < $8 • Tees < $4"
  },
  {
    id: 2,
    tag: "Ladies' Luxury Bags",
    tagColor: "bg-rose-100 text-rose-900 border-rose-300",
    title: "Elegance That Fits Your Budget.",
    highlight: "Chic Quilted Slings & Executive Totes.",
    description: "Spacious PU leather executive handbags with gold clasps ($10) & compact diamond-quilted chain slings ($6). Perfect for lectures and church.",
    primaryCta: "Shop Handbags ($6 & $10)",
    categoryId: "bags",
    bgGradient: "from-rose-950/80 via-slate-900/90 to-slate-950",
    bgImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=80",
    badge: "Steal $6 • Premium $10"
  },
  {
    id: 3,
    tag: "Perfumes & Beauty",
    tagColor: "bg-amber-100 text-amber-900 border-amber-300",
    title: "24-Hour Scent Projection.",
    highlight: "Concentrated Pocket Perfumes Under $5.",
    description: "Pure oil-based pocket perfumes (35ml) in Vanilla Sweet & Royal Oud, gentleman woody EDP, and hydrating hair & body mists (< $4).",
    primaryCta: "Discover Scents (< $5)",
    categoryId: "beauty",
    bgGradient: "from-amber-950/80 via-slate-900/90 to-slate-950",
    bgImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80",
    badge: "All Scents Under $5"
  },
  {
    id: 4,
    tag: "Tuckshop & Study Fuel",
    tagColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    title: "Campus Study Essentials.",
    highlight: "Mazoe Orange, Popcorn, Biscuits & Essentials.",
    description: "Ice-cold Coca-Cola, Mazoe Orange concentrate (makes 20+ glasses), fresh salted maputi buckets (50¢), 2-quire notebooks, and plush hot water bottles ($4).",
    primaryCta: "Browse Study Fuel",
    categoryId: "snacks",
    bgGradient: "from-emerald-950/80 via-slate-900/90 to-slate-950",
    bgImage: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1600&q=80",
    badge: "Snacks from 25¢ - 50¢"
  }
];

export default function HeroBanner({ onExploreClick, onSelectCategory, config }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];
  const groupInvite = config?.whatsappGroupInvite || STORE_CONFIG.whatsappGroupInvite;
  const catalogUrl = config?.whatsappCatalogUrl || "https://wa.me/c/254748094795";

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const handleSlideCta = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    if (onExploreClick) onExploreClick();
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white min-h-[460px] sm:min-h-[520px] flex items-center transition-all duration-700">
      
      {/* Background Image with Dynamic Fade */}
      <div className="absolute inset-0 z-0">
        <img
          key={slide.id}
          src={slide.bgImage}
          alt={slide.tag}
          className="w-full h-full object-cover object-center transform scale-105 animate-fade-in transition-all duration-1000 opacity-35"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-95`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="max-w-3xl space-y-5">
          
          {/* Top Pill / Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${slide.tagColor}`}>
              <Tag className="w-3 h-3" />
              <span>{slide.tag}</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-300 font-semibold bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-full">
              <Users className="w-3.5 h-3.5" /> 110+ Comrades on WhatsApp
            </span>

            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
              {slide.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            {slide.title}{' '}
            <span className="block mt-1 bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
              {slide.highlight}
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {slide.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleSlideCta(slide.categoryId)}
              className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-amber-500/20 transition transform active:scale-95 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span>{slide.primaryCta}</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {/* WhatsApp Catalog Direct Link */}
            <a
              href={catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>WhatsApp Catalog</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
            </a>

            {/* Group Invite Link */}
            <a
              href={groupInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex px-4 py-3 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition items-center gap-1.5"
            >
              <span>Join Group</span>
            </a>
          </div>

          {/* Micro Trust Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Pay on Hostel Delivery (M-Pesa / Cash)</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Before Paying</span>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-white flex items-center justify-center transition backdrop-blur-xs"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-white flex items-center justify-center transition backdrop-blur-xs"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Carousel Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
