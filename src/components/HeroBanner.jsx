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
    tagColor: "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800",
    title: "Great Quality Everyday.",
    highlight: "Comrade Affordable Styles for Him.",
    description: "Breathable cotton button-up shirts (< $8), heavyweight graphic streetwear tees (< $4), and textured casual polos built for campus life.",
    primaryCta: "Explore Men's Wear",
    categoryId: "fashion",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    badge: "Shirts < $8 • Tees < $4",
    priceTag: "From $3.50",
    rating: "4.9 ★ (84 reviews)",
    secondaryPill: "Pure Breathable Cotton"
  },
  {
    id: 2,
    tag: "Ladies' Luxury Bags",
    tagColor: "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800",
    title: "Elegance That Fits Your Budget.",
    highlight: "Chic Quilted Slings & Executive Totes.",
    description: "Spacious PU leather executive handbags with gold clasps ($10) & compact diamond-quilted chain slings ($6). Perfect for lectures and church.",
    primaryCta: "Shop Handbags ($6 & $10)",
    categoryId: "bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    badge: "Steal $6 • Premium $10",
    priceTag: "Steal $6 • Premium $10",
    rating: "5.0 ★ (112 reviews)",
    secondaryPill: "Gold Clasps & Chains"
  },
  {
    id: 3,
    tag: "Perfumes & Beauty",
    tagColor: "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800",
    title: "24-Hour Scent Projection.",
    highlight: "Concentrated Pocket Perfumes Under $5.",
    description: "Pure oil-based pocket perfumes (35ml) in Vanilla Sweet & Royal Oud, gentleman woody EDP, and hydrating hair & body mists (< $4).",
    primaryCta: "Discover Scents (< $5)",
    categoryId: "beauty",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    badge: "All Scents Under $5",
    priceTag: "Only $3.00 - $4.50",
    rating: "4.8 ★ (96 reviews)",
    secondaryPill: "Long-Lasting Oil Scent"
  },
  {
    id: 4,
    tag: "Tuckshop & Study Fuel",
    tagColor: "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800",
    title: "Campus Study Essentials.",
    highlight: "Mazoe Orange, Popcorn & Tuckshop.",
    description: "Ice-cold Coca-Cola, Mazoe Orange concentrate (makes 20+ glasses), fresh salted maputi buckets (50¢), 2-quire notebooks, and plush hot water bottles ($4).",
    primaryCta: "Browse Study Fuel",
    categoryId: "snacks",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
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
  const groupInvite = config?.whatsappGroupInvite || STORE_CONFIG.whatsappGroupInvite;
  const catalogUrl = config?.whatsappCatalogUrl || "https://wa.me/c/254748094795";

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleSlideCta = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    if (onExploreClick) onExploreClick();
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      
      {/* Background Subtle Accent Glows (Zero Muddy Opaque Wash) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Expansive Content Container starting from far left to far right */}
      <div className="relative z-10 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-8 xl:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (7 cols): Mature Marketing Copy & Call to Action */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Top Pill / Badge row with mature e-commerce hierarchy */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${slide.tagColor}`}>
                <Tag className="w-3.5 h-3.5" />
                <span>{slide.tag}</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full shadow-xs">
                <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> 
                <span>110+ Comrades on WhatsApp</span>
              </span>

              <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-700/80 px-3 py-1 rounded-full shadow-xs">
                {slide.badge}
              </span>
            </div>

            {/* Headline with refined typography and mature gold accent */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              {slide.title}{' '}
              <span className="block mt-1 text-amber-600 dark:text-amber-400">
                {slide.highlight}
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSlideCta(slide.categoryId)}
                className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-amber-500/25 transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
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
                className="hidden lg:inline-flex px-4 py-3 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition items-center gap-1.5 shadow-xs"
              >
                <span>Join Group</span>
              </a>
            </div>

            {/* Micro Trust Bar with light/dark adaptive icons */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Pay on Hostel Delivery (M-Pesa / Cash)</span>
              </div>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Inspect Before Paying</span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): High-Clarity Featured Product Showcase Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* The Crisp, 100% Clear Product Photography Card */}
            <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 group">
              <img
                key={slide.id}
                src={slide.image || slide.bgImage || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"}
                alt={slide.title}
                loading="eager"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80";
                }}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Top Price Tag */}
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {slide.priceTag || slide.badge}
                </span>
              </div>

              {/* Floating Bottom Social Proof / Rating Tag */}
              <div className="absolute bottom-4 right-4 bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 text-xs font-bold">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{slide.rating || '4.9 ★ Verified'}</span>
              </div>

              {/* Instant Free Hostel Drop-Off Badge */}
              <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>Hostel Drop-Off</span>
              </div>
            </div>

            {/* Navigation Arrows for Carousel */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white flex items-center justify-center transition shadow-lg cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white flex items-center justify-center transition shadow-lg cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 pt-8">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide 
                  ? 'w-8 bg-amber-500 shadow-xs' 
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
}
