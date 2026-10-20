# 🔒 Mideva's Collection — Security Assessment & Hardening Notes
### *Threat Modeling, Storage Boundaries & Production Hardening Guide*

---

## 1. Executive Security Overview

Mideva's Collection currently operates as a client-side Single Page Application (SPA) with zero external server dependencies, paired with an optional Vercel Serverless Webhook for WhatsApp automation.

Because the system handles campus customer inquiries and orders without storing sensitive credit card numbers or banking passwords, the system's threat profile is **Low to Moderate**. However, as user volume grows, key architectural controls must be hardened.

---

## 2. Threat Modeling & Storage Boundaries

### Current Architecture: Browser LocalStorage
- **What is stored:** Product catalog overrides, customer reviews, order history, analytics events, and store configuration.
- **Benefits:**
  - Zero server hosting bills ($0.00/month).
  - No database breach risk (each customer's cart and interactions exist solely on their local device).
  - Resilient to network outages (PWA caches assets locally).
- **Tradeoffs & Risks:**
  - **Device Isolation:** If Mideva adds a product on her laptop, that change is only in her laptop's browser localStorage. Customers see the factory 52 products unless a centralized database or shared sync mechanism is used.
  - **Client-Side Auth Limitation:** The current admin authentication validates the passcode (`mideva2026`) in client-side JavaScript. Any developer opening browser DevTools can inspect the source code.
  - **Storage Clearing:** If Mideva clears her browser cache or history, custom products and local order logs stored only in that browser will be reset to defaults.

### Role-Based Access Control (RBAC) Enforcement
- **Customer Isolation:** Customers/Comrades registered via `AuthModal` are assigned strictly `role: 'customer'`. They possess **zero modification privileges**; client-side helper functions (`canAccessAdmin`, `canEditStock`, `canEditPrices`, `canManageCMS`) return `false` unconditionally.
- **Passcode-Protected Elevation:** Only staff accounts (`admin` and `seller`) with valid passcodes can unlock administrative controls.
- **Client Boot Storage Sanitizer:** On every application mount, the system inspects `localStorage` and purges any deprecated or unauthorized session keys before rendering components.

---

## 3. Recommended Production Hardening Path

### Step 1: Upgrading Admin Authentication (From Passcode to Free JWT Auth)
Instead of client-side passcode matching:
1. Use **Supabase Auth** or **Firebase Auth** (both provide 50,000 monthly active users for free).
2. Mideva logs in using an email magic link or secure password with bcrypt hashing.
3. The server issues a secure, HTTP-only JWT token.
4. Admin endpoints verify the token before allowing product inserts, price modifications, or order deletions.

### Step 2: Meta Webhook Security (`api/whatsapp-webhook.js`)
The Vercel serverless webhook currently implements:
1. **Verification Token Handshake:** Verifies `hub.verify_token` against `WHATSAPP_VERIFY_TOKEN` before responding with `hub.challenge`.
2. **Next Hardening Step — Payload Signature Validation:**
   In production, Meta sends an `X-Hub-Signature-256` header containing a SHA-256 HMAC of the request body signed with the Meta App Secret.
   ```javascript
   import crypto from 'node:crypto';

   function verifyMetaSignature(req, appSecret) {
     const signature = req.headers['x-hub-signature-256'];
     if (!signature) return false;
     const expected = 'sha256=' + crypto
       .createHmac('sha256', appSecret)
       .update(JSON.stringify(req.body))
       .digest('hex');
     return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
   }
   ```

### Step 3: Input Sanitization & XSS Prevention
- All user-submitted customer comments (`ReviewsModal.jsx`, `ProductDetailModal.jsx`) and order notes (`QuoteDrawer.jsx`) are rendered as text children in React JSX.
- React automatically escapes string values before insertion into the DOM, mitigating classic reflected Cross-Site Scripting (XSS).
- When migrating to a backend database, inputs must be stripped of HTML tags using a library such as `DOMPurify` or sanitized via parameterized SQL queries.

### Step 4: Rate Limiting & Bot Protection
- In the public WhatsApp quote drawer and review submission forms, add a client-side debounce and hidden honeypot field.
- If upgrading to a backend API, integrate Vercel's Edge Middleware or Cloudflare Turnstile (free) to block automated spam submissions.

---

## 4. Production Security Checklist

| Check | Status | Action Required |
| :--- | :---: | :--- |
| **No Credit Cards Stored** | ✅ PASS | Payments use peer Cash, M-Pesa STK, or EcoCash USSD. No card data touches the server. |
| **HTTPS Only** | ✅ PASS | Enforced automatically by Vercel's global edge network. |
| **XSS Protection** | ✅ PASS | React JSX auto-escapes all student comments and product titles. |
| **Content Security Policy (CSP)** | ⚠️ PENDING | Add `Content-Security-Policy` header in `vercel.json` restricting script execution to self. |
| **Database Row Level Security** | ⚠️ PENDING | Execute RLS policies in Supabase when migrating from localStorage (see Developer Guide). |
| **Meta Webhook Signature Check** | ⚠️ PENDING | Add `verifyMetaSignature` once Meta App Secret is configured in Vercel environment variables. |

---

## 5. Summary Recommendation for Mideva

The current architecture is **production-safe for immediate campus commercial launch**. Because customers do not transmit passwords or debit card credentials, the risk is negligible. When order volume reaches **50+ orders per day**, proceed with the Supabase database migration outlined in [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).
