# KampusKart – Quick Deployment Action Checklist

## 🚨 CRITICAL FIXES (Must Do Before Any Deployment)

### [ ] 1. Fix Socket.io URLs (BREAKS LIVE LOCATION)
**Files to fix:**
- `client/src/pages/OrderStatus.jsx` line 37
- `client/src/pages/DeliveryLocation.jsx` line 14

**Change from:**
```javascript
const s = io('http://localhost:5000');
```

**Change to:**
```javascript
const socketUrl = import.meta.env.VITE_SOCKET_URL 
  ? import.meta.env.VITE_SOCKET_URL 
  : (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
const s = io(socketUrl);
```

**Environment variable needed:**
```env
# In frontend .env.production (Vercel dashboard)
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

---

### [ ] 2. Update Backend CORS (BLOCKS CROSS-DEVICE ACCESS)
**File:** `server/index.js` lines ~20-23

**Change from:**
```javascript
cors: {
  origin: ['http://localhost:3000', 'http://localhost:3001', ...],
}
```

**Change to:**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,  // https://kampuskart.vercel.app
].filter(Boolean);

cors: {
  origin: allowedOrigins,
  credentials: true,
}
```

**Environment variable needed:**
```env
# In backend (Render/Railway dashboard)
FRONTEND_URL=https://kampuskart.vercel.app
```

---

### [ ] 3. Update Socket.io CORS in Backend
**File:** `server/index.js` lines ~18-24

**Change from:**
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', ...],  // ❌ Only localhost
  },
});
```

**Change to:**
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
  },
});
```

---

### [ ] 4. Enforce Cloudinary in Production (PREVENTS DATA LOSS)
**File:** `server/config/cloudinary.js`

**Add check:**
```javascript
if (process.env.NODE_ENV === 'production' && !isCloudinaryConfigured) {
  console.error('❌ CLOUDINARY MUST BE CONFIGURED IN PRODUCTION');
  console.error('Missing: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  process.exit(1);
}
```

---

### [ ] 5. Remove Hardcoded Admin Seeding (SECURITY)
**File:** `server/controllers/authController.js` lines ~68-76

**Delete this entire block:**
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

---

### [ ] 6. Remove Localhost Fallbacks in Admin Panel
**File:** `client/src/pages/Admin.jsx` (multiple locations)

**Find and replace:**
```javascript
// ❌ OLD (multiple occurrences)
href={request.pdfUrl.startsWith('/') ? `http://localhost:5000${request.pdfUrl}` : request.pdfUrl}
href={item.pdfUrl.startsWith('/') ? `http://localhost:5000${item.pdfUrl}` : item.pdfUrl}
href={order.payment.screenshotUrl.startsWith('/') ? `http://localhost:5000${order.payment.screenshotUrl}` : order.payment.screenshotUrl}

// ✅ NEW (assuming always Cloudinary URLs)
href={request.pdfUrl}
href={item.pdfUrl}
href={order.payment.screenshotUrl}
```

---

### [ ] 7. Fix Error Message in SignIn Page
**File:** `client/src/pages/SignIn.jsx` line ~37

**Change from:**
```javascript
setError('Cannot reach server. Please ensure the backend is running on http://localhost:5000');
```

**Change to:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'server';
setError(`Cannot connect to ${apiUrl}. Please check your internet connection.`);
```

---

## 📦 ENVIRONMENT VARIABLES TO SET UP

### Backend (Render/Railway Dashboard)
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/kampuskart
JWT_SECRET=your-random-secret-at-least-32-characters-long
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://kampuskart.vercel.app
```

### Frontend (Vercel Dashboard)
```env
VITE_API_URL=https://kampuskart-backend.onrender.com/api
VITE_SOCKET_URL=https://kampuskart-backend.onrender.com
```

---

## ✅ DEPLOYMENT STEPS

### Step 1: Apply All 7 Code Fixes Above
- [ ] Socket.io URL fix
- [ ] CORS fix
- [ ] Socket.io CORS fix
- [ ] Cloudinary enforcement
- [ ] Remove admin seeding
- [ ] Remove localhost fallbacks
- [ ] Fix error message

### Step 2: Test Locally
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev
# Should see: "Server running on http://localhost:5000"

# Terminal 2: Frontend
cd client
npm install
npm run dev
# Should see: "Local: http://localhost:3000"
```

