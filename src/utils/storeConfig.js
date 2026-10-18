// =========================================================================
// MIDEVA'S COLLECTION — STORE CONFIG & EDITABLE PUBLIC CONTENT
// Allows Mideva (admin) to dynamically update phone, group links,
// announcements, exchange rates, and store bio without modifying code.
// =========================================================================

const CONFIG_STORAGE_KEY = 'midevas_store_config';

export const DEFAULT_STORE_CONFIG = {
  storeName: "Mideva's Collection",
  adminEmail: "monalisamideva@gmail.com",
  tagline: "Great Quality Everyday",
  subTagline: "Comrade Affordable Fashion & Daily Essentials for Ladies & Gentlemen",
  whatsappNumber: "254748094795",
  whatsappCatalogUrl: "https://wa.me/c/254748094795",
  whatsappGroupInvite: "https://chat.whatsapp.com/GuRW4nzqO251oyPcC5MRwH",
  announcementText: "🔥 Shirts < $8 • Tees < $4 • Bags $6 & $10 • Perfumes < $5 • Free Campus Hostel Delivery!",
  deliveryNotice: "🚀 Free delivery around campus hostels & student halls! Fast town drop-off available.",
  exchangeRate: 130,
  currency: "$",
  secondaryCurrency: "KSh",
  ecocashNumber: "0774809479",
  ecocashMerchantCode: "94795",
  ecocashRate: 28, // ZiG rate per USD if paying in local ZiG EcoCash
  ecocashMode: "USD", // "USD" or "ZiG"
  paymentMethods: ["M-Pesa", "EcoCash", "Cash on Delivery", "Bank Transfer"]
};

// Unified price formatter across the application
export function formatPrice(usdAmount, activeCurrency = '$', config = DEFAULT_STORE_CONFIG) {
  const amount = Number(usdAmount) || 0;
  if (activeCurrency === 'KSh') {
    const kshRate = config?.exchangeRate || 130;
    return `KSh ${Math.round(amount * kshRate).toLocaleString()}`;
  }
  if (activeCurrency === 'EcoCash') {
    // If EcoCash is set to USD mode (most common in modern Zim campus trade), show EcoCash $
    if (config?.ecocashMode === 'ZiG') {
      const zigRate = config?.ecocashRate || 28;
      return `ZiG ${Math.round(amount * zigRate).toLocaleString()}`;
    }
    return `EcoCash $${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function getStoreConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_STORE_CONFIG));
      return DEFAULT_STORE_CONFIG;
    }
    return { ...DEFAULT_STORE_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_STORE_CONFIG;
  }
}

export function saveStoreConfig(newConfig) {
  try {
    const current = getStoreConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving store config:', err);
    return getStoreConfig();
  }
}

export function resetStoreConfig() {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_STORE_CONFIG));
  return DEFAULT_STORE_CONFIG;
}
