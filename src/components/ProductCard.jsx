import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Check, Star, Tag, Heart, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { STORE_CONFIG } from '../data/products';
import { trackEvent } from '../utils/analytics';
import { getLikes, isProductLikedByUser, toggleProductLike } from '../utils/likes';
import { formatPrice } from '../utils/storeConfig';
import { notifySuccess, notifyWarning } from '../utils/notifications';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80';

export default function ProductCard({ product, onAddToCart, currency, onOpenReviews, onOpenDetail, config }) {
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);
  const [likeCount, setLikeCount] = useState(() => (getLikes()[product.id] || 0));
  const [isLiked, setIsLiked] = useState(() => isProductLikedByUser(product.id));
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.sizes ? product.sizes[0] : (product.colors ? product.colors[0] : (product.scents ? product.scents[0] : null))
  );

  // Live stock calculation
  const stock = product.stockQuantity !== undefined ? product.stockQuantity : (product.inStock !== false ? 12 : 0);
  const isOutOfStock = stock <= 0 || product.inStock === false;
  const isLowStock = !isOutOfStock && stock <= 5;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    const res = toggleProductLike(product.id);
    setLikeCount(res.count);
    setIsLiked(res.isLiked);
    if (res.isLiked) {
      trackEvent('product_liked', { productId: product.id, name: product.name });
    }
  };

  const displayPrice = formatPrice(product.price, currency, config);
  const comradeDisplayPrice = formatPrice(product.comradePrice, currency, config);

  const handleAdd = () => {
    if (isOutOfStock) {
      notifyWarning(`Sorry comrade, "${product.name}" is currently sold out!`);
      return;
    }

    onAddToCart({
      ...product,
      selectedVariant
    });
    trackEvent('add_to_cart', { productId: product.id, name: product.name, price: product.price });
    notifySuccess(`Added ${product.name} to Quote 🛒`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Direct single-item WhatsApp link
  const getWhatsAppDirectLink = () => {
    trackEvent('whatsapp_order', { productId: product.id, name: product.name });
    const variantText = selectedVariant ? ` (Option: ${selectedVariant})` : '';
    const text = encodeURIComponent(
      `Hello Mideva! ❤️ I want to buy this item from your collection:\n\n` +
      `📦 Item: ${product.name}${variantText}\n` +
      `💰 Price: ${displayPrice}\n` +
      (isOutOfStock ? `(I see it is marked Out of Stock - please notify me when restocked!)\n` : '') +
      `Is this currently available for campus delivery?`
    );
    return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`;
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between">
      
      {/* Product Image & Badges */}
      <div 
        onClick={() => onOpenDetail && onOpenDetail(product)}
        className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'grayscale opacity-75' : ''
          }`}
          loading="lazy"
        />

        {/* Hover Quick View Overlay (Amazon style) */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Quick View
          </span>
        </div>

        {/* Top Badges on image */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
          {product.badge && (
            <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
              {product.badge}
            </span>
          )}
          {product.isComradeDeal && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Tag className="w-2.5 h-2.5" /> Comrade Deal
            </span>
          )}
        </div>

        {/* Heart Like Button & Counter */}
        <button
          type="button"
          onClick={handleLikeClick}
          aria-label="Like product"
          className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-xs px-2 py-1 rounded-full shadow-md text-xs font-bold transition transform active:scale-90"
        >
          <Heart className={`w-3.5 h-3.5 transition ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-500'}`} />
          <span className={`text-[10px] font-extrabold ${isLiked ? 'text-rose-600' : 'text-slate-600 dark:text-slate-300'}`}>
            {likeCount}
          </span>
        </button>

        {/* Live Stock Status Indicator */}
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
          {isOutOfStock ? (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full border shadow-xs flex items-center gap-1 bg-rose-600 text-white border-rose-700">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-xs flex items-center gap-1 bg-amber-500 text-white border-amber-600 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Only {stock} left!
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              In Stock ({stock})
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Rating & Reviews Trigger */}
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              onClick={() => onOpenReviews && onOpenReviews(product)}
              className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 transition"
            >
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold ml-1 text-slate-800 dark:text-slate-200">{product.rating}</span>
              </div>
              <span>•</span>
              <span className="underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2">{product.reviews} reviews</span>
            </button>

            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetail && onOpenDetail(product)}
            className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Description with Read more / Show less toggle */}
          <div className="mt-1">
            <p className={`text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed ${
              isDescExpanded ? '' : 'line-clamp-2'
            }`}>
              {product.description}
            </p>
            {product.description && product.description.length > 60 && (
              <button
                type="button"
                onClick={() => setIsDescExpanded((prev) => !prev)}
                className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline mt-0.5 inline-flex items-center gap-0.5"
              >
                {isDescExpanded ? (
                  <>Show less <ChevronUp className="w-2.5 h-2.5" /></>
                ) : (
                  <>Read more... <ChevronDown className="w-2.5 h-2.5" /></>
                )}
              </button>
            )}
          </div>

          {/* Variant Selector (Sizes or Colors or Scents) */}
          {(product.sizes || product.colors || product.scents) && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                {product.sizes ? 'Size:' : (product.colors ? 'Color:' : 'Scent:')}
              </span>
              {(product.sizes || product.colors || product.scents).slice(0, 4).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border transition flex-shrink-0 ${
                    selectedVariant === v
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {displayPrice}
              </span>
              {product.comradePrice < product.price && (
                <span className="ml-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                  Comrade: {comradeDisplayPrice}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Add to Quote Drawer + Direct WhatsApp Order */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
              }`}
            >
              {isOutOfStock ? (
                <span>Sold Out</span>
              ) : added ? (
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
              className="w-full py-1.5 px-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 transition flex items-center justify-center gap-1 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
