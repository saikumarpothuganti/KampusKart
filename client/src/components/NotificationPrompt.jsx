import React, { useState, useEffect } from 'react';
import API from '../lib/api';
import { useAuth } from '../context/AuthContext';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check PWA mode
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone === true;
    const permission = 'Notification' in window ? Notification.permission : null;

    console.log('[NotificationPrompt] Debug Info:', {
      isPWA,
      permission,
      hasNotificationAPI: 'Notification' in window,
      userAuthenticated: !!user?.id,
      userID: user?.id,
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
      standalone: window.navigator.standalone,
    });

    // CHANGED: Show prompt if (PWA OR browser in dev) AND (permission is default OR denied)
    // This allows testing in browser and helps users who denied permission to try again
    const shouldShow = (isPWA || window.location.hostname === 'localhost') && 
                       (permission === 'default' || permission === 'denied');
    
    if (shouldShow) {
      console.log('[NotificationPrompt] Showing notification prompt');
      setShowPrompt(true);
    } else {
      console.log('[NotificationPrompt] Not showing - conditions not met');
    }
  }, [user]);

  const handleEnable = async () => {
    try {
      console.log('[NotificationPrompt] Enable clicked, user:', user?.id);

      // User must be authenticated
      if (!user || !user.id) {
        console.error('[PWA] User not authenticated - cannot subscribe');
        setShowPrompt(false);
        return;
      }

      console.log('[NotificationPrompt] Requesting notification permission...');
      // Request permission
      const permission = await Notification.requestPermission();
      console.log('[NotificationPrompt] Permission result:', permission);
      
      if (permission !== 'granted') {
        console.warn('[PWA] User denied notification permission');
        setShowPrompt(false);
        return;
      }

      console.log('[NotificationPrompt] Permission granted, registering service worker...');
      // Register service worker if needed
      const registration = await navigator.serviceWorker.ready;
      console.log('[NotificationPrompt] Service Worker ready:', !!registration);

      // Generate VAPID public key (from backend env)
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || 
        'BBlUaRlvusca8spAYX_EH778O60Fu9j802G_UmZ6SuV5LlfKzF2bNUCZeYpIHGulF5Ib9mxf0vgfmm9lqQ8W2lk';

      console.log('[NotificationPrompt] VAPID Public Key loaded:', vapidPublicKey.substring(0, 20) + '...');

      // Convert base64 to Uint8Array
      const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      };

      console.log('[NotificationPrompt] Subscribing to push manager...');
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      console.log('[NotificationPrompt] Push subscription created:', {
        endpoint: subscription.endpoint.substring(0, 50) + '...',
        userId: user.id,
      });

      // Send subscription to backend WITH userId (STEP 2)
      console.log('[NotificationPrompt] Sending subscription to backend...');
      const response = await API.post('/push/subscribe', { 
        subscription: subscription.toJSON(),
        userId: user.id
      });

      console.log('[NotificationPrompt] Backend response:', response);
      console.log('[PWA] Push subscription sent to backend with userId');
      setShowPrompt(false);
    } catch (error) {
      console.error('[PWA] Notification enable failed:', error);
      setShowPrompt(false);
    }
  };

  const handleLater = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-4 w-full max-w-sm">
      <div className="realistic-paper-card w-full p-6 relative transform rotate-1 shadow-2xl border-2 border-dashed border-[#B8860B]/40">
        {/* Fold effect corner */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-paper border-b border-l border-ink/20 shadow-sm rounded-bl-sm" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
        
        <div className="mb-4 pr-6">
          <p className="text-[#B8860B] font-serif font-bold text-lg mb-1 leading-tight">
            🔔 Enable notifications to get order updates
          </p>
          <p className="text-[#B8860B]/80 font-serif text-sm">
            Stay informed about your order status in real-time.
          </p>
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={handleLater}
            className="bg-transparent border-2 border-dashed border-[#B8860B]/50 text-[#B8860B] px-4 py-2 rounded-sm text-sm font-bold shadow-[2px_2px_0px_rgba(184,134,11,0.2)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_rgba(184,134,11,0.2)] transition-all font-serif"
          >
            Later
          </button>
          <button
            onClick={handleEnable}
            className="bg-[#B8860B] text-[#FAF8F2] px-6 py-2 rounded-sm text-sm font-bold shadow-[3px_3px_0px_rgba(184,134,11,0.3)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_rgba(184,134,11,0.3)] transition-all font-serif"
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
