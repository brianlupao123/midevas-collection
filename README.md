# 🛍️ Mideva's Collection — Marketing Catalog & Instant WhatsApp Quote Tool

A modern, high-converting e-commerce catalog and instant quote/order system built for **Mideva's Collection for Both Ladies and Gentlemen**.

Adapted from the catalog and quote-drawer architecture of the Orac Web demo, this platform enables WhatsApp group members and social media shoppers to browse products, select sizes and colors, build a live cart, and send structured orders straight to WhatsApp in one click.

---

## 🌟 Key Features

1. **Category Filtering & Search**:
   - 👔 **Men's Apparel**: Shirts (< $8), Graphic Streetwear & Plain Tees (< $4), Polos.
   - 👜 **Ladies' Handbags**: Classic Structured Handbags ($10), Crossbody Slings ($6), Canvas Totes.
   - 🌸 **Perfumes & Grooming**: 24h Long-Lasting Pocket Perfumes (< $5), Fresh Hair & Body Sprays (< $4).
   - 🪥 **Everyday Essentials**: Charcoal Toothbrush 3-Pack (3 for $1), Plush Hot Water Bottles ($4), Insulated Tumblers.
2. **Instant Quote & Order Drawer**:
   - Slide-out cart with quantity controls and instant price calculation.
   - Dual currency support ($ USD and KSh).
   - Customer name, room/hostel, and special request fields.
3. **One-Click WhatsApp Order Generation**:
   - Formats the entire order into a structured WhatsApp message with items, quantities, subtotal, and hostel drop-off location.
   - Sends directly to Mideva with zero friction.
4. **WhatsApp Community Integration**:
   - Prominent links to the official **110+ members WhatsApp group**.
   - Floating chat assistant for direct customer inquiries.
5. **Mobile-First & Fast**:
   - Tailwind CSS with responsive layout and glassmorphism styling.
   - Lightweight bundle powered by Vite and React 18.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5180`.

### 3. Production Build
```bash
npm run build
```

---

## ⚙️ Configuration

To update store contact info, WhatsApp number, or prices, edit `src/data/products.js`:
```javascript
export const STORE_CONFIG = {
  storeName: "Mideva's Collection",
  whatsappNumber: "254700000000", // Update with Mideva's phone number
  whatsappGroupInvite: "https://chat.whatsapp.com/invite/...",
  ...
};
```
