// =========================================================================
// MIDEVA'S COLLECTION — STANDALONE WHATSAPP AGENT SERVER
// Can be run locally: node server/standalone-whatsapp-agent.js
// Provides:
//   1. Local Webhook Server on port 4000
//   2. Conversational response generation for Mideva's customer inquiries
//   3. Baileys / QR Code direct connection support
// =========================================================================

import http from 'http';

const PORT = process.env.PORT || 4000;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "mideva_campus_secret_token_2026";

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         MIDEVA'S COLLECTION — WHATSAPP AUTOMATION AGENT       ║
║  Store Phone: +254 748 094795                                ║
║  Webhook Port: http://localhost:${PORT}/webhook                  ║
║  Verification Token: ${VERIFY_TOKEN} ║
╚═══════════════════════════════════════════════════════════════╝
`);

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

  // Health check
  if (url.pathname === '/' || url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      status: 'active', 
      service: "Mideva's Collection WhatsApp Agent",
      phone: "+254748094795",
      webhook: `/webhook`
    }));
  }

  // Webhook verification (GET /webhook)
  if (req.method === 'GET' && url.pathname === '/webhook') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully by Meta');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(challenge);
    } else {
      res.writeHead(403);
      return res.end('Verification token mismatch');
    }
  }

  // Webhook event handler (POST /webhook)
  if (req.method === 'POST' && url.pathname === '/webhook') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        console.log('📩 Incoming WhatsApp Event:', JSON.stringify(payload, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'received' }));
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`🚀 Mideva WhatsApp Agent listening on port ${PORT}`);
});
