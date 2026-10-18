// =========================================================================
// MIDEVA'S COLLECTION — LIVE TOAST NOTIFICATION EVENT SYSTEM
// Dispatches visual alerts for cart, stock, orders, auth, and theme updates
// =========================================================================

export function notify(message, type = 'info', duration = 3500) {
  const toastEvent = new CustomEvent('midevas-toast', {
    detail: {
      id: 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      message,
      type, // 'success' | 'warning' | 'error' | 'info'
      duration,
      timestamp: Date.now()
    }
  });
  window.dispatchEvent(toastEvent);
}

export function notifySuccess(message, duration) {
  notify(message, 'success', duration);
}

export function notifyWarning(message, duration) {
  notify(message, 'warning', duration);
}

export function notifyError(message, duration) {
  notify(message, 'error', duration);
}

export function notifyInfo(message, duration) {
  notify(message, 'info', duration);
}
