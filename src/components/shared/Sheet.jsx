import React, { useEffect } from 'react';

/**
 * Responsive modal/bottom sheet container.
 * - Displays as centered modal on tablet/desktop (>= 768px).
 * - Displays as bottom sheet on phones (< 768px) with max-h-[85dvh] and internal scrolling.
 */
export function Sheet({
  isOpen = true,
  onClose,
  title = '',
  children,
  maxWidth = 'max-w-lg',
  className = '',
  closeOnEscape = true
}) {
  useEffect(() => {
    if (!isOpen || !closeOnEscape || !onClose) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/75 backdrop-blur-sm fade-in-up"
    >
      <div
        className={`w-full ${maxWidth} bg-[#180a38]/95 border-t-2 md:border-2 border-purple-400/50 rounded-t-3xl md:rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[85dvh] md:max-h-[90dvh] overflow-y-auto overscroll-contain pb-[max(1.25rem,env(safe-area-inset-bottom))] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
