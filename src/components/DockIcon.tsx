import React from 'react';
import { motion } from 'motion/react';
import { DynamicIcon } from './DynamicIcon';

interface DockIconProps {
  id: string;
  label: string;
  iconName: string;
  onClick: () => void;
  isOpen: boolean; // active state helper
  hoverIndex: number | null;
  currentIndex: number;
}

export const DockIcon: React.FC<DockIconProps> = ({
  id,
  label,
  iconName,
  onClick,
  isOpen,
  hoverIndex,
  currentIndex
}) => {
  // macOS style magnification calculation:
  // If this icon is hovered: scale = 1.28
  // If neighbors are hovered: scale = 1.15
  // Otherwise: scale = 1.0
  let scale = 1.0;
  if (hoverIndex !== null) {
    const dist = Math.abs(hoverIndex - currentIndex);
    if (dist === 0) {
      scale = 1.28;
    } else if (dist === 1) {
      scale = 1.14;
    }
  }

  // Trigger bounce animation when clicked
  const [isBouncing, setIsBouncing] = React.useState(false);

  const handlePointerDown = () => {
    setIsBouncing(true);
    onClick();
    setTimeout(() => {
      setIsBouncing(false);
    }, 1100); // match bounce timer
  };

  return (
    <div 
      className="relative flex flex-col items-center group touch-none"
      id={`dock-wrapper-${id}`}
    >
      {/* Small Tooltip showing label */}
      <div 
        className="absolute top-[-44px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-white/95 border border-white/10 shadow-lg whitespace-nowrap z-50 text-center"
      >
        {label}
        <div className="absolute top-[100%] left-1/2 -translate-x-1/2 border-t-4 border-t-slate-950/85 border-x-4 border-x-transparent" />
      </div>

      {/* Main Interactive Icon Button */}
      <motion.button
        animate={{
          scale: scale,
          y: isBouncing ? [0, -22, 0, -10, 0] : 0
        }}
        transition={{
          y: {
            duration: 1.1,
            ease: 'easeInOut'
          },
          scale: {
            type: 'spring',
            stiffness: 280,
            damping: 18,
          }
        }}
        onClick={handlePointerDown}
        className="focus:outline-none relative flex items-center justify-center cursor-pointer select-none active:brightness-90 transition-all rounded-2xl"
        style={{ transformOrigin: 'bottom center' }}
        aria-label={`Open ${label}`}
      >
        <DynamicIcon name={iconName} size={30} className="w-11 h-11 sm:w-13 sm:h-13" />

        {/* Shimmer liquid reflection highlights */}
        {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" /> */}
      </motion.button>

      {/* Active Indicator LED dot under the icon */}
      <div className="h-1.5 -mt-1 flex items-center justify-center select-none pointer-events-none">
        {isOpen && (
          <motion.div 
            layoutId={`active-dot-${id}`}
            className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255, 255, 255, 0.8)]"
          />
        )}
      </div>
    </div>
  );
};
