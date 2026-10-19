// =========================================================================
// MIDEVA'S COLLECTION — ROLE-BASED ACCESS CONTROL (RBAC) & AUTH SYSTEM
// Benchmarked from 1-feedback-system (Africa University LecturePulse)
// Defines strict roles: 'customer' (Comrade), 'seller' (Reseller), 'admin' (System Lead)
// By default: Unauthenticated guest / Customer.
// Customers have STRICTLY ZERO privileges to edit catalog, prices, or store settings.
// =========================================================================

export const ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin'
};

export const ROLE_LABELS = {
  [ROLES.CUSTOMER]: 'Comrade (Customer)',
  [ROLES.SELLER]: 'Campus Reseller (Seller)',
  [ROLES.ADMIN]: 'System Lead (Admin)'
};

export const ROLE_BADGES = {
  [ROLES.CUSTOMER]: { label: 'Comrade', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' },
  [ROLES.SELLER]: { label: 'Seller', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' },
  [ROLES.ADMIN]: { label: 'Admin', color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800' }
};

// Staff / Admin Accounts (for official store management)
export const DEMO_ACCOUNTS = [
  {
    role: ROLES.ADMIN,
    name: 'Mona Lisa Mideva',
    email: 'monalisamideva@gmail.com',
    title: 'Store Owner & System Lead',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    hostel: 'Admin HQ',
    phone: '+254 748 094 795',
    passcode: 'mideva2026',
    key: 'admin'
  },
  {
    role: ROLES.SELLER,
    name: 'Campus Reseller Staff',
    email: 'seller@midevas.co.ke',
    title: 'Campus Reseller & Fulfillment',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    hostel: 'Storefront Desk',
    phone: '+254 748 094 795',
    passcode: 'seller123',
    key: 'seller'
  }
];

const AUTH_USER_KEY = 'midevas_auth_user';

// Get current logged in user. BY DEFAULT: NO ONE IS SIGNED IN (returns null).
export function getActiveUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) {
      if (raw.toLowerCase().includes('brian') || raw.toLowerCase().includes('lupao')) {
        localStorage.removeItem(AUTH_USER_KEY);
      } else {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.role) return parsed;
      }
    }
  } catch (err) {
    // fallback
  }

  // Check registered customer profile in localStorage
  try {
    const custRaw = localStorage.getItem('midevas_customer_user');
    if (custRaw) {
      if (custRaw.toLowerCase().includes('brian') || custRaw.toLowerCase().includes('lupao')) {
        localStorage.removeItem('midevas_customer_user');
      } else {
        const cust = JSON.parse(custRaw);
        if (cust && cust.name) {
          return {
            id: cust.id || 'cust_' + Date.now().toString(36),
            role: ROLES.CUSTOMER,
            name: cust.name,
            email: cust.email || '',
            phone: cust.phone || '',
            hostel: cust.hostel || 'Campus Hostel',
            title: 'Comrade Shopper',
            avatar: cust.avatar || (cust.email ? `https://unavatar.io/${encodeURIComponent(cust.email.trim().toLowerCase())}?fallback=https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cust.name)}` : '')
          };
        }
      }
    }
  } catch (err) {
    // fallback
  }

  // Default: Nobody signed in
  return null;
}

// Set active user with role
export function setActiveUser(user) {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem('midevas_admin_auth');
      window.dispatchEvent(new CustomEvent('midevas-auth-updated', { detail: null }));
      return null;
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    // Also sync with customer storage if role is customer
    if (user.role === ROLES.CUSTOMER) {
      localStorage.setItem('midevas_customer_user', JSON.stringify({
        id: user.id || 'cust_' + Date.now().toString(36),
        name: user.name,
        phone: user.phone || '',
        hostel: user.hostel || '',
        email: user.email || '',
        avatar: user.avatar || '',
        campus: user.campus || 'Main Campus'
      }));
    }

    // Set admin session auth if admin or seller
    if (user.role === ROLES.ADMIN || user.role === ROLES.SELLER) {
      sessionStorage.setItem('midevas_admin_auth', 'true');
    } else {
      sessionStorage.removeItem('midevas_admin_auth');
    }

    window.dispatchEvent(new CustomEvent('midevas-auth-updated', { detail: user }));
    return user;
  } catch (err) {
    console.error('Error saving active user:', err);
    return user;
  }
}

// Switch to a staff/admin demo account (or logout to customer/guest)
export function switchDemoRole(roleKey) {
  if (roleKey === 'customer' || roleKey === 'guest') {
    return logoutActiveUser();
  }
  const account = DEMO_ACCOUNTS.find((a) => a.key === roleKey || a.role === roleKey);
  if (account) {
    return setActiveUser(account);
  }
  return getActiveUser();
}

// Logout user: resets to guest state (nobody signed in)
export function logoutActiveUser() {
  try {
    sessionStorage.removeItem('midevas_admin_auth');
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem('midevas_customer_user');
    window.dispatchEvent(new CustomEvent('midevas-auth-updated', { detail: null }));
    window.dispatchEvent(new CustomEvent('midevas-customer-updated', { detail: null }));
    return null;
  } catch (err) {
    return null;
  }
}

// RBAC Permission Helpers
// Customers have STRICTLY ZERO privileges to modify the store.
export function canAccessAdmin(user) {
  return Boolean(user && (user.role === ROLES.ADMIN || user.role === ROLES.SELLER));
}

export function canEditStock(user) {
  return Boolean(user && (user.role === ROLES.ADMIN || user.role === ROLES.SELLER));
}

export function canEditPrices(user) {
  return Boolean(user && (user.role === ROLES.ADMIN || user.role === ROLES.SELLER));
}

export function canManageOrders(user) {
  return Boolean(user && (user.role === ROLES.ADMIN || user.role === ROLES.SELLER));
}

export function canExportDeliveryRoster(user) {
  return Boolean(user && (user.role === ROLES.ADMIN || user.role === ROLES.SELLER));
}

export function canManageCMS(user) {
  return Boolean(user && user.role === ROLES.ADMIN);
}

export function canConfigureBot(user) {
  return Boolean(user && user.role === ROLES.ADMIN);
}

export function canChangePasscode(user) {
  return Boolean(user && user.role === ROLES.ADMIN);
}

export function canResetCatalog(user) {
  return Boolean(user && user.role === ROLES.ADMIN);
}
