# Quick Testing Guide: User-Specific Push Notifications

## Prerequisites
✅ VAPID keys configured in `.env` files
✅ MongoDB connected and running
✅ Backend running on `http://localhost:5000`
✅ Frontend running on `http://localhost:5173`
✅ Logged in with a user account

## Test Scenario 1: Subscribe to Notifications

### Step 1: Open PWA
```bash
# Start backend
cd server && npm start

# Start frontend (new terminal)
cd client && npm run dev
```

### Step 2: Install PWA
1. On mobile device or Chrome DevTools PWA mode:
2. Visit `http://localhost:5173`
3. Browser shows install prompt
4. Click "Install" / "Add to Home Screen"
5. Open as standalone app

### Step 3: Enable Notifications
1. NotificationPrompt banner appears at top
2. Click **"Enable"** button
3. Browser asks for permission: **"Allow"**
4. Banner disappears = success!

### Step 4: Verify in Database
```bash
# Terminal: Check MongoDB
db.pushsubscriptions.findOne({ userId: ObjectId("YOUR_USER_ID") })

# Should show:
{
  _id: ObjectId,
  userId: ObjectId("YOUR_USER_ID"),
  subscription: {
    endpoint: "https://fcm.googleapis.com/fcm/send/...",
    keys: { ... }
  }
}
```

---

## Test Scenario 2: PDF Request Price Notification

### Step 1: Create PDF Request (User)
1. User: Upload a PDF
2. Fill form: Title, Quantity, Sides
3. Submit = PDF request created

### Step 2: Admin Sets Price
1. Admin Dashboard → PDF Requests tab
2. Find the pending request
3. Click "Set Price" button
4. Enter price (e.g., ₹100)
5. Click "Save"

### Step 3: Check Notification
**Expected notification on device:**
```
Title: KampusKart
Body: "Price set for {PDF_TITLE}. Please proceed with order."
```

### Step 4: Check Backend Logs
```
[Push] Sent notification to 1/1 devices for user 507f1f77bcf86cd799439011
```

---

## Test Scenario 3: Order Status Update Notification

### Step 1: Create Order (User)
1. User: Add items to cart
2. Go to Payment
3. Create order
4. Order placed with status `pending_price` or `placed`

### Step 2: Admin Updates Status
1. Admin Dashboard → Orders tab
2. Find the order
3. Click status dropdown
4. Change status: `sent` → `printing` → `out_for_delivery` → `delivered`
5. Each change sends notification

### Step 3: Check Notifications
**Expected notifications:**
```
Status: printing
→ "🖨️ Your order is now being printed."

Status: out_for_delivery
→ "🚚 Your order is out for delivery."

Status: delivered
→ "✅ Your order has been delivered."
```

### Step 4: Verify Only Order Owner Gets Notified
1. Create order as User A
2. Admin updates order status
3. ✅ User A receives notification
4. ✅ User B does NOT receive notification

---

## Test Scenario 4: Custom PDF Price in Order

### Step 1: Create Order with Custom PDF
1. User uploads custom PDF
2. Creates order with that PDF
3. Status: `pending_price` (no price yet)

### Step 2: Admin Sets Item Price
1. Admin Dashboard → Orders tab
2. Find order with custom PDF
3. Click "Set Price" on custom item
4. Enter price
5. Click "Save"

### Step 3: Check Notification
**Expected notification:**
```
Title: KampusKart
Body: "Price set for {ITEM_TITLE}. Please proceed with order."
```

---

## Test Scenario 5: Multiple Devices (Same User)

### Step 1: Subscribe on Device 1
1. Mobile device 1: Install PWA + Enable notifications
2. Notification stored in DB with userId + endpoint1

### Step 2: Subscribe on Device 2
1. Mobile device 2 (or desktop): Install PWA + Enable notifications
2. Notification stored in DB with userId + endpoint2

### Step 3: Admin Triggers Event
1. Admin sets order status for this user
2. Notification sent to BOTH devices simultaneously
3. ✅ Both devices receive notification

### Step 4: Verify in Database
```bash
db.pushsubscriptions.find({ userId: ObjectId("YOUR_USER_ID") }).count()
# Should show: 2
```

---

## Test Scenario 6: Error Handling

### Step 1: Test with No Subscriptions
```bash
curl -X POST http://localhost:5000/api/push/test
```

**Response:**
```json
{
  "message": "Test notification campaign completed",
  "totalSubscriptions": 1,
  "successCount": 0,
  "failureCount": 1,
  "errors": [{
    "endpoint": "...",
    "error": "..."
  }]
}
```

### Step 2: Test Missing User
- Manually trigger notification with invalid userId
- Backend logs error, doesn't crash
- Endpoint still returns success

---

## Test Scenario 7: Admin Test Endpoint

### Send Test Notification to All Users
```bash
curl -X POST http://localhost:5000/api/push/test
```

**Response:**
```json
{
  "message": "Test notification campaign completed",
  "totalSubscriptions": 3,
  "successCount": 3,
  "failureCount": 0
}
```

**Expected on all 3 subscribed devices:**
```
Title: KampusKart
Body: "Notifications are working 🎉"
```

---

## Troubleshooting

### Notification Not Received
1. ✅ Confirm userId saved in subscription
2. ✅ Confirm service worker registered
3. ✅ Confirm device has notification permission granted
4. ✅ Check browser console for errors
5. ✅ Check backend logs for "Sent notification" message

### "No subscriptions found"
1. User hasn't enabled notifications yet
2. NotificationPrompt dismissed without enabling
3. Check DB: `db.pushsubscriptions.count()` should be > 0

### "Failed to save subscription"
1. Check user is authenticated
2. Check userId is being sent from frontend
3. Check MongoDB connection

### Duplicate Subscriptions
1. Should not happen due to unique index
2. If you see duplicates, re-subscribe on device
3. Database constraint will prevent duplicates

---

## Quick Commands

### View All Subscriptions
```bash
# MongoDB
db.pushsubscriptions.find().pretty()
```

### View User's Subscriptions
```bash
# MongoDB
db.pushsubscriptions.find({ 
  userId: ObjectId("507f1f77bcf86cd799439011") 
}).pretty()
```

### View Backend Logs
```bash
# Terminal where backend is running
# Look for lines containing "[Push]"
```

### Force Re-subscribe
1. Uninstall PWA: Settings → Apps → Clear Data
2. Reinstall: "Add to Home Screen"
3. Re-enable notifications

---

## Production Deployment

1. **Render Backend:**
   - ✅ .env already has VAPID keys
   - ✅ MongoDB already connected
   - ✅ No code changes needed
   - `git push origin main` → Auto-deploys

2. **PWA on Production URL:**
   - Users visit: `https://kampuskart-1.onrender.com`
   - Install PWA
   - Enable notifications
   - Same flow works with production backend

3. **Monitor Notifications:**
   - Backend logs: Check for "[Push]" messages
   - Database: Check pushsubscriptions collection
   - User feedback: Ask if they received notification

---

**Status:** ✅ READY TO TEST
**Last Updated:** December 22, 2025
