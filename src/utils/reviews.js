// =========================================================================
// MIDEVA'S COLLECTION — PRODUCT REVIEWS & SOCIAL PROOF
// Supports reading reviews, adding reviews with ratings, and calculating scores
// =========================================================================

const REVIEWS_STORAGE_KEY = 'midevas_product_reviews';

const SEED_REVIEWS = [
  {
    id: 'rev_1',
    productId: 'fsh-01',
    author: 'Tariro M.',
    campus: 'Main Campus',
    rating: 5,
    date: '2 days ago',
    comment: 'Quality cotton shirt! Wore it for our group presentation and looked sharp. Fast delivery to hostel too.'
  },
  {
    id: 'rev_2',
    productId: 'fsh-02',
    author: 'Kelvin K.',
    campus: 'Hall 4',
    rating: 5,
    date: '3 days ago',
    comment: 'The streetwear graphic tee is heavy duty and fits oversize nicely. Best $3.50 spent this semester.'
  },
  {
    id: 'rev_3',
    productId: 'bag-05',
    author: 'Nyasha C.',
    campus: 'Complex Girls Hostel',
    rating: 5,
    date: 'Yesterday',
    comment: 'Love my executive structured bag! It holds my iPad, perfume and notebook comfortably. Gold details look expensive.'
  },
  {
    id: 'rev_4',
    productId: 'bty-09',
    author: 'Blessing T.',
    campus: 'Hostel 2',
    rating: 5,
    date: '4 days ago',
    comment: 'The Vanilla Sweet pocket perfume smells divine and lasts until evening lectures. Ordering the Amber one next!'
  },
  {
    id: 'rev_5',
    productId: 'snk-23',
    author: 'Simba G.',
    campus: 'Off-Campus Flats',
    rating: 5,
    date: '1 day ago',
    comment: 'Mazoe Orange concentrate + maputi study bundle delivered right to my gate. Lifesaver during exam revision.'
  }
];

export function getReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
      return SEED_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return SEED_REVIEWS;
  }
}

export function getReviewsForProduct(productId) {
  const all = getReviews();
  return all.filter((r) => r.productId === productId);
}

export function addReview(reviewData) {
  try {
    const all = getReviews();
    const newRev = {
      id: 'rev_' + Date.now().toString(36),
      productId: reviewData.productId,
      author: reviewData.author?.trim() || 'Comrade Reviewer',
      campus: reviewData.campus?.trim() || 'Campus Resident',
      rating: Number(reviewData.rating) || 5,
      date: 'Just now',
      comment: reviewData.comment?.trim() || 'Great quality product! Highly recommended.'
    };
    all.unshift(newRev);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(all));
    return newRev;
  } catch (err) {
    console.error('Error adding review:', err);
    return null;
  }
}

export function deleteReview(reviewId) {
  try {
    const all = getReviews();
    const updated = all.filter((r) => r.id !== reviewId);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting review:', err);
    return getReviews();
  }
}

export function getProductRatingStats(productId, baselineRating = 4.8, baselineCount = 25) {
  const productReviews = getReviewsForProduct(productId);
  if (productReviews.length === 0) {
    return {
      average: baselineRating,
      count: baselineCount,
      breakdown: { 5: 80, 4: 15, 3: 5, 2: 0, 1: 0 }
    };
  }
  const total = productReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
  const avg = (total / productReviews.length).toFixed(1);
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    breakdown[star] = (breakdown[star] || 0) + 1;
  });
  return {
    average: Number(avg),
    count: productReviews.length,
    breakdown
  };
}
