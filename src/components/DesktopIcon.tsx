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
      className="relative flex flex-col items-center justify-center cursor-pointer select-none group w-20 sm:w-24 p-2 rounded-xl transition-all hover:bg-white/10 active:bg-white/15 border border-transparent hover:border-white/10 focus-visible:outline-none focus:ring-2 focus:ring-cyan-400"
      id={`desktop-icon-${item.id}`}
      tabIndex={0}
      aria-label={`Open ${item.label}`}
    >
      {/* Icon Area */}
      <div className="relative">
        <DynamicIcon name={item.iconName} size={28} className="drop-shadow-md" />
        
        {/* Glow backdrop on hover */}
        <div 
          className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        />
      </div>

      {/* Label under icon */}
      <span className="mt-2 text-[11px] sm:text-xs font-medium text-white text-center line-clamp-2 leading-tight select-none px-1 py-0.5 rounded  text-shadow-md">
        {item.label}
      </span>

      {/* Mini Tooltip overlay on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2.5 z-30 max-w-[130px] whitespace-normal text-center break-words bg-neutral-950/95 backdrop-blur-md px-2.5 py-1.5 rounded-md text-[10px] text-cyan-200 border border-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.5)] pointer-events-none"
          >
            {item.tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
