# PWA Push Notifications - STEP 1 Setup

## VAPID Keys Generated

**Public Key:**
```
BBlUaRlvusca8spAYX_EH778O60Fu9j802G_UmZ6SuV5LlfKzF2bNUCZeYpIHGulF5Ib9mxf0vgfmm9lqQ8W2lk
```

**Private Key:**
```
J1kIBZlALcu1cjvnUeIPSSjHW74S794ImFpQ7In-wjw
```

## Environment Configuration

### Backend (.env)
Add to `server/.env`:
```env
VAPID_PUBLIC_KEY=BBlUaRlvusca8spAYX_EH778O60Fu9j802G_UmZ6SuV5LlfKzF2bNUCZeYpIHGulF5Ib9mxf0vgfmm9lqQ8W2lk
VAPID_PRIVATE_KEY=J1kIBZlALcu1cjvnUeIPSSjHW74S794ImFpQ7In-wjw
VAPID_SUBJECT=mailto:your-email@example.com
```

### Frontend (.env)
Add to `client/.env`:
```env
VITE_VAPID_PUBLIC_KEY=BBlUaRlvusca8spAYX_EH778O60Fu9j802G_UmZ6SuV5LlfKzF2bNUCZeYpIHGulF5Ib9mxf0vgfmm9lqQ8W2lk
```

## What Was Implemented (STEP 1 ONLY)

### Frontend
1. **NotificationPrompt.jsx** - Shows only when:
   - App is running as PWA (standalone mode)
   - Notification permission is "default"
   - Non-blocking, appears at top of screen

2. **Flow:**
   - User clicks "Enable" → Request permission
   - If granted → Subscribe to push notifications
   - Send subscription to backend `/api/push/subscribe`
   - If denied/dismissed → Hide prompt silently

### Backend
1. **PushSubscription Model** - Stores:
   - userId (optional, if logged in)
   - subscription.endpoint (unique)
   - subscription.keys (p256dh, auth)
   - createdAt timestamp

2. **POST /api/push/subscribe** - Endpoint that:
   - Accepts push subscription JSON
   - Checks for duplicates (by endpoint)
   - Saves to MongoDB
   - Returns success/existing status

### Safety Features
- No auto-prompting on load
- Fails silently (no crashes)
- Doesn't send any notifications yet
- Doesn't affect existing order/payment logic
- Works only in PWA mode

## Testing

1. Install app as PWA (use InstallPrompt)
2. Notification prompt appears at top
3. Click "Enable"
4. Grant permission in browser
5. Check backend MongoDB for saved subscription

## Next Steps (NOT IMPLEMENTED YET)

- STEP 2: Send notifications from backend when order status changes
- STEP 3: Handle notification clicks to navigate to order details
- STEP 4: Add admin UI to send test notifications

## Important Notes

- Keep VAPID private key secret
- Add both keys to production environment variables
- Notification prompt only shows in standalone/PWA mode
- No notifications are sent in STEP 1 (just subscription capture)
