// =========================================================================
// MIDEVA'S COLLECTION — ORDER TRACKING & MANAGEMENT
// Stores order records when quotes or WhatsApp checkouts occur.
// Allows Mideva to track pending, confirmed, delivered, and cancelled orders.
// =========================================================================

const ORDERS_STORAGE_KEY = 'midevas_recorded_orders';

// Seed demo orders so Mideva has realistic data immediately on first launch
const SEED_ORDERS = [
  {
    id: 'ORD-782104',
    customerName: 'Tinashe Moyo',
    deliveryLocation: 'Hostel 3, Room 14B',
    notes: 'Please bring both Sky Blue and Navy Blue shirts to choose fit',
    items: [
      { name: 'Classic Button-Up Cotton Shirt', variant: 'Sky Blue', quantity: 1, price: 7.50 },
      { name: 'Soft Care Pads (6 Pack)', variant: null, quantity: 1, price: 3.40 }
    ],
    totalUsd: 10.90,
    totalKsh: 1417,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() // yesterday
  },
  {
    id: 'ORD-893155',
    customerName: 'Chiedza B.',
    deliveryLocation: 'Complex Hall 2, Room 08',
    notes: 'Deliver after 5pm class please!',
    items: [
      { name: 'Compact Quilted Crossbody Sling Bag', variant: 'Classic Black', quantity: 1, price: 6.00 },
      { name: 'Luxury Oil-Based Pocket Perfume (35ml)', variant: 'Vanilla Sweet', quantity: 1, price: 4.50 }
    ],
    totalUsd: 10.50,
    totalKsh: 1365,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hrs ago
  },
  {
    id: 'ORD-941028',
    customerName: 'Kudzai N.',
    deliveryLocation: 'Gate 2 Campus Drop-off',
    notes: 'Cash on delivery ready',
    items: [
      { name: 'Heavyweight Graphic Streetwear Tee', variant: 'Vintage Black', quantity: 2, price: 3.80 },
      { name: 'Mazoe Orange Crush Concentrate', variant: null, quantity: 1, price: 4.50 },
      { name: 'Maputi (Popcorn) Bucket', variant: null, quantity: 2, price: 0.50 }
    ],
    totalUsd: 13.10,
    totalKsh: 1703,
    status: 'Pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString() // 35 mins ago
  }
];

export function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading orders:', err);
    return SEED_ORDERS;
  }
}

export function saveOrder(orderInput) {
  try {
    const orders = getOrders();
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      customerName: orderInput.customerName?.trim() || 'Comrade Customer',
      deliveryLocation: orderInput.deliveryLocation?.trim() || 'Campus Drop-off',
      notes: orderInput.notes?.trim() || '',
      items: orderInput.items.map((i) => ({
        id: i.id,
        name: i.name,
        variant: i.selectedVariant || null,
        quantity: i.quantity,
        price: i.price,
        lineTotal: +(i.price * i.quantity).toFixed(2)
      })),
      totalUsd: +orderInput.totalUsd.toFixed(2),
      totalKsh: Math.round(orderInput.totalUsd * 130)
    };

    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return newOrder;
  } catch (err) {
    console.error('Error saving order:', err);
    return null;
  }
}

export function updateOrderStatus(orderId, newStatus) {
  try {
    const orders = getOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating status:', err);
    return getOrders();
  }
}

export function deleteOrder(orderId) {
  try {
    const orders = getOrders();
    const filtered = orders.filter((o) => o.id !== orderId);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Error deleting order:', err);
    return getOrders();
  }
}
