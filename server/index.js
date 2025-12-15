import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import pdfRequestRoutes from './routes/pdfRequestRoutes.js';
import feedbackRoutes from './routes/feedback.js';
import pickupPointRoutes from './routes/pickupPointRoutes.js';

const app = express();
const httpServer = createServer(app);

// Determine allowed origins for CORS and Socket.io
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
  ];

  // Add production frontend URL if provided
  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL);
  }

  return origins;
};

const allowedOrigins = getAllowedOrigins();

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pdf-requests', pdfRequestRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/pickup-points', pickupPointRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;

// Startup checks
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.warn('[Security] JWT_SECRET is missing or too short. Set a strong value in server/.env');
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('[Socket.io] Client connected:', socket.id);

  // Join order-specific room for live location updates
  socket.on('joinOrder', ({ orderId }) => {
    socket.join(orderId);
    console.log(`[Socket.io] Socket ${socket.id} joined room: ${orderId}`);
  });

  // Delivery person updates location
  socket.on('updateDeliveryLocation', async ({ orderId, lat, lng }) => {
    try {
      const Order = (await import('./models/Order.js')).default;
      const order = await Order.findOne({ orderId });

      if (order && order.liveLocationEnabled) {
        // Update order with new location
        order.deliveryLocation = { lat, lng };
        await order.save();

        // Broadcast to only clients in this order's room
        io.to(orderId).emit(`deliveryLocation:${orderId}`, { lat, lng });
        console.log(`[Socket.io] Location updated for order ${orderId}:`, { lat, lng });
      }
    } catch (error) {
      console.error('[Socket.io] Error updating delivery location:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('[Socket.io] Client disconnected:', socket.id);
  });
});

httpServer.listen(PORT, HOST, () => {
  console.log(`[Server] Running on ${HOST}:${PORT}`);
  console.log(`[Environment] NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
  if (process.env.JWT_SECRET) {
    console.log('[Security] JWT_SECRET loaded (length:', process.env.JWT_SECRET.length, ')');
  }
});
