// =========================================================================
// MIDEVA'S COLLECTION — WHATSAPP AI AGENT CONVERSATIONAL ENGINE
// Powers automated WhatsApp responses for Meta Cloud API, Baileys,
// and the Admin WhatsApp Simulator.
// =========================================================================

import { BASELINE_PRODUCTS, STORE_CONFIG } from '../data/products';
import { getStoreConfig } from './storeConfig';

const AGENT_CONFIG_KEY = 'midevas_whatsapp_agent_config';

export const DEFAULT_AGENT_CONFIG = {
  enabled: true,
  agentName: "Mideva's Campus Assistant",
  welcomeMessage: "Hello comrade! 👋 Welcome to *Mideva's Collection*.\nGreat Quality Everyday at Comrade Affordable Prices.",
  outOfOfficeMessage: "Hi comrade! Mideva is currently attending lectures or making hostel drop-offs. Your order/inquiry has been received and will be attended to shortly! 🚀",
  mpesaTillNumber: "123456", // Customizable by Mideva in Admin
  mpesaPaybillNumber: "",
  freeDeliveryNote: "🚀 Free delivery around campus hostels & halls! Pay upon drop-off.",
  businessHours: "8:00 AM - 10:00 PM",
  verifyToken: "mideva_campus_secret_token_2026"
};

