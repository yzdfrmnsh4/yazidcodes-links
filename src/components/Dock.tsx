import React, { useState } from 'react';
import { DockIcon } from './DockIcon';
import { AppWindowId } from '../types';

interface DockItemDef {
  id: AppWindowId | 'alert_welcome' | 'whatsapp';
  label: string;
  iconName: string;
  targetWindowId?: AppWindowId;
  action?: () => void;
}

interface DockProps {
  onOpenWindow: (id: AppWindowId) => void;
  openWindows: Record<AppWindowId, boolean>;
  onTriggerToast: (msg: string) => void;
}

export const Dock: React.FC<DockProps> = ({ onOpenWindow, openWindows, onTriggerToast }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dockItems: DockItemDef[] = [
    {
      id: 'finder',
      label: 'Finder',
      targetWindowId: 'finder',
      iconName: 'finder',
      action: () => {
        onTriggerToast("Selamat Datang di Desktop macOS Muhammad Yazid!");
        onOpenWindow('finder');
      }
    },
    {
      id: 'safari',
      label: 'Safari Browser',
      targetWindowId: 'safari',
      iconName: 'safari',
      action: () => {
        onOpenWindow('safari');
      }
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Chat',
      iconName: 'whatsapp',
      action: () => {
        window.open('https://wa.me/628123456789', '_blank');
        onTriggerToast("💬 Menghubungi Muhammad Yazid di WhatsApp...");
      }
    },
    {
      id: 'spotify',
      label: 'Spotify Music',
      targetWindowId: 'spotify',
      iconName: 'spotify',
      action: () => {
        onOpenWindow('spotify');
      }
    },
    {
      id: 'photos',
      label: 'Photos Gallery',
      targetWindowId: 'photos',
      iconName: 'photos',
      action: () => {
        onOpenWindow('photos');
      }
    },
    {
      id: 'notes',
      label: 'Sticky Notes',
      targetWindowId: 'notes',
      iconName: 'notes',
      action: () => {
        onOpenWindow('notes');
      }
    },
    {
      id: 'camera',
      label: 'Photo Booth Webcam',
      targetWindowId: 'camera',
      iconName: 'camera',
      action: () => {
        onTriggerToast("📷 Membuka Photo Booth...");
        onOpenWindow('camera');
      }
    }
  ];

  return (
    <div 
      className="fixed bottom-[14px] left-1/2 -translate-x-1/2 z-40 max-w-[92vw] sm:max-w-none px-4 sm:px-2 py-1 rounded-4xl backdrop-blur-2xl  border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex items-end gap-3 sm:gap-2 select-none"
      onMouseLeave={() => setHoveredIndex(null)}
      id="macos-dock"
    >
      {/* Liquid Glass light highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-t-4xl" />
      
      {/* Render the items */}
      {dockItems.map((item, idx) => {
        const isAppOpen = item.targetWindowId ? !!openWindows[item.targetWindowId] : false;
        
        return (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseMove={() => setHoveredIndex(idx)}
            className="flex items-end justify-center "
          >
            <DockIcon
              id={item.id}
              label={item.label}
              iconName={item.iconName}
              isOpen={isAppOpen}
              hoverIndex={hoveredIndex}
              currentIndex={idx}
              onClick={item.action ? item.action : () => item.targetWindowId && onOpenWindow(item.targetWindowId)}
            />
          </div>
        );
      })}
    </div>
  );
};
