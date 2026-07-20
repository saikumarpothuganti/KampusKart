import Cart from '../models/Cart.js';
import mongoose from 'mongoose';

let indexDropped = false;
const dropUniqueIndex = async () => {
  if (indexDropped) return;
  try {
    await mongoose.connection.collection('carts').dropIndex('userId_1');
  } catch (err) {}
  indexDropped = true;
};

// GET /api/cart
export const getCarts = async (req, res) => {
  try {
    await dropUniqueIndex();
    let carts = await Cart.find({ userId: req.user.id });
    if (carts.length === 0) {
      const defaultCart = new Cart({ userId: req.user.id, name: 'My Cart', items: [] });
      await defaultCart.save();
      carts = [defaultCart];
    }
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/cart/create
export const createCart = async (req, res) => {
  try {
    const { name } = req.body;
    const newCart = new Cart({ userId: req.user.id, name: name || 'New Cart', items: [] });
    await newCart.save();
    
    const carts = await Cart.find({ userId: req.user.id });
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/cart/:cartId/add
export const addToCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { type, subjectId, title, code, pdfUrl, qty, sides, sideType, pricePerPage, price, userPrice } = req.body;

    const cart = await Cart.findOne({ _id: cartId, userId: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items.push({ type, subjectId, title, code, pdfUrl, qty, sides, sideType, pricePerPage, price, userPrice });
    await cart.save();

    const carts = await Cart.find({ userId: req.user.id });
    res.json(carts);
  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/cart/:cartId/:itemIndex
export const updateCartItem = async (req, res) => {
  try {
    const { cartId, itemIndex } = req.params;
    const { qty, sides, sideType, pricePerPage } = req.body;

    const cart = await Cart.findOne({ _id: cartId, userId: req.user.id });
    if (!cart || !cart.items[itemIndex]) return res.status(404).json({ error: 'Item not found' });

    if (qty !== undefined) cart.items[itemIndex].qty = qty;
    if (sides !== undefined) cart.items[itemIndex].sides = sides;
    if (sideType !== undefined) cart.items[itemIndex].sideType = sideType;
    if (pricePerPage !== undefined) cart.items[itemIndex].pricePerPage = pricePerPage;

    await cart.save();
    
    const carts = await Cart.find({ userId: req.user.id });
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/cart/:cartId/:itemIndex
export const removeFromCart = async (req, res) => {
  try {
    const { cartId, itemIndex } = req.params;

    const cart = await Cart.findOne({ _id: cartId, userId: req.user.id });
    if (!cart || !cart.items[itemIndex]) return res.status(404).json({ error: 'Item not found' });

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const carts = await Cart.find({ userId: req.user.id });
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/cart/:cartId
export const deleteCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    await Cart.findOneAndDelete({ _id: cartId, userId: req.user.id });
    
    let carts = await Cart.find({ userId: req.user.id });
    if (carts.length === 0) {
      const defaultCart = new Cart({ userId: req.user.id, name: 'My Cart', items: [] });
      await defaultCart.save();
      carts = [defaultCart];
    }
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
