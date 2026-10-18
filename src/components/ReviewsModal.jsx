import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Check, Sparkles, User, MapPin } from 'lucide-react';
import { getReviewsForProduct, addReview } from '../utils/reviews';
import { getCurrentCustomer } from '../utils/customerAuth';
import { notifySuccess } from '../utils/notifications';

export default function ReviewsModal({ isOpen, onClose, product }) {
  const [reviews, setReviews] = useState(() => (product ? getReviewsForProduct(product.id) : []));
  const [author, setAuthor] = useState('');
  const [campus, setCampus] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sync reviews when product changes & auto-fill customer info
  useEffect(() => {
    if (product) {
      setReviews(getReviewsForProduct(product.id));
      setSubmitted(false);
      const cust = getCurrentCustomer();
      if (cust) {
        if (!author) setAuthor(cust.name || '');
        if (!campus) setCampus(cust.hostel || 'Campus Resident');
      }
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev = addReview({
      productId: product.id,
      author: author.trim() || 'Comrade Reviewer',
      campus: campus.trim() || 'Campus Resident',
      rating,
      comment: comment.trim()
    });

    if (newRev) {
      setReviews((prev) => [newRev, ...prev]);
      setSubmitted(true);
      setComment('');
      notifySuccess('Review posted successfully! Thank you comrade! ⭐');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200 dark:border-slate-800">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  Customer Reviews
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                  {product.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 max-h-[60vh] overflow-y-auto space-y-5">
            {/* Rating summary */}
            <div className="flex items-center justify-between bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{product.rating}</span>
                <div>
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Verified Comrade Ratings ({reviews.length + (product.reviews || 0)} total)
                  </span>
                </div>
              </div>
            </div>

            {/* List of Reviews */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recent Reviews ({reviews.length})
              </h4>
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center italic">
                  Be the first comrade to review this item!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{rev.author}</span>
                        <span className="text-[10px] text-slate-400">• {rev.campus}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                  </div>
                ))
              )}
            </div>

            {/* Write a review form */}
            <form onSubmit={handleSubmit} className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> Write a Quick Review
              </h4>

              {submitted && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your review was recorded successfully.</span>
                </div>
              )}

              {/* Star selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Brian L.)"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Hostel / Campus"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  required
                  placeholder="How was the product quality or delivery speed?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition"
              >
                Post Review
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
