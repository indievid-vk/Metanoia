import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window and main content container after render
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      const mainContainer = document.querySelector('main');
      if (mainContainer) {
        mainContainer.scrollTop = 0;
      }
      // Also try layout container by classes just in case
      const layoutContainer = document.querySelector('.overflow-y-auto');
      if (layoutContainer) {
        layoutContainer.scrollTop = 0;
      }
    };
    
    // Attempt scroll immediately
    scrollToTop();
    
    // Attempt after delays to account for any React/framer-motion rendering ticks
    const t1 = setTimeout(scrollToTop, 10);
    const t2 = setTimeout(scrollToTop, 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
