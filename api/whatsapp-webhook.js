// =========================================================================
// MIDEVA'S COLLECTION — VERCEL SERVERLESS WHATSAPP CLOUD API WEBHOOK
// Endpoint: https://midevas-collection.vercel.app/api/whatsapp-webhook
// Automatically receives incoming messages from Meta WhatsApp Business API
// and sends back intelligent product recommendations and order receipts.
// =========================================================================

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "mideva_campus_secret_token_2026";
const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID;

// Fallback products knowledge base for standalone serverless runtime
const CATALOG_SUMMARY = [
  { name: "Classic Button-Up Cotton Shirt", category: "fashion", price: 7.50, comrade: 7.00 },
  { name: "Heavyweight Graphic Streetwear Tee", category: "fashion", price: 3.80, comrade: 3.50 },
  { name: "Executive Structured Shoulder Handbag", category: "bags", price: 10.00, comrade: 9.50 },
  { name: "Compact Quilted Crossbody Sling Bag", category: "bags", price: 6.00, comrade: 5.50 },
  { name: "Luxury Oil Pocket Perfume (35ml)", category: "beauty", price: 4.50, comrade: 4.00 },
  { name: "Gentleman Amber Woody EDP", category: "beauty", price: 4.90, comrade: 4.50 },
  { name: "Soft Care Sanitary Pads (6 Pack)", category: "hygiene", price: 3.40, comrade: 3.20 },
  { name: "Baby Soft White Tissue (18 Ply)", category: "hygiene", price: 7.50, comrade: 7.00 },
  { name: "Ice Cold Coca-Cola (500ml)", category: "snacks", price: 1.00, comrade: 0.90 },
  { name: "Mazoe Orange Crush 2L", category: "snacks", price: 4.50, comrade: 4.20 },
  { name: "Maputi (Popcorn) Bucket", category: "snacks", price: 0.50, comrade: 0.50 },
  { name: "Plush Velvet Hot Water Bottle", category: "essentials", price: 4.00, comrade: 3.80 },
  { name: "2 Quire Hardcover Exercise Book", category: "stationery", price: 2.50, comrade: 2.30 }
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
6️⃣ *Delivery & Payment Info* (Hostel drop-off & M-Pesa)
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

  // Search products
  const matches = CATALOG_SUMMARY.filter(p => p.name.toLowerCase().includes(q));
  if (matches.length > 0) {
    let msg = `🔍 *FOUND ${matches.length} MATCHING ITEMS:*\n`;
    matches.forEach((m, idx) => {
      msg += `${idx + 1}. *${m.name}* — $${m.price.toFixed(2)} (~KSh ${Math.round(m.price * 130)})\n`;
    });
    msg += `\nReply with your hostel room to order!`;
    return msg;
  }

  return `Thanks for messaging Mideva's Collection! ❤️\nType *MENU* to see all items and prices, or type *7* to speak with Mideva!`;
}

export default async function handler(req, res) {
  // 1. Meta Webhook Verification (GET request)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WhatsApp Webhook Verified Successfully');
      return res.status(200).send(challenge);
    } else {
      return res.status(403).json({ error: 'Verification token mismatch' });
    }
  }

  // 2. Incoming WhatsApp Message Event (POST request)
  if (req.method === 'POST') {
    try {
      const body = req.body;

      // Direct simulator / developer test payload
      if (body?.text) {
        const reply = generateReply(body.text, body.customerName || 'Comrade');
        return res.status(200).json({ status: 'success', replyText: reply });
      }

      if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
          const from = message.from; // Customer phone number
          const messageText = message.text?.body || message.button?.text || '';
          const customerName = value.contacts?.[0]?.profile?.name || 'Comrade';

          console.log(`Received message from ${from} (${customerName}): ${messageText}`);

          const replyText = generateReply(messageText, customerName);

          // If WhatsApp Cloud API credentials are configured, send response back
          if (WHATSAPP_TOKEN && PHONE_NUMBER_ID) {
            await fetch(`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: from,
                text: { body: replyText }
              })
            });
          }
        }

        return res.status(200).json({ status: 'success' });
      } else {
        return res.status(404).json({ error: 'Unknown event source' });
      }
    } catch (err) {
      console.error('Error handling WhatsApp webhook:', err);
      return res.status(200).json({ status: 'error_logged' }); // Always return 200 to Meta so it does not retry repeatedly
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
