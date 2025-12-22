const STORAGE_KEY = 'ORDERS_ENABLED';

// Returns global flag (default: true)
export const getOrdersEnabled = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return true;
  return stored === 'true';
};

// Role-aware check: Admins always allowed to place orders
export const isOrdersEnabledForUser = (user) => {
  if (user?.isAdmin) return true;
  return getOrdersEnabled();
};

// Persist toggle value to localStorage
export const setOrdersEnabled = (value) => {
  localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
  return value;
};

export const ORDERS_PAUSED_MESSAGE =
  'We\'ve received more orders than expected. New orders are temporarily paused. Please check back shortly. For urgent needs, contact us on Telegram.';
