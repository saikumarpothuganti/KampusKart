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

const recalculateCart = (cart) => {
  let actualEnergy = 0;
  
  cart.items.forEach(item => {
    const isBasic = item.quality === 'basic';
    const isPremium = item.quality === 'premium';
    const energyPerItem = isBasic ? 6 : (isPremium ? 18 : 12);
    actualEnergy += (energyPerItem * (item.qty || 1));
  });

  cart.actualEnergy = actualEnergy;
  cart.displayEnergy = actualEnergy > 0 ? actualEnergy : 0; // Removed sessionOffset

  const level = Math.floor(cart.displayEnergy / 100);
  const currentRewardLevel = level; // Allow levels beyond 6 so frontend can check for 700+

  cart.currentRewardLevel = currentRewardLevel;
  let eventDiscountTotal = 0;

  cart.items.forEach(item => {
    const isBasic = item.quality === 'basic';
    const basePrice = item.price ?? item.userPrice ?? 0;
    let discount = 0;
    
    if (isBasic) {
      if (level >= 5) discount = 3;       // 500+ Energy (84+ books)
      else if (level >= 3) discount = 2;  // 300-499 Energy (50-83 books)
      else if (level >= 1) discount = 1;  // 100-299 Energy (17-49 books)
    } else {
      if (level >= 6) discount = 10;     // 600+ (50+ standard books)
      else if (level === 5) discount = 7; // 500-599
      else if (level === 4) discount = 5; // 400-499
      else if (level === 3) discount = 3; // 300-399
      else if (level === 2) discount = 2; // 200-299
      else if (level === 1) discount = 1; // 100-199
    }

    item.eventDiscount = discount;
    eventDiscountTotal += (discount * (item.qty || 1));
    
    // Ensure we explicitly set userPrice to basePrice if it was previously overwritten by the old logic
    item.userPrice = basePrice;
  });

  cart.eventDiscountTotal = eventDiscountTotal;
};

// GET /api/cart
export const getCarts = async (req, res) => {
  try {
    await dropUniqueIndex();
    let carts = await Cart.find({ userId: req.user.id });
    if (carts.length === 0) {
      const defaultCart = new Cart({ userId: req.user.id, name: 'My Cart', items: [] });
      recalculateCart(defaultCart);
      await defaultCart.save();
      carts = [defaultCart];
    } else {
      let needsSave = false;
      for (const cart of carts) {
        if (cart.sessionOffset === undefined) {
          recalculateCart(cart);
          await cart.save();
        } else {
          recalculateCart(cart); // recalculate in memory before sending
        }
      }
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
    recalculateCart(newCart);
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
    const { type, subjectId, title, code, pdfUrl, qty, sides, sideType, quality, pricePerPage, price, userPrice } = req.body;

    const cart = await Cart.findOne({ _id: cartId, userId: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items.push({ type, subjectId, title, code, pdfUrl, qty, sides, sideType, quality, pricePerPage, price, userPrice });
    recalculateCart(cart);
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
    const { qty, sides, sideType, quality, pricePerPage } = req.body;

    const cart = await Cart.findOne({ _id: cartId, userId: req.user.id });
    if (!cart || !cart.items[itemIndex]) return res.status(404).json({ error: 'Item not found' });

    if (qty !== undefined) cart.items[itemIndex].qty = qty;
    if (sides !== undefined) cart.items[itemIndex].sides = sides;
    if (sideType !== undefined) cart.items[itemIndex].sideType = sideType;
    if (quality !== undefined) cart.items[itemIndex].quality = quality;
    if (pricePerPage !== undefined) cart.items[itemIndex].pricePerPage = pricePerPage;

    recalculateCart(cart);
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
    recalculateCart(cart);
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
      recalculateCart(defaultCart);
      await defaultCart.save();
      carts = [defaultCart];
    }
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
