// =========================================================================
// MIDEVA'S COLLECTION — REAL PRODUCT CATALOG & DYNAMIC STORE
// Harvested from Tuckshop project + Provision Assistance data
// + Original Mideva WhatsApp group items, organized into business categories.
// Includes high-fidelity realistic product imagery & dynamic localStorage sync.
// =========================================================================

export const STORE_CONFIG = {
  storeName: "Mideva's Collection",
  tagline: "Great Quality Everyday",
  subTagline: "Comrade Affordable Fashion & Daily Essentials for Ladies & Gentlemen",
  whatsappNumber: "254748094795",
  whatsappGroupInvite: "https://chat.whatsapp.com/GuRW4nzqO251oyPcC5MRwH",
  currency: "$",
  secondaryCurrency: "KSh",
  exchangeRate: 130,
  deliveryNotice: "🚀 Free delivery around campus hostels & student halls! Fast drop-off available.",
  paymentMethods: ["M-Pesa", "Cash on Delivery", "EcoCash", "Bank Transfer"],
};

export const CATEGORIES = [
  { id: "all",       name: "All Items",           icon: "Sparkles",        emoji: "✨" },
  { id: "fashion",   name: "Men's Fashion",       icon: "Shirt",           emoji: "👔" },
  { id: "bags",      name: "Ladies' Bags",        icon: "ShoppingBag",     emoji: "👜" },
  { id: "beauty",    name: "Perfumes & Beauty",   icon: "Droplets",        emoji: "🌸" },
  { id: "hygiene",   name: "Hygiene & Care",      icon: "Heart",           emoji: "🧼" },
  { id: "snacks",    name: "Snacks & Drinks",     icon: "Coffee",          emoji: "🍫" },
  { id: "groceries", name: "Groceries & Kitchen", icon: "UtensilsCrossed",  emoji: "🍳" },
  { id: "stationery",name: "Stationery & Study",  icon: "BookOpen",        emoji: "📚" },
  { id: "essentials",name: "Campus Essentials",   icon: "Package",         emoji: "🎒" },
];

