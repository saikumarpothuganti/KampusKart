import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { name, userId, email, password } = req.body;

    if (!name || !userId || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const existingUserId = await User.findOne({ userId: userId.toLowerCase() });
    if (existingUserId) {
      return res.status(400).json({ error: 'User ID already taken' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      userId: userId.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, userId: newUser.userId, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        userId: newUser.userId,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ error: 'ID and password required' });
    }

    const identifier = (userId || '').toLowerCase();
    let user = null;
    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ userId: identifier });
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, userId: user.userId, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (userId.toLowerCase() !== req.user.userId.toLowerCase()) {
      return res.status(403).json({ error: 'User ID does not match' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
