import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DesktopItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface DesktopIconProps {
  item: DesktopItem;
  index: number;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Open link in a new tab securely
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
        delay: index * 0.08 
      }}
      whileHover={{ y: -4, scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className="relative flex items-center justify-center cursor-pointer select-none group w-16 h-16 sm:w-20 sm:h-20 p-2 rounded-2xl transition-all hover:bg-cyan-500/20 active:bg-cyan-500/35 border border-transparent hover:border-cyan-500/30 focus-visible:outline-none focus:ring-2 focus:ring-cyan-400"
      id={`desktop-icon-${item.id}`}
      tabIndex={0}
      aria-label={`Open ${item.label}`}
    >
      {/* Icon Area */}
      <div className="relative flex items-center justify-center">
        <DynamicIcon name={item.iconName} size={20} className="drop-shadow-md" />
        
        {/* Glow backdrop on hover */}
        <div 
          className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        />
      </div>

      {/* Mini Tooltip overlay on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 3, scale: 0.95 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="absolute bottom-full mb-3 z-30 bg-zinc-900/90 backdrop-blur-md border border-white/10 text-white font-medium px-2.5 py-1 rounded-md text-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] pointer-events-none whitespace-nowrap"
          >
            {item.tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
