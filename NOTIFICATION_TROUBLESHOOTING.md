# 🔧 Notification Troubleshooting Guide

## Issue: App Not Asking for Notification Permissions

### **Diagnostic Checklist**

**Step 1: Verify PWA Installation**
```
✓ You must be in STANDALONE mode (App mode, not browser tab)
✓ Look at URL bar - should NOT show address bar
✓ Or check: Settings → Apps → NotificationPrompt should appear ONLY in this mode
```

**Step 2: Check NotificationPrompt Visibility**

Open browser **DevTools Console** (`F12` → Console) and look for:
```
[NotificationPrompt] Debug Info: {
  isPWA: true or false ← MUST be true
  permission: 'default' or 'granted' or 'denied'
  userAuthenticated: true or false ← MUST be true
  displayMode: 'standalone' or 'browser'
}
```

**Expected for prompt to show:**
- `isPWA: true` ← Must be in standalone mode
- `permission: 'default' OR 'denied'` ← Never asked or previously denied
- `userAuthenticated: true` ← Must be logged in

---

## Fix #1: You're Not in PWA Standalone Mode

### **Check if running as PWA:**
Open browser console and run:
```javascript
console.log('PWA Mode:', window.matchMedia('(display-mode: standalone)').matches);
console.log('Standalone:', window.navigator.standalone);
```

If BOTH false: **You're in browser mode, not PWA mode**

### **Solution: Reinstall PWA**
1. **Uninstall PWA:**
   - Settings → Apps → Find KampusKart
   - Delete/Uninstall → Clear all data

2. **Reinstall PWA:**
   - Open browser to your app URL
   - Click "Add to Home Screen" (top right menu)
   - Wait for installation
   - Open from home screen (NOT from browser)

3. **Verify PWA mode:**
   ```javascript
   // Run in console - should return true
   window.matchMedia('(display-mode: standalone)').matches
   ```

---

## Fix #2: Permission Already Denied or Granted

### **Check current permission:**
```javascript
console.log('Permission:', Notification.permission);
// Expected: 'default' (never asked) or 'denied' (blocked)
// If 'granted': Prompt won't show, but notifications should work
```

### **If permission is 'denied':**

**Android:**
1. Settings → Apps → NotificationPrompt (or KampusKart)
2. Permissions → Notifications → Toggle ON
3. Restart app

**iPhone (iOS):**
1. Settings → NotificationPrompt (or KampusKart)
2. Notifications → Allow Notifications → Toggle ON
3. Restart app

Then refresh app and try again.

---

## Fix #3: User Not Authenticated

### **Check authentication:**
```javascript
// In console, check:
localStorage.getItem('auth');        // Should return a token
localStorage.getItem('user');        // Should return user data with 'id'
```

### **Solution:**
1. **Log out:** Click profile → Sign out
2. **Clear cache:** Settings → Clear browsing data → Cache & cookies
3. **Log back in:** Sign in with your account
4. **Verify:** Check console that `localStorage.getItem('user')` returns user ID
5. **Then:** NotificationPrompt should appear

---

## Fix #4: Service Worker Not Registered

### **Check service worker:**
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs.length);
  regs.forEach(reg => console.log('Scope:', reg.scope));
});
```

Should show: `Service Workers: 1` with scope `/`

### **If 0 service workers:**
1. **Check network tab:** DevTools → Network → Reload
   - Should request `/service-worker.js`
   - Should return 200 OK
   - Should see `[ServiceWorker] Installing...` in console

2. **If not downloading:**
   - Clear cache: `Ctrl+Shift+Del` → Clear all
   - Reinstall PWA (see Fix #1)

3. **If 404 error:**
   - Service worker not in `public/service-worker.js`
   - Or build not including `/public` folder

---

## Fix #5: VAPID Keys Not Set

### **Check VAPID configuration:**
```javascript
// In console
console.log('VITE_VAPID_PUBLIC_KEY:', import.meta.env.VITE_VAPID_PUBLIC_KEY);
```

Should return a long key starting with `BBl...`

### **If missing or wrong:**
1. **Add to `client/.env`:**
   ```
   VITE_VAPID_PUBLIC_KEY=BBlUaRlvusca8spAYX_EH778O60Fu9j802G_UmZ6SuV5LlfKzF2bNUCZeYpIHGulF5Ib9mxf0vgfmm9lqQ8W2lk
   ```

2. **Add to `server/.env`:**
   ```
   VAPID_PUBLIC_KEY=BBlUaRlvusca8spAYX_EH778O60Fu9j802G_UmZ6SuV5LlfKzF2bNUCZeYpIHGulF5Ib9mxf0vgfmm9lqQ8W2lk
   VAPID_PRIVATE_KEY=J1kIBZlALcu1cjvnUeIPSSjHW74S794ImFpQ7In-wjw
   VAPID_SUBJECT=https://kampuskart-1.onrender.com
   ```

3. **Restart servers:**
   ```bash
   # Kill existing: Ctrl+C
   cd server && npm start
   cd client && npm run dev
   ```

4. **Clear cache & reinstall PWA** (see Fix #1)

---

## Test Everything Works

### **Step 1: Enable Notifications**
1. Open PWA in standalone mode
2. Click "Enable" button (should appear on first screen)
3. Grant permission
4. Wait for confirmation message

### **Step 2: Check Subscription Saved**
Open browser console and run:
```javascript
// Check localStorage
console.log('Subscription info:', localStorage.getItem('push-subscription'));

