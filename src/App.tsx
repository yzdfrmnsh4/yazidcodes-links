import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithSkeleton } from './components/ImageWithSkeleton';
import { useRealtime } from './hooks/useRealtime';
import { MenuBar } from './components/MenuBar';
import { DesktopIcon } from './components/DesktopIcon';
import { Dock } from './components/Dock';
import { Modal } from './components/Modal';
import { FinderContent } from './components/FinderContent';
import { SafariContent } from './components/SafariContent';
import { SpotifyPlayer } from './components/SpotifyPlayer';
import { PhotoGallery } from './components/PhotoGallery';
import { StickyNote } from './components/StickyNote';
import { CameraContent } from './components/CameraContent';
import { Toast } from './components/Toast';
import { DesktopWidgets } from './components/DesktopWidgets';
import DarkVeil from './components/DarkVeil';
import ProfileCard from './components/ProfileCard';
import { AppWindowId, DesktopItem } from './types';
import { Wallpaper, RefreshCw, LayoutGrid, Info, Camera, Battery, Wifi, SignalHigh } from 'lucide-react';
import { Spotify } from './components/icon/Spotify';
import { Insta } from './components/icon/Instagram';
import { WhatsApp } from './components/icon/WhatsApp';

export default function App() {
  const { time, location } = useRealtime();

  // Desktop Icons Configuration
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([
    {
      id: 'tiktok',
      label: 'TikTok Profile',
      iconName: 'tiktok',
      url: 'https://tiktok.com/@yaziddev',
      tooltip: 'My Profil TikTok',
      accentColor: 'shadow-red-500/30'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      iconName: 'instagram',
      url: 'https://instagram.com/yzdfrmnsh',
      tooltip: 'Sapa Saya di Instagram',
      accentColor: 'shadow-orange-500/30'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      iconName: 'linkedin',
      url: 'https://linkedin.com/in/username',
      tooltip: 'Connect di LinkedIn',
      accentColor: 'shadow-blue-500/30'
    },
    {
      id: 'github',
      label: 'GitHub Developer',
      iconName: 'github',
      url: 'https://github.com/yzdfrmnsh4',
      tooltip: 'Lihat Repositori & Kontribusi Kode',
      accentColor: 'shadow-slate-500/30'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      iconName: 'whatsapp',
      url: 'https://wa.me/628818208207',
      tooltip: 'Diskusikan Proyek Anda via WhatsApp',
      accentColor: 'shadow-emerald-500/30'
    },
    {
      id: 'portfolio',
      label: 'Yazid.dev Portfolio',
      iconName: 'portfolio',
      url: 'https://yazidcodes.site',
      tooltip: 'Kunjungi Website Portofolio saya',
      accentColor: 'shadow-cyan-500/30'
    }
  ]);

  // Window Open/Close States
  const [openWindows, setOpenWindows] = useState<Record<AppWindowId, boolean>>({
    finder: false,
    safari: false,
    spotify: false,
    photos: false,
    notes: false,
    terminal: false,
    portfolio: false,
    camera: false
  });

  // Track focused window label for MenuBar display
  const [activeWindowLabel, setActiveWindowLabel] = useState<string>('Finder');

  // Track overlapping zIndex stack
  const [zIndexStack, setZIndexStack] = useState<Record<AppWindowId, number>>({
    finder: 10,
    safari: 11,
    spotify: 12,
    photos: 13,
    notes: 14,
    terminal: 15,
    portfolio: 16,
    camera: 17
  });
  const [highestZIndex, setHighestZIndex] = useState<number>(20);

  // Wallpaper manager (Choose from presets)
  const wallpapers = [
    "https://images.pexels.com/photos/1106472/pexels-photo-1106472.jpeg", // Emerald Bay Lake Tahoe (turquoise)
    "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg", // Clear reflections
    "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg"  // Starry mountains
  ];
  const [currentWallpaperIdx, setCurrentWallpaperIdx] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Monitor screen layout context responsively
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toast States
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  // Initialize Welcome Message (Finder does NOT show by default)
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      triggerToast("Selamat datang! Klik Finder di Dock atau ketuk shortcut aplikasi untuk memulai.");
    }, 1500);

    return () => clearTimeout(welcomeTimer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const handleOpenWindow = (id: AppWindowId) => {
    setOpenWindows(prev => ({ ...prev, [id]: true }));
    handleFocusWindow(id);
  };

  const handleCloseWindow = (id: AppWindowId) => {
    setOpenWindows(prev => ({ ...prev, [id]: false }));
    // Reset active title context to Finder if closed
    setActiveWindowLabel('Finder');
  };

  const handleFocusWindow = (id: AppWindowId) => {
    // Increment total z-index and assign to this window
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setZIndexStack(prev => ({ ...prev, [id]: newZIndex }));

    // Convert to proper capital label for display
    const titleMap: Record<AppWindowId, string> = {
      finder: 'Finder Finder',
      safari: 'Safari Browser',
      spotify: 'Spotify Stream',
      photos: 'Photos Album',
      notes: 'Sticky Notes',
      terminal: 'Terminal Bash',
      portfolio: 'Portfolio Node',
      camera: 'Photo Booth'
    };
    setActiveWindowLabel(titleMap[id] || 'Finder');
  };

  const cycleWallpaper = () => {
    setCurrentWallpaperIdx((prev) => (prev + 1) % wallpapers.length);
    triggerToast("🎆 Wallpaper diganti! Liquid glass beradaptasi dengan pencahayaan baru.");
  };

  return (

    <div
      className="relative w-screen h-screen overflow-hidden font-sans select-none bg-slate-950"
      id="macos-surface-container"
    >
      {/* Dynamic Live WebGL Wallpaper using DarkVeil (React Bits + OGL) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* <img src="../foto.jpg" alt="" className="w-screen" /> */}
        <DarkVeil
          hueShift={currentWallpaperIdx * 120}
          noiseIntensity={0.03}
          scanlineIntensity={0.05}
          speed={0.35}
          scanlineFrequency={0.0}
          warpAmount={0.05}
          resolutionScale={0.8}
        />
      </div>

      {/* Background glass overlay to unify and smooth overall wallpaper depth */}
      <div className="absolute inset-0 z-[1] bg-slate-950/10 pointer-events-none backdrop-brightness-[0.8] transition-all duration-500" />

      {/* CONDITIONAL TOP NAVIGATION: macOS MenuBar (Desktop) vs iOS Notch bar (Mobile) */}
      {!isMobile ? (
        <MenuBar
          time={time}
          location={location}
          activeWindowLabel={activeWindowLabel}
        />
      ) : (

        /* iOS Status bar with simulated Dynamic Island / Notch */
        <div className="fixed top-0 left-0 w-full h-[44px] z-50 flex items-center justify-between px-6 text-white text-xs select-none">

          {/* Signal and status icons left side */}
          <span className="font-bold tracking-tight text-white/95 text-[13px] drop-shadow-sm">
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>

          {/* DYNAMIC ISLAND PILL (Menggunakan Class dari index.css) */}
          <div className="star-border-wrapper bg-white/5">
            <div className="star-glow-top"></div>
            <div className="star-glow-bottom"></div>

            {/* Konten Asli Dynamic Island */}
            <div className="relative z-10 w-full h-full bg-black rounded-full shadow-inner flex flex-row items-center justify-center gap-1.5 px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
              <span className="text-[10px] font-thin text-white  tracking-widest leading-none">
                Yazidcodes
              </span>
            </div>
          </div>

          {/* Battery & Signals right side */}
          <div className="flex items-center space-x-2 font-bold text-white/95 drop-shadow-sm">
            <div className="pb-0.5 flex items-center space-x-2">
              <Wifi size={18} className="hover:text-white transition-colors cursor-pointer" />
              <Battery size={20} className="hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* RESPONSIVE LAYOUT WORKSPACES */}
      {!isMobile ? (
        /* ==================== DESKTOP WORKSPACE ==================== */
        <div
          className="absolute top-[40px] bottom-[110px] left-0 right-0 p-6 flex flex-row items-stretch justify-between gap-6"
          id="desktop-main-grid"
        >
          {/* Left Area: Desktop Icon Grid with wrapping */}
          <div
            className="pl-10 pt-14 flex-1 flex flex-col flex-wrap items-start justify-start gap-x-5 gap-y-7 content-start max-h-96 overflow-auto scrollbar-none selection:bg-cyan-500/20"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setActiveWindowLabel('Finder');
              }
            }}
          >
            {desktopItems.map((item, index) => (
              <DesktopIcon
                key={item.id}
                item={item}
                index={index}
              />
            ))}

            {/* Floating Settings/Wallpaper control shortcut */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              onClick={cycleWallpaper}
              className="relative flex flex-col items-center justify-center cursor-pointer select-none group w-20 sm:w-24 h-28 P-2 rounded-xl hover:bg-white/10  active:bg-white/15 border border-transparent hover:border-white/10 text-center"
              title="Ganti Wallpaper Desktop"
            >
              <div className="relative flex items-center justify-center w-11 h-11 sm:w-16 sm:h-16  text-white">
                {/* <Wallpaper size={20} className="group-hover:rotate-12 transition-transform" /> */}
                <ImageWithSkeleton src="../iconn/wallpaper.png" className="w-full h-full" alt="" />

              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-semibold text-white leading-tight text-shadow-md">
                Ganti Wallpaper
              </span>
            </motion.div>
          </div>

          {/* Right Area: Elegant widgets glass panel */}
          <div className="w-[325px] flex flex-col gap-4 shrink-0 overflow-y-auto scrollbar-none pr-1 pb-12 mask-fade-bottom">
            <DesktopWidgets time={time} onTriggerToast={triggerToast} />

            {/* Guide Card panel */}
            {/* <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="p-4 rounded-2xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 text-white shadow-xl flex items-start space-x-3"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                <Info size={16} className="animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-200">Panduan Tahoe</h4>
                <p className="text-[10px] text-slate-300 leading-normal mt-0.5">
                  Tarik window modal pada titlebar untuk memindahkan posisi secara presisi, gunakan tombol Tutup di sisi kanan atau traffic light di kiri.
                </p>
              </div>
            </motion.div> */}
          </div>
        </div>
      ) : (

        /* ==================== MOBILE WORKSPACE (iOS Home) ==================== */
        <div
          className="absolute top-0 bottom-0 left-0 right-0 px-4 pb-6"
          id="mobile-ios-container"
        >
          {/* Scrollable iOS Home Content */}
          <div className="absolute inset-0 overflow-y-auto scrollbar-none flex flex-col gap-4 pt-[60px] pb-[150px] px-4 mask-fade-mobile">
            {/* iOS Smart Stack Widgets at top */}
            <div className="w-full">
              <DesktopWidgets time={time} onTriggerToast={triggerToast} isMobile={true} />
            </div>

            {/* iOS App Icon Grid */}
            <div className="grid grid-cols-4 gap-x-2 gap-y-4 px-2 mt-1 justify-items-center">
              {desktopItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    window.open(item.url, '_blank', 'noreferrer,noopener');
                  }}
                  className="flex flex-col items-center justify-center cursor-pointer select-none active:opacity-70"
                >
                  <div className="w-[70px] h-[70px] rounded-2xl shadow-sky-500/10 shadow-lg flex items-center justify-center relative backdrop-blur-xl">
                    {/* <span className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl" /> */}
                    <div className="transform scale-110">
                      {item.id === 'tiktok' && (

                        <ImageWithSkeleton src="/iconn/tiktok.png" alt="" className="w-full h-full" />

                      )}
                      {item.id === 'instagram' && (
                        // <Insta />
                        <ImageWithSkeleton src="/iconn/instagram.png" alt="" className="w-full h-full" />

                      )}
                      {item.id === 'linkedin' && (


                        <ImageWithSkeleton src="/iconn/linkedin.png" alt="" className="w-full h-full" />

                      )}
                      {item.id === 'github' && (
                        <ImageWithSkeleton src="/iconn/github.png" alt="" className="w-full h-full" />

                      )}
                      {item.id === 'whatsapp' && (
                        <ImageWithSkeleton src="/iconn/whatsApp.png" alt="" className="w-full h-full" />

                      )}
                      {item.id === 'portfolio' && (
                        <ImageWithSkeleton src="/iconn/browser.png" alt="" className="w-full h-full" />

                      )}
                    </div>
                  </div>
                  <span className="mt-1 text-[10px] text-white font-medium text-center line-clamp-1 max-w-[65px] drop-shadow-sm">
                    {item.label}
                  </span>
                </motion.div>
              ))}

              {/* Wallpaper element on mobile grid too */}
              <div
                onClick={cycleWallpaper}
                className="flex flex-col items-center justify-center cursor-pointer select-none active:opacity-70"
              >
                <div className="w-[70px] h-[70px] rounded-2xl shadow-lg flex items-center justify-center">
                  {/* <Wallpaper size={18} className="text-white" /> */}
                  <ImageWithSkeleton src="/iconn/wallpaper.png" alt="" className="w-full h-full" />

                </div>
                <span className="mt-1 text-[10px] text-white font-medium text-center truncate w-full max-w-[65px] drop-shadow-sm">
                  Wallpaper
                </span>
              </div>
            </div>
          </div>

          {/* iOS Translucent Glass Bottom Dock (Holding WA, Safari, Spotify, Photos, Camera) */}
          <div className="absolute bottom-6 left-0 right-0 z-20 px-4 shrink-0">
            <div className="mx-auto w-full max-w-[420px] h-[78px] rounded-[28px] backdrop-blur-3xl bg-slate-900/40 border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.4)] flex items-center justify-around px-4">
              {/* Launcher 1: Phone / WhatsApp Icon */}
              <button
                onClick={() => {
                  window.open('https://wa.me/628123456789', '_blank');
                  triggerToast("💬 Menghubungi Muhammad Yazid di WhatsApp...");
                }}
                className="w-[64px] h-[64px] rounded-2xl hover:brightness-110 active:scale-90 transition-transform flex items-center justify-center shadow-lg overflow-hidden"
                title="WhatsApp"
              >
                <ImageWithSkeleton src="/iconn/whatsApp.png" alt="" className="w-full h-full" />
                {/* <WhatsApp className="w-10"/> */}
              </button>

              {/* Launcher 2: Safari Web */}
              <button
                onClick={() => handleOpenWindow('safari')}
                className="w-[64px] h-[64px] rounded-2xl  flex items-center justify-center hover:brightness-110 active:scale-90 transition-transform shadow-lg overflow-hidden"
                title="Safari"
              >
                <ImageWithSkeleton src="/iconn/safari.png" alt="" className="w-full h-full" />

              </button>

              {/* Launcher 3: Spotify Player */}
              <button
                onClick={() => handleOpenWindow('spotify')}
                className="w-[64px] h-[64px] rounded-2xl  flex items-center justify-center hover:brightness-110 active:scale-90 transition-transform shadow-lg overflow-hidden"
                title="Spotify"
              >
                {/* <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.782-8.895-.98-.336.075-.668-.135-.744-.47-.077-.336.135-.668.47-.743 3.856-.88 7.15-.502 9.822 1.13.296.18.387.563.207.857zm1.225-2.72c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.85-.107-.975-.522-.125-.413.107-.85.522-.975 3.67-1.114 8.243-.574 11.347 1.33.37.227.49.707.26 1.074zm.106-2.833C14.384 8.71 8.522 8.514 5.13 9.544c-.52.157-1.07-.143-1.226-.66-.158-.52.143-1.07.66-1.226 3.9-1.183 10.37-.954 14.43 1.456.468.278.62.882.342 1.35-.277.468-.88.62-1.35.342z"/>
                </svg> */}
                <ImageWithSkeleton src="/iconn/spotify.png" alt="" className="w-full h-full" />
              </button>

              {/* Launcher 4: Photos Gallery */}
              <button
                onClick={() => handleOpenWindow('photos')}
                className="w-[64px] h-[64px] rounded-2xl  flex items-center justify-center hover:brightness-95 active:scale-90 transition-transform shadow-lg overflow-hidden relative"
                title="Galeri"
              >
                <ImageWithSkeleton src="/iconn/photos.png" alt="" className="w-full h-full" />

              </button>

              {/* Launcher 5: Photo Booth Camera */}
              <button
                onClick={() => {
                  triggerToast("📷 Membuka Photo Booth...");
                  handleOpenWindow('camera');
                }}
                className="w-[64px] h-[64px] rounded-2xl  flex items-center justify-center hover:brightness-110 active:scale-90 transition-transform shadow-lg relative overflow-hidden"
                title="Kamera"
              >
                {/* <Camera size={18} className="text-cyan-400" /> */}
                <ImageWithSkeleton src="/iconn/camera.png" alt="" className="w-full h-full" />

              </button>
            </div>

            {/* Simulated iPhone home indicator bar */}
            <div className="w-[115px] h-[4.5px] rounded-full bg-white/45 mx-auto mt-4" />
          </div>
        </div>
      )}

      {/* ==================== FLOATING APP WINDOWS ==================== */}

      {/* 1. Finder Modal */}
      <Modal
        id="finder"
        title="Finder — Profil Muhammad Yazid"
        isOpen={openWindows.finder}
        onClose={() => handleCloseWindow('finder')}
        zIndex={zIndexStack.finder}
        onFocus={() => handleFocusWindow('finder')}
        initialWidth="640px"
        initialHeight="430px"
      >
        <FinderContent />
      </Modal>

      {/* 2. Safari Modal */}
      <Modal
        id="safari"
        title="Safari — Hub Portofolio"
        isOpen={openWindows.safari}
        onClose={() => handleCloseWindow('safari')}
        zIndex={zIndexStack.safari}
        onFocus={() => handleFocusWindow('safari')}
        initialWidth="680px"
        initialHeight="440px"
      >
        <SafariContent />
      </Modal>

      {/* 3. Spotify Modal */}
      <Modal
        id="spotify"
        title="Spotify — Ambient Coding Track"
        isOpen={openWindows.spotify}
        onClose={() => handleCloseWindow('spotify')}
        zIndex={zIndexStack.spotify}
        onFocus={() => handleFocusWindow('spotify')}
        initialWidth="500px"
        initialHeight="380px"
      >
        <SpotifyPlayer />
      </Modal>

      {/* 4. Photos Gallery Modal */}
      <Modal
        id="photos"
        // title="Photo"
        isOpen={openWindows.photos}
        onClose={() => handleCloseWindow('photos')}
        zIndex={zIndexStack.photos}
        onFocus={() => handleFocusWindow('photos')}
        initialWidth="580px"
        initialHeight="400px"
      >
        <PhotoGallery />
      </Modal>

      {/* 5. Sticky Note Modal */}
      <Modal
        id="notes"
        title="Sticky Notes"
        isOpen={openWindows.notes}
        onClose={() => handleCloseWindow('notes')}
        zIndex={zIndexStack.notes}
        onFocus={() => handleFocusWindow('notes')}
        initialWidth="380px"
        initialHeight="330px"
      >
        <StickyNote />
      </Modal>

      {/* 6. Camera Modal */}
      <Modal
        id="camera"
        title="Photo Booth — Kamera Efek"
        isOpen={openWindows.camera}
        onClose={() => handleCloseWindow('camera')}
        zIndex={zIndexStack.camera}
        onFocus={() => handleFocusWindow('camera')}
        initialWidth="680px"
        initialHeight="640px"
        resizable={true}
        minWidth={420}
        minHeight={480}
        maxWidth={960}
        maxHeight={800}
      >
        <CameraContent />
      </Modal>

      {/* Global Toast Alert Layer */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* macOS Dock Bottom Navigation (Only visible on desktop/wide viewports to clear space for iOS layout) */}
      {!isMobile && (
        <Dock
          onOpenWindow={handleOpenWindow}
          openWindows={openWindows}
          onTriggerToast={triggerToast}
        />
      )}
    </div>
  );
}
