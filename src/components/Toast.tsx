import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'loading' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

/**
 * Premium Liquid Glass Toast Component
 * 
 * DESIGN SPECIFICATION:
 * - Ultra translucent glossy background ("Liquid Glass")
 * - Left-aligned colored atmospheric glow of high fidelity
 * - Rounded-2xl macOS-inspired responsive design
 * - Custom tailored symbols matching the provided visual reference perfectly
 */
export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose,
  duration = 3000 
}) => {
  // Use a ref to keep track of the latest onClose function 
  // to avoid timer resets due to unstable parent state callbacks
  const onCloseRef = React.useRef(onClose);
  
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  
  useEffect(() => {
    if (isVisible && type !== 'loading') {
      const timer = setTimeout(() => {
        onCloseRef.current();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, type, duration]);

  // Design tokens tailored to perfectly recreate the user's reference image
  const themeTokens = {
    success: {
      glowColor: 'bg-emerald-500/10',
      iconContainerBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      // High fidelity minimal check mark
      icon: (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4 8L11 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    loading: {
      glowColor: 'bg-amber-500/10',
      iconContainerBg: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
      // Beautiful macOS-styled dotted rotating sun loader matching the image
      icon: (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" />
        </svg>
      )
    },
    error: {
      glowColor: 'bg-rose-500/10',
      iconContainerBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      // High fidelity minimal cross mark
      icon: (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    info: {
      glowColor: 'bg-blue-500/10',
      iconContainerBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      icon: (
        <svg width="4" height="10" viewBox="0 0 4 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3V9M2 1H2.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  };

  const currentTheme = themeTokens[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.95, y: -12, filter: 'blur(2px)', transition: { duration: 0.15 } }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed top-12 right-4 sm:right-6 z-[9999] w-[350px] sm:w-[410px] overflow-hidden rounded-2xl border border-white/[0.04] bg-[#111113]/70 backdrop-blur-3xl backdrop-saturate-[180%] text-zinc-100 p-4 pl-4.5 pr-9 flex items-center gap-3.5 shadow-[0_24px_55px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.06)] font-sans"
          id="macos-liquid-toast"
        >
          {/* Subtle Top-Border Highlight simulating 3D Glass Sheen */}
          <div className="absolute top-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-white/[0.08] via-transparent to-transparent pointer-events-none" />

          {/* Left-Aligned Atmospheric Diffused Gradient Glow */}
          <div className={`absolute -top-12 -left-12 w-28 h-28 rounded-full ${currentTheme.glowColor} filter blur-2xl pointer-events-none opacity-80`} />

          {/* Liquid Glass Edge Highlighting on upper-left and left side */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/[0.012] to-transparent pointer-events-none" />

          {/* Icon Badge */}
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 select-none ${currentTheme.iconContainerBg}`}>
            {currentTheme.icon}
          </div>

          {/* Typography Layout - Display Only Message in high fidelity */}
          <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center text-left z-10 select-none">
            <p className="text-[13px] font-medium text-zinc-200 leading-snug tracking-wide select-text">
              {message}
            </p>
          </div>

          {/* Minimal macOS Style Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-3.5 right-3 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] p-1 rounded-md transition-all duration-150 focus:outline-none cursor-pointer z-20"
            aria-label="Close notification"
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

