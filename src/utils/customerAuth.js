// =========================================================================
// MIDEVA'S COLLECTION — COMRADE / CUSTOMER AUTHENTICATION & PROFILE
// Allows comrades to register/sign in with Name, WhatsApp number, and Hostel
// =========================================================================

import { getOrders } from './orders';

const CUSTOMER_STORAGE_KEY = 'midevas_customer_user';

export function getCurrentCustomer() {
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function saveCustomerProfile(profileData) {
  try {
    const current = getCurrentCustomer() || {};
    const updated = {
      id: current.id || 'comrade_' + Date.now().toString(36),
      name: profileData.name ? profileData.name.trim() : current.name || '',
      phone: profileData.phone ? profileData.phone.trim() : current.phone || '',
      hostel: profileData.hostel ? profileData.hostel.trim() : current.hostel || '',
      email: profileData.email ? profileData.email.trim() : current.email || '',
      campus: profileData.campus ? profileData.campus.trim() : (current.campus || 'Main Campus'),
      updatedAt: new Date().toISOString(),
      registeredAt: current.registeredAt || new Date().toISOString()
    };
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('midevas-customer-updated', { detail: updated }));
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