export function getAgentConfig() {
  try {
    const raw = localStorage.getItem(AGENT_CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(AGENT_CONFIG_KEY, JSON.stringify(DEFAULT_AGENT_CONFIG));
      return DEFAULT_AGENT_CONFIG;
    }
    return { ...DEFAULT_AGENT_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_AGENT_CONFIG;
  }
}

export function saveAgentConfig(newConfig) {
  try {
    const current = getAgentConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(AGENT_CONFIG_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return getAgentConfig();
  }
}

// Convert USD to KSh based on active exchange rate
function formatKsh(usd, rate = 130) {
  return `KSh ${Math.round(usd * rate).toLocaleString()}`;
}

// Format the main menu
function getMainMenu(customerName = "Comrade") {
  return `🛍️ *MIDEVA'S COLLECTION — CAMPUS BOT*
Hello ${customerName}! 👋

*How can I help you today?*
Reply with a *number* or ask a question:

1️⃣ *Comrade Deals* (< $4 & < $8 specials)
2️⃣ *Ladies' Handbags* ($6 & $10)
3️⃣ *Men's Wear* (Shirts, Graphic Tees & Polos)
4️⃣ *Perfumes & Scents* (35ml Pocket Oils < $5)
5️⃣ *Campus Tuckshop* (Mazoe, Maputi, Biscuits, Sugar)
6️⃣ *Hygiene & Toiletries* (Pads, Soaps, Toothpaste)
7️⃣ *Delivery & Payment Info* (Hostel drop-off & M-Pesa)
8️⃣ *Chat with Mideva Directly (Human)*

🌐 *Browse Full Web Catalog:* https://midevas-collection.vercel.app`;
}

// Core conversation processor
export function processWhatsAppMessage({ from, text, customerName = "Comrade" }) {
  const storeConfig = getStoreConfig();
  const agentConfig = getAgentConfig();
  const exchangeRate = storeConfig.exchangeRate || 130;

  const raw = (text || "").trim();
  const q = raw.toLowerCase();

  // 1. Check if agent is enabled
  if (!agentConfig.enabled) {
    return {
      replyText: `Hi ${customerName}! Mideva's automated bot is currently resting. Mideva will reply to you personally very soon! ❤️`,
      intent: 'disabled',
      matchedProducts: []
    };
  }

  // 2. Greetings
  if (
    q === 'hi' || q === 'hello' || q === 'hey' || q === 'menu' || 
    q === 'start' || q === 'mambo' || q === 'habari' || q === 'help' ||
    q === 'yo' || q === 'xup' || q === 'good morning' || q === 'good evening'
  ) {
    return {
      replyText: getMainMenu(customerName),
      intent: 'greeting',
      matchedProducts: []
    };
  }

  // 3. Numbered Menu Selection
  if (q === '1' || q.includes('comrade deal') || q.includes('specials')) {
    const deals = BASELINE_PRODUCTS.filter((p) => p.isComradeDeal).slice(0, 5);
    let reply = `🔥 *MIDEVA'S COMRADE DEALS (< $4 & < $8)*\n━━━━━━━━━━━━━━━━━━━━━\n`;
    deals.forEach((d, i) => {
      reply += `${i + 1}. *${d.name}*\n   💰 Price: *$${d.comradePrice.toFixed(2)}* (~${formatKsh(d.comradePrice, exchangeRate)})\n   📌 ${d.badge || 'Comrade Special'}\n\n`;
    });
    reply += `━━━━━━━━━━━━━━━━━━━━━\nTo order any item, reply with the *item name* and your *hostel/room number*! 🚀`;
    return { replyText: reply, intent: 'comrade_deals', matchedProducts: deals };
  }

  if (q === '2' || q === 'bags' || q.includes('handbag') || q.includes('sling') || q.includes('clutch')) {
    const bags = BASELINE_PRODUCTS.filter((p) => p.category === 'bags');
    let reply = `👜 *LADIES' HANDBAGS & SLINGS*\n━━━━━━━━━━━━━━━━━━━━━\n`;
    bags.forEach((b, i) => {
      reply += `${i + 1}. *${b.name}*\n   💰 Price: *$${b.price.toFixed(2)}* (~${formatKsh(b.price, exchangeRate)})\n   🎨 Colors: ${b.colors ? b.colors.join(', ') : 'Assorted'}\n   ${b.description}\n\n`;
    });
    reply += `━━━━━━━━━━━━━━━━━━━━━\nReply with the bag name to reserve one for hostel delivery!`;
    return { replyText: reply, intent: 'category_bags', matchedProducts: bags };
  }

  if (q === '3' || q.includes('men') || q.includes('shirt') || q.includes('tshirt') || q.includes('tee')) {
    const fashion = BASELINE_PRODUCTS.filter((p) => p.category === 'fashion');
    let reply = `👔 *MEN'S SHIRTS & STREETWEAR TEES*\n━━━━━━━━━━━━━━━━━━━━━\n`;
    fashion.forEach((f, i) => {
      reply += `${i + 1}. *${f.name}*\n   💰 Comrade Price: *$${f.comradePrice.toFixed(2)}* (~${formatKsh(f.comradePrice, exchangeRate)})\n   📏 Sizes: ${f.sizes ? f.sizes.join(', ') : 'M, L, XL'}\n   🎨 Colors: ${f.colors ? f.colors.join(', ') : 'Assorted'}\n\n`;
    });
    reply += `━━━━━━━━━━━━━━━━━━━━━\nReply with your size and color to order!`;
    return { replyText: reply, intent: 'category_fashion', matchedProducts: fashion };
  }

  if (q === '4' || q.includes('perfume') || q.includes('scent') || q.includes('fragrance') || q.includes('mist')) {
    const scents = BASELINE_PRODUCTS.filter((p) => p.category === 'beauty');
    let reply = `🌸 *PERFUMES & SCENTS (ALL UNDER $5)*\n━━━━━━━━━━━━━━━━━━━━━\n`;
    scents.forEach((s, i) => {
      reply += `${i + 1}. *${s.name}*\n   💰 Price: *$${s.price.toFixed(2)}* (~${formatKsh(s.price, exchangeRate)})\n   ✨ Scents: ${s.scents ? s.scents.join(', ') : 'Long lasting'}\n\n`;
    });
    reply += `━━━━━━━━━━━━━━━━━━━━━\n24-hour projection guaranteed! Reply with chosen scent to order.`;
    return { replyText: reply, intent: 'category_scents', matchedProducts: scents };
  }

  if (q === '5' || q.includes('snack') || q.includes('tuckshop') || q.includes('coke') || q.includes('mazoe') || q.includes('maputi')) {
    const snacks = BASELINE_PRODUCTS.filter((p) => p.category === 'snacks');
    let reply = `🍫 *CAMPUS TUCKSHOP & EXAM FUEL*\n━━━━━━━━━━━━━━━━━━━━━\n`;
    snacks.forEach((sn, i) => {
      reply += `${i + 1}. *${sn.name}* — *$${sn.price.toFixed(2)}* (~${formatKsh(sn.price, exchangeRate)})\n`;
    });
    reply += `\n━━━━━━━━━━━━━━━━━━━━━\nNeed a late study session pack? Tell us your hostel room! 🚀`;
    return { replyText: reply, intent: 'category_snacks', matchedProducts: snacks };
  }

  if (q === '6' || q.includes('hygiene') || q.includes('pads') || q.includes('soap') || q.includes('tissue') || q.includes('colgate')) {
    const hygiene = BASELINE_PRODUCTS.filter((p) => p.category === 'hygiene');
    let reply = `🧼 *HYGIENE & PERSONAL CARE ESSENTIALS*\n━━━━━━━━━━━━━━━━━━━━━\n`;
    hygiene.forEach((h, i) => {
      reply += `${i + 1}. *${h.name}* — *$${h.price.toFixed(2)}* (~${formatKsh(h.price, exchangeRate)})\n`;
    });
    reply += `\n━━━━━━━━━━━━━━━━━━━━━\nStock up for the semester with free hostel drop-off!`;
    return { replyText: reply, intent: 'category_hygiene', matchedProducts: hygiene };
  }

  if (q === '7' || q.includes('delivery') || q.includes('deliver') || q.includes('hostel') || q.includes('pay') || q.includes('mpesa')) {
    return {
      replyText: `🚚 *DELIVERY & PAYMENT INFORMATION*
━━━━━━━━━━━━━━━━━━━━━
📍 *Delivery Coverage:*
• Free drop-off to all campus hostels, student halls, and residential blocks!
• Town drop-off points available upon request.

💵 *Payment Options:*
• *M-Pesa:* Till / Paybill: *${agentConfig.mpesaTillNumber || '254748094795'}*
• *Cash on Delivery:* Pay upon receiving and inspecting your items.
• *EcoCash & Mobile Bank Transfer* also accepted.

🔒 *Zero Risk:* Inspect your bag, shirt, or items before making payment!`,
      intent: 'delivery_payment',
      matchedProducts: []
    };
  }

  if (q === '8' || q.includes('human') || q.includes('mideva') || q.includes('call') || q.includes('speak')) {
    return {
      replyText: `❤️ *CONNECTING WITH MIDEVA*
I have alerted Mideva (+254 748 094795) that you'd like to chat personally!

She will respond directly in this chat thread shortly. Feel free to leave any specific size, photo requests, or questions here in the meantime! 😊`,
      intent: 'human_hand_off',
      matchedProducts: [],
      shouldNotifyAdmin: true
    };
  }

  // 4. Order Parser (e.g. "Order", "I want", "Buy", "Need", "Quote")
  if (q.startsWith('order') || q.includes('i want') || q.includes('i need') || q.includes('buy') || q.includes('quote')) {
    // Search for any mentioned products
    const detected = BASELINE_PRODUCTS.filter((p) => {
      const pWords = p.name.toLowerCase().split(' ').filter(w => w.length > 3);
      return pWords.some(w => q.includes(w));
    });

    if (detected.length > 0) {
      const totalUsd = detected.reduce((sum, item) => sum + item.price, 0);
      let receipt = `🧾 *AUTOMATED ORDER DRAFT — MIDEVA'S COLLECTION*\n━━━━━━━━━━━━━━━━━━━━━\n👤 *Customer:* ${customerName}\n\n*ITEMS DETECTED:*\n`;
      detected.forEach((item, idx) => {
        receipt += `${idx + 1}. *${item.name}* — $${item.price.toFixed(2)} (~${formatKsh(item.price, exchangeRate)})\n`;
      });
      receipt += `\n━━━━━━━━━━━━━━━━━━━━━\n💰 *Total Estimate:* *$${totalUsd.toFixed(2)}* (~${formatKsh(totalUsd, exchangeRate)})\n🚚 *Delivery:* FREE at Campus Hostels\n━━━━━━━━━━━━━━━━━━━━━\n📍 To confirm this order, please reply with your *Hostel & Room Number* (e.g. "Hostel 3 Room 12B")!`;
      return {
        replyText: receipt,
        intent: 'order_draft',
        matchedProducts: detected
      };
    }
  }

  // 5. Direct Product Name Search Matcher
  const matched = BASELINE_PRODUCTS.filter((p) => {
    const pName = p.name.toLowerCase();
    const queryWords = q.split(' ').filter(w => w.length > 2);
    return queryWords.some(w => pName.includes(w));
  }).slice(0, 3);

  if (matched.length > 0) {
    let reply = `🔍 *FOUND ${matched.length} MATCHING ITEMS:*\n━━━━━━━━━━━━━━━━━━━━━\n`;
    matched.forEach((p, idx) => {
      reply += `${idx + 1}. *${p.name}*\n   💰 Price: *$${p.price.toFixed(2)}* (~${formatKsh(p.price, exchangeRate)})\n   ${p.comradePrice < p.price ? `🔥 Comrade Special: *$${p.comradePrice.toFixed(2)}*\n` : ''}   📦 Status: ${p.inStock ? 'In Stock ✅' : 'Restocking soon ⏳'}\n   ${p.description}\n\n`;
    });
    reply += `━━━━━━━━━━━━━━━━━━━━━\nReply with *ORDER [Item Name]* and your hostel room to have it delivered today!`;
    return {
      replyText: reply,
      intent: 'product_match',
      matchedProducts: matched
    };
  }

  // 6. Natural Language Fallback
  return {
    replyText: `Thanks for messaging Mideva's Collection! ❤️\nI didn't quite catch that. You can:\n\n• Type *MENU* to see all categories and prices\n• Ask for a product (e.g. "perfume", "handbags", "shirts", "snacks")\n• Or reply *8* to speak directly with Mideva!`,
    intent: 'fallback',
    matchedProducts: []
  };
}
