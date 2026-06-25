import React, { useState } from 'react';
import { DockIcon } from './DockIcon';
import { AppWindowId } from '../types';

interface DockItemDef {
  id: string;
  label: string;
  iconName: string;
  targetWindowId?: AppWindowId;
  action?: () => void;
}

interface DockProps {
  onOpenWindow: (id: AppWindowId) => void;
  openWindows: Record<AppWindowId, boolean>;
  onTriggerToast: (msg: string) => void;
  onCycleWallpaper?: () => void;
}

export const Dock: React.FC<DockProps> = ({ onOpenWindow, openWindows, onTriggerToast, onCycleWallpaper }) => {
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
      id: 'portfolio',
      label: 'Portofolio',
      iconName: 'portfolio',
      action: () => {
        window.open('https://yazidcodes.site', '_blank');
        onTriggerToast("🌐 Membuka website Portofolio Muhammad Yazid...");
      }
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      iconName: 'tiktok',
      action: () => {
        window.open('https://tiktok.com/@yaziddev', '_blank');
        onTriggerToast("🎵 Membuka profil TikTok Muhammad Yazid...");
      }
    },
    {
      id: 'instagram',
      label: 'Instagram',
      iconName: 'instagram',
      action: () => {
        window.open('https://instagram.com/yzdfrmnsh', '_blank');
        onTriggerToast("📸 Membuka Instagram Muhammad Yazid...");
      }
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      iconName: 'linkedin',
      action: () => {
        window.open('https://linkedin.com/in/m-yazid-ilmany-firmansyah/', '_blank');
        onTriggerToast("💼 Membuka LinkedIn Muhammad Yazid...");
      }
    },
    {
      id: 'github',
      label: 'GitHub',
      iconName: 'github',
      action: () => {
        window.open('https://github.com/yzdfrmnsh4', '_blank');
        onTriggerToast("💻 Membuka GitHub Muhammad Yazid...");
      }
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Chat',
      iconName: 'whatsapp',
      action: () => {
        window.open('https://wa.me/628818208207', '_blank');
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
    },
    {
      id: 'wallpaper',
      label: 'Ganti Wallpaper',
      iconName: 'wallpaper',
      action: () => {
        if (onCycleWallpaper) {
          onCycleWallpaper();
        }
      }
    }
  ];

  return (
    <div 
      className="fixed bottom-[14px] left-1/2 -translate-x-1/2 z-40 max-w-[92vw] sm:max-w-none px-4 sm:px-2  rounded-3xl backdrop-blur-2xl  border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex items-end gap-3 sm:gap-2 select-none"
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