### Step 3: Verify Core Flow Works Locally
- [ ] Signup/Signin works
- [ ] Can browse subjects
- [ ] Can upload custom PDF
- [ ] Admin can view & price requests
- [ ] Can add to cart & checkout
- [ ] Order appears in history

### Step 4: Deploy Backend (Render/Railway)
- [ ] Create Render/Railway account
- [ ] Connect GitHub repo
- [ ] Set all environment variables (see above)
- [ ] Deploy
- [ ] Test `/api/health` endpoint returns `{"status":"OK"}`
- [ ] Copy backend URL (e.g., `https://kampuskart-backend.onrender.com`)

### Step 5: Deploy Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Connect GitHub repo
- [ ] Set environment variables with backend URL from Step 4
- [ ] Deploy
- [ ] Test sign-in from deployed frontend

### Step 6: Cross-Device Testing
- [ ] Access deployed frontend from phone
- [ ] Sign in using email/password
- [ ] Browse subjects
- [ ] Upload custom PDF
- [ ] Place order
- [ ] Verify data in admin panel

### Step 7: Verify Files in Cloudinary
- [ ] Login to Cloudinary dashboard
- [ ] Check "kampuskart/pdfs" folder has uploaded files
- [ ] Check "kampuskart/screenshots" folder has payment screenshots
- [ ] Confirm no files in local `/uploads` folder (should be empty/deleted)

---

## 🎯 FEATURES CHECKLIST

### ✅ Works Cross-Device (No Fix Needed)
- [x] User authentication
- [x] Browse subjects
- [x] Shopping cart
- [x] Order creation
- [x] Order history
- [x] PDF upload (if Cloudinary configured)
- [x] Admin order management
- [x] Admin subject management

### ⚠️ Broken on Cross-Device (Needs Fixes Above)
- [ ] Live location tracking (socket.io hardcoded)
- [ ] File viewing in remote admin (if local fallback used)
- [ ] Error messages reference localhost

### ❌ Not Implemented
- PDF delivery person interface
- Notifications (email/SMS)
- Payment gateway (Razorpay)
- Refund system
- Full-text search

---

## 🔐 SECURITY REMINDERS

- [ ] **Never commit `.env` file** – Only commit `.env.example`
- [ ] **JWT_SECRET must be strong** – Use cryptographically random 32+ chars
- [ ] **Cloudinary API secret is secret** – Never share, never commit
- [ ] **MongoDB URI has password** – Treat as secret, use .env
- [ ] **CORS whitelist is specific** – Don't use * in production
- [ ] **Admin credentials not hardcoded** – Removed hardcoded seeding

---

## 🐛 COMMON ISSUES & FIXES

### Problem: "Cannot reach server" error
**Causes:**
1. Backend not running
2. CORS not allowing frontend origin
3. Socket.io URL hardcoded to localhost

**Fixes:**
1. Check backend is deployed and URL in `VITE_API_URL` is correct
2. Ensure `FRONTEND_URL` in backend matches deployed frontend
3. Apply socket.io URL fix (#1 above)

---

### Problem: PDF won't display
**Causes:**
1. Cloudinary not configured
2. Trying to access local `/uploads` from remote
3. File upload failed silently

**Fixes:**
1. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
2. Check uploaded file URL in MongoDB (should be `https://res.cloudinary.com/...`)
3. Check backend logs for upload errors

---

### Problem: Live location not updating
**Causes:**
1. Socket.io hardcoded to `http://localhost:5000` (won't connect from remote)
2. Deployment CORS not allowing socket connection
3. Delivery person location not being submitted

**Fixes:**
1. Apply socket.io URL fix (#1 above)
2. Ensure socket.io CORS in backend allows frontend URL (#3 above)
3. Verify delivery person is using live location feature

---

## 📞 SUPPORT

If stuck:
1. Check `DEPLOYMENT_READINESS_REPORT.md` for detailed explanations
2. Check backend logs: `npm run dev` shows errors
3. Check browser console: `F12` → Console tab shows API/socket errors
4. Verify `.env` files have all required variables set

---

**Timeline:** 1-2 hours to apply fixes + test locally = 3-4 hours total to fully deploy

**Status After Fixes:** ✅ **PRODUCTION READY** – Works across devices, cloud-safe, scalable
