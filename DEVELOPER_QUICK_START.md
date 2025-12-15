# KampusKart - Developer Quick Start

Fast reference for developers working on KampusKart after production fixes.

---

## 📋 Important: What Changed

Your project now uses **environment-based configuration** instead of hardcoded localhost URLs. This means:

✅ **Good:** Deploy to any server (localhost, Vercel, Render) with just environment variables  
✅ **Good:** Socket.io works across devices and networks  
✅ **Good:** Files go to Cloudinary (not risky local storage in production)  
✅ **Good:** Admin credentials are database-driven (not hardcoded)  

---

## 🚀 Quick Start (Local Development)

### 1. Setup Backend

```bash
cd server
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/kampuskart
JWT_SECRET=dev-secret-32-chars-minimum-here-okay
CLOUDINARY_CLOUD_NAME=test
CLOUDINARY_API_KEY=test
CLOUDINARY_API_SECRET=test
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Then:
```bash
npm install
npm run dev
```

✅ Should see: `[Server] Running on 0.0.0.0:5000`

### 2. Setup Frontend

```bash
cd client
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Then:
```bash
npm install
npm run dev
```

✅ Should see: `VITE v4.x.x ready in x ms`

### 3. Access Application

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API:** http://localhost:5000/api

---

## 📁 Key Files You'll Work With

### Configuration
- `client/src/config.js` - **NEW!** Central config for API_BASE_URL and SOCKET_URL
- `server/index.js` - Socket.io and CORS setup
- `.env.example` - Environment variable templates

### Components That Changed
- `client/src/lib/api.js` - Now imports API_BASE_URL from config
- `client/src/pages/OrderStatus.jsx` - Now imports SOCKET_URL from config
- `client/src/pages/DeliveryLocation.jsx` - Now imports SOCKET_URL from config
- `server/controllers/authController.js` - Removed hardcoded admin seeding

### New Features
- `server/config/cloudinary.js` - Now enforces Cloudinary in production
- `generate-secret.js` - Generate secure JWT secrets

---

## 🔧 Common Tasks

### Adding a New API Endpoint

**Backend** (e.g., `server/routes/myRoutes.js`):
```javascript
router.get('/my-endpoint', async (req, res) => {
  // Your code
});
```

**Frontend** (e.g., `client/src/pages/MyPage.jsx`):
```javascript
import API from '../lib/api';

const response = await API.get('/my-endpoint');
// API_BASE_URL is automatically prepended!
```

✅ Works on localhost, Vercel, Render without changing code!

### Using Socket.io in a New Component

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_CONFIG } from '../config';

export default function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, SOCKET_CONFIG);

    socket.on('connect', () => {
      console.log('Connected!');
      socket.emit('joinRoom', { roomId: 'my-room' });
    });

    socket.on('messageFromServer', (data) => {
      setData(data);
    });

    return () => socket.disconnect();
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

✅ Works on localhost, Vercel, Render without changing code!

### Uploading Files

**Backend** (e.g., `server/routes/uploadRoutes.js`):
```javascript
import uploadToCloudinary from '../config/cloudinary.js';

router.post('/upload', async (req, res) => {
  const buffer = req.file.buffer;
  const url = await uploadToCloudinary(buffer, 'my-folder');
  res.json({ url }); // Returns Cloudinary URL
});
```

**Frontend** (e.g., `client/src/pages/MyPage.jsx`):
```javascript
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await API.post('/upload', formData);
  console.log(response.data.url); // Cloudinary URL - never 'http://localhost...'
};
```

✅ Production: Automatically uses Cloudinary  
✅ Development: Can use Cloudinary or local fallback  
✅ In production without Cloudinary: **Server will exit with error**

---

## 🧪 Testing Changes

### Test Local Development
```bash
# In browser console while accessing http://localhost:3000:
localStorage.getItem('token') // Should show JWT token after signin
```

### Test Socket.io
```bash
# In browser console:
// After placing order and enabling live location:
// Should see messages like:
// [Socket.io] Socket abc123... joined room: ORDER_ID
```

### Test Cross-Device (Advanced)

1. Find your machine IP:
   ```bash
   # macOS/Linux in WSL
   hostname -I
   
   # or
   ipconfig
   ```

2. Update `.env` on backend:
   ```env
   HOST=0.0.0.0  # Allow external connections
   ```

3. From phone on same WiFi, visit:
   ```
   http://192.168.x.x:3000
   ```

4. Everything should work exactly the same!

---

## 🚨 Important Rules

### ❌ DO NOT DO THIS

```javascript
// ❌ BAD: Hardcoded localhost
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

const socket = io('http://localhost:5000');

// ❌ BAD: Hardcoded file paths
const imageUrl = '/uploads/image.jpg';
```

### ✅ DO THIS INSTEAD

```javascript
// ✅ GOOD: Use config
import API from '../lib/api'; // Already has baseURL
import { SOCKET_URL } from '../config';

const socket = io(SOCKET_URL, SOCKET_CONFIG);

// ✅ GOOD: Trust backend URL (Cloudinary or configured storage)
const imageUrl = order.payment.screenshotUrl; // From API
```

---

## 📚 Documentation Reference

- **Production Deployment:** See `PRODUCTION_DEPLOYMENT.md`
- **Deployment Readiness:** See `READY_FOR_DEPLOYMENT.md`
- **Code Changes Reference:** See `CODE_CHANGES_REFERENCE.md`
- **Security Checklist:** See `DEPLOYMENT_READINESS_REPORT.md`

---

## 🆘 Troubleshooting

### "Cannot GET /api/users"
✅ **Check:** Backend running on `http://localhost:5000`?  
✅ **Check:** Frontend `.env` has `VITE_API_BASE_URL=http://localhost:5000/api`?

### "Socket.io connection failed"
✅ **Check:** Backend running on `http://localhost:5000`?  
✅ **Check:** Frontend `.env` has `VITE_SOCKET_URL=http://localhost:5000`?  
✅ **Check:** Backend `index.js` has `allowedOrigins` including `http://localhost:3000`?

### "Cloudinary upload failed"
✅ **In development:** If not configured, falls back to local `/uploads` folder  
✅ **In production:** Server will exit with clear error message about missing Cloudinary vars

### Components saying "localhost" in error messages
✅ **Fixed!** Error messages are now generic - doesn't reference localhost anymore

---

## 🎓 Learning Path

If you're new to the codebase:

1. **Read:** `READY_FOR_DEPLOYMENT.md` - Understand what changed
2. **Read:** `CODE_CHANGES_REFERENCE.md` - See the actual code
3. **Explore:** `client/src/config.js` - Understand configuration
4. **Explore:** `server/index.js` - Understand socket.io setup
5. **Code:** Try the "Common Tasks" section above

---

## 📞 Got Issues?

**Error starts with `[Socket.io]`:** Check socket.io configuration in `server/index.js`  
**Error starts with `[Cloudinary]`:** Check Cloudinary env vars or check `server/config/cloudinary.js`  
**Error starts with `[Server]`:** Check backend logs, likely a database issue  
**CORS error?:** Check `CLIENT_URL` in `.env` matches what frontend is using  

---

**Last Updated:** December 14, 2025  
**Status:** All Fixes Applied ✅  
**Ready for:** Local Development → Vercel + Render Deployment
