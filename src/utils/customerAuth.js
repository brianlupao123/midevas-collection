// =========================================================================
// MIDEVA'S COLLECTION — COMRADE / CUSTOMER AUTHENTICATION & PROFILE
// Allows comrades to register/sign in with Name, Email, WhatsApp number, and Hostel
// By default: Clients are unauthenticated until they create an account.
// Email photo or uploaded avatar automatically replaces the header profile icon.
// =========================================================================

import { getOrders } from './orders';
import { setActiveUser, ROLES } from './rbac';

const CUSTOMER_STORAGE_KEY = 'midevas_customer_user';

// Helper to resolve an email avatar URL (via unavatar.io Gravatar/social fallback or initials)
export function resolveEmailAvatar(email, name) {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanName = name ? name.trim() : 'Comrade';
  if (cleanEmail) {
    return `https://unavatar.io/${encodeURIComponent(cleanEmail)}?fallback=https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`;
  }
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`;
}

export function getCurrentCustomer() {
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (!raw) return null;
    
    // Purge any legacy test accounts
    if (raw.toLowerCase().includes('brian') || raw.toLowerCase().includes('lupao')) {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      return null;
    }
    
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function saveCustomerProfile(profileData) {
  try {
    const current = getCurrentCustomer() || {};
    const name = profileData.name ? profileData.name.trim() : current.name || '';
    const email = profileData.email ? profileData.email.trim() : current.email || '';
    const phone = profileData.phone ? profileData.phone.trim() : current.phone || '';
    const hostel = profileData.hostel ? profileData.hostel.trim() : current.hostel || '';
    const campus = profileData.campus ? profileData.campus.trim() : (current.campus || 'Main Campus');
    const avatar = profileData.avatar || resolveEmailAvatar(email, name);

    const updated = {
      id: current.id || 'comrade_' + Date.now().toString(36),
      name,
      phone,
      hostel,
      email,
      campus,
      avatar,
      updatedAt: new Date().toISOString(),
      registeredAt: current.registeredAt || new Date().toISOString()
    };

    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('midevas-customer-updated', { detail: updated }));

    // Automatically set active user so the header profile icon updates immediately
    setActiveUser({
      id: updated.id,
      role: ROLES.CUSTOMER,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      hostel: updated.hostel,
      avatar: updated.avatar,
      title: 'Comrade Shopper'
    });

    return updated;
  } catch (err) {
    console.error('Error saving customer profile:', err);
    return null;
  }
}

export function logoutCustomer() {
  try {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('midevas-customer-updated', { detail: null }));
    setActiveUser(null);
  } catch (err) {
    // ignore
  }
}

export function getCustomerPastOrders(customer) {
  if (!customer) return [];
  const allOrders = getOrders();
  const searchName = (customer.name || '').toLowerCase().trim();
  const searchPhone = (customer.phone || '').replace(/\D/g, '');

  return allOrders.filter((o) => {
    const ordName = (o.customerName || '').toLowerCase().trim();
    const ordNotes = (o.notes || '') + ' ' + (o.deliveryLocation || '');
    if (searchName && ordName.includes(searchName)) return true;
    if (searchPhone && ordNotes.replace(/\D/g, '').includes(searchPhone)) return true;
    return false;
  });
}
