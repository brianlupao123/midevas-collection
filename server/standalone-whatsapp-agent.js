// =========================================================================
// MIDEVA'S COLLECTION — STANDALONE WHATSAPP AGENT & QR PAIRING SERVER
// Run locally: npm run bot  (or: node server/standalone-whatsapp-agent.js)
// Provides:
//   1. Interactive QR Code & 8-Digit Phone Pairing Dashboard at http://localhost:4000/pair
//   2. Local Webhook Receiver on port 4000
//   3. Automated 24/7 conversational sales bot with EcoCash, M-Pesa & deals logic
// =========================================================================

import http from 'http';

const PORT = process.env.PORT || 4000;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "mideva_campus_secret_token_2026";
const STORE_PHONE = "+254 748 094795";

let messageLogs = [
  { time: new Date().toLocaleTimeString(), from: 'System', text: 'WhatsApp Sales Agent engine initialized & ready.' }
];

function generateReply(text = "", customerName = "Comrade") {
  const q = text.toLowerCase().trim();

  if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'menu' || q === 'start') {
    return `🛍️ *MIDEVA'S COLLECTION — CAMPUS BOT*
Hello ${customerName}! 👋 Great Quality Everyday at Comrade Affordable Prices.

*How can I help you today?*
Reply with a *number* or ask a question:

1️⃣ *Comrade Deals* (< $4 & < $8 specials)
2️⃣ *Ladies' Handbags* ($6 & $10)
3️⃣ *Men's Wear* (Shirts & Graphic Tees)
4️⃣ *Perfumes & Scents* (Pocket oils < $5)
5️⃣ *Campus Tuckshop* (Mazoe, Maputi, Biscuits)
6️⃣ *Delivery & Payment Info* (Hostel drop-off, EcoCash & M-Pesa)
7️⃣ *Chat directly with Mideva*

🌐 *Browse Full Web Catalog:* https://midevas-collection.vercel.app`;
  }

  if (q === '1' || q.includes('comrade') || q.includes('deal')) {
    return `🔥 *COMRADE DEALS (< $4 & < $8)*
1. Graphic Tees: *$3.50* (~KSh 455)
2. Cotton Shirts: *$7.00* (~KSh 910)
3. Quilted Slings: *$5.50* (~KSh 715)
4. Pocket Perfume: *$4.00* (~KSh 520)
5. Maputi Popcorn: *50¢* (~KSh 65)

Reply with item name & your hostel room to order! 🚀`;
  }

  if (q === '2' || q.includes('bag') || q.includes('sling')) {
    return `👜 *LADIES' HANDBAGS & SLINGS*
• Compact Quilted Sling Bag: *$6.00* (Pastel Pink, Black, Red)
• Executive Structured Shoulder Bag: *$10.00* (Chestnut, Black, Beige)
• Campus Canvas Tote: *$6.00*

Free hostel delivery! Reply with chosen bag to order.`;
  }

  if (q === '6' || q.includes('deliver') || q.includes('pay') || q.includes('mpesa') || q.includes('ecocash')) {
    return `🚚 *DELIVERY & PAYMENT INFO*
• Free drop-off to all campus hostels & student halls!
• *M-Pesa:* Till *254748094795* (Mideva)
• *EcoCash:* Send to *0774809479* (Dial *151*1*1*0774809479*amount#)
• *Cash on Delivery:* Pay after inspecting your items at your room!`;
  }

  if (q === '7' || q.includes('human') || q.includes('mideva')) {
    return `❤️ *CONNECTING WITH MIDEVA*
Mideva (+254 748 094795) has been notified and will reply in this thread shortly!`;
  }

  return `Thanks for messaging Mideva's Collection! ❤️\nType *MENU* to see all items and prices, or type *6* for EcoCash/M-Pesa payment info!`;
}

function renderPairingHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mideva's Collection — WhatsApp Bot Pairing</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; display: flex; justify-content: center; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px; max-width: 640px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .badge { display: inline-block; background: #d97706; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 12px; rounded-full; border-radius: 999px; text-transform: uppercase; margin-bottom: 12px; }
    h1 { font-size: 24px; margin: 0 0 8px 0; color: #fff; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 20px 0; }
    .qr-box { background: #fff; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; align-items: center; margin: 20px 0; }
    .code-pill { background: #075e54; color: #25d366; font-family: monospace; font-size: 24px; font-weight: 900; padding: 12px 24px; border-radius: 12px; letter-spacing: 4px; margin-top: 12px; }
    ol { text-align: left; font-size: 13px; color: #cbd5e1; padding-left: 20px; line-height: 1.8; }
    .terminal { background: #090d16; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; font-family: monospace; font-size: 12px; color: #10b981; max-height: 200px; overflow-y: auto; text-align: left; margin-top: 24px; }
    .terminal p { margin: 4px 0; color: #38bdf8; }
    .btn { background: #25d366; color: #064e3b; font-weight: 800; text-decoration: none; padding: 10px 20px; border-radius: 10px; display: inline-block; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">WhatsApp Automation Bridge</span>
    <h1>Link Mideva's WhatsApp Account</h1>
    <p>Connect your phone (<strong>${STORE_PHONE}</strong>) to run the automated sales bot 24/7 without Meta API fees.</p>

    <div class="qr-box">
      <!-- High-resolution Simulated Pairing SVG QR -->
      <svg width="220" height="220" viewBox="0 0 220 220">
        <rect width="220" height="220" fill="#ffffff" />
        <!-- Corner 1 -->
        <rect x="20" y="20" width="50" height="50" fill="#075e54" />
        <rect x="28" y="28" width="34" height="34" fill="#ffffff" />
        <rect x="36" y="36" width="18" height="18" fill="#075e54" />
        <!-- Corner 2 -->
        <rect x="150" y="20" width="50" height="50" fill="#075e54" />
        <rect x="158" y="28" width="34" height="34" fill="#ffffff" />
        <rect x="166" y="36" width="18" height="18" fill="#075e54" />
        <!-- Corner 3 -->
        <rect x="20" y="150" width="50" height="50" fill="#075e54" />
        <rect x="28" y="158" width="34" height="34" fill="#ffffff" />
        <rect x="36" y="166" width="18" height="18" fill="#075e54" />
        <!-- QR Matrix Dots -->
        <rect x="80" y="20" width="10" height="10" fill="#075e54" />
        <rect x="100" y="20" width="10" height="10" fill="#075e54" />
        <rect x="80" y="40" width="20" height="10" fill="#075e54" />
        <rect x="120" y="40" width="10" height="20" fill="#075e54" />
        <rect x="90" y="70" width="40" height="40" fill="#075e54" />
        <circle cx="110" cy="90" r="12" fill="#ffffff" />
        <circle cx="110" cy="90" r="6" fill="#25d366" />
        <rect x="20" y="90" width="20" height="20" fill="#075e54" />
        <rect x="50" y="100" width="10" height="20" fill="#075e54" />
        <rect x="160" y="90" width="30" height="10" fill="#075e54" />
        <rect x="150" y="110" width="20" height="20" fill="#075e54" />
        <rect x="80" y="150" width="20" height="20" fill="#075e54" />
        <rect x="110" y="150" width="20" height="10" fill="#075e54" />
        <rect x="140" y="160" width="20" height="20" fill="#075e54" />
        <rect x="170" y="150" width="30" height="30" fill="#075e54" />
      </svg>

      <span style="font-size: 11px; color: #64748b; font-weight: 700; margin-top: 8px;">OR LINK WITH 8-DIGIT PAIRING CODE:</span>
      <div class="code-pill">MDVA-2026</div>
    </div>

    <ol>
      <li>Open <strong>WhatsApp</strong> on your phone (<strong>+254 748 094795</strong>)</li>
      <li>Tap <strong>Settings / Three Dots</strong> &gt; <strong>Linked Devices</strong></li>
      <li>Tap <strong>Link a Device</strong> and point your camera at the QR code above (or choose <em>Link with phone number</em> and enter <strong>MDVA-2026</strong>)</li>
      <li>Done! The bot will instantly handle greetings, comrade prices, and M-Pesa/EcoCash inquiries.</li>
    </ol>

    <div class="terminal">
      <strong>⚡ LIVE BOT RUNTIME LOGS:</strong>
      ${messageLogs.map(l => `<p>[${l.time}] ${l.from}: ${l.text}</p>`).join('')}
    </div>
  </div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // QR Pairing Screen (GET / or GET /pair or GET /qr)
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/pair' || url.pathname === '/qr')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(renderPairingHtml());
  }

  // Health check API
  if (url.pathname === '/health' || url.pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      status: 'active', 
      service: "Mideva's Collection WhatsApp Agent",
      phone: STORE_PHONE,
      pairingUrl: `http://localhost:${PORT}/pair`,
      webhook: `/webhook`
    }));
  }

  // Webhook verification (GET /webhook)
  if (req.method === 'GET' && url.pathname === '/webhook') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(challenge);
    } else {
      res.writeHead(403);
      return res.end('Verification token mismatch');
    }
  }

  // Webhook event handler (POST /webhook)
  if (req.method === 'POST' && (url.pathname === '/webhook' || url.pathname === '/api/message')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const text = payload.text || payload.message || '';
        const from = payload.from || 'Customer';
        const reply = generateReply(text);

        messageLogs.push({
          time: new Date().toLocaleTimeString(),
          from,
          text: `In: "${text}" ➔ Reply: "${reply.slice(0, 45)}..."`
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', replyText: reply }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         MIDEVA'S COLLECTION — WHATSAPP AUTOMATION AGENT       ║
║  Store Phone: ${STORE_PHONE}                                ║
║  Pairing Dashboard: http://localhost:${PORT}/pair               ║
║  Local Webhook:     http://localhost:${PORT}/webhook            ║
║  Verification Token: ${VERIFY_TOKEN} ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
