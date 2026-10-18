import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  Star, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Share2, 
  Heart, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  ThumbsUp,
  MapPin,
  Send,
  ArrowRight
} from 'lucide-react';
import { STORE_CONFIG } from '../data/products';
import { formatPrice } from '../utils/storeConfig';
import { trackEvent } from '../utils/analytics';
import { getLikes, isProductLikedByUser, toggleProductLike } from '../utils/likes';
import { getReviewsForProduct, addReview, getProductRatingStats } from '../utils/reviews';
import { getCurrentCustomer } from '../utils/customerAuth';
import { notifySuccess, notifyWarning } from '../utils/notifications';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  currency, 
  config,
  allProducts = [],
  onSelectRelatedProduct
}) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  
  // Like states
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Reviews & Comments state
  const [reviewsList, setReviewsList] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [campusLocation, setCampusLocation] = useState('Main Campus Hostel');
  const [commentRating, setCommentRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      setImgSrc(product.image || FALLBACK_IMAGE);
      const initialVariant = product.sizes ? product.sizes[0] : (product.colors ? product.colors[0] : (product.scents ? product.scents[0] : null));
      setSelectedVariant(initialVariant);
      setQuantity(1);
      setAdded(false);
      setCopiedLink(false);

      // Likes
      const allLikes = getLikes();
      setLikeCount(allLikes[product.id] || 0);
      setIsLiked(isProductLikedByUser(product.id));

      // Reviews
      setReviewsList(getReviewsForProduct(product.id));
      setCommentSubmitted(false);

      // Comrade profile auto-fill
      const customer = getCurrentCustomer();
      if (customer) {
        setAuthorName(customer.name || '');
        setCampusLocation(customer.hostel || 'Main Campus Hostel');
      }

      trackEvent('view_product_detail', { productId: product.id, name: product.name, price: product.price });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const stock = product.stockQuantity !== undefined ? product.stockQuantity : (product.inStock !== false ? 12 : 0);
  const isOutOfStock = stock <= 0 || product.inStock === false;
  const isLowStock = !isOutOfStock && stock <= 5;

  const displayPrice = formatPrice(product.price, currency, config);
  const comradeDisplayPrice = formatPrice(product.comradePrice, currency, config);
  const savingsAmount = product.price > product.comradePrice ? (product.price - product.comradePrice).toFixed(2) : 0;
  const ratingStats = getProductRatingStats(product.id, product.rating, product.reviews);

  // Related products from same category
  const relatedProducts = (allProducts || [])
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Like handler
  const handleLike = () => {
    const res = toggleProductLike(product.id);
    setLikeCount(res.count);
    setIsLiked(res.isLiked);
    if (res.isLiked) {
      trackEvent('product_liked_modal', { productId: product.id, name: product.name });
    }
  };

  // Add to cart handler
  const handleAdd = () => {
    if (isOutOfStock) {
      notifyWarning(`"${product.name}" is currently sold out.`);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      onAddToCart({
        ...product,
        selectedVariant
      });
    }
    trackEvent('add_to_cart_modal', { 
      productId: product.id, 
      name: product.name, 
      price: product.price, 
      quantity,
      selectedVariant 
    });
    notifySuccess(`Added ${quantity}x ${product.name} to Quote 🛒`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  // Direct WhatsApp Order
  const handleWhatsAppOrder = () => {
    trackEvent('whatsapp_order_modal', { productId: product.id, name: product.name, quantity });
    const variantText = selectedVariant ? ` (${selectedVariant})` : '';
    const phone = config?.whatsappNumber || STORE_CONFIG.whatsappNumber;
    const totalPriceFormatted = formatPrice(product.price * quantity, currency, config);
    const text = encodeURIComponent(
      `Hello Mideva! ❤️ I would like to buy from your collection:\n\n` +
      `📦 Item: ${product.name}${variantText}\n` +
      `🔢 Qty: ${quantity}\n` +
      `💰 Unit Price: ${displayPrice}\n` +
      `💵 Total: ${totalPriceFormatted}\n\n` +
      `📍 Delivery to: Campus Hostel / Hall\n` +
      `Is this item available for delivery today?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Share / Copy Link
  const handleShare = () => {
    const url = window.location.origin + window.location.pathname + `?product=${product.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Submit Comment / Review
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    const newRev = addReview({
      productId: product.id,
      author: authorName.trim() || 'Comrade Student',
      campus: campusLocation.trim() || 'Campus Hostel',
      rating: commentRating,
      comment: commentText.trim()
    });

    if (newRev) {
      setReviewsList((prev) => [newRev, ...prev]);
      setCommentText('');
      setCommentSubmitted(true);
      setTimeout(() => setCommentSubmitted(false), 3000);
      trackEvent('product_review_posted', { productId: product.id, rating: commentRating });
    }
    setIsSubmittingComment(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-left">
        <div className="relative transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all w-full max-w-4xl border border-slate-200 my-8">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="uppercase tracking-wider font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <span>/</span>
              <span className="truncate max-w-[200px] sm:max-w-md text-slate-800 font-medium">
                {product.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                title="Copy share link"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition text-xs flex items-center gap-1 font-semibold"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink && <span className="text-[11px] text-emerald-600 font-bold">Link copied!</span>}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main 2-Column Content (Amazon Style Layout) */}
          <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 max-h-[82vh] overflow-y-auto">
            
            {/* Left Column: Image, Badges & Social Proof (5 cols) */}
            <div className="md:col-span-5 flex flex-col space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
                <img
                  src={imgSrc}
                  alt={product.name}
                  onError={() => setImgSrc(FALLBACK_IMAGE)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  {product.badge && (
                    <span className="bg-slate-900/90 text-white text-xs font-black px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                      {product.badge}
                    </span>
                  )}
                  {product.isComradeDeal && (
                    <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <Tag className="w-3 h-3" /> Comrade Deal
                    </span>
                  )}
                </div>

                {/* Like Button on Image */}
                <button
                  type="button"
                  onClick={handleLike}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/95 backdrop-blur-sm shadow-md hover:bg-white text-slate-700 transition transform active:scale-90 flex items-center gap-1.5"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold">{likeCount}</span>
                </button>

                {/* Dynamic Stock Tag */}
                <div className="absolute bottom-3 left-3">
                  {isOutOfStock ? (
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span>Sold Out • Restocking Soon</span>
                    </span>
                  ) : isLowStock ? (
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-sm flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span>Only {stock} Left in Stock!</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-emerald-200 text-emerald-800 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>In Stock ({stock} available) • Ready for Drop-Off</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery & Trust Highlights */}
              <div className="rounded-2xl bg-amber-50/80 border border-amber-200/70 p-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2.5 font-bold text-amber-900">
                  <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Free Campus Hostel Delivery</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
                  Delivered right to your room or hostel gate within campus. Pay cash or EcoCash upon inspection.
                </p>
                <div className="flex items-center gap-2.5 font-semibold text-slate-800 pt-1 border-t border-amber-200/50">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Student Tested Quality Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Column: Details, Variants, Price & Buy Actions (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                
                {/* Title */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {product.name}
                  </h1>

                  {/* Rating Stars & Reviews Count */}
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(ratingStats.average)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="font-extrabold ml-1.5 text-slate-900 text-sm">
                        {ratingStats.average}
                      </span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <a href="#comments-section" className="text-xs font-semibold text-amber-700 hover:underline">
                      {reviewsList.length} verified comrade reviews
                    </a>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {displayPrice}
                      </span>
                      {product.comradePrice < product.price && (
                        <span className="text-sm font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          Comrade Deal: {comradeDisplayPrice}
                        </span>
                      )}
                    </div>
                    {product.comradePrice < product.price && (
                      <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                        🎉 Student discount saves you ${savingsAmount} on this item!
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Currency</span>
                    <span className="text-xs font-black text-amber-700">{currency}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-1">
                    About this item
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Variant Selector (Sizes, Colors, or Scents) */}
                {(product.sizes || product.colors || product.scents) && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        Select {product.sizes ? 'Size' : (product.colors ? 'Color / Shade' : 'Fragrance Scent')}:
                      </span>
                      <span className="font-semibold text-amber-700">{selectedVariant || 'None'}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(product.sizes || product.colors || product.scents).map((variant) => (
                        <button
                          key={variant}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                            selectedVariant === variant
                              ? 'border-amber-600 bg-amber-500 text-white shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {selectedVariant === variant && <Check className="w-3.5 h-3.5" />}
                          <span>{variant}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper & Subtotal */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Quantity:</span>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                      <button
                        type="button"
                        disabled={isOutOfStock || quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-xs font-black text-slate-900 bg-slate-50 min-w-[32px] text-center">
                        {isOutOfStock ? 0 : quantity}
                      </span>
                      <button
                        type="button"
                        disabled={isOutOfStock || quantity >= stock}
                        onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                        className="px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    {isLowStock && (
                      <span className="text-[10px] font-bold text-amber-600">
                        Max {stock} units
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Total</span>
                    <span className="text-sm font-black text-slate-900">
                      {formatPrice(product.price * (isOutOfStock ? 0 : quantity), currency, config)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons: Add to Quote Drawer + Buy on WhatsApp */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 shadow-md ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
                    }`}
                  >
                    {isOutOfStock ? (
                      <span>Currently Out of Stock</span>
                    ) : added ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Order!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Quote Drawer
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order via WhatsApp</span>
                  </button>
                </div>
                <p className="text-[11px] text-center text-slate-400 font-medium">
                  ⚡ No card needed. Pay with EcoCash, M-Pesa, or Cash when comrade drops it off.
                </p>
              </div>

            </div>

          </div>

          {/* Related / Frequently Bought Together Section */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-6">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Other Comrades Also Bought in {product.category}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedProduct && onSelectRelatedProduct(rel)}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition flex items-center gap-3"
                  >
                    <img
                      src={rel.image || FALLBACK_IMAGE}
                      alt={rel.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{rel.name}</h4>
                      <span className="text-xs font-black text-amber-600">
                        {formatPrice(rel.price, currency, config)}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Comments & Reviews Section (Bottom) */}
          <div id="comments-section" className="border-t border-slate-200 p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Customer Comments &amp; Campus Reviews
                </h3>
                <p className="text-xs text-slate-500">
                  Honest feedback from fellow students who ordered this product.
                </p>
              </div>

              {/* Overall Rating Pill */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-black text-amber-900">{ratingStats.average} out of 5</span>
                <span className="text-xs text-amber-700">({reviewsList.length} reviews)</span>
              </div>
            </div>

            {/* Comment Post Form */}
            <form onSubmit={handleCommentSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Leave a comment or review for {product.name}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Name / Nickname</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kelvin K. or Tariro"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Campus / Hostel Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Hall 4, Complex, Off-campus"
                    value={campusLocation}
                    onChange={(e) => setCampusLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Rating</label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCommentRating(star)}
                        className="p-1 focus:outline-none transition transform hover:scale-125"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= commentRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1.5">
                      {commentRating} / 5
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Review / Comment</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Share how this item fits, how fast it arrived to your hostel, or scent longevity..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  {commentSubmitted && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Review posted successfully!
                    </span>
                  )}
                </span>
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Review</span>
                </button>
              </div>
            </form>

            {/* List of Comments */}
            <div className="space-y-3">
              {reviewsList.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  No comments yet for this item. Be the first comrade to drop a review!
                </div>
              ) : (
                reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                          {rev.author ? rev.author.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900">{rev.author}</span>
                          <span className="text-[10px] text-slate-500 ml-1.5 flex-inline items-center gap-1">
                            📍 {rev.campus}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-9">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
