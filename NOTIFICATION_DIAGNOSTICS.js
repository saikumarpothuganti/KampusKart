#!/usr/bin/env node

/**
 * NOTIFICATION DEBUGGING GUIDE
 * 
 * Run these commands in your browser console to diagnose notification issues
 */

// ==========================================
// 1. CHECK NOTIFICATION API SUPPORT
// ==========================================
console.log('=== 1. NOTIFICATION API SUPPORT ===');
console.log('Notification API available:', 'Notification' in window);
console.log('Service Worker available:', 'serviceWorker' in navigator);
console.log('Push Manager available:', 'PushManager' in window);

// ==========================================
// 2. CHECK CURRENT PERMISSION STATE
// ==========================================
console.log('\n=== 2. CURRENT PERMISSION STATE ===');
console.log('Notification permission:', Notification.permission);
// Values: 'default' (never asked), 'granted' (allowed), 'denied' (blocked)

// ==========================================
// 3. CHECK PWA MODE
// ==========================================
console.log('\n=== 3. PWA MODE CHECK ===');
console.log('Display mode (standalone):', window.matchMedia('(display-mode: standalone)').matches);
console.log('Navigator standalone:', window.navigator.standalone);
console.log('Is PWA:', window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

// ==========================================
// 4. CHECK SERVICE WORKER REGISTRATION
// ==========================================
console.log('\n=== 4. SERVICE WORKER CHECK ===');
navigator.serviceWorker.getRegistrations().then((registrations) => {
  console.log('Registered service workers:', registrations.length);
  registrations.forEach((reg, idx) => {
    console.log(`  [${idx}] Scope: ${reg.scope}`);
    console.log(`      Active: ${reg.active ? 'YES' : 'NO'}`);
    console.log(`      Installing: ${reg.installing ? 'YES' : 'NO'}`);
    console.log(`      Waiting: ${reg.waiting ? 'YES' : 'NO'}`);
  });
}).catch(err => console.error('Error getting registrations:', err));

// ==========================================
// 5. REQUEST PERMISSION (RUN IF NEEDED)
// ==========================================
console.log('\n=== 5. REQUEST PERMISSION ===');
console.log('To request permission, run: Notification.requestPermission().then(perm => console.log("Result:", perm))');

// ==========================================
// 6. CHECK USER AUTHENTICATION
// ==========================================
console.log('\n=== 6. USER AUTHENTICATION ===');
// Check localStorage or context - example for this project
try {
  const auth = localStorage.getItem('auth');
  const user = localStorage.getItem('user');
  console.log('Auth token:', auth ? 'Present' : 'Missing');
  console.log('User data:', user ? 'Present' : 'Missing');
  if (user) {
    const userData = JSON.parse(user);
    console.log('User ID:', userData.id);
  }
} catch (e) {
  console.error('Error reading auth:', e);
}

// ==========================================
// 7. MANUALLY TEST SUBSCRIPTION
// ==========================================
console.log('\n=== 7. MANUAL SUBSCRIPTION TEST ===');
console.log(`To manually subscribe, run this in console:

async function testSubscribe() {
  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker ready:', !!registration);
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: new Uint8Array([...])
    });
    
    console.log('Subscription created:', subscription);
    console.log('Endpoint:', subscription.endpoint);
    
    // Send to backend
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userId: 'YOUR_USER_ID'
      })
    });
    
    console.log('Backend response:', await response.json());
  } catch (error) {
    console.error('Subscription error:', error);
  }
}

testSubscribe();
`);

// ==========================================
// 8. CHECK BROWSER CONSOLE FOR LOGS
// ==========================================
console.log('\n=== 8. BROWSER CONSOLE LOGS ===');
console.log('Look for these logs to debug:');
console.log('  [NotificationPrompt] - Component lifecycle');
console.log('  [ServiceWorker] - Service worker events');
console.log('  [Push] - Push notifications');
console.log('\nIf NotificationPrompt doesn\'t appear:');
console.log('  - Check if isPWA is true (must be in standalone mode)');
console.log('  - Check if permission is "default" or "denied"');
console.log('  - Check if user is authenticated (user?.id)');

// ==========================================
// 9. TEST PUSH NOTIFICATION (ADMIN)
// ==========================================
console.log('\n=== 9. SEND TEST PUSH (ADMIN ONLY) ===');
console.log('From terminal, run:');
console.log('  curl -X POST http://localhost:5000/api/push/test');
console.log('\nOr from production:');
console.log('  curl -X POST https://kampuskart-1.onrender.com/api/push/test');

// ==========================================
// 10. COMMON ISSUES & SOLUTIONS
// ==========================================
console.log('\n=== 10. COMMON ISSUES ===');
console.log(`
❌ NotificationPrompt not showing?
  ✓ Ensure you're in PWA mode (Add to Home Screen)
  ✓ Open as standalone app (not browser tab)
  ✓ Check permission state (should be 'default' or 'denied')
  ✓ Check user is authenticated

❌ Permission request not appearing?
  ✓ Must be in PWA standalone mode
  ✓ Permission may already be granted or denied
  ✓ Check Settings → Apps → Permissions

❌ Subscription sending but no notifications?
  ✓ Check MongoDB: db.pushsubscriptions.find()
  ✓ Check backend logs for "[Push]" messages
  ✓ Try curl POST /api/push/test from server terminal
  ✓ Ensure VAPID keys are set in .env

❌ Notifications appear in browser but not on mobile?
  ✓ iOS: Requires app in standalone mode
  ✓ Android: Check notification settings per app
  ✓ Try toggling notifications off/on in settings
  ✓ Reinstall PWA and re-enable notifications
`);

console.log('\n=== DIAGNOSTIC COMPLETE ===');
