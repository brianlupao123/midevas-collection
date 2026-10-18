// =========================================================================
// MIDEVA'S COLLECTION — ROLE-BASED ACCESS CONTROL (RBAC) & AUTH SYSTEM
// Benchmarked from 1-feedback-system (Africa University LecturePulse)
// Defines strict roles: 'customer' (Comrade), 'seller' (Reseller), 'admin' (System Lead)
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

// Seeded Showcase Accounts (benchmarked directly from 1-feedback-system DEMO_ACCOUNTS)
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
    name: 'Mideva Sales Staff',
    email: 'seller@midevas.co.ke',
    title: 'Campus Reseller & Fulfillment',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    hostel: 'Storefront Desk',
    phone: '+254 748 094 795',
    passcode: 'seller123',
    key: 'seller'
  },
  {
    role: ROLES.CUSTOMER,
    name: 'Brian Lupao',
    email: 'brian@student.africa',
    title: 'Comrade Student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    hostel: 'Hall 4 Room 204',
    phone: '+254 712 345 678',
    passcode: 'comrade',
    key: 'customer'
  }
];

const AUTH_USER_KEY = 'midevas_auth_user';

// Get current logged in user or default to Comrade (Customer)
export function getActiveUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.role) return parsed;
    }
  } catch (err) {
    // fallback
  }

  // Check legacy customer storage if present
  try {
    const custRaw = localStorage.getItem('midevas_customer_user');
    if (custRaw) {
      const cust = JSON.parse(custRaw);
      if (cust && cust.name) {
        return {
          id: cust.id || 'cust_' + Date.now().toString(36),
          role: ROLES.CUSTOMER,
          name: cust.name,
          email: cust.email || 'comrade@student.ac.ke',
          phone: cust.phone || '+254 700 000 000',
          hostel: cust.hostel || 'Campus Hostel',
          title: 'Comrade Shopper',
          avatar: ''
        };
      }
    }
  } catch (err) {
    // fallback
  }

  // Default initial guest/comrade account
  return DEMO_ACCOUNTS.find((a) => a.role === ROLES.CUSTOMER) || DEMO_ACCOUNTS[2];
}

// Set active user with role
export function setActiveUser(user) {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    // Also sync with legacy customer key if it's a customer
    if (user.role === ROLES.CUSTOMER) {
      localStorage.setItem('midevas_customer_user', JSON.stringify({
        id: user.id || 'cust_' + Date.now().toString(36),
        name: user.name,
        phone: user.phone,
        hostel: user.hostel,
        email: user.email,
        campus: 'Main Campus'
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

// Switch to a demo account
export function switchDemoRole(roleKey) {
  const account = DEMO_ACCOUNTS.find((a) => a.key === roleKey || a.role === roleKey);
  if (account) {
    return setActiveUser(account);
  }
  return getActiveUser();
}

// Logout to Comrade / Guest state
export function logoutActiveUser() {
  try {
    sessionStorage.removeItem('midevas_admin_auth');
    const guestUser = {
      role: ROLES.CUSTOMER,
      name: 'Comrade Guest',
      email: '',
      title: 'Comrade Shopper',
      phone: '',
      hostel: '',
      avatar: ''
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(guestUser));
    window.dispatchEvent(new CustomEvent('midevas-auth-updated', { detail: guestUser }));
    return guestUser;
  } catch (err) {
    // ignore
  }
}

// RBAC Permission Helpers
export function canAccessAdmin(user) {
  const role = user?.role || ROLES.CUSTOMER;
  return role === ROLES.ADMIN || role === ROLES.SELLER;
}

export function canEditStock(user) {
  const role = user?.role || ROLES.CUSTOMER;
  return role === ROLES.ADMIN || role === ROLES.SELLER;
}

export function canEditPrices(user) {
  const role = user?.role || ROLES.CUSTOMER;
  return role === ROLES.ADMIN || role === ROLES.SELLER;
}

export function canManageOrders(user) {
  const role = user?.role || ROLES.CUSTOMER;
  return role === ROLES.ADMIN || role === ROLES.SELLER;
}

export function canExportDeliveryRoster(user) {
  const role = user?.role || ROLES.CUSTOMER;
  return role === ROLES.ADMIN || role === ROLES.SELLER;
}

export function canManageCMS(user) {
  const role = user?.role || ROLES.CUSTOMER;
  return role === ROLES.ADMIN;
}

export function canConfigureBot(user) {
  const role = user?.role || ROLES.CUSTOMER;
  return role === ROLES.ADMIN;
}

export function canChangePasscode(user) {
  const role = user?.role || ROLES.CUSTOMER;
  return role === ROLES.ADMIN;
}

export function canResetCatalog(user) {
  const role = user?.role || ROLES.CUSTOMER;
  return role === ROLES.ADMIN;
}
