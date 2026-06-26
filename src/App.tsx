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
import { LeftWidgets } from './components/LeftWidgets';
import { RightWidgets } from './components/RightWidgets';
import DarkVeil from './components/DarkVeil';
import Grainient from './components/Grainient';
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
      label: 'TikTok',
      iconName: 'tiktok',
      url: 'https://tiktok.com/@yaziddev',
      tooltip: 'My Profil TikTok',
      accentColor: ''
    },
    {
      id: 'instagram',
      label: 'Instagram',
      iconName: 'instagram',
      url: 'https://instagram.com/yzdfrmnsh',
      tooltip: 'Sapa Saya di Instagram',
      accentColor: ''
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      iconName: 'linkedin',
      url: 'https://linkedin.com/in/m-yazid-ilmany-firmansyah/',
      tooltip: 'Connect di LinkedIn',
      accentColor: ''
    },
    {
      id: 'github',
      label: 'GitHub',
      iconName: 'github',
      url: 'https://github.com/yzdfrmnsh4',
      tooltip: 'Lihat Repositori & Kontribusi Kode',
      accentColor: ''
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      iconName: 'whatsapp',
      url: 'https://wa.me/628818208207',
      tooltip: 'Diskusikan Proyek Anda via WhatsApp',
      accentColor: ''
    },
    {
      id: 'portfolio',
      label: 'Portofolio',
      iconName: 'portfolio',
      url: 'https://yazidcodes.site',
      tooltip: 'Kunjungi Website Portofolio saya',
      accentColor: ''
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
    "/spiderr.jpeg", // Clear reflections
    "/wallpaper.jpg", // Emerald Bay Lake Tahoe (turquoise)
    "/wallpaper-dark.jpg"  // Starry mountains
  ];
  const [currentWallpaperIdx, setCurrentWallpaperIdx] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isWallpaperHovered, setIsWallpaperHovered] = useState<boolean>(false);

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
      {/* Desktop Background Wallpaper Options (Comment/Uncomment to switch) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* --- OPTION 1: Static Image Wallpaper (uses the wallpapers array) --- */}
        <img 
          src={wallpapers[currentWallpaperIdx]} 
          alt="Desktop Wallpaper" 
          className="w-full h-full object-cover" 
        />

        {/* --- OPTION 2: Live WebGL Gradient (Grainient) --- */}
        {/* <Grainient
          color1="#05f8ff"
          color2="#ffffff"
          color3="#0ef6ff"
          timeSpeed={0.25}
          colorBalance={0.0}
          warpStrength={1.0}
          warpFrequency={5.0}
          warpSpeed={2.0}
          warpAmplitude={50.0}
          blendAngle={0.0}
          blendSoftness={0.05}
          rotationAmount={500.0}
          noiseScale={2.0}
          grainAmount={0.1}
          grainScale={2.0}
          grainAnimated={false}
          contrast={1.5}
          gamma={1.0}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.9}
        /> */}

        {/* --- OPTION 3: Live WebGL Liquid Glass (DarkVeil) --- */}
        {/* <DarkVeil
          hueShift={currentWallpaperIdx * 120}
          noiseIntensity={0.03}
          scanlineIntensity={0.05}
          speed={0.35}
          scanlineFrequency={0.0}
          warpAmount={0.05}
          resolutionScale={0.8}
        /> */}
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
          {/* Left Column: Left Widgets (Spiderman Theme) */}
          <div className="w-[320px] flex flex-col gap-4 shrink-0 overflow-y-auto scrollbar-none pl-1 pb-12 mask-fade-bottom animate-fade-in">
            <LeftWidgets time={time} />
          </div>

          {/* Center Area: Empty Spacer for Spiderman Wallpaper */}
          <div
            className="flex-1"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setActiveWindowLabel('Finder');
              }
            }}
          />

          {/* Right Column: Right Widgets (Spiderman Theme) */}
          <div className="w-[320px] flex flex-col gap-4 shrink-0 overflow-y-auto scrollbar-none pr-1 pb-12 mask-fade-bottom animate-fade-in">
            <RightWidgets time={time} />
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
            <div className="grid grid-cols-4 gap-x-2 gap-y-4 px-0  mt-1 mb-2 justify-between items-center  w-full max-w-[420px] mx-auto">
              {desktopItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    window.open(item.url, '_blank', 'noreferrer,noopener');
                  }}
                  className="flex flex-col items-center justify-center cursor-pointer select-none active:opacity-70  "
                >
                  <div className="w-[76px] h-[76px] rounded-2xl  flex items-center justify-center relative backdrop-blur-xl">
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
                        <ImageWithSkeleton src="/web-app-manifest-512x512.png" alt="" className="w-full h-full" />

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
          <div className="absolute bottom-6 left-0 right-0 z-20 px-4 shrink-0 ">
            <div className="mx-auto w-full max-w-[420px] h-[78px] rounded-[20px] backdrop-blur-2xl  border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.4)] flex items-center justify-between px-2 py-2 mb-7">
              {/* Launcher 1: Phone / WhatsApp Icon */}
              <button
                onClick={() => {
                  window.open('https://wa.me/628818208207', '_blank');
                  triggerToast("💬 Menghubungi Muhammad Yazid di WhatsApp...");
                }}
                className="w-[80px] h-[80px] rounded-2xl hover:brightness-110  transition-transform flex items-center justify-center  overflow-hidden"
                title="WhatsApp"
              >
                <ImageWithSkeleton src="/iconn/iMessage.png" alt="" className="w-full h-full" />
                {/* <WhatsApp className="w-10"/> */}
              </button>

              {/* Launcher 2: Safari Web */}
              <button
                onClick={() => handleOpenWindow('safari')}
                className="w-[80px] h-[80px] rounded-2xl  flex items-center justify-center hover:brightness-110  transition-transform  overflow-hidden"
                title="Safari"
              >
                <ImageWithSkeleton src="/iconn/safari-dark.png" alt="" className="w-full h-full" />

              </button>

              {/* Launcher 3: Spotify Player */}
              {/* <button
                onClick={() => handleOpenWindow('spotify')}
                className="w-[80px] h-[80px] rounded-2xl  flex items-center justify-center hover:brightness-110 active:scale-90 transition-transform shadow-lg overflow-hidden"
                title="Spotify"
              >
                
                <ImageWithSkeleton src="/iconn/spotify.png" alt="" className="w-full h-full" />
              </button> */}

              {/* Launcher 4: Photos Gallery */}
              <button
                onClick={() => handleOpenWindow('photos')}
                className="w-[80px] h-[80px] rounded-2xl  flex items-center justify-center hover:brightness-95  transition-transform  overflow-hidden relative"
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
                className="w-[80px] h-[80px] rounded-2xl  flex items-center justify-center hover:brightness-110 active:scale-90 transition-transform  relative overflow-hidden"
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
        title="Photo Booth"
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
        noPadding={true}
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
          onCycleWallpaper={cycleWallpaper}
        />
      )}
    </div>
  );
}
