# 🏗️ MIDEVA'S COLLECTION — COMPLETE SYSTEM DOCUMENTATION
### *Production Architecture, Solved Bug Registers & Developer Anti-Regression Guide*
**System Name:** Mideva's Collection  
**Live Production URL:** [https://midevas-collection.vercel.app](https://midevas-collection.vercel.app)  
**Private Admin Link:** [https://midevas-collection.vercel.app/#admin](https://midevas-collection.vercel.app/#admin)  
**Mobile Interactive Guide:** [https://midevas-collection.vercel.app/guide](https://midevas-collection.vercel.app/guide)  
**Document Version:** 4.3.0 (Enterprise Handover Edition)  
**Last Updated:** 20 October 2026 | **Author/Maintainer:** Engineering Handover Team  
**Business Owner:** Mona Lisa Mideva (`monalisamideva@gmail.com`)  

---

> [!IMPORTANT]
> **CRITICAL DEVELOPER NOTICE — BUSINESS CONTINUITY MANDATE**  
> Mideva's Collection is a live, operating business serving university students. Any regression, unhandled storage overflow, or auth vulnerability will directly disrupt customer ordering and cause financial loss to the store owner.  
> **Before committing any code, read Section 12 ("Developer Guardrails & Solved Bug Register") to ensure you do not re-introduce previously solved architectural bugs.**

---

## 1. System Overview & Business Model

Mideva's Collection is a **zero-infrastructure-cost, campus e-commerce shopping platform** built as a client-side React SPA with Progressive Web App (PWA) capabilities and native WhatsApp order fulfillment.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MIDEVA'S COLLECTION COMMERCE FLOW                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Student opens https://midevas-collection.vercel.app on mobile browser   │
│ 2. Browses 52+ catalog items across 9 categories (Clothes, Perfumes, etc.) │
│ 3. Selects currency (USD $, Kenyan Shilling KSh, EcoCash USD/ZiG)           │
│ 4. Adds items to Quote Cart (calculates comrade savings & bulk discounts)   │
│ 5. Taps "Send Order via WhatsApp" → Pre-formatted WhatsApp order generated  │
│ 6. Order arrives on Owner Phone (+254 748 094795) via WhatsApp message      │
│ 7. Owner copies "WhatsApp Delivery Roster" from Admin Dashboard (#admin)    │
│ 8. Hostel Drop-off Run: Goods delivered to room, Cash/EcoCash collected!    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Architectural Principles
1. **Zero Monthly Infrastructure Overhead:** Zero database bills, zero server maintenance costs, hosted completely free on Vercel Edge.
2. **Offline-First & Local Storage Persistence:** Uses atomic `localStorage` operations for offline capability, with pre-wired Supabase cloud sync ready for multi-device expansion.
3. **WhatsApp-Centric Checkout:** Replaces expensive, high-friction card payment gateways with direct WhatsApp order generation, matching the communication habits of 98% of campus students.
4. **Resilient Client-Side Media Compression:** All user camera uploads are downscaled via HTML5 Canvas before persisting to avoid browser storage quota overflows.
5. **Strict Role-Based Access Control (RBAC):** Default state is strictly an unauthenticated Guest/Customer. Store management is locked behind a private passcode hash.

---

## 2. Frontend Component Architecture

### 2.1 Component Tree (`src/`)

```
App.jsx (Root Application Controller)
├── AnnouncementBar.jsx         — Dynamic top announcement scrolling ticker
├── Navbar.jsx                  — Edge-to-edge navbar (Search, Currency, Theme, Cart)
│   └── UserProfileDropdown.jsx — RBAC profile trigger (Guest / Customer / Admin)
├── HeroBanner.jsx              — Full-bleed auto-advancing promotional carousel
├── CategoryPills.jsx           — Category filter tabs with live item count badges
├── ProductGrid.jsx             — Responsive product catalog grid (desktop & mobile)
│   └── ProductCard.jsx         — Product card with image, price, like, & quick view
├── AmazonSidebarNav.jsx        — Slide-out department menu drawer with category links
├── AdminModal.jsx              — Master store management workspace (~2,977 lines)
│   ├── Tab: Orders & Quotes    — Order ledger, hostel drop-off status, & roster copy
│   ├── Tab: Live Stock & Price — Real-time price edits & stock +/- steppers
│   ├── Tab: Product Catalog    — CRUD items, photo uploads & factory reset
│   ├── Tab: CMS Page Manager   — Edit ticker announcements, banner slides & rates
│   ├── Tab: Profile & Security — Owner passcode management & contact information
│   ├── Tab: WhatsApp Bot Agent — Conversational engine simulator & reply tuning
│   └── Tab: Analytics          — Revenue summaries & popular item metrics
├── AuthModal.jsx               — Comrade customer registration & avatar sync
├── ProductDetailModal.jsx      — Amazon-style modal with size/color variants
├── QuoteDrawer.jsx             — Slide-out cart with multi-currency totals & WhatsApp URL
├── PaymentModal.jsx            — Express checkout helper (M-Pesa Till & EcoCash)
├── FlyerGeneratorModal.jsx     — Canvas-based WhatsApp Story & Status poster creator
├── ReviewsModal.jsx            — Customer feedback and star review viewer
├── ChatWidget.jsx              — Floating student shopping assistant chatbot
├── MobileBottomBar.jsx         — Sticky touch bottom navigation bar for smartphones
├── WhatsAppFloat.jsx           — Floating WhatsApp support & 110+ comrade group button
├── ToastNotification.jsx       — Real-time toast alert feedback system
└── Footer.jsx                  — Edge-to-edge footer with categories, policies & badge
```

### 2.2 Event-Driven State Bus

The application coordinates global updates across disconnected components using native Custom Events:

| Event Name | Dispatched When | Handled By |
|:---|:---|:---|
| `'midevas-catalog-updated'` | Product added, price changed, or stock adjusted | `App.jsx`, `ProductGrid.jsx`, `AdminModal.jsx` |
| `'midevas-auth-updated'` | Owner/Seller logs in or logs out | `App.jsx`, `Navbar.jsx`, `UserProfileDropdown.jsx` |
| `'midevas-customer-updated'` | Student registers or updates hostel room | `App.jsx`, `UserProfileDropdown.jsx` |
| `'midevas-theme-changed'` | User switches Day / Night mode | `App.jsx`, document root classes |

---

## 3. Storage Architecture & Keys

All state is stored with clear namespaces in `localStorage`. 

```
┌───────────────────────────────┬──────────────────────────────────────────────┐
│ Storage Key                   │ Description & Data Shape                     │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ `midevas_catalog_products`    │ Array of 52+ product objects (id, price,     │
│                               │ comradePrice, inStock, stockCount, image...) │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ `midevas_orders`              │ Array of order quotes (id, customer, items,  │
│                               │ hostelRoom, total, status, timestamp)        │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ `midevas_auth_user`           │ Current session user ({role, name, email,    │
│                               │ passcode, title})                            │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ `midevas_customer_user`       │ Customer profile ({name, email, room, photo})│
├───────────────────────────────┼──────────────────────────────────────────────┤
│ `midevas_store_config`        │ CMS settings ({exchangeRate, zigRate,        │
│                               │ announcement, ecocashNumber, isOpen...})     │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ `midevas_whatsapp_agent_config`│ Bot assistant tuning ({enabled, agentName,   │
│                               │ welcomeMsg, outOfOfficeMsg, tillNumber...})  │
├───────────────────────────────┼──────────────────────────────────────────────┤
│ `midevas_theme`               │ `'light'` or `'dark'`                        │
└───────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 4. Multi-Currency Conversion Engine

Prices are stored internally in **USD ($)** as the baseline decimal currency. Conversions are calculated dynamically in real-time across the app using `src/utils/storeConfig.js`:

```javascript
export function formatPrice(usdAmount, activeCurrency, config) {
  const kshRate = config?.exchangeRate || 130;
  const zigRate = config?.zigRate || 28;

  if (activeCurrency === 'KSh') {
    return `KSh ${Math.round(usdAmount * kshRate).toLocaleString()}`;
  }
  if (activeCurrency === 'EcoCash') {
    if (config?.ecocashMode === 'ZiG') {
      return `ZiG ${Math.round(usdAmount * zigRate).toLocaleString()}`;
    }
    return `EcoCash $${usdAmount.toFixed(2)}`;
  }
  return `$${usdAmount.toFixed(2)}`;
}
```

* **USD ($):** Displayed as `$X.XX`
* **Kenyan Shilling (KSh):** Rounded to nearest integer (`Math.round(usd * 130)`)
* **EcoCash (Zimbabwe):** Supports both USD direct and ZiG conversion modes

---

## 5. Role-Based Access Control (RBAC) Matrix

The system implements four distinct user tiers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            RBAC PERMISSIONS MATRIX                          │
├─────────────────────┬───────────┬──────────────┬─────────────┬──────────────┤
│ Feature / Action    │ Guest     │ Student/User │ Campus Reseller│ Store Owner │
│                     │ (Default) │ (Comrade)    │ (Seller Desk)│ (Admin)      │
├─────────────────────┼───────────┼──────────────┼─────────────┼──────────────┤
│ Browse Catalog      │    ✅     │      ✅      │     ✅      │      ✅      │
│ Add to Quote Cart   │    ✅     │      ✅      │     ✅      │      ✅      │
│ Send WhatsApp Order │    ✅     │      ✅      │     ✅      │      ✅      │
│ User Profile Avatar │    ❌     │      ✅      │     ✅      │      ✅      │
│ View Admin Portal   │    ❌     │      ❌      │     ✅      │      ✅      │
│ Edit Stock Counts   │    ❌     │      ❌      │     ✅      │      ✅      │
│ Edit Product Prices │    ❌     │      ❌      │     ❌      │      ✅      │
│ Add / Delete Items  │    ❌     │      ❌      │     ❌      │      ✅      │
│ Edit CMS & Ticker   │    ❌     │      ❌      │     ❌      │      ✅      │
│ Change Passcode     │    ❌     │      ❌      │     ❌      │      ✅      │
└─────────────────────┴───────────┴──────────────┴─────────────┴──────────────┘
```

* **Default State:** Any new visitor is assigned `Guest` role. The header displays `"Sign In"`. No admin capabilities are exposed.
* **Customer Registration:** Generates a personalized profile avatar from the user's email or image upload and stores hostel delivery details for 1-click checkout.
* **Admin Authentication:** Restricted to the owner passcode (default: `mideva2026`).

---

## 6. WhatsApp Commerce & AI Bot Agent Engine

### 6.1 WhatsApp Deep-Link Construction

When checking out from `QuoteDrawer.jsx`, the system builds an itemized, URL-encoded string targeting `wa.me/<whatsappNumber>`:

```text
Hello Mideva! 🛍️
I'd like to place an order from Mideva's Collection:

• 1× Classic Button-Up Cotton Shirt (Size: L, Color: Sky Blue) - $7.00
• 1× Vanilla Scent EDP Pocket Perfume (35ml) - $2.50

Total: $9.50 (approx KSh 1,235)
Delivery: Hall 4 Room 204 (Main Campus)
Customer: Tariro Moyo (+254 748 094 795)
Payment: Cash on Delivery / EcoCash

Please confirm availability and drop-off time! 🎓
```

### 6.2 Conversational Agent Parser (`src/utils/whatsappAgentEngine.js`)

The app includes a natural-language intent parser that powers automated replies for the web simulator and the Meta Cloud Webhook (`api/whatsapp-webhook.js`):
1. **Greeting (`hi`, `hello`, `menu`):** Returns the numbered campus catalog menu.
2. **Category Selection (`1`-`7`):** Formats deals, handbags, perfumes, shirts, and tuckshop snacks with active prices in USD & KSh.
3. **Natural Order Parser (`order ...`, `i want ...`):** Scans customer text against catalog titles, extracts line items, computes running totals, and asks for hostel room confirmation.
4. **Human Hand-Off (`8`, `human`, `speak`):** Alerts Mona Lisa that a student requested personal assistance.

---

## 7. Media Pipeline & Camera Compression

### 7.1 The Storage Quota Problem
Modern smartphone cameras capture images at 12MP–48MP resolution, resulting in 5MB–15MB JPEG/HEIC files. Raw Base64 string encoding inflates binary data by ~33%. Saving an uncompressed 10MB photo directly into browser `localStorage` exceeds the 5MB–10MB storage quota, throwing an unhandled `QuotaExceededError` that crashes the save operation.

### 7.2 The HTML5 Canvas Downscaling Solution
In `src/components/AdminModal.jsx`, `handleImageFileUpload` routes all file uploads through an automatic downscaling pipeline:

```javascript
// src/components/AdminModal.jsx:358-390
const handleImageFileUpload = (e, target = 'new') => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (uploadEvent) => {
    const rawDataUrl = uploadEvent.target?.result;
    if (typeof rawDataUrl !== 'string') return;

    // Load into in-memory Image
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_DIM = 800; // Constrain to 800px max width/height
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        }
      } else {
        if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Compress to lightweight JPEG (~60KB - 90KB)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

      if (target === 'new') setNewProdImg(compressedDataUrl);
      else if (target === 'edit' && editingProduct) {
        setEditingProduct((prev) => ({ ...prev, image: compressedDataUrl }));
      }
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
};
```

---

## 8. Multi-Format Handover & Documentation System

All handover materials are co-located directly in the repository under `handover/`:

```
handover/
├── Midevas_Collection_Owner_Guide.docx — Standalone Word doc with offline embedded PNGs
├── MIDEVA_MOBILE_GUIDE.html            — Touch-optimized phone app with 1-tap copy
├── START_HERE_MIDEVA.html              — Offline visual desktop dashboard
├── USER_GUIDE.md                       — 9-chapter illustrated handbook
├── STORE_CREDENTIALS.txt               — Quick credentials text sheet
├── DEVELOPER_GUIDE.md                  — Full technical engineering guide & Supabase DDL
├── SYSTEM_DOCUMENTATION.md             — This master architecture document
├── SECURITY_NOTES.md                   — Threat model and RBAC analysis
├── PITCH_DOC.md                        — Campus business plan and wireframes
├── Midevas-Collection-Handover-Package.zip — Full 30MB compressed archive
└── screenshots/                        — 22 full-resolution PNG screenshots
```

### Live Public URLs
* **Mobile Interactive Guide:** `https://midevas-collection.vercel.app/guide`
* **Screenshot CDN:** `https://midevas-collection.vercel.app/screenshots/handover-XX.png`

---

## 9. Automated Testing & Verification Suite

### 9.1 Test Scripts
The project includes automated regression tests using `puppeteer-core` with system Google Chrome:
* **`test-rbac-and-layout.mjs`**: Validates Guest default state, zero pre-signed sessions, full-width edge-to-edge navbar styling, and dark mode toggle.
* **`test-handover-screenshots.mjs`**: Automates capture of all 22 store, modal, and admin screens into `public/screenshots/`.

### 9.2 Running Verification Locally
```bash
# 1. Start development server
npm run dev

# 2. In a separate terminal, run layout & RBAC verification
node test-rbac-and-layout.mjs

# 3. Build for production verification
npm run build
```

---

## 10. Serverless Functions

* **`api/whatsapp-webhook.js`**:
  * **GET:** Handles Meta webhook handshake challenge via `hub.verify_token`.
  * **POST:** Ingests incoming WhatsApp chat events, parses customer message through `processWhatsAppMessage()`, and returns automated responses.

---

## 11. Cloud Synchronization (Optional Supabase Upgrade)

When Mona Lisa Mideva requests real-time cross-device sync between her laptop and smartphone:
1. Create a free Supabase project at [https://supabase.com](https://supabase.com).
2. Execute the provided DDL schema in `handover/DEVELOPER_GUIDE.md` (`products`, `orders`, `store_config` tables).
3. Set environment variables in Vercel:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
4. Deploy — `src/utils/supabaseClient.js` will automatically activate cloud sync while falling back to `localStorage` offline.

---

## 12. ⚠️ DEVELOPER GUARDRAILS & SOLVED BUG REGISTER

### 🚫 Anti-Regression Checklist for Future Developers

#### 1. NEVER Remove or Bypass Canvas Downscaling (`handleImageFileUpload`)
* **Bug Prevented:** `DOMException: QuotaExceededError` on phone camera photo uploads.
* **Rule:** Any image uploaded from a device must be resized to max 800px and converted to a compressed JPEG before saving to state or `localStorage`.

#### 2. NEVER Hardcode Personal Test Names or Developer Identities
* **Bug Prevented:** Developer test identities leaking into customer-facing storefront or invoice fields.
* **Rule:** The business owner is Mona Lisa Mideva (`monalisamideva@gmail.com`). Default user must always be Guest (`role: 'guest'`). All test accounts must remain purged.

#### 3. NEVER Use Relative Paths for Documentation Screenshots
* **Bug Prevented:** `"Preview unavailable"` broken image icons in GitHub, chat previews, and external markdown readers.
* **Rule:** Documentation images must link to `https://midevas-collection.vercel.app/screenshots/handover-XX.png` (live CDN) or `./screenshots/` in local package distributions.

#### 4. NEVER Break Hash-Based Admin Routing (`#admin`)
* **Bug Prevented:** 404 Not Found on Vercel page refreshes.
* **Rule:** The SPA uses hash navigation (`#admin`, `#store`). Do not convert to pushState router without configuring rewrite rules in `vercel.json`.

#### 5. DO NOT Rely Exclusively on Logged Website Quotes
* **Business Protection Rule:** A quote logged in the Admin dashboard does not guarantee the student completed checkout. The store owner must always confirm receipt of the actual WhatsApp chat message before dispatching hostel delivery runs.

#### 6. PRESERVE the Emergency Catalog Reset (`handleResetCatalog`)
* **Business Protection Rule:** If a non-technical store owner accidentally deletes products or enters invalid prices, the red **"Reset to Factory Catalog"** button in `AdminModal.jsx` safely restores all 52 baseline products from `src/data/products.js`. Never remove this fallback.

---

*Certified Production Architecture. Version 4.3.0. Ready for Handover.*
