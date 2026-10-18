# 🛠️ Mideva's Collection — Developer & Engineering Guide
### *Technical Architecture, Component Hierarchy, Storage Layer & Migration Specifications*

---

## 1. Project Overview & Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | React | 18.2.0 | Reactive UI components & SPA architecture |
| **Build Tool** | Vite | 5.4.21 | Sub-second HMR & optimized production bundling |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first responsive design & mobile-first UI |
| **Icons** | Lucide React | 0.344.0 | Lightweight SVG icons |
| **PWA** | Service Worker / Web App Manifest | Native | Offline caching & phone home-screen install |
| **Deployment** | Vercel Serverless | Native | Zero-cost edge deployment & serverless webhooks |
| **Storage** | Browser LocalStorage | Native | Resilient client-side persistence for zero-cost operation |

---

## 2. Directory Structure & Component Hierarchy

```
D:\Projects\midevas-collection\
├── api\
│   └── whatsapp-webhook.js          # Vercel serverless webhook for Meta WhatsApp API
├── public\
│   ├── favicon.svg                  # Brand SVG favicon
│   ├── manifest.json                # PWA manifest
│   └── sw.js                        # Service worker with stale-while-revalidate caching
├── src\
│   ├── components\
│   │   ├── AdminModal.jsx           # Store management portal (Orders, Products, CMS, Profile)
│   │   ├── AmazonSidebarNav.jsx     # Slide-out department navigation drawer
│   │   ├── AnnouncementBar.jsx      # Top dynamic scrolling marquee ticker
│   │   ├── CategoryPills.jsx        # Category tabs and price sub-filters
│   │   ├── ChatWidget.jsx           # Interactive floating campus chatbot
│   │   ├── FlyerGeneratorModal.jsx  # HTML5 Canvas poster creator for WhatsApp stories
│   │   ├── Footer.jsx               # Site footer with category links & admin trigger
│   │   ├── HeroBanner.jsx           # Auto-advancing 4-slide promotional carousel
│   │   ├── MobileBottomBar.jsx      # Sticky touch bar for mobile screens
│   │   ├── Navbar.jsx               # Top header with search, currency, All menu & cart
│   │   ├── PaymentModal.jsx         # Express checkout (M-Pesa STK, EcoCash USSD, Cash)
│   │   ├── ProductCard.jsx          # Individual product card with like heart & quick view
│   │   ├── ProductDetailModal.jsx   # Amazon-style full product inspection & direct comments
│   │   ├── ProductGrid.jsx          # Responsive product grid
│   │   ├── QuoteDrawer.jsx          # Slide-out cart & WhatsApp order generator
│   │   ├── ReviewsModal.jsx         # Customer reviews viewer
│   │   └── WhatsAppFloat.jsx        # Quick WhatsApp chat button
│   ├── data\
│   │   └── products.js              # 52 BASELINE_PRODUCTS, categories & product CRUD
│   ├── utils\
│   │   ├── analytics.js             # Client-side analytics event logger
│   │   ├── likes.js                 # Product like counts & toggle helpers
│   │   ├── orders.js                # Order tracking, storage & status management
│   │   ├── reviews.js               # Customer review storage, deletion & rating calculations
│   │   ├── storeConfig.js           # Dynamic store config & formatPrice() currency engine
│   │   └── whatsappAgentEngine.js   # Conversational WhatsApp AI rule parser
│   ├── App.jsx                      # Root application component & modal orchestration
│   ├── index.css                    # Tailwind CSS directives & custom animations
│   └── main.jsx                     # Vite DOM entry point
├── server\
│   └── standalone-whatsapp-agent.js # Local Node.js agent with Baileys QR code pairing
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 3. Data Layer Contracts

### 3.1 Product Object Schema
```javascript
{
  id: "fsh-01",                      // String: Unique SKU
  name: "Classic Button-Up Shirt",  // String: Title
  category: "fashion",               // String: category id matching CATEGORIES
  price: 7.50,                       // Number: Standard price in USD
  comradePrice: 7.00,                // Number: Student deal price in USD
  badge: "Under $8",                 // String: Visual badge tag
  isComradeDeal: true,               // Boolean: Flag for comrade deal filters
  rating: 4.8,                       // Number: Average rating (1-5)
  reviews: 42,                       // Number: Count of reviews
  description: "Breathable...",      // String: Long description
  sizes: ["M", "L", "XL"],           // Array<String> (optional)
  colors: ["Sky Blue", "White"],     // Array<String> (optional)
  scents: ["Vanilla", "Amber"],      // Array<String> (optional)
  image: "https://images.unsplash...",// String: Image URL or Base64 Data URL
  inStock: true                      // Boolean: Availability flag
}
```

### 3.2 Order Object Schema
```javascript
{
  id: "ORD-K89A2",                   // String: Generated unique order ID
  customerName: "Tariro M.",         // String: Customer name
  deliveryLocation: "Hall 4 Room 12",// String: Hostel / Hall / Gate
  notes: "Call when downstairs",     // String: Special requests
  items: [
    {
      id: "fsh-01",
      name: "Classic Button-Up Shirt",
      price: 7.50,
      quantity: 1,
      variant: "M"
    }
  ],
  totalUsd: 7.50,                    // Number: Order total in USD
  totalKsh: 975,                     // Number: Equivalent in KSh
  status: "Pending",                 // "Pending" | "Confirmed" | "Delivered" | "Cancelled"
  createdAt: "2026-10-18T07:20:00Z" // ISO Timestamp
}
```

### 3.3 Customer Review Schema
```javascript
{
  id: "rev_m1k8a9",                  // String: Unique review ID
  productId: "fsh-01",               // String: Associated product ID
  author: "Tariro M.",               // String: Customer name
  campus: "Main Campus Hostel",       // String: Campus or hostel location
  rating: 5,                         // Number: Star rating (1-5)
  date: "2 days ago",                // String: Date string
  comment: "Great quality shirt!..." // String: Customer feedback
}
```

---

## 4. Multi-Currency Engine (`formatPrice`)

The application supports three operational currencies via a unified utility in `src/utils/storeConfig.js`:

```javascript
export function formatPrice(usdAmount, activeCurrency = '$', config = DEFAULT_STORE_CONFIG) {
  const amount = Number(usdAmount) || 0;
  if (activeCurrency === 'KSh') {
    const kshRate = config?.exchangeRate || 130;
    return `KSh ${Math.round(amount * kshRate).toLocaleString()}`;
  }
  if (activeCurrency === 'EcoCash') {
    if (config?.ecocashMode === 'ZiG') {
      const zigRate = config?.ecocashRate || 28;
      return `ZiG ${Math.round(amount * zigRate).toLocaleString()}`;
    }
    return `EcoCash $${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
}
```

---

## 5. Free Cloud Database Migration Guide (PostgreSQL / Supabase)

To scale the system beyond browser `localStorage` to a centralized cloud database, use **Supabase** (completely free tier with 500MB PostgreSQL and instant REST APIs):

### Step 1: Execute SQL Schema in Supabase SQL Editor
```sql
-- 1. Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  comrade_price NUMERIC(10,2),
  badge TEXT,
  is_comrade_deal BOOLEAN DEFAULT false,
  rating NUMERIC(2,1) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  description TEXT,
  sizes TEXT[],
  colors TEXT[],
  scents TEXT[],
  image TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  total_usd NUMERIC(10,2) NOT NULL,
  total_ksh INTEGER,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Reviews Table
CREATE TABLE product_reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  campus TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Store Configuration Table
CREATE TABLE store_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products, reviews, and config
CREATE POLICY "Public products read" ON products FOR SELECT USING (true);
CREATE POLICY "Public reviews read" ON product_reviews FOR SELECT USING (true);
CREATE POLICY "Public config read" ON store_config FOR SELECT USING (true);

-- Allow public order insertion
CREATE POLICY "Public orders insert" ON orders FOR INSERT WITH CHECK (true);
-- Allow public review insertion
CREATE POLICY "Public reviews insert" ON product_reviews FOR INSERT WITH CHECK (true);
```

### Step 2: Supabase Client Adapter (`src/utils/supabaseClient.js`)
Install the lightweight client:
```bash
npm install @supabase/supabase-js
```
Initialize the client:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 6. Development Scripts

```bash
# Start Vite development server
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview

# Run standalone WhatsApp QR pairing agent server (port 4000)
npm run bot
```
