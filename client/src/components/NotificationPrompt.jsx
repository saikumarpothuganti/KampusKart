import React, { useState, useEffect } from 'react';
import API from '../lib/api';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show if running as PWA AND permission is default
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone === true;
    const permission = 'Notification' in window ? Notification.permission : null;

    if (isPWA && permission === 'default') {
      setShowPrompt(true);
    }
  }, []);

  const handleEnable = async () => {
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        setShowPrompt(false);
        return;
      }

      // Register service worker if needed
      const registration = await navigator.serviceWorker.ready;

      // Generate VAPID public key (from backend env)
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || 
        'BN8pqzZ-xC3-Kj_9LKqZ7C6JQ8vW5rX2fY9pQrS3tU5vW6xY7zA8bC9dE0fG1hI2jK3lM4nO5pQ6rS7tU8vW9xY0zA';

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

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Send subscription to backend
      await API.post('/push/subscribe', { subscription: subscription.toJSON() });
      
      console.log('[PWA] Push subscription sent to backend');
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
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <p style={{ color: '#111827', fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
          🔔 Enable notifications to get order updates
        </p>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: '0' }}>
          Stay informed about your order status in real-time.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={handleLater}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            color: '#6b7280',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.target.style.borderColor = '#9ca3af';
            e.target.style.color = '#374151';
          }}
          onMouseOut={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.color = '#6b7280';
          }}
        >
          Later
        </button>
        <button
          onClick={handleEnable}
          style={{
            padding: '8px 16px',
            backgroundColor: '#16a34a',
            border: 'none',
            color: '#ffffff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#15803d';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#16a34a';
          }}
        >
          Enable
        </button>
      </div>
    </div>
  );
};

export default NotificationPrompt;
