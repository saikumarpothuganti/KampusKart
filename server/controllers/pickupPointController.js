import PickupPoint from '../models/PickupPoint.js';

// Get all pickup points (active for clients, all for admin)
export const getPickupPoints = async (req, res) => {
  try {
    const pickupPoints = await PickupPoint.find({ isActive: true });
    res.json(pickupPoints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pickup points', error });
  }
};

// Get all pickup points for admin (both active and inactive)
export const getAllPickupPoints = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const pickupPoints = await PickupPoint.find().sort({ name: 1 });
    res.json(pickupPoints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pickup points', error });
  }
};

// Toggle pickup point active status
export const togglePickupPoint = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const pickupPoint = await PickupPoint.findById(id);
    
    if (!pickupPoint) {
      return res.status(404).json({ message: 'Pickup point not found' });
    }

    pickupPoint.isActive = !pickupPoint.isActive;
    pickupPoint.updatedAt = Date.now();
    await pickupPoint.save();

    res.json(pickupPoint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update pickup point', error });
  }
};

// Create a new pickup point
export const createPickupPoint = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const existingPoint = await PickupPoint.findOne({ name });
    if (existingPoint) {
      return res.status(400).json({ message: 'Pickup point already exists' });
    }

    const pickupPoint = new PickupPoint({ name, isActive: true });
    await pickupPoint.save();

    res.status(201).json(pickupPoint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create pickup point', error });
  }
};

// Delete a pickup point
export const deletePickupPoint = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const pickupPoint = await PickupPoint.findByIdAndDelete(id);

    if (!pickupPoint) {
      return res.status(404).json({ message: 'Pickup point not found' });
    }

    res.json({ message: 'Pickup point deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete pickup point', error });
  }
};
