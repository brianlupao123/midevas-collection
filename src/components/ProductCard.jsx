import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Check, Star, Tag } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';

export default function ProductCard({ product, onAddToCart, currency }) {
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.sizes ? product.sizes[0] : (product.colors ? product.colors[0] : null)
  );

  const displayPrice = currency === '$' 
    ? `$${product.price.toFixed(2)}`
    : `KSh ${Math.round(product.price * STORE_CONFIG.exchangeRate).toLocaleString()}`;

  const comradeDisplayPrice = currency === '$'
    ? `$${product.comradePrice.toFixed(2)}`
    : `KSh ${Math.round(product.comradePrice * STORE_CONFIG.exchangeRate).toLocaleString()}`;

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedVariant
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Direct single-item WhatsApp link
  const getWhatsAppDirectLink = () => {
    const variantText = selectedVariant ? ` (Option: ${selectedVariant})` : '';
    const text = encodeURIComponent(
      `Hello Mideva! ❤️ I want to buy this item from your collection:\n\n` +
      `📦 Item: ${product.name}${variantText}\n` +
      `💰 Price: ${displayPrice}\n` +
      `Is this currently available for campus delivery?`
    );
    return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`;
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges on image */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
              {product.badge}
            </span>
          )}
          {product.isComradeDeal && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Tag className="w-2.5 h-2.5" /> Comrade Deal
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="bg-white/95 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/80 shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold ml-1 text-slate-800">{product.rating}</span>
            </div>
            <span>•</span>
            <span>{product.reviews} reviews</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-amber-700 transition">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector (Sizes or Colors or Scents) */}
          {(product.sizes || product.colors || product.scents) && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                {product.sizes ? 'Size:' : (product.colors ? 'Color:' : 'Scent:')}
              </span>
              {(product.sizes || product.colors || product.scents).slice(0, 4).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition flex-shrink-0 ${
                    selectedVariant === v
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {displayPrice}
              </span>
              {product.comradePrice < product.price && (
                <span className="ml-1.5 text-xs text-rose-600 font-bold">
                  Comrade: {comradeDisplayPrice}
                </span>
              )}
            </div>
          </div>

          {/* Buttons: Add to Quote Drawer + Direct WhatsApp Order */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleAdd}
              className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Quote
                </>
              )}
            </button>

            <a
              href={getWhatsAppDirectLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 transition flex items-center justify-center gap-1 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
