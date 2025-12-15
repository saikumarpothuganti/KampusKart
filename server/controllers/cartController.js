import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart || { userId: req.user.id, items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { type, subjectId, title, code, pdfUrl, qty, sides, price, userPrice } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const item = {
      type,
      subjectId,
      title,
      code,
      pdfUrl,
      qty,
      sides,
      price,
      userPrice,
    };

    cart.items.push(item);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemIndex } = req.params;
    const { qty, sides } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || !cart.items[itemIndex]) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (qty !== undefined) cart.items[itemIndex].qty = qty;
    if (sides !== undefined) cart.items[itemIndex].sides = sides;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemIndex } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || !cart.items[itemIndex]) {
      return res.status(404).json({ error: 'Item not found' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
