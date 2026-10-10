import { useState, useEffect } from 'react';

export function useViewport() {
  const [viewport, setViewport] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      width: w,
      height: h,
      isPhone: w < 768,
      isMedium: w >= 768 && w < 1180,
      isWide: w >= 1180,
      isShort: h < 800,
      isMobile: w < 640,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setViewport({
        width: w,
        height: h,
        isPhone: w < 768,
        isMedium: w >= 768 && w < 1180,
        isWide: w >= 1180,
        isShort: h < 800,
        isMobile: w < 640,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}
