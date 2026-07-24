import User from '../models/User.js';
import OTP from '../models/OTP.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import Order from '../models/Order.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    
    if (type === 'reset') {
      if (!existingEmail) {
        return res.status(404).json({ error: 'Email not found' });
      }
    } else {
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email to prevent spam issues
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Save new OTP
    const newOtp = new OTP({
      email: email.toLowerCase(),
      otp,
    });
    await newOtp.save();

    // Send email
    const mailOptions = {
      from: `"KampusKart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your KampusKart Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #e5e5e5; border-radius: 10px;">
          <h2 style="color: #1a422a;">KampusKart Email Verification</h2>
          <p style="color: #555; font-size: 16px;">Thank you for signing up for KampusKart!</p>
          <p style="color: #555; font-size: 16px;">Please use the following 6-digit code to complete your registration:</p>
          <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 12px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000,
        });
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.error('--- EMAIL BLOCKED BY WI-FI (SMTP ERROR) ---');
        console.error(mailErr.message);
        console.log(`Email: ${email} | FALLBACK OTP: ${otp}`);
        console.log('-------------------------------------------');
        // We still return success so the frontend UI can proceed to step 2 for testing
      }
    } else {
      console.log('--- OTP GENERATED LOCALLY (Email credentials missing) ---');
      console.log(`Email: ${email} | OTP: ${otp}`);
      console.log('---------------------------------------------------------');
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Failed to send OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, userId, email, password, otp, gender } = req.body;

    if (!name || !userId || !email || !password || !otp) {
      return res.status(400).json({ error: 'All fields including OTP are required' });
    }

    // Verify OTP
    const validOtp = await OTP.findOne({ email: email.toLowerCase(), otp });
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const existingUserId = await User.findOne({ userId: userId.toLowerCase() });
    if (existingUserId) {
      return res.status(400).json({ error: 'User ID already taken' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Delete OTP now that it has been successfully used
    await OTP.deleteOne({ _id: validOtp._id });

    let avatarIndex = Math.floor(Math.random() * 4); // Default random
    if (gender === 'Female') {
      avatarIndex = Math.random() < 0.5 ? 1 : 2; // Pick 2nd or 3rd
    } else if (gender === 'Male') {
      avatarIndex = Math.random() < 0.5 ? 0 : 3; // Pick 1st or 4th
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      userId: userId.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      gender: gender || 'Other',
      avatarIndex,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, userId: newUser.userId, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        userId: newUser.userId,
        email: newUser.email,
        gender: newUser.gender,
        isAdmin: newUser.isAdmin,
        avatarIndex: newUser.avatarIndex,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validOtp = await OTP.findOne({ email: email.toLowerCase(), otp });
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await OTP.deleteOne({ _id: validOtp._id });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    await user.save();

    const token = jwt.sign(
      { id: user._id, userId: user.userId, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
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
        avatarIndex: user.avatarIndex,
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
      process.env.JWT_SECRET,
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
        avatarIndex: user.avatarIndex,
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
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { gender } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (gender && ['Male', 'Female', 'Other'].includes(gender)) {
      user.gender = gender;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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

export const updateAvatar = async (req, res) => {
  try {
    const { avatarIndex } = req.body;
    if (avatarIndex === undefined || avatarIndex < 0 || avatarIndex > 3) {
      return res.status(400).json({ error: 'Invalid avatar index' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.avatarIndex = avatarIndex;
    await user.save();
    res.json({ message: 'Avatar updated successfully', avatarIndex });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const toggleCodStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.codEnabled = !user.codEnabled;
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error toggling COD status:', error);
    res.status(500).json({ error: 'Failed to toggle COD status' });
  }
};

export const toggleMarketingStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isMarketing = !user.isMarketing;
    
    // If enabling marketing and they don't have a code, generate one
    if (user.isMarketing) {
      if (!user.referralCode) {
        const randomDigits = Math.floor(100 + Math.random() * 900);
        user.referralCode = `${user.userId}${randomDigits}`;
      }
      if (!user.referralCodes || user.referralCodes.length === 0) {
        user.referralCodes = [user.referralCode];
      }
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error toggling marketing status:', error);
    res.status(500).json({ error: 'Failed to toggle marketing status' });
  }
};

export const getReferralUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const marketingUsers = await User.find({ isMarketing: true }, '-passwordHash').sort({ createdAt: -1 });
    
    const results = [];
    for (const user of marketingUsers) {
      const code = user.referralCode;
      let totalOrders = 0;
      let totalBooksSold = 0;
      let orders = [];
      if (user.referralCodes && user.referralCodes.length > 0) {
        orders = await Order.find({ referralCode: { $in: user.referralCodes } }).sort({ createdAt: -1 });
      } else if (user.referralCode) {
        orders = await Order.find({ referralCode: user.referralCode }).sort({ createdAt: -1 });
      }
      totalOrders = orders.length;
      for (const order of orders) {
        if (order.status !== 'cancelled') {
           for (const item of order.items) {
             totalBooksSold += (item.qty || 1);
           }
        }
      }

      results.push({
        user,
        stats: {
          totalOrders,
          totalBooksSold
        },
        orders
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching referral users:', error);
    res.status(500).json({ error: 'Failed to fetch referral users' });
  }
};

export const addReferralCode = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { userId } = req.params;
    const { newCode } = req.body;

    if (!newCode || newCode.trim() === '') {
      return res.status(400).json({ error: 'Referral code cannot be empty' });
    }

    const finalNewCode = newCode.trim();

    // Check if any user already has this exact code in their referralCodes array or as referralCode
    const existingUserWithCode = await User.findOne({ 
      $or: [
        { referralCode: finalNewCode },
        { referralCodes: finalNewCode }
      ]
    });
    if (existingUserWithCode && existingUserWithCode._id.toString() !== userId) {
      return res.status(400).json({ error: 'This referral code is already taken by another user' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize array if empty
    if (!user.referralCodes) {
      user.referralCodes = [];
    }
    
    // Add old code if array is empty but string exists
    if (user.referralCode && user.referralCodes.length === 0) {
      user.referralCodes.push(user.referralCode);
    }

    if (!user.referralCodes.includes(finalNewCode)) {
      user.referralCodes.push(finalNewCode);
    }

    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error adding referral code:', error);
    res.status(500).json({ error: 'Failed to add referral code' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user, auto-generate a userId (e.g. from email)
      const baseId = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const uniqueSuffix = Math.floor(Math.random() * 10000);
      const userId = `${baseId}${uniqueSuffix}`;
      
      user = new User({
        name,
        email: email.toLowerCase(),
        userId,
        googleId,
        avatarIndex: Math.floor(Math.random() * 4)
      });
      await user.save();
    } else if (!user.googleId) {
       // Link googleId to existing user
       user.googleId = googleId;
       await user.save();
    }
    
    const jwtToken = jwt.sign(
      { id: user._id, userId: user.userId, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        email: user.email,
        isAdmin: user.isAdmin,
        avatarIndex: user.avatarIndex,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
};
