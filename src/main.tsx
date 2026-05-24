import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Clean up stale or development service workers to prevent MIME type / dev-sw.js errors in the browser
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      const scriptURL = registration.active?.scriptURL || registration.installing?.scriptURL || registration.waiting?.scriptURL || '';
      const isDevSw = scriptURL.includes('dev-sw.js');
      // In development mode, unregister all; in production mode, selectively unregister stale dev-sw.js
      if (isDevSw || import.meta.env.DEV) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('Cleaned up stale service worker:', scriptURL);
          }
        });
      }
    }
  }).catch((err) => {
    console.warn('Error reading service worker registrations:', err);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
