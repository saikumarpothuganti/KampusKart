import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { v4 as uuidv4 } from 'uuid';

const generateOrderId = async () => {
  let orderId = '';
  let isUnique = false;
  while (!isUnique) {
    const randomNum = Math.floor(Math.random() * 10000);
    orderId = `O${randomNum.toString().padStart(4, '0')}`;
    const existing = await Order.findOne({ orderId });
    isUnique = !existing;
  }
  return orderId;
};

export const createOrder = async (req, res) => {
  try {
    const { items, amount, paymentScreenshotUrl, student, pickupPoint, paymentType, paidAmount, remainingAmount } = req.body;

    if (!items || amount === undefined || amount === null || !student) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if any item has null/undefined userPrice (custom PDF without price)
    const hasPendingPrice = items.some(item => 
      item.type === 'custom' && (item.userPrice === null || item.userPrice === undefined)
    );

    const orderId = await generateOrderId();

    // Prepare payment info (optional / backward-compatible)
    const paymentInfo = {
      screenshotUrl: paymentScreenshotUrl,
    };

    // If a payment type is provided, validate and set amounts safely
    if (paymentType === 'COD') {
      const paid = Number(paidAmount ?? 0);
      const remaining = Number(remainingAmount ?? 0);
      if (!(paid > 0) || !(paid < Number(amount))) {
        return res.status(400).json({ error: 'For COD, paidAmount must be > 0 and < total amount' });
      }
      if (Math.round((Number(amount) - paid) * 100) / 100 !== Math.round(remaining * 100) / 100) {
        return res.status(400).json({ error: 'remainingAmount must equal (total - paidAmount)' });
      }
      paymentInfo.type = 'COD';
      paymentInfo.paidAmount = paid;
      paymentInfo.remainingAmount = remaining;
    } else if (paymentType === 'FULL') {
      paymentInfo.type = 'FULL';
      paymentInfo.paidAmount = Number(amount) || 0;
      paymentInfo.remainingAmount = 0;
    }

    const newOrder = new Order({
      userId: req.user.id,
      orderId,
      items,
      amount,
      status: hasPendingPrice ? 'pending_price' : 'sent',
      canCancel: true,
      payment: paymentInfo,
      student,
      pickupPoint: pickupPoint || 'Main Gate',
    });

    await newOrder.save();

    // Clear cart
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is owner or admin
    if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (order.status !== 'sent') {
      return res.status(400).json({ error: 'Orders cannot be cancelled after being placed' });
    }

    order.status = 'cancelled';
    order.canCancel = false;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin routes
export const getAllOrders = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending_price', 'sent', 'placed', 'printing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = { status, canCancel: status === 'sent' };
    if (status === 'delivered' || status === 'cancelled') {
      updates.liveLocationEnabled = false;
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      updates,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { orderId } = req.params;
    await Order.findOneAndDelete({ orderId });

    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  export const toggleLiveLocation = async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { orderId } = req.params;
      const { enabled } = req.body;

      const order = await Order.findOneAndUpdate(
        { orderId },
        { liveLocationEnabled: enabled },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const setCustomPDFPrice = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { orderId } = req.params;
    const { itemIndex, price } = req.body;

    if (price === undefined || price === null || price < 0) {
      return res.status(400).json({ error: 'Valid price required' });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!order.items[itemIndex]) {
      return res.status(400).json({ error: 'Item not found' });
    }

    // Set the price for the custom PDF item
    order.items[itemIndex].userPrice = price;

    // Recalculate total amount
    const newAmount = order.items.reduce((total, item) => {
      const itemPrice = item.userPrice ?? item.price ?? 0;
      return total + (itemPrice * item.qty);
    }, 0);
    order.amount = newAmount;

    // Check if all custom items now have prices
    const stillHasPendingPrice = order.items.some(item => 
      item.type === 'custom' && (item.userPrice === null || item.userPrice === undefined)
    );

    // If all prices are set, mark as ready for user confirmation
    if (!stillHasPendingPrice && order.status === 'pending_price') {
      order.priceSetByAdmin = true;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDeliveryDays = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { orderId } = req.params;
    const { deliveryDays } = req.body;

    const parsed = parseInt(deliveryDays, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      return res.status(400).json({ error: 'deliveryDays must be a positive number' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { deliveryDays: parsed },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (order.status !== 'pending_price') {
      return res.status(400).json({ error: 'Order is not a pending request' });
    }

    if (!order.priceSetByAdmin) {
      return res.status(400).json({ error: 'Admin has not set the price yet' });
    }

    // Move to sent status so user can proceed with payment
    order.status = 'sent';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
