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
  Tag, 
  Star, 
  Truck 
} from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

const SLIDES = [
  {
    id: 1,
    tag: "Men's Wear & Streetwear",
    tagColor: "bg-blue-500/20 text-blue-200 border-blue-400/40",
    title: "Great Quality Everyday.",
    highlight: "Comrade Affordable Styles for Him.",
    description: "Breathable cotton button-up shirts (< $8), heavyweight graphic streetwear tees (< $4), and textured casual polos built for campus life.",
    primaryCta: "Explore Men's Wear",
    categoryId: "fashion",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1400&q=80",
    badge: "Shirts < $8 • Tees < $4",
    priceTag: "From $3.50",
    rating: "4.9 ★ (84 reviews)",
    secondaryPill: "Pure Breathable Cotton"
  },
  {
    id: 2,
    tag: "Ladies' Luxury Bags",
    tagColor: "bg-rose-500/20 text-rose-200 border-rose-400/40",
    title: "Elegance That Fits Your Budget.",
    highlight: "Chic Quilted Slings & Executive Totes.",
    description: "Spacious PU leather executive handbags with gold clasps ($10) & compact diamond-quilted chain slings ($6). Perfect for lectures and church.",
    primaryCta: "Shop Handbags ($6 & $10)",
    categoryId: "bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=80",
    badge: "Steal $6 • Premium $10",
    priceTag: "Steal $6 • Premium $10",
    rating: "5.0 ★ (112 reviews)",
    secondaryPill: "Gold Clasps & Chains"
  },
  {
    id: 3,
    tag: "Perfumes & Beauty",
    tagColor: "bg-amber-500/20 text-amber-200 border-amber-400/40",
    title: "24-Hour Scent Projection.",
    highlight: "Concentrated Pocket Perfumes Under $5.",
    description: "Pure oil-based pocket perfumes (35ml) in Vanilla Sweet & Royal Oud, gentleman woody EDP, and hydrating hair & body mists (< $4).",
    primaryCta: "Discover Scents (< $5)",
    categoryId: "beauty",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80",
    badge: "All Scents Under $5",
    priceTag: "Only $3.00 - $4.50",
    rating: "4.8 ★ (96 reviews)",
    secondaryPill: "Long-Lasting Oil Scent"
  },
  {
    id: 4,
    tag: "Tuckshop & Study Fuel",
    tagColor: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
    title: "Campus Study Essentials.",
    highlight: "Mazoe Orange, Popcorn & Tuckshop.",
    description: "Ice-cold Coca-Cola, Mazoe Orange concentrate (makes 20+ glasses), fresh salted maputi buckets (50¢), 2-quire notebooks, and plush hot water bottles ($4).",
    primaryCta: "Browse Study Fuel",
    categoryId: "snacks",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1400&q=80",
    badge: "Snacks from 25¢ - 50¢",
    priceTag: "From 25¢ - $4.00",
    rating: "4.9 ★ (130 reviews)",
    secondaryPill: "Instant Hostel Delivery"
  }
];

export default function HeroBanner({ onExploreClick, onSelectCategory, config }) {
  const slides = config?.heroSlides && config.heroSlides.length > 0 ? config.heroSlides : SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0];
  const slideImg = slide.image || slide.bgImage || "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1400&q=80";
  const groupInvite = config?.whatsappGroupInvite || STORE_CONFIG.whatsappGroupInvite;
  const catalogUrl = config?.whatsappCatalogUrl || "https://wa.me/c/254748094795";

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleSlideCta = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    if (onExploreClick) onExploreClick();
  };

  return (
    <div className="relative w-full overflow-hidden min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-950 text-white select-none">
      
      {/* 1. Full-Banner Background Image spanning 100% width and height */}
      <div className="absolute inset-0 w-full h-full">
        <img
          key={slide.id}
          src={slideImg}
          alt={slide.title}
          loading="eager"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80";
          }}
          className="w-full h-full object-cover object-center transform scale-100 transition-all duration-700 ease-out"
        />

        {/* 2. Directional Gradient Scrim: Crisp contrast for text on the left, 100% photo visibility on the center & right */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent sm:from-slate-950/85 sm:via-slate-950/50 sm:to-transparent/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
      </div>

      {/* 3. Main Content Container: Spanning edge-to-edge from the farthest left */}
      <div className="relative z-10 w-full px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-5">
          
          {/* Top Pill / Badge row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${slide.tagColor || 'bg-white/20 text-white border-white/30'}`}>
              <Tag className="w-3.5 h-3.5" />
              <span>{slide.tag}</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/90 font-semibold bg-white/15 backdrop-blur-md border border-white/25 px-3 py-1 rounded-full shadow-xs">
              <Users className="w-3.5 h-3.5 text-amber-400" /> 
              <span>110+ Comrades on WhatsApp</span>
            </span>

            <span className="text-xs font-black text-slate-950 bg-amber-400 px-3 py-1 rounded-full shadow-xs">
              {slide.priceTag || slide.badge}
            </span>
          </div>

          {/* Headline with clean, high-contrast typography and gold highlights (zero muddy background rectangles) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-md">
            {slide.title}{' '}
            <span className="block mt-1 text-amber-400 font-extrabold drop-shadow-sm">
              {slide.highlight}
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed font-normal drop-shadow-xs">
            {slide.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSlideCta(slide.categoryId)}
              className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-amber-500/30 transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
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
              className="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 flex items-center gap-2"
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
              className="hidden lg:inline-flex px-4 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold transition items-center gap-1.5 shadow-xs"
            >
              <span>Join Group</span>
            </a>
          </div>

          {/* Micro Trust Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Pay on Hostel Delivery (M-Pesa / Cash)</span>
            </div>
            <span className="hidden sm:inline text-white/40">•</span>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fast Campus Hostel Drop-Off</span>
            </div>
            <span className="hidden sm:inline text-white/40">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Before Paying</span>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Bottom-Right Product Pill */}
      <div className="hidden lg:flex absolute bottom-5 right-6 z-20 items-center gap-2 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white shadow-xl text-xs font-bold">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span>{slide.rating || '4.9 ★ Verified'}</span>
        <span className="text-white/40">•</span>
        <span className="text-amber-300 font-extrabold">{slide.priceTag || slide.badge}</span>
      </div>

      {/* Navigation Arrows for Full Carousel placed at farthest edges */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition shadow-lg cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition shadow-lg cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicator Dots at bottom center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.id || idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentSlide === idx 
                ? 'w-7 h-2 bg-amber-400 shadow-md' 
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
