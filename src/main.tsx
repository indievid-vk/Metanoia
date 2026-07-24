import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Clean up ONLY legacy dev-sw.js service workers if present from older dev sessions
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      const scriptURL = registration.active?.scriptURL || registration.installing?.scriptURL || registration.waiting?.scriptURL || '';
      if (scriptURL.includes('dev-sw.js')) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('Cleaned up legacy dev service worker:', scriptURL);
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