export const BASELINE_PRODUCTS = [
  // ═══════════════════════════════════════════════════════════
  // CATEGORY: MEN'S FASHION
  // ═══════════════════════════════════════════════════════════
  {
    id: "fsh-01",
    name: "Classic Button-Up Cotton Shirt",
    category: "fashion",
    price: 7.50,
    comradePrice: 7.00,
    badge: "Under $8",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 42,
    description: "Breathable, crisp long-sleeve cotton shirt. Perfect for class, presentations, and Sunday outings.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Sky Blue", "Classic White", "Navy Blue", "Soft Pink"],
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "fsh-02",
    name: "Heavyweight Graphic Streetwear Tee",
    category: "fashion",
    price: 3.80,
    comradePrice: 3.50,
    badge: "Under $4",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 67,
    description: "Trendy oversized graphic t-shirt. 100% durable cotton that survives every hostel wash cycle.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Vintage Black", "Off-White", "Forest Green"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "fsh-03",
    name: "Essential Plain Crewneck Tee",
    category: "fashion",
    price: 3.50,
    comradePrice: 3.00,
    badge: "Comrade Deal",
    isComradeDeal: true,
    rating: 4.7,
    reviews: 51,
    description: "Everyday minimalist solid-color t-shirt. Soft feel, fade-resistant, essential for daily wear.",
    sizes: ["M", "L", "XL"],
    colors: ["Jet Black", "Heather Grey", "Pure White", "Maroon"],
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "fsh-04",
    name: "Textured Casual Polo Shirt",
    category: "fashion",
    price: 6.90,
    comradePrice: 6.50,
    badge: "Smart Casual",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 38,
    description: "Ribbed collar polo with clean fit. Great balance of smart and casual comfort.",
    sizes: ["M", "L", "XL"],
    colors: ["Burgundy", "Charcoal", "Olive"],
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: LADIES' BAGS
  // ═══════════════════════════════════════════════════════════
  {
    id: "bag-05",
    name: "Executive Structured Shoulder Handbag",
    category: "bags",
    price: 10.00,
    comradePrice: 9.50,
    badge: "Premium $10",
    isComradeDeal: false,
    rating: 5.0,
    reviews: 84,
    description: "Spacious luxury-finish PU leather handbag with gold accent clasps. Easily holds tablet, phone, and makeup.",
    colors: ["Chestnut Brown", "Midnight Black", "Beige Cream"],
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bag-06",
    name: "Compact Quilted Crossbody Sling Bag",
    category: "bags",
    price: 6.00,
    comradePrice: 5.50,
    badge: "Steal $6",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 92,
    description: "Chic diamond-quilted sling bag with adjustable chain strap. Lightweight for parties, church, and walks.",
    colors: ["Pastel Pink", "Classic Black", "Cherry Red"],
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bag-07",
    name: "Campus Canvas Multi-Pocket Tote",
    category: "bags",
    price: 6.00,
    comradePrice: 5.80,
    badge: "Popular $6",
    isComradeDeal: true,
    rating: 4.7,
    reviews: 49,
    description: "Sturdy aesthetic canvas tote bag with zipper closure. Built to carry textbooks, notebooks, and essentials.",
    colors: ["Natural Khaki", "Onyx Black", "Olive Green"],
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bag-08",
    name: "Evening Envelope Clutch with Strap",
    category: "bags",
    price: 10.00,
    comradePrice: 9.00,
    badge: "Event Pick $10",
    isComradeDeal: false,
    rating: 4.8,
    reviews: 31,
    description: "Sleek envelope-style clutch with detachable metallic strap. Perfect for graduations, dinners, and parties.",
    colors: ["Rose Gold", "Matte Black", "Emerald Green"],
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: PERFUMES & BEAUTY
  // ═══════════════════════════════════════════════════════════
  {
    id: "bty-09",
    name: "Luxury Oil-Based Pocket Perfume (35ml)",
    category: "beauty",
    price: 4.50,
    comradePrice: 4.00,
    badge: "Under $5",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 110,
    description: "Long-lasting concentrated fragrance oil. 24-hour projection that turns heads in the lecture hall.",
    scents: ["Vanilla Sweet", "Royal Oud", "Aqua Marine", "Floral Bouquet"],
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bty-10",
    name: "Gentleman Amber Woody Eau de Parfum",
    category: "beauty",
    price: 4.90,
    comradePrice: 4.50,
    badge: "Under $5",
    isComradeDeal: true,
    rating: 5.0,
    reviews: 88,
    description: "Deep, masculine scent with cedarwood, amber, and spiced citrus notes. Highly rated by male comrades.",
    scents: ["Amber Wood", "Tobacco Vanille", "Silver Mountain"],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bty-11",
    name: "All-Day Fresh Body & Hair Mist Spray",
    category: "beauty",
    price: 3.80,
    comradePrice: 3.50,
    badge: "Under $4",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 74,
    description: "Refreshing hydration and fragrance spray for hair and body. Non-sticky, instant fresh glow.",
    scents: ["Coconut Breeze", "Berry Crush", "Citrus Spark"],
    image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bty-12",
    name: "Strong Hold Nourishing Hair Spray",
    category: "beauty",
    price: 3.50,
    comradePrice: 3.20,
    badge: "Under $4",
    isComradeDeal: true,
    rating: 4.6,
    reviews: 43,
    description: "Tames flyaways and holds braid/wig styling without flaking. Vitamin E enriched.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bty-13",
    name: "Clere for Men Moisturizing Body Lotion",
    category: "beauty",
    price: 2.50,
    comradePrice: 2.30,
    badge: "Grooming",
    isComradeDeal: true,
    rating: 4.7,
    reviews: 36,
    description: "Rich moisturizing lotion for dry skin. Fresh masculine scent, non-greasy, long-lasting hydration.",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bty-14",
    name: "Quick Action Gentle Hair Remover Cream",
    category: "beauty",
    price: 0.50,
    comradePrice: 0.50,
    badge: "50¢",
    isComradeDeal: true,
    rating: 4.3,
    reviews: 22,
    description: "Fast-acting gentle hair removal cream. Smooth skin in under 10 minutes.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: HYGIENE & PERSONAL CARE
  // ═══════════════════════════════════════════════════════════
  {
    id: "hyg-15",
    name: "Soft Care Sanitary Pads (6 Pack)",
    category: "hygiene",
    price: 3.40,
    comradePrice: 3.20,
    badge: "Essential",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 95,
    description: "Ultra-soft absorbent sanitary pads. 6-pack for reliable monthly protection.",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-16",
    name: "Always Ultra Thin Pads with Wings",
    category: "hygiene",
    price: 1.50,
    comradePrice: 1.30,
    badge: "Trusted",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 120,
    description: "Everyday protection with ultra-thin design and leak-guard wings.",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-17",
    name: "Baby Soft White Tissue (18 Ply Pack)",
    category: "hygiene",
    price: 7.50,
    comradePrice: 7.00,
    badge: "Bulk Value",
    isComradeDeal: false,
    rating: 4.7,
    reviews: 55,
    description: "Premium soft tissue paper. 18-ply bulk pack perfect for the whole semester.",
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-18",
    name: "Lifebuoy Antibacterial Soap (6 Pack)",
    category: "hygiene",
    price: 4.00,
    comradePrice: 3.80,
    badge: "Antibacterial",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 78,
    description: "Trusted antibacterial soap for daily hygiene. 6-bar value pack for roommates.",
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-19",
    name: "Colgate Triple Action Toothpaste",
    category: "hygiene",
    price: 1.00,
    comradePrice: 0.90,
    badge: "Daily Use",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 150,
    description: "Cavity protection fluoride toothpaste. Fresh minty breath throughout lectures.",
    image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-20",
    name: "Active Charcoal Toothbrush Triple Pack",
    category: "hygiene",
    price: 1.40,
    comradePrice: 1.20,
    badge: "3 Pack",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 135,
    description: "Ultra-soft micro-bristles with active charcoal. 3 premium toothbrushes for incredible value!",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-21",
    name: "Pure Vaseline Petroleum Jelly",
    category: "hygiene",
    price: 1.00,
    comradePrice: 0.90,
    badge: "Classic",
    isComradeDeal: true,
    rating: 4.6,
    reviews: 88,
    description: "Multi-purpose moisture barrier. Heals dry lips, knees, elbows, and minor cuts.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-22",
    name: "Lux Silk Fragrance Beauty Soap Bar",
    category: "hygiene",
    price: 1.50,
    comradePrice: 1.30,
    badge: "Fragrant",
    isComradeDeal: true,
    rating: 4.7,
    reviews: 62,
    description: "Luxurious scented beauty soap bar for soft, silky smooth skin.",
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-23",
    name: "Boom Washing Powder (1kg Laundry Pack)",
    category: "hygiene",
    price: 1.90,
    comradePrice: 1.80,
    badge: "Laundry",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 97,
    description: "Powerful stain-busting laundry powder. 1kg pack handles 2+ weeks of hostel laundry.",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-24",
    name: "Britelite Heavy Duty Green Bar Soap (1kg)",
    category: "hygiene",
    price: 1.10,
    comradePrice: 1.00,
    badge: "Budget Soap",
    isComradeDeal: true,
    rating: 4.5,
    reviews: 44,
    description: "Heavy-duty green bar soap. Washes everything from dishes to hostel laundry.",
    image: "https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "hyg-25",
    name: "Fun 'n Fresh 48-Hour Roll-on Deodorant",
    category: "hygiene",
    price: 2.00,
    comradePrice: 1.80,
    badge: "Fresh",
    isComradeDeal: true,
    rating: 4.6,
    reviews: 33,
    description: "48-hour freshness roll-on. Confidence from lecture hall to night out.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: SNACKS & DRINKS
  // ═══════════════════════════════════════════════════════════
  {
    id: "snk-26",
    name: "Lays Crispy Potato Chips (Regular)",
    category: "snacks",
    price: 0.50,
    comradePrice: 0.50,
    badge: "Snack 50¢",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 200,
    description: "Crispy salted potato chips. The perfect study break and movie night companion.",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "snk-27",
    name: "Ice Cold Coca-Cola (500ml Bottle)",
    category: "snacks",
    price: 1.00,
    comradePrice: 0.90,
    badge: "Refreshing",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 300,
    description: "Ice-cold classic Coca-Cola in a 500ml bottle. Nothing beats it on a hot afternoon.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "snk-28",
    name: "Coca-Cola 2 Litre Sharing Bottle",
    category: "snacks",
    price: 2.50,
    comradePrice: 2.30,
    badge: "Share Size",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 180,
    description: "2-litre sharing bottle. Perfect for hostel room hangouts and weekend get-togethers.",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "snk-29",
    name: "Mazoe Orange Crush Concentrate (2L)",
    category: "snacks",
    price: 4.50,
    comradePrice: 4.20,
    badge: "Makes 20+ Glasses",
    isComradeDeal: false,
    rating: 5.0,
    reviews: 165,
    description: "Iconic orange drink concentrate. One bottle makes 20+ refreshing glasses for study sessions.",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "snk-30",
    name: "Minute Maid Tropical Fruit Juice",
    category: "snacks",
    price: 0.50,
    comradePrice: 0.50,
    badge: "Quick Sip 50¢",
    isComradeDeal: true,
    rating: 4.5,
    reviews: 72,
    description: "Fruity juice in assorted tropical flavors. Perfect for a quick lecture break.",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "snk-31",
    name: "Crunchy Irish Tea Biscuits (Assorted)",
    category: "snacks",
    price: 1.00,
    comradePrice: 0.90,
    badge: "Tea Time",
    isComradeDeal: true,
    rating: 4.6,
    reviews: 89,
    description: "Crunchy assorted biscuits for tea time. A campus breakfast favorite.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "snk-32",
    name: "Fresh Salted Maputi (Popcorn) Bucket",
    category: "snacks",
    price: 0.50,
    comradePrice: 0.50,
    badge: "Campus Fave 50¢",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 210,
    description: "Freshly popped salted maputi. The ultimate campus study and movie fuel!",
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "snk-33",
    name: "Sliced Polony Deli Cold Cut Roll",
    category: "snacks",
    price: 1.00,
    comradePrice: 0.90,
    badge: "Quick Meal",
    isComradeDeal: true,
    rating: 4.4,
    reviews: 58,
    description: "Sliced polony cold meat. Quick protein for sandwiches and bread rolls.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: GROCERIES & KITCHEN
  // ═══════════════════════════════════════════════════════════
  {
    id: "grc-34",
    name: "Pure Refined White Sugar (2kg Pack)",
    category: "groceries",
    price: 3.50,
    comradePrice: 3.30,
    badge: "Bulk Staple",
    isComradeDeal: false,
    rating: 4.8,
    reviews: 130,
    description: "Pure white sugar. 2kg bag lasts a full month for daily tea, porridge, and baking.",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "grc-35",
    name: "Cerevita Instant Nutritious Porridge Mix",
    category: "groceries",
    price: 3.50,
    comradePrice: 3.30,
    badge: "Breakfast",
    isComradeDeal: false,
    rating: 4.7,
    reviews: 77,
    description: "Nutritious instant breakfast porridge. Just add warm water or milk for a quick filling start.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "grc-36",
    name: "Sweet Sun Jam Fruit Spread",
    category: "groceries",
    price: 1.50,
    comradePrice: 1.40,
    badge: "Spread",
    isComradeDeal: true,
    rating: 4.6,
    reviews: 65,
    description: "Sweet fruit jam in a jar. Perfect on bread and scones for quick hostel mornings.",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "grc-37",
    name: "Pilchards in Rich Tomato Sauce (Tinned)",
    category: "groceries",
    price: 1.50,
    comradePrice: 1.40,
    badge: "Protein",
    isComradeDeal: true,
    rating: 4.5,
    reviews: 90,
    description: "Pilchards in rich tomato sauce. Protein-packed, pairs delicious with sadza, rice or bread.",
    image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "grc-38",
    name: "Baked Beans in Rich Tomato Sauce",
    category: "groceries",
    price: 1.00,
    comradePrice: 0.90,
    badge: "Quick Meal",
    isComradeDeal: true,
    rating: 4.7,
    reviews: 105,
    description: "Ready-to-eat baked beans in rich tomato sauce. Just heat and enjoy with toast or eggs!",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "grc-39",
    name: "Ricoffy Instant Granule Coffee",
    category: "groceries",
    price: 2.00,
    comradePrice: 1.80,
    badge: "Study Fuel",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 140,
    description: "Iconic rich instant coffee. An absolute must-have for late-night study and early mornings.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "grc-40",
    name: "Rooibos Pure Herbal Tea Bags (20 Pack)",
    category: "groceries",
    price: 2.00,
    comradePrice: 1.80,
    badge: "Healthy",
    isComradeDeal: true,
    rating: 4.6,
    reviews: 48,
    description: "Naturally caffeine-free red bush tea. Soothing aroma and high in antioxidants.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "grc-41",
    name: "Creamy Mayonnaise (Squeeze Bottle)",
    category: "groceries",
    price: 3.00,
    comradePrice: 2.80,
    badge: "Condiment",
    isComradeDeal: false,
    rating: 4.5,
    reviews: 39,
    description: "Creamy mayonnaise in a clean squeeze bottle. Essential for chips, sandwiches, and salads.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: STATIONERY & STUDY
  // ═══════════════════════════════════════════════════════════
  {
    id: "stn-42",
    name: "2 Quire Hardcover Ruled Exercise Book",
    category: "stationery",
    price: 2.50,
    comradePrice: 2.30,
    badge: "96 Pages",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 180,
    description: "Durable 96-page ruled exercise book. Hardcover protects notes throughout semester backpack life.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "stn-43",
    name: "Edumax Blue Ballpoint Pens (10 Pack)",
    category: "stationery",
    price: 0.85,
    comradePrice: 0.80,
    badge: "Bulk Pack",
    isComradeDeal: true,
    rating: 4.7,
    reviews: 95,
    description: "Smooth glide blue ink ballpoint pens. 10-pack will last you and your study group through exams.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "stn-44",
    name: "Single Blue Medium Ballpoint Pen",
    category: "stationery",
    price: 0.25,
    comradePrice: 0.25,
    badge: "25¢",
    isComradeDeal: true,
    rating: 4.5,
    reviews: 220,
    description: "Reliable blue ballpoint pen. Quick pickup right before your next lecture.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "stn-45",
    name: "HB Graphite Pencils (Pack of 5)",
    category: "stationery",
    price: 0.50,
    comradePrice: 0.50,
    badge: "5 for 50¢",
    isComradeDeal: true,
    rating: 4.6,
    reviews: 85,
    description: "HB drawing and writing pencils. 5-pack for multiple-choice exams, math, and sketches.",
    image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "stn-46",
    name: "Clear Metric 30cm Study Ruler",
    category: "stationery",
    price: 0.50,
    comradePrice: 0.50,
    badge: "50¢",
    isComradeDeal: true,
    rating: 4.4,
    reviews: 42,
    description: "Transparent 30cm shatter-resistant ruler with metric measurements.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: CAMPUS ESSENTIALS
  // ═══════════════════════════════════════════════════════════
  {
    id: "ess-47",
    name: "Plush Velvet Cover Hot Water Bottle",
    category: "essentials",
    price: 4.00,
    comradePrice: 3.80,
    badge: "Only $4",
    isComradeDeal: true,
    rating: 5.0,
    reviews: 97,
    description: "2-litre leak-proof rubber bottle with cozy velvet fleece cover. Campus savior for chilly nights.",
    colors: ["Baby Pink", "Cozy Grey", "Sky Blue"],
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "ess-48",
    name: "Insulated Stainless Travel Tumbler (500ml)",
    category: "essentials",
    price: 4.50,
    comradePrice: 4.00,
    badge: "Best Seller",
    isComradeDeal: true,
    rating: 4.8,
    reviews: 62,
    description: "Keeps tea hot for 8 hours or ice water chilled for 12 hours. Fits all backpack bottle pockets.",
    colors: ["Matte Black", "Stainless Silver", "Pastel Lilac"],
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "ess-49",
    name: "Compact Microfiber Quick-Dry Towel",
    category: "essentials",
    price: 3.00,
    comradePrice: 2.80,
    badge: "Compact",
    isComradeDeal: true,
    rating: 4.7,
    reviews: 55,
    description: "Dries 3x faster than cotton and takes negligible room in your gym or class backpack.",
    colors: ["Cobalt Blue", "Charcoal Grey", "Teal"],
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "ess-50",
    name: "Pure Natural Bottled Water (500ml)",
    category: "essentials",
    price: 0.25,
    comradePrice: 0.25,
    badge: "Hydrate 25¢",
    isComradeDeal: true,
    rating: 4.9,
    reviews: 500,
    description: "Pure purified drinking water. Stay hydrated throughout long lectures.",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "ess-51",
    name: "Panado Paracetamol Pain Relief (Blister Pack)",
    category: "essentials",
    price: 0.50,
    comradePrice: 0.50,
    badge: "Relief",
    isComradeDeal: true,
    rating: 4.7,
    reviews: 140,
    description: "Fast-acting pain and headache relief. Keep a pack in your dorm drawer.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "ess-52",
    name: "Twin-Blade Shaving Razors (Pack of 5)",
    category: "essentials",
    price: 0.50,
    comradePrice: 0.50,
    badge: "Grooming 50¢",
    isComradeDeal: true,
    rating: 4.3,
    reviews: 35,
    description: "Disposable twin-blade precision razors with lubricating strip for a smooth clean shave.",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
];

// LocalStorage key for admin modified / added products
const CATALOG_STORAGE_KEY = 'midevas_catalog_products';

export function getStoredProducts() {
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) {
      // Seed initial products with realistic stock quantities (10-25 items)
      const seeded = BASELINE_PRODUCTS.map((p, idx) => ({
        ...p,
        stockQuantity: p.stockQuantity ?? (12 + (idx % 15)),
        lowStockThreshold: 5,
        inStock: p.inStock !== false
      }));
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    // Ensure backwards compatibility with any products missing stockQuantity
    return parsed.map((p, idx) => ({
      ...p,
      stockQuantity: p.stockQuantity ?? (p.inStock !== false ? (10 + (idx % 12)) : 0),
      lowStockThreshold: p.lowStockThreshold || 5,
      inStock: p.stockQuantity !== undefined ? p.stockQuantity > 0 : (p.inStock !== false)
    }));
  } catch (err) {
    return BASELINE_PRODUCTS;
  }
}

export function saveCustomProduct(product) {
  try {
    const prods = getStoredProducts();
    const qty = product.stockQuantity !== undefined ? Number(product.stockQuantity) : 20;
    const newProd = {
      ...product,
      id: product.id || 'cust-' + Math.random().toString(36).substring(2, 8),
      rating: product.rating || 5.0,
      reviews: product.reviews || 1,
      stockQuantity: qty,
      lowStockThreshold: product.lowStockThreshold || 5,
      inStock: qty > 0,
      isComradeDeal: product.isComradeDeal !== false,
      price: Number(product.price) || 1.0,
      comradePrice: Number(product.comradePrice) || Number(product.price) || 1.0
    };
    prods.unshift(newProd);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(prods));
    return prods;
  } catch (err) {
    console.error('Error saving product:', err);
    return getStoredProducts();
  }
}

// Automatically decrement stock when items are sold
export function decrementSoldItems(orderItems = []) {
  try {
    const prods = getStoredProducts();
    const updated = prods.map((p) => {
      const match = orderItems.find((item) => item.id === p.id);
      if (match) {
        const currentQty = p.stockQuantity ?? (p.inStock !== false ? 15 : 0);
        const qtySold = Number(match.quantity) || 1;
        const newQty = Math.max(0, currentQty - qtySold);
        return {
          ...p,
          stockQuantity: newQty,
          inStock: newQty > 0
        };
      }
      return p;
    });
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error decrementing sold stock:', err);
    return getStoredProducts();
  }
}

// Directly set product stock quantity
export function updateProductStockQuantity(id, newQuantity) {
  try {
    const prods = getStoredProducts();
    const qty = Math.max(0, Number(newQuantity) || 0);
    const updated = prods.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          stockQuantity: qty,
          inStock: qty > 0
        };
      }
      return p;
    });
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return getStoredProducts();
  }
}

// Adjust stock by delta (+1, +5, -1, etc.)
export function adjustProductStock(id, delta) {
  try {
    const prods = getStoredProducts();
    const updated = prods.map((p) => {
      if (p.id === id) {
        const current = p.stockQuantity ?? (p.inStock !== false ? 15 : 0);
        const next = Math.max(0, current + Number(delta));
        return {
          ...p,
          stockQuantity: next,
          inStock: next > 0
        };
      }
      return p;
    });
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return getStoredProducts();
  }
}

export function updateProductPrice(id, newPrice, newComradePrice) {
  try {
    const prods = getStoredProducts();
    const updated = prods.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          price: Number(newPrice),
          comradePrice: newComradePrice ? Number(newComradePrice) : Number(newPrice)
        };
      }
      return p;
    });
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return getStoredProducts();
  }
}

export function toggleProductStock(id) {
  try {
    const prods = getStoredProducts();
    const updated = prods.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return getStoredProducts();
  }
}

export function deleteProduct(id) {
  try {
    const prods = getStoredProducts();
    const filtered = prods.filter((p) => p.id !== id);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    return getStoredProducts();
  }
}

export function resetProducts() {
  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(BASELINE_PRODUCTS));
  return BASELINE_PRODUCTS;
}

// Active default products array for backwards compatibility
export const PRODUCTS = BASELINE_PRODUCTS;

// Computed category counts
CATEGORIES.forEach((cat) => {
  cat.count = cat.id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat.id).length;
});
