import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppWindowId } from '../types';

interface ModalProps {
  id: AppWindowId;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
  children: React.ReactNode;
  initialHeight?: string;
  initialWidth?: string;
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

export const Modal: React.FC<ModalProps> = ({
  id,
  title,
  isOpen,
  onClose,
  zIndex,
  onFocus,
  children,
  initialWidth = '600px',
  initialHeight = '450px',
  resizable = false,
  minWidth = 320,
  maxWidth = 1200,
  minHeight = 280,
  maxHeight = 900
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 80 }); // start responsive position
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState({
    width: parseInt(initialWidth) || 600,
    height: parseInt(initialHeight) || 450
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ width: 0, height: 0, clientX: 0, clientY: 0 });

  // Center the modal on load based on screen size
  useEffect(() => {
    if (isOpen) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;

      const targetX = isMobile ? 12 : Math.max(80, (w - (parseInt(initialWidth) || 600)) / 2);
      const targetY = isMobile ? 60 : Math.max(100, (h - (parseInt(initialHeight) || 450)) / 2);

      setPosition({ x: targetX, y: targetY });

      // Reset size on open
      setSize({
        width: Math.min(parseInt(initialWidth) || 600, w - 24),
        height: Math.min(parseInt(initialHeight) || 450, h - 140)
      });
    }
  }, [isOpen, initialWidth, initialHeight]);

  // Handle Dragging via Pointer Capture for robust touch/mouse control without hover lock
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea')) {
      return;
    }

    onFocus();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // safe fallback if not supported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isMaximized) return;

    const nextX = e.clientX - dragStart.current.x;
    // Bounds check to avoid dragging navbar away
    const nextY = Math.max(40, e.clientY - dragStart.current.y);
    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // safe fallback
      }
    }
  };

  // Handle Resizing
  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    resizeStart.current = {
      width: size.width,
      height: size.height,
      clientX: e.clientX,
      clientY: e.clientY
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) { }
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing || isMaximized) return;
    e.stopPropagation();

    const deltaX = e.clientX - resizeStart.current.clientX;
    const deltaY = e.clientY - resizeStart.current.clientY;

    const currentMaxWidth = Math.min(maxWidth, window.innerWidth - position.x - 12);
    const currentMaxHeight = Math.min(maxHeight, window.innerHeight - position.y - 85);

    const newWidth = Math.max(minWidth, Math.min(currentMaxWidth, resizeStart.current.width + deltaX));
    const newHeight = Math.max(minHeight, Math.min(currentMaxHeight, resizeStart.current.height + deltaY));

    setSize({ width: newWidth, height: newHeight });
  };

  const handleResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizing) {
      setIsResizing(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) { }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.93, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 40 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 140, damping: 16 }}
          style={{
            position: 'absolute',
            left: isMaximized ? 0 : `${position.x}px`,
            top: isMaximized ? 40 : `${position.y}px`,
            width: isMaximized ? '100%' : `${size.width}px`,
            height: isMaximized ? 'calc(100vh - 40px - 85px)' : (resizable ? `${size.height}px` : 'auto'),
            zIndex: zIndex,
          }}
          className="flex flex-col rounded-2xl overflow-hidden selection:bg-cyan-500/30 shadow-2xl 
                     border border-white/30 backdrop-blur-3xl backdrop-saturate-150 
                     bg-black/30 text-slate-100 focus:outline-none"
          onClick={onFocus}
          onPointerDown={onFocus}
          tabIndex={0}
        >
          {/* Windows Top Gloss Highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none" />
          {/* Title Bar */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={() => setIsMaximized(!isMaximized)}
            style={{ touchAction: 'none' }}
            className="h-[46px] bg-slate-950/50 px-4 flex items-center justify-between border-b border-white/10 cursor-grab select-none active:cursor-grabbing shrink-0"
            title="Tarik di sini untuk menggeser jendela"
          >
            {/* macOS Styling - Traffic Light Circles with expanded touch targets */}
            <div className="flex items-center space-x-3 py-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="title-button w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-400 border border-rose-600/60 relative flex items-center justify-center group focus:outline-none cursor-pointer transition-colors"
                aria-label="Tutup jendela"
              >
                <span className="text-[9px] leading-none text-rose-950 opacity-0 group-hover:opacity-100 font-extrabold transition-opacity pb-0.5">×</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="title-button w-3.5 h-3.5 rounded-full bg-amber-400 hover:bg-amber-300 border border-amber-500/60 relative flex items-center justify-center group focus:outline-none cursor-pointer transition-colors"
                aria-label="Minimalkan jendela"
              >
                <span className="text-[12px] leading-all text-amber-950 opacity-0 group-hover:opacity-100 font-extrabold transition-opacity pb-1.5">-</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMaximized(!isMaximized);
                }}
                className="title-button w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 border border-emerald-600/60 relative flex items-center justify-center group focus:outline-none cursor-pointer transition-colors"
                aria-label="Maksimalkan jendela"
              >
                <span className="text-[8px] leading-all text-emerald-950 opacity-0 group-hover:opacity-100 font-extrabold transition-opacity pb-0.5">+</span>
              </button>
            </div>

            {/* Window Title & Drag Guide */}
            <div className="text-xs font-semibold text-slate-300 pointer-events-none uppercase tracking-widest flex items-center gap-2">
              {/* <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" /> */}
              <span>{title}</span>
              <span className="hidden md:inline text-[9px] text-slate-500 font-normal normal-case tracking-normal bg-white/5 px-2 py-0.5 rounded border border-white/5 ml-2">
                Drag to Move
              </span>
            </div>

            {/* Close text helper on smaller screen profiles */}
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-[10px] text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 px-2 py-1 rounded border border-white/5 hover:border-rose-500/20 transition-all focus:outline-none active:scale-95 cursor-pointer font-sans"
              >
                Tutup
              </button>
            </div>
          </div>

          {/* Window Content */}
          <div
            className="flex-1 overflow-auto p-5 scrollbar-thin scrollbar-thumb-white/10 relative"
            style={{
              maxHeight: isMaximized ? 'none' : '100%',
              minHeight: '200px'
            }}
          >
            {children}
          </div>

          {/* Resize Handle */}
          {resizable && !isMaximized && (
            <div
              onPointerDown={handleResizePointerDown}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              className="absolute bottom-1 right-1 w-5.5 h-5.5 cursor-se-resize z-50 flex items-end justify-end pointer-events-auto p-0.5"
              style={{ touchAction: 'none' }}
              title="Tarik untuk mengubah ukuran"
            >
              <svg width="12" height="12" viewBox="0 0 10 10" className="text-cyan-400 opacity-60 hover:opacity-100 transition-opacity">
                <path d="M10,0 L0,10 M10,4 L4,10 M10,8 L8,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
