// =========================================================================
// MIDEVA'S COLLECTION — STORE CONFIG & EDITABLE PUBLIC CONTENT
// Allows Mideva (admin) to dynamically update phone, group links,
// announcements, exchange rates, and store bio without modifying code.
// =========================================================================

const CONFIG_STORAGE_KEY = 'midevas_store_config';

export const DEFAULT_HERO_SLIDES = [
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
    bgImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    badge: "Shirts < $8 • Tees < $4",
    priceTag: "From $3.50",
    rating: "4.9 ★ (84 reviews)",
    secondaryPill: "Pure Breathable Cotton"
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
    bgImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    badge: "Steal $6 • Premium $10",
    priceTag: "Steal $6 • Premium $10",
    rating: "5.0 ★ (112 reviews)",
    secondaryPill: "Gold Clasps & Chains"
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
    bgImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    badge: "All Scents Under $5",
    priceTag: "Only $3.00 - $4.50",
    rating: "4.8 ★ (96 reviews)",
    secondaryPill: "Long-Lasting Oil Scent"
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
    bgImage: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    badge: "Snacks from 25¢ - 50¢",
    priceTag: "From 25¢ - $4.00",
    rating: "4.9 ★ (130 reviews)",
    secondaryPill: "Instant Hostel Delivery"
  }
];

export const DEFAULT_STORE_CONFIG = {
  storeName: "Mideva's Collection",
  adminEmail: "monalisamideva@gmail.com",
  adminName: "Mona Lisa Mideva",
  adminPhone: "+254 748 094795",
  adminPasscode: "mideva2026",
  adminAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  adminRole: "Store Owner & Campus Reseller Lead",
  tagline: "Great Quality Everyday",
  subTagline: "Comrade Affordable Fashion & Daily Essentials for Ladies & Gentlemen",
  whatsappNumber: "254748094795",
  whatsappCatalogUrl: "https://wa.me/c/254748094795",
  whatsappGroupInvite: "https://chat.whatsapp.com/GuRW4nzqO251oyPcC5MRwH",
  announcementText: "🔥 Shirts < $8 • Tees < $4 • Bags $6 & $10 • Perfumes < $5 • Free Campus Hostel Delivery!",
  deliveryNotice: "🚀 Free delivery around campus hostels & student halls! Fast town drop-off available.",
  exchangeRate: 130,
  currency: "$",
  secondaryCurrency: "KSh",
  ecocashNumber: "0774809479",
  ecocashMerchantCode: "94795",
  ecocashRate: 28, // ZiG rate per USD if paying in local ZiG EcoCash
  ecocashMode: "USD", // "USD" or "ZiG"
  paymentMethods: ["M-Pesa", "EcoCash", "Cash on Delivery", "Bank Transfer"],
  storeStatus: "open", // "open" | "delivery_run" | "closed"
  freeDeliveryEnabled: true,
  heroSlides: DEFAULT_HERO_SLIDES
};

// Unified price formatter across the application
export function formatPrice(usdAmount, activeCurrency = '$', config = DEFAULT_STORE_CONFIG) {
  const amount = Number(usdAmount) || 0;
  if (activeCurrency === 'KSh') {
    const kshRate = config?.exchangeRate || 130;
    return `KSh ${Math.round(amount * kshRate).toLocaleString()}`;
  }
  if (activeCurrency === 'EcoCash') {
    // If EcoCash is set to USD mode (most common in modern Zim campus trade), show EcoCash $
    if (config?.ecocashMode === 'ZiG') {
      const zigRate = config?.ecocashRate || 28;
      return `ZiG ${Math.round(amount * zigRate).toLocaleString()}`;
    }
    return `EcoCash $${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function getStoreConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_STORE_CONFIG));
      return DEFAULT_STORE_CONFIG;
    }
    const parsed = JSON.parse(raw);
    if (parsed.heroSlides && Array.isArray(parsed.heroSlides)) {
      parsed.heroSlides = parsed.heroSlides.map((slide, i) => {
        const def = DEFAULT_HERO_SLIDES[i] || DEFAULT_HERO_SLIDES[0];
        return {
          ...def,
          ...slide,
          image: slide.image || slide.bgImage || def.image,
          priceTag: slide.priceTag || def.priceTag,
          rating: slide.rating || def.rating,
        };
      });
    }
    return { ...DEFAULT_STORE_CONFIG, ...parsed };
  } catch (err) {
    return DEFAULT_STORE_CONFIG;
  }
}

export function saveStoreConfig(newConfig) {
  try {
    const current = getStoreConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving store config:', err);
    return getStoreConfig();
  }
}

export function resetStoreConfig() {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_STORE_CONFIG));
  return DEFAULT_STORE_CONFIG;
}
