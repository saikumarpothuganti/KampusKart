import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response: ${outcome}`);

    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        maxWidth: '500px',
        backgroundColor: '#000000',
        border: '2px solid #00ff66',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0, 255, 102, 0.3)',
        zIndex: 9999,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <p style={{ color: '#00ff66', fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
          📱 Install KampusKart App
        </p>
        <p style={{ color: '#cccccc', fontSize: '13px', margin: '0' }}>
          Access KampusKart faster and offline. Install the app on your device.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowBanner(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid #666666',
            color: '#999999',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.target.style.borderColor = '#00ff66';
            e.target.style.color = '#00ff66';
          }}
          onMouseOut={(e) => {
            e.target.style.borderColor = '#666666';
            e.target.style.color = '#999999';
          }}
        >
          Later
        </button>
        <button
          onClick={handleInstall}
          style={{
            padding: '8px 16px',
            backgroundColor: '#00ff66',
            border: 'none',
            color: '#000000',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#00dd55';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#00ff66';
          }}
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
