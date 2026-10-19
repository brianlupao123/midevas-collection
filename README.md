# 🛍️ Mideva's Collection — Full Campus E-Commerce & WhatsApp Platform
### *Production-Grade Campus Shopping Mall & WhatsApp Order Engine for Mona Lisa Mideva*

> **Live Production Store:** [https://midevas-collection.vercel.app](https://midevas-collection.vercel.app)  
> **Official WhatsApp Order Line:** `+254 748 094795`  
> **Official Student Group Invite (110+ members):** [https://chat.whatsapp.com/GuRW4nzqO251oyPcC5MRwH](https://chat.whatsapp.com/GuRW4nzqO251oyPcC5MRwH)  
> **EcoCash Line:** `0774809479`  

---

## 🌟 Executive Overview

**Mideva's Collection** is an asset-light, production-ready campus e-commerce shopping mall and WhatsApp conversational ordering platform built for student reseller **Mona Lisa Mideva**. The platform enables university students living across campus hostels and residential halls to browse 52+ comrade-affordable products, view high-resolution specifications and student reviews, select sizes and scents, choose their operational currency (**USD $, Kenyan Shillings KSh, or Zimbabwean EcoCash**), and complete purchases via **WhatsApp One-Click Checkout**, **Express Payment (M-Pesa STK push & EcoCash USSD)**, or **Cash on Hostel Door Delivery**.

The entire system operates at **$0.00 operational software cost** using modern client-side architectures, Vercel serverless edge functions, and Progressive Web App (PWA) standards.

---

## 📚 Complete Handover & Documentation Suite

The project includes an exhaustive, publication-grade documentation suite covering every operational, technical, and business aspect of the platform:

| Document | Primary Audience | Scope & Description |
|:---|:---|:---|
| **[HANDOVER.md](./HANDOVER.md)** | **Business Owner & Stakeholders** | **Master Handover Certificate:** Transfer of ownership, complete credentials matrix, system architecture, feature inventory, maintenance schedules, and acceptance checklist. |
| **[USER_GUIDE.md](./USER_GUIDE.md)** | **Mona Lisa Mideva & Resellers** | **Exhaustive User Manual:** Complete login credentials for all 4 roles, step-by-step navigation workflows, live inventory steppers, 1-click delivery rosters, and screenshot mapping. |
| **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** | **Software Engineers** | **Developer Handbook:** Puppeteer browser automation techniques, event-driven decoupled component architecture, hash routing, multi-currency engine, edge webhook, and Supabase PostgreSQL schema. |
| **[SYSTEM_DOCUMENTATION.md](./SYSTEM_DOCUMENTATION.md)** | **Technical Leads** | **Complete System Functionality:** Component hierarchy tree, state synchronization events, data layer contracts, order life cycle, and Progressive Web App service worker offline cache. |
| **[PITCH_DOC.md](./PITCH_DOC.md)** | **Investors & Campus Partners** | **Business Pitch Deck with Wireframes:** Full-bleed storefront, Amazon-style modal, admin workspace, and mobile wireframes; TAM/SAM/SOM market analysis, unit economics (34% margin), and scaling roadmap. |
| **[SECURITY_NOTES.md](./SECURITY_NOTES.md)** | **DevSecOps** | **Security Assessment:** RBAC threat modeling, startup storage sanitization, Meta webhook SHA-256 HMAC signature validation, XSS escaping, and production hardening checklist. |
| **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** | **Project Managers** | **Milestone History & Changelog:** Complete git commit history from initial catalog to current Phase 3.2, and 12-month cloud database and franchise roadmap. |

---

## 🔑 Default Credentials & Role-Based Access Control (RBAC)

| Role | Access Method | Credentials | Privileges |
|:---|:---|:---|:---|
| **1. Guest / Visitor** | No login required (default) | None | Browse 52 items, filter by category/price, add to quote, send WhatsApp order |
| **2. Comrade (Customer)** | Header Profile → Create Account | Full Name, WhatsApp, Hostel Room, Email *(syncs avatar)* | Saved hostel room delivery pass, 1-click checkout, past quotes history, email photo in header |
| **3. Campus Reseller (Seller)** | Header Profile → Staff & Admin Sign In | **Email:** `seller@midevas.co.ke`<br/>**Passcode:** `seller123` | Manage inventory steppers (±1, ±5, ±10), update prices, export WhatsApp delivery rosters |
| **4. System Lead (Admin)** | Header Profile → Staff & Admin Sign In | **Email:** `monalisamideva@gmail.com`<br/>**Passcode:** `mideva2026` | Full system control: catalog CRUD, camera photo uploads, CMS editor, AI bot config, master passcode |

---

## ✨ Key Feature Highlights

### 1. 🛍️ Amazon-Style Product Experience
- **Amazon-Style Product Detail Modal (`ProductDetailModal.jsx`):** High-res image inspection, dynamic comrade deal savings calculations, interactive variant selection (size, color, scent), quantity steppers, and social sharing links.
- **Embedded Customer Reviews & Comments:** Verified comrade buyer testimonials, star ratings, and an instant form for students to post reviews directly.
- **Amazon Department Navigation Drawer (`AmazonSidebarNav.jsx`):** Slide-out drawer with department categories, *"🔥 Comrade Deals Only"*, price filters (`< $4`, `< $5`, `< $10`), and quick currency toggle.
- **Frequently Bought Together:** Smart recommendation carousels in product modals.

### 2. 💱 Dynamic 3-Way Currency Engine
- **USD ($):** Standard base currency.
- **Kenyan Shillings (KSh):** Live conversion at customizable rate (default `130 KSh/USD`).
- **EcoCash (Zimbabwe):** Supports both **USD mode** (`EcoCash $5.00`) and **ZiG mode** (`ZiG 140` at default `28 ZiG/USD`) with custom USSD instructions for Zimbabwean students.

### 3. ⚡ Admin Command Center ("Less UI, Do More")
- **1-Click Top Command Strip:**
  - 1-click Store Status toggle: *Open for Orders (Green)*, *On Delivery Run (Amber)*, *Closed (Red)*.
  - 1-click Free Campus Delivery toggle.
  - **📋 1-Click WhatsApp Delivery Run Sheet:** Instantly formats all pending orders with hostel room numbers and totals, ready to paste into WhatsApp.
  - **⚡ 1-Click Order Confirmation:** Approves all pending orders in one tap.
- **Full Product Catalog CRUD:** Add items, change prices, toggle stock availability, and **upload photos directly from phone/laptop camera**.
- **🎨 CMS Page Content Editor:** Change hero slides, announcement ticker marquee, delivery notices, taglines, and payment methods live with zero code.
- **👤 Profile & Security Auth:** Update owner avatar, contact numbers, and change admin passcode.

### 4. 🤖 WhatsApp Conversational AI Agent
- **Engine (`whatsappAgentEngine.js`):** Built-in intent parser handling catalog lookups, comrade deals, delivery policies, and payment instructions.
- **Admin Phone Simulator:** Live chat bubble simulator in the Admin modal for testing responses.
- **Vercel Serverless Webhook (`api/whatsapp-webhook.js`):** Live Meta WhatsApp Cloud API endpoint ready for 24/7 automated messaging.
- **Local Pairing Server (`server/standalone-whatsapp-agent.js`):** Optional QR-code pairing server via Baileys at `localhost:4000/pair`.

### 5. 🎨 WhatsApp Story Flyer Generator
- Built-in HTML5 Canvas poster creator.
- Generates **9:16 vertical WhatsApp stories** or **1:1 square Instagram posters** highlighting products, discounts, and hostel drop-offs with 1-click PNG download.

### 6. 📱 Progressive Web App (PWA)
- Installable on mobile home screens (Android & iOS).
- Offline-ready with service worker caching.

---

## 🚀 Quickstart for Developers

```bash
# 1. Clone repository
git clone https://github.com/brianlupao123/midevas-collection.git
cd midevas-collection

# 2. Install dependencies
npm install

# 3. Start local development server (port 5180)
npm run dev

# 4. Compile production build
npm run build

# 5. Run automated layout & RBAC verification
node test-rbac-and-layout.mjs

# 6. Capture full 17-screenshot handover suite
node take-all-handover-screenshots.mjs
```

---

## 📸 Verified Handover Screenshot Suite

The repository includes 17 high-resolution screenshots covering all user navigation flows:

1. `handover-01-storefront-hero.png` — Edge-to-edge desktop storefront with full-bleed hero banner
2. `handover-02-product-catalog.png` — Product grid with category pills and price filters
3. `handover-03-sidebar-nav.png` — Amazon-style department drawer
4. `handover-04-product-detail.png` — Product detail modal with variant selector & reviews
5. `handover-05-cart-drawer.png` — Quote drawer with multi-currency totals & WhatsApp generator
6. `handover-06-dark-mode.png` — Complete storefront rendered in dark/night theme
7. `handover-07-mobile-view.png` — Mobile viewport (375×812) with sticky touch bottom bar
8. `handover-08-footer.png` — Storefront footer with contacts & department shortcuts
9. `handover-09-signin-dropdown.png` — Header profile dropdown with sign-in trigger
10. `handover-10-auth-modal.png` — Comrade customer registration modal with live email avatar
11. `handover-11-customer-logged-in.png` — Signed-in customer with header photo avatar
12. `handover-12-seller-workspace.png` — Campus Reseller (Seller) workspace with inventory steppers
13. `handover-13-admin-signin.png` — Staff & Admin passcode authentication screen
14. `handover-14-admin-dashboard.png` — Admin master workspace overview with revenue metrics
15. `handover-15-admin-livestock.png` — Live stock & rapid price controls table
16. `handover-16-admin-orders.png` — Admin orders & quotes management hub
17. `handover-17-admin-cms.png` — Admin CMS page content editor (slides, ticker, store bio)

---

## 📄 License & Ownership

Created for **Mona Lisa Mideva**. All rights reserved. Deployed to production at [https://midevas-collection.vercel.app](https://midevas-collection.vercel.app).
