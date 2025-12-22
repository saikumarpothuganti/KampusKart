// In-memory global flag for orders toggle
let ORDERS_ENABLED = true;

// Get current orders enabled state
export const getOrdersEnabled = (req, res) => {
  res.json({ enabled: ORDERS_ENABLED });
};

// Set orders enabled state (admin only)
export const setOrdersEnabled = (req, res) => {
  const { enabled } = req.body;
  
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'enabled must be a boolean' });
  }
  
  ORDERS_ENABLED = enabled;
  res.json({ enabled: ORDERS_ENABLED });
};

// Helper to check if orders are enabled for a user
export const checkOrdersEnabled = (user) => {
  // Admin always bypasses
  if (user?.isAdmin) return true;
  return ORDERS_ENABLED;
};

// Export flag getter for use in other controllers
export const getFlag = () => ORDERS_ENABLED;
