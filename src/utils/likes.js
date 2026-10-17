// =========================================================================
// MIDEVA'S COLLECTION — PRODUCT LIKES & ENGAGEMENT
// Handles customer likes/hearts with local storage persistence
// =========================================================================

const LIKES_STORAGE_KEY = 'midevas_product_likes';
const USER_LIKED_KEY = 'midevas_user_liked_set';

// Seed like counts for social proof
const BASELINE_LIKES = {
  'fsh-01': 38,
  'fsh-02': 54,
  'fsh-03': 29,
  'fsh-04': 22,
  'bag-05': 73,
  'bag-06': 81,
  'bag-07': 44,
  'bag-08': 31,
  'bty-09': 95,
  'bty-10': 67,
  'bty-11': 48,
  'hyg-15': 62,
  'hyg-18': 41,
  'snk-26': 112,
  'snk-27': 180,
  'snk-29': 145,
  'snk-32': 190,
  'grc-39': 88,
  'stn-42': 65,
  'ess-47': 84
};

export function getLikes() {
  try {
    const raw = localStorage.getItem(LIKES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(BASELINE_LIKES));
      return BASELINE_LIKES;
    }
    return { ...BASELINE_LIKES, ...JSON.parse(raw) };
  } catch (err) {
    return BASELINE_LIKES;
  }
}

export function getUserLikedSet() {
  try {
    const raw = localStorage.getItem(USER_LIKED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

export function isProductLikedByUser(productId) {
  const userLiked = getUserLikedSet();
  return !!userLiked[productId];
}

export function toggleProductLike(productId) {
  try {
    const likes = getLikes();
    const userLiked = getUserLikedSet();
    const currentlyLiked = !!userLiked[productId];

    const currentCount = likes[productId] || 0;
    const newCount = currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    likes[productId] = newCount;
    userLiked[productId] = !currentlyLiked;

    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
    localStorage.setItem(USER_LIKED_KEY, JSON.stringify(userLiked));

    return {
      count: newCount,
      isLiked: !currentlyLiked
    };
  } catch (err) {
    console.error('Error toggling like:', err);
    return { count: 1, isLiked: true };
  }
}