// Or check MongoDB from server terminal:
// mongosh "your-connection-string"
// use kampuskart
// db.pushsubscriptions.find().pretty()
```

Should show subscription with your `userId`.

### **Step 3: Send Test Notification**

**From your computer terminal (server folder):**
```bash
curl -X POST http://localhost:5000/api/push/test
# Or production:
curl -X POST https://kampuskart-1.onrender.com/api/push/test
```

**Expected response:**
```json
{
  "message": "Test notification campaign completed",
  "totalSubscriptions": 1,
  "successCount": 1,
  "failureCount": 0
}
```

### **Step 4: Wait for Notification**
- Notification should appear on your device within 2-3 seconds
- If PWA is in background, notification appears as system notification
- If PWA is active, check console logs

---

## Debug Logs to Check

### **NotificationPrompt Logs**
```
[NotificationPrompt] Debug Info: { ... }
[NotificationPrompt] Showing notification prompt
[NotificationPrompt] Enable clicked
[NotificationPrompt] Requesting notification permission...
[NotificationPrompt] Permission granted
[NotificationPrompt] Service Worker ready: true
[NotificationPrompt] Subscribing to push manager...
[NotificationPrompt] Push subscription created: { endpoint, userId }
[NotificationPrompt] Sending subscription to backend...
[NotificationPrompt] Backend response: { ... }
```

### **Service Worker Logs**
```
[ServiceWorker] Installing...
[ServiceWorker] Activating...
[ServiceWorker] Push event received
[ServiceWorker] Parsed push data: { title, body }
[ServiceWorker] Showing notification: ...
[ServiceWorker] Notification displayed successfully
```

### **Backend Logs** (server console)
```
[Push] Sent notification to 1/1 devices for user <userId>
```

---

## Nuclear Option: Complete Reset

If nothing works, do a complete reset:

```bash
# 1. Clear all local data
# On device: Settings → Apps → Clear all data

# 2. Clear cache on computer
rm -rf client/node_modules/.vite
rm -rf client/dist

# 3. Kill all running servers
Ctrl+C (in both terminal windows)

# 4. Remove service worker registration
# Open DevTools → Application → Service Workers → Unregister

# 5. Clear browser cache
Ctrl+Shift+Del → Clear all

# 6. Restart everything
cd server && npm start
cd client && npm run dev

# 7. Reinstall PWA
# Add to Home Screen → Install

# 8. Enable notifications fresh
# Click "Enable" button → Grant permission
```

---

## Still Not Working?

### **Collect Diagnostic Info**

Run this in browser console and share the output:
```javascript
console.log({
  notificationAPI: 'Notification' in window,
  permission: Notification.permission,
  isPWA: window.matchMedia('(display-mode: standalone)').matches,
  userAuth: !!localStorage.getItem('user'),
  serviceWorkers: navigator.serviceWorker.getRegistrations().then(r => r.length),
  vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY?.substring(0, 20),
});
```

### **Check Server Logs**
Look for `[Push]` messages in server terminal showing notifications being sent.

### **Check MongoDB**
```bash
# From server terminal:
mongosh "your-connection-string"
db.pushsubscriptions.find().pretty()
# Should show your subscription with userId
```

---

**If all these steps don't work, please share:**
1. Browser console logs (copy all `[NotificationPrompt]` and `[ServiceWorker]` messages)
2. Server console logs (copy all `[Push]` messages)
3. The diagnostic info above
4. Screenshots of settings/app state
