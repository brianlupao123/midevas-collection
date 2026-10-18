import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Check, 
  Tag, 
  ExternalLink,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { STORE_CONFIG, BASELINE_PRODUCTS } from '../data/products';
import { trackEvent } from '../utils/analytics';

const QUICK_PROMPTS = [
  { id: 'comrade', label: '🔥 What are Comrade Deals?', icon: Tag },
  { id: 'delivery', label: '🚚 How does hostel delivery work?', icon: Truck },
  { id: 'bags', label: '👜 Handbags ($6 & $10)', icon: ShoppingBag },
  { id: 'fashion', label: '👔 Men\'s shirts & tees', icon: Sparkles },
  { id: 'payment', label: '💳 Payment (M-Pesa / Cash)', icon: Check },
  { id: 'catalog', label: '📱 WhatsApp Catalog', icon: ExternalLink },
];

export default function ChatWidget({ onAddToCart, onSelectCategory, config }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'bot',
      text: "Hi comrade! 👋 Welcome to Mideva's Collection. Looking for something specific, or need help with sizes, prices, or hostel delivery?",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const whatsappNum = config?.whatsappNumber || STORE_CONFIG.whatsappNumber;
  const catalogUrl = config?.whatsappCatalogUrl || "https://wa.me/c/254748094795";

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const addMessage = (sender, text, recommendations = []) => {
    setMessages((prev) => [
      ...prev,
      {
        id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 5),
        sender,
        text,
        recommendations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Bot response engine (local intelligent QA & product matcher)
  const generateBotReply = (userQuery) => {
    const q = userQuery.toLowerCase();

    // 1. Delivery query
    if (q.includes('deliver') || q.includes('hostel') || q.includes('hall') || q.includes('drop off') || q.includes('room')) {
      return {
        text: "🚀 Free delivery around all campus hostels & student halls! Mideva drops off right at your hall or gate. You can inspect the items before paying via M-Pesa or Cash.",
        recs: []
      };
    }

    // 2. Comrade Deals query
    if (q.includes('comrade') || q.includes('discount') || q.includes('cheap') || q.includes('deal') || q.includes('offer')) {
      const comradeItems = BASELINE_PRODUCTS.filter((p) => p.isComradeDeal).slice(0, 3);
      return {
        text: "🔥 Comrade Deals are our special student-discounted essentials! Men's tees from $3, shirts < $8, quilted sling bags for $6, and tuckshop study snacks from 25¢. Here are 3 top picks:",
        recs: comradeItems
      };
    }

    // 3. Bags query
    if (q.includes('bag') || q.includes('handbag') || q.includes('sling') || q.includes('tote') || q.includes('clutch')) {
      const bagItems = BASELINE_PRODUCTS.filter((p) => p.category === 'bags').slice(0, 3);
      return {
        text: "👜 We have beautiful luxury-finish PU leather bags! The Compact Quilted Sling is just $6, and the Executive Structured Handbag is $10. Both hold phones, cosmetics, and tablets comfortably.",
        recs: bagItems
      };
    }

    // 4. Men's wear / Shirts query
    if (q.includes('shirt') || q.includes('tee') || q.includes('men') || q.includes('polo') || q.includes('streetwear')) {
      const fashionItems = BASELINE_PRODUCTS.filter((p) => p.category === 'fashion').slice(0, 3);
      return {
        text: "👔 For gentlemen, we have crisp cotton long-sleeve button-up shirts (< $8 in sizes M-XXL) and heavyweight 100% cotton graphic streetwear tees (< $4) that survive every hostel wash cycle!",
        recs: fashionItems
      };
    }

    // 5. Perfume / Scents query
    if (q.includes('perfume') || q.includes('scent') || q.includes('fragrance') || q.includes('cologne') || q.includes('spray') || q.includes('mist')) {
      const beautyItems = BASELINE_PRODUCTS.filter((p) => p.category === 'beauty').slice(0, 3);
      return {
        text: "🌸 Our 35ml concentrated oil pocket perfumes are under $5 with 24-hour scent projection! Scents include Vanilla Sweet, Royal Oud, Aqua Marine, and Amber Wood.",
        recs: beautyItems
      };
    }

    // 6. Payment query
    if (q.includes('pay') || q.includes('mpesa') || q.includes('m-pesa') || q.includes('cash') || q.includes('ecocash') || q.includes('money')) {
      return {
        text: `💳 We accept:\n• M-Pesa (Till / Paybill: 254748094795)\n• EcoCash (Send money to ${config?.ecocashNumber || '0774809479'} or dial *151*1*1*${config?.ecocashNumber || '0774809479'}*amount#)\n• Cash on Delivery: inspect your items at your hostel first before paying!`,
        recs: []
      };
    }

    // 7. Snacks / Drinks / Tuckshop
    if (q.includes('snack') || q.includes('drink') || q.includes('coke') || q.includes('mazoe') || q.includes('popcorn') || q.includes('biscuit') || q.includes('food')) {
      const snackItems = BASELINE_PRODUCTS.filter((p) => p.category === 'snacks').slice(0, 3);
      return {
        text: "🍫 Need exam revision fuel? We deliver ice-cold Coca-Cola, Mazoe Orange Crush 2L concentrate, and fresh salted maputi buckets (50¢) directly to your hostel gate!",
        recs: snackItems
      };
    }

    // 8. General search matcher
    const matchingProducts = BASELINE_PRODUCTS.filter((p) => 
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ).slice(0, 3);

    if (matchingProducts.length > 0) {
      return {
        text: `Found ${matchingProducts.length} items matching "${userQuery}":`,
        recs: matchingProducts
      };
    }

    // Fallback response with WhatsApp route
    return {
      text: "I can help you browse fashion, bags, perfumes, or snacks, or connect you directly with Mideva on WhatsApp for custom orders!",
      recs: []
    };
  };

  const handleSendMessage = (textToSend) => {
    const q = (textToSend || inputText).trim();
    if (!q) return;

    // Add user message
    addMessage('user', q);
    setInputText('');
    setIsTyping(true);

    trackEvent('chat_query', { query: q });

    // Simulate natural response delay
    setTimeout(() => {
      const reply = generateBotReply(q);
      addMessage('bot', reply.text, reply.recs);
      setIsTyping(false);
    }, 500);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'bot',
        text: "Chat cleared! How else can I assist you with items from Mideva's Collection?",
        timestamp: 'Just now'
      }
    ]);
  };

  // Build WhatsApp hand-off URL
  const getWhatsAppHandoffUrl = () => {
    const userMsgs = messages.filter((m) => m.sender === 'user').map((m) => m.text).slice(-3);
    const summary = userMsgs.length > 0 ? ` (Inquiry: ${userMsgs.join('; ')})` : '';
    const text = encodeURIComponent(`Hello Mideva! ❤️ I was chatting on your website assistant${summary} and wanted to ask about availability.`);
    return `https://wa.me/${whatsappNum}?text=${text}`;
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-18 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
          {/* Notification pill */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-200 text-xs font-bold text-slate-800 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Need help? Chat with Assistant</span>
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
              trackEvent('chat_opened');
            }}
            aria-label="Open chat assistant"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 border-2 border-white"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[520px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-fade-in">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <div>
                <h4 className="text-sm font-extrabold leading-tight">Mideva's Campus Assistant</h4>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>● Online</span> • Answers &amp; Quotes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-white rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Embedded Recommended Product Cards */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
                      {m.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        >
                          <img
                            src={rec.image}
                            alt={rec.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{rec.name}</h5>
                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-400">${rec.price.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => {
                              onAddToCart(rec);
                              addMessage('bot', `Added ${rec.name} to your quote drawer!`);
                            }}
                            className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold transition flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-16 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-200"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Option Suggestion Chips */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSendMessage(p.label)}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-800 dark:hover:text-amber-300 hover:border-amber-300 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap transition flex-shrink-0"
                >
                  <Icon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* WhatsApp Direct Handoff Link */}
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 border-t border-emerald-100 dark:border-emerald-800 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300">
            <span className="truncate">Need to talk directly with Mideva?</span>
            <a
              href={getWhatsAppHandoffUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 ml-2 flex-shrink-0"
            >
              <span>Chat on WhatsApp</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about items, delivery, sizing..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white transition flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
