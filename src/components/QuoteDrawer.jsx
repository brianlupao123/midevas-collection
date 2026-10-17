import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  Copy, 
  Check, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  User,
  FileText
} from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

export default function QuoteDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart, currency }) {
  const [customerName, setCustomerName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const totalUsd = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalKsh = Math.round(totalUsd * STORE_CONFIG.exchangeRate);

  const displayTotal = currency === '$' 
    ? `$${totalUsd.toFixed(2)}`
    : `KSh ${totalKsh.toLocaleString()}`;

  // Build formatted order text
  const generateOrderText = () => {
    let text = `🛍️ *ORDER REQUEST — MIDEVA'S COLLECTION*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 *Customer:* ${customerName.trim() || 'Comrade Customer'}\n`;
    text += `📍 *Hostel/Location:* ${deliveryLocation.trim() || 'Campus Drop-off'}\n`;
    if (notes.trim()) {
      text += `📝 *Note:* ${notes.trim()}\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `*ITEMS REQUESTED:*\n`;

    cartItems.forEach((item, index) => {
      const variant = item.selectedVariant ? ` (${item.selectedVariant})` : '';
      const lineTotal = (item.price * item.quantity).toFixed(2);
      text += `${index + 1}. *${item.name}*${variant}\n`;
      text += `   Qty: ${item.quantity} × $${item.price.toFixed(2)} = *$${lineTotal}*\n`;
    });

    text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *TOTAL ESTIMATE:* *$${totalUsd.toFixed(2)}* (~KSh ${totalKsh.toLocaleString()})\n`;
    text += `🚚 *Delivery:* Free around campus hostels\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Please confirm availability and drop-off time. Thank you! ❤️`;

    return text;
  };

  const handleSendWhatsApp = () => {
    const orderText = generateOrderText();
    const encoded = encodeURIComponent(orderText);
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopyOrderText = async () => {
    try {
      await navigator.clipboard.writeText(generateOrderText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay with blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                  Quote &amp; Order Request
                </h2>
                <p className="text-xs text-slate-500">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your quote
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  title="Clear all items"
                  className="p-2 text-slate-400 hover:text-rose-600 transition text-xs rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 transition rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body - Scrollable Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your quote cart is empty</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Browse Mideva's collection and click "Add to Quote" on any item to build your WhatsApp order.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedVariant || 'default'}`}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition flex gap-3 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      {item.selectedVariant && (
                        <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded mt-0.5">
                          {item.selectedVariant}
                        </span>
                      )}
                      <div className="text-xs font-extrabold text-slate-800 mt-1">
                        ${(item.price * item.quantity).toFixed(2)}{' '}
                        <span className="text-[10px] font-normal text-slate-400">
                          (${item.price.toFixed(2)} ea)
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.selectedVariant, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.selectedVariant, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete item button */}
                    <button
                      onClick={() => onRemoveItem(item.id, item.selectedVariant)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Delivery Notice */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Free delivery around campus hostels and halls for group members!</span>
                </div>

                {/* Quick Customer Delivery Details Form */}
                <div className="pt-2 border-t border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Delivery Details (Included in WhatsApp Message)
                  </div>
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Your Name / Nickname (e.g. Brian)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Hostel, Hall, Room, or Campus Gate"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Special request (e.g. deliver after 4pm, bring color options)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer with Totals & WhatsApp Send Button */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Total Calculation */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">${totalUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Hostel Delivery:</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Estimated Total:</span>
                  <div className="text-right">
                    <span className="text-amber-600">{displayTotal}</span>
                    <span className="block text-[11px] font-normal text-slate-500">
                      (~KSh {totalKsh.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Action: Send WhatsApp Order */}
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-emerald-200" />
                <span>Send Order via WhatsApp Now</span>
              </button>

              {/* Secondary Action: Copy Text to Clipboard */}
              <button
                onClick={handleCopyOrderText}
                className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Order Text Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Formatted Order Summary</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-slate-400">
                🔒 No online card payment required. Pay on delivery via M-Pesa or Cash.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
