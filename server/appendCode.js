import fs from 'fs';
const code = `
export const updateItemColor = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { color } = req.body;
    const order = await Order.findOne({ orderId: orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.adminColor = color;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
`;
fs.appendFileSync('./controllers/orderController.js', code, 'utf8');
