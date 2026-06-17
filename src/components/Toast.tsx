import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, message]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 200, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 200, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          className="fixed top-12 right-4 z-50 w-72 sm:w-80 overflow-hidden rounded-2xl border border-white/20 backdrop-blur-2xl bg-slate-900/75 p-3.5 shadow-2xl flex items-start space-x-3 text-slate-100 uppercase-none font-sans"
          id="macos-alert-banner"
        >
          {/* Top glass reflection highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />

          {/* App Logo or notification icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 border border-white/10 flex items-center justify-center shrink-0">
            <Bell size={14} className="text-white animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 pr-1 select-none">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">System Notification</span>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors focus:outline-none"
              >
                <X size={12} />
              </button>
            </div>
            <p className="text-xs font-medium text-slate-100 mt-1 leading-normal">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
