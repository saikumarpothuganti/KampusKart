# KampusKart - Critical Code Changes Reference

Quick reference for the most important code changes made to fix all production issues.

---

## 1. Frontend Config Module (`client/src/config.js`)

```javascript
/**
 * KampusKart Frontend Configuration
 * Centralized environment-based configuration for API and Socket.io URLs
 */

const isDev = import.meta.env.DEV;

// API Base URL
export const API_BASE_URL = isDev
  ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  : import.meta.env.VITE_API_BASE_URL || '/api';

// Socket.io URL
export const SOCKET_URL = isDev
  ? import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
  : import.meta.env.VITE_SOCKET_URL || window.location.origin;

// Socket.io Configuration
export const SOCKET_CONFIG = {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  SOCKET_CONFIG,
};
```

---

## 2. Updated API Client (`client/src/lib/api.js`)

```javascript
import axios from 'axios';
import { API_BASE_URL } from '../config.js';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor: Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default API;
```

---

## 3. Backend Socket.io Setup (`server/index.js` - key section)

```javascript
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

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, HOST, () => {
  console.log(`[Server] Running on ${HOST}:${PORT}`);
  console.log(`[Environment] NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
});
```

---

## 4. Cloudinary Enforcement (`server/config/cloudinary.js`)

```javascript
// In production, Cloudinary is REQUIRED
if (process.env.NODE_ENV === 'production' && !isCloudinaryConfigured) {
  console.error('❌ FATAL: Cloudinary must be configured in production!');
  console.error('Missing environment variables:');
  if (!cloudName || cloudName === 'test') console.error('  - CLOUDINARY_CLOUD_NAME');
  if (!apiKey || apiKey === 'test') console.error('  - CLOUDINARY_API_KEY');
  if (!apiSecret || apiSecret === 'test') console.error('  - CLOUDINARY_API_SECRET');
  process.exit(1);
}

const uploadToCloudinary = (buffer, folder) => {
  // In development, allow local fallback if Cloudinary not configured
  if (!isCloudinaryConfigured && process.env.NODE_ENV !== 'production') {
    console.log('[Cloudinary] Using local fallback - Cloudinary not configured');
    // ... local save code
  }

  // Use Cloudinary (production and dev with Cloudinary configured)
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error);
          reject(error);
        } else {
          console.log(`[Cloudinary] ✅ Uploaded to ${folder}:`, result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer);
  });
};
```

---

## 5. Updated Socket.io in OrderStatus.jsx

```javascript
import { SOCKET_URL, SOCKET_CONFIG } from '../config.js';

// ... in useEffect:
useEffect(() => {
  if (!order || !order.liveLocationEnabled) {
    if (socket) socket.disconnect();
    return;
  }

  const s = io(SOCKET_URL, SOCKET_CONFIG);
  setSocket(s);

  s.on('connect', () => {
    console.log('Socket connected for order', orderId);
    s.emit('joinOrder', { orderId });
  });

  s.on(`deliveryLocation:${orderId}`, (loc) => {
    setLiveLocation(loc);
  });

  s.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return () => {
    s.disconnect();
  };
}, [order, orderId, socket]);
```

---

## 6. Removed Admin Seeding (`server/controllers/authController.js`)

**BEFORE:**
```javascript
if (!user && identifier === 'admin123') {
  const passwordHash = await bcrypt.hash('admin-123', 10);
  user = await User.create({
    name: 'Admin',
    userId: 'admin123',
    email: 'admin@example.com',
    passwordHash,
    isAdmin: true,
  });
}
```

**AFTER:**
```javascript
// This block completely REMOVED
// Admin must be created properly through database
```

---

## 7. Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kampuskart
JWT_SECRET=your-random-secure-string-32-chars-minimum
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
HOST=0.0.0.0
NODE_ENV=production
CLIENT_URL=https://kampuskart.vercel.app
```

### Frontend (.env)

```env
VITE_API_BASE_URL=https://kampuskart-backend.onrender.com/api
VITE_SOCKET_URL=https://kampuskart-backend.onrender.com
```

---

## 8. Key Imports to Update in Components

If you're updating other components, use these imports:

```javascript
// For API calls
import API from '../lib/api';

// For socket.io initialization
import { SOCKET_URL, SOCKET_CONFIG } from '../config.js';
import { io } from 'socket.io-client';

// For config values
import { API_BASE_URL, SOCKET_URL } from '../config.js';
```

---

## 9. Testing the Changes

### Local Testing
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev
# Should see: [Server] Running on 0.0.0.0:5000

# Terminal 2: Frontend
cd client
npm install
npm run dev
# Should see: VITE v4.x.x ready in x ms
```

### Testing Socket.io Connection
Open browser DevTools (F12) → Console:
- Look for: `[Socket.io] Client connected`
- Place order and toggle live location
- Should see: `[Socket.io] Socket ... joined room: ...`

### Testing Cross-Device
1. Get your machine IP: `ipconfig getifaddr en0` (Mac) or `hostname -I` (Linux/WSL)
2. Access frontend from phone: `http://192.168.x.x:3000`
3. Sign in and place order
4. Should work without any "cannot reach server" errors

---

## 10. Migration Checklist

- [ ] Updated `client/src/config.js` (new file)
- [ ] Updated `client/src/lib/api.js` to use config
- [ ] Updated `client/src/pages/OrderStatus.jsx` to use SOCKET_URL
- [ ] Updated `client/src/pages/DeliveryLocation.jsx` to use SOCKET_URL
- [ ] Updated `server/index.js` for CORS and Socket.io
- [ ] Updated `server/config/cloudinary.js` for production enforcement
- [ ] Updated `server/controllers/authController.js` (removed admin seeding)
- [ ] Created `.env.example` files for both frontend and backend
- [ ] Created `PRODUCTION_DEPLOYMENT.md` guide
- [ ] Tested locally before deploying

---

**Generated:** December 14, 2025  
**Version:** 1.0  
**Status:** All Critical Fixes Applied ✅
