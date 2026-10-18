// =========================================================================
// MIDEVA'S COLLECTION — THEME MANAGER (LIGHT / DARK MODE)
// Persists comrade preference in localStorage and toggles 'dark' on <html>
// =========================================================================

const THEME_STORAGE_KEY = 'midevas_theme';

export function getStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (err) {
    // ignore
  }
  return 'light';
}

export function applyTheme(theme) {
  try {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.dispatchEvent(new CustomEvent('midevas-theme-changed', { detail: { theme } }));
  } catch (err) {
    console.error('Failed to apply theme:', err);
  }
}

export function toggleTheme() {
  const current = getStoredTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function initTheme() {
  const initial = getStoredTheme();
  applyTheme(initial);
  return initial;
}
