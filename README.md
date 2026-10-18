# 🛍️ Mideva's Collection — Full Campus E-Commerce & WhatsApp Platform

> **Live Production Store:** [https://midevas-collection.vercel.app](https://midevas-collection.vercel.app)  
> **Official WhatsApp Order Line:** `+254 748 094795`  
> **Official Student Group Invite (110+ members):** [https://chat.whatsapp.com/GuRW4nzqO251oyPcC5MRwH](https://chat.whatsapp.com/GuRW4nzqO251oyPcC5MRwH)  
> **EcoCash Line:** `0774809479`  

---

## 🌟 Executive Overview

**Mideva's Collection** is a production-ready, hyper-local campus shopping platform built for student reseller **Mona Lisa Mideva**. The platform enables tertiary students across university hostels and halls to browse 52+ comrade-affordable products, view detailed specifications and fellow student reviews, choose sizes/variants, select their currency (USD, KSh, or Zimbabwean EcoCash), and complete purchases via **WhatsApp One-Click Checkout**, **Express Payment (M-Pesa STK push & EcoCash USSD)**, or **Cash on Hostel Delivery**.

The entire platform operates at **$0.00 operational cost** using modern client-side architectures, Vercel serverless edge functions, and Progressive Web App (PWA) standards.

---

## 📚 Complete Documentation Suite

For comprehensive details on every facet of the system, consult the dedicated guides:

| Document | Purpose & Audience |
| :--- | :--- |
| [USER_GUIDE.md](./USER_GUIDE.md) | **Step-by-step user manual for Mideva:** How to login, add products, upload photos, manage orders, generate WhatsApp delivery rosters, change hero slides, and update exchange rates. |
| [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) | **Changelog & roadmap:** Full git commit history from initial catalog to current Phase 3.0, and future scaling milestones (Supabase, push notifications, multi-campus). |
| [PITCH_DOC.md](./PITCH_DOC.md) | **Business pitch deck:** Economic model, TAM/SAM/SOM, comrade pricing advantages, 34% unit margins, and campus retail disruption. |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | **Developer reference:** Architecture tree, data contracts, state management, Vercel serverless webhooks, and complete SQL schema for Supabase/PostgreSQL migration. |
| [SECURITY_NOTES.md](./SECURITY_NOTES.md) | **Security assessment:** Threat modeling, localStorage tradeoffs, admin auth hardening, Meta webhook signature validation, and production security checklist. |

---

## ✨ Feature Highlights

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
- **Login Credentials:** `monalisamideva@gmail.com` / `mideva2026` (passcode editable in admin).
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
# 1. Clone the repository
git clone https://github.com/monalisamideva/midevas-collection.git
cd midevas-collection

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build

# 5. Run optional local WhatsApp QR pairing bot
npm run bot
```

---

## 🔒 Security & Default Credentials

| Field | Production Default |
| :--- | :--- |
| **Admin Portal** | Click the lock icon in the top right navbar |
| **Admin Email** | `monalisamideva@gmail.com` |
| **Default Passcode** | `mideva2026` (changeable in Profile tab) |
| **WhatsApp Line** | `+254 748 094795` |
| **EcoCash Number** | `0774809479` |
| **Webhook Verify Token** | `mideva_campus_secret_token_2026` |

---

## 📄 License & Ownership

Created for **Mona Lisa Mideva** by **Brian Lupao**. All rights reserved. Built for production deployment across tertiary university campuses.
