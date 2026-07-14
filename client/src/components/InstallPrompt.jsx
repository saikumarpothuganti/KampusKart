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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 w-full max-w-sm">
      <div className="realistic-paper-card w-full p-6 relative transform -rotate-1 shadow-2xl border-2 border-dashed border-[#B8860B]/40">
        {/* Fold effect corner */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-paper border-b border-l border-ink/20 shadow-sm rounded-bl-sm" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
        
        <div className="mb-4 pr-6">
          <p className="text-[#B8860B] font-serif font-bold text-lg mb-1 leading-tight">
            📱 Install KampusKart App
          </p>
          <p className="text-[#B8860B]/80 font-serif text-sm">
            Access KampusKart faster and offline. Install the app on your device.
          </p>
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={() => setShowBanner(false)}
            className="bg-transparent border-2 border-dashed border-[#B8860B]/50 text-[#B8860B] px-4 py-2 rounded-sm text-sm font-bold shadow-[2px_2px_0px_rgba(184,134,11,0.2)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_rgba(184,134,11,0.2)] transition-all font-serif"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="bg-[#B8860B] text-[#FAF8F2] px-6 py-2 rounded-sm text-sm font-bold shadow-[3px_3px_0px_rgba(184,134,11,0.3)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_rgba(184,134,11,0.3)] transition-all font-serif"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
