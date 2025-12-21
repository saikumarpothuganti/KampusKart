import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA: Register service worker safely
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('[PWA] Service Worker registered'))
      .catch(err => console.error('[PWA] Service Worker registration failed:', err));
  });
}
