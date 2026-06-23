import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, 
  Download, 
  RefreshCw, 
  Sparkles, 
  AlertTriangle, 
  Trash2, 
  CameraOff, 
  LayoutGrid,
  User,
  X
} from 'lucide-react';

interface CapturedItem {
  id: string;
  dataUrl: string; // Base64 for photo
  timestamp: string;
  filter: string;
}

const FILTER_PRESETS = [
  { id: 'normal', name: 'Normal', css: '' },
  { id: 'grayscale', name: 'Grayscale', css: 'grayscale' },
  { id: 'sepia', name: 'Sepia', css: 'sepia' },
  { id: 'vintage', name: 'Vintage', css: 'sepia contrast-[1.15] saturate-[1.3] brightness-[0.95]' },
  { id: 'vaporwave', name: 'Cyber Neon', css: 'hue-rotate-[130deg] saturate-[1.8] contrast-[1.2]' },
  { id: 'cobalt', name: 'Cobalt Chill', css: 'hue-rotate-[210deg] saturate-[1.4] contrast-[1.1]' },
  { id: 'invert', name: 'Invert Tech', css: 'invert' },
  { id: 'blur', name: 'Dream Blur', css: 'blur-[2px]' },
  { id: 'pixelate', name: 'Retro Pixel', css: 'contrast-[1.4] saturate-[1.2] brightness-[1.1]' }
];

export const CameraContent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [capturedItems, setCapturedItems] = useState<CapturedItem[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(false);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);

  // Mode Selection ('single' or 'grid')
  const [mode, setMode] = useState<'grid' | 'single'>('single');
  const [isEffectsOpen, setIsEffectsOpen] = useState<boolean>(false);

  // 4-shot series capture states
  const [isSeriesCapturing, setIsSeriesCapturing] = useState<boolean>(false);
  const [seriesCountdown, setSeriesCountdown] = useState<number>(0);
  const [seriesPhotoIndex, setSeriesPhotoIndex] = useState<number>(0);
  const [temporarySeriesPhotos, setTemporarySeriesPhotos] = useState<string[]>([]);

  // Simulator procedural frames
  const simulatorFrameRef = useRef<number>(0);

  // Load items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mac_tahoe_camera_items');
    if (saved) {
      try {
        setCapturedItems(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const saveItems = (updated: CapturedItem[]) => {
    setCapturedItems(updated);
    localStorage.setItem('mac_tahoe_camera_items', JSON.stringify(updated));
  };

  // Shutter Sound synth
  const playShutterSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      // safe fallback
    }
  };

  // Sound prompt played during countdown ticks
  const playTickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch (e) { }
  };

  // Setup actual webcam stream
  const startCamera = async () => {
    setCameraError(null);
    setIsSimulatorMode(false);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn("Camera access failed, falling back to simulator:", err);
      setCameraError("Kamera fisik tidak terdeteksi. Mengaktifkan Mode Simulator Kamera!");
      setIsSimulatorMode(true);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Procedural simulator drawing logic
  const drawSimulatorFrame = (ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) => {
    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Wave animations
    const timeVal = frame * 0.04;
    for (let y = 0; y < height; y += 8) {
      const offset = Math.sin(y * 0.008 + timeVal) * 110;
      ctx.fillStyle = `rgba(168, 85, 247, ${0.12 + Math.sin(y * 0.015) * 0.04})`;
      ctx.fillRect(width / 2 - 160 + offset, y, 320, 4);
    }

    // Outer face oval
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 20, 110, 0, Math.PI * 2);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(width / 2 - 40, height / 2 - 50, 10, 0, Math.PI * 2);
    ctx.arc(width / 2 + 40, height / 2 - 50, 10, 0, Math.PI * 2);
    ctx.fill();

    // Smile mouth
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 45, 0.1 * Math.PI, 0.9 * Math.PI, false);
    ctx.stroke();

    // Guides
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(width / 2 - 140, height / 2 - 150, 280, 280);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(width / 2 - 145, height / 2 - 155, 25, 4);
    ctx.fillRect(width / 2 - 145, height / 2 - 155, 4, 25);
    ctx.fillRect(width / 2 + 120, height / 2 - 155, 25, 4);
    ctx.fillRect(width / 2 + 141, height / 2 - 155, 4, 25);

    ctx.fillRect(width / 2 - 145, height / 2 + 126, 25, 4);
    ctx.fillRect(width / 2 - 145, height / 2 + 105, 4, 25);
    ctx.fillRect(width / 2 + 120, height / 2 + 126, 25, 4);
    ctx.fillRect(width / 2 + 141, height / 2 + 105, 4, 25);

    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText("PHOTO BOOTH", width / 2, height / 2 + 50);

    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#c084fc';
    ctx.fillText("SYS_WEBCAM_ONLINE", width / 2, height / 2 + 85);
  };

  // High-performance canvas drawing loop for simulator mode
  useEffect(() => {
    let animId: number;
    if (isSimulatorMode && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 640;
      canvas.height = 480;
      let frame = 0;
      
      const render = () => {
        if (ctx) {
          drawSimulatorFrame(ctx, 640, 480, frame);
        }
        frame++;
        simulatorFrameRef.current = frame;
        animId = requestAnimationFrame(render);
      };
      animId = requestAnimationFrame(render);
    }
    return () => cancelAnimationFrame(animId);
  }, [isSimulatorMode]);

  // Apply Filter to Canvas helper
  const applyCanvasFilter = (ctx: CanvasRenderingContext2D, width: number, height: number, filter: string) => {
    if (filter === 'grayscale') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        data[i] = avg;
        data[i+1] = avg;
        data[i+2] = avg;
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filter === 'sepia') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filter === 'vintage') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        data[i] = Math.min(255, (r * 0.393 + g * 0.769 + b * 0.189) * 1.05);
        data[i+1] = Math.min(255, (r * 0.349 + g * 0.686 + b * 0.168) * 0.95);
        data[i+2] = Math.min(255, (r * 0.272 + g * 0.534 + b * 0.131) * 0.85);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filter === 'invert') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filter === 'pixelate') {
      const size = 10;
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
          const redIndex = (y * width + x) * 4;
          const r = data[redIndex];
          const g = data[redIndex + 1];
          const b = data[redIndex + 2];
          const a = data[redIndex + 3];

          for (let dy = 0; dy < size; dy++) {
            for (let dx = 0; dx < size; dx++) {
              if (x + dx < width && y + dy < height) {
                const targetIndex = ((y + dy) * width + (x + dx)) * 4;
                data[targetIndex] = r;
                data[targetIndex + 1] = g;
                data[targetIndex + 2] = b;
                data[targetIndex + 3] = a;
              }
            }
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filter === 'cobalt') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 0.4);
        data[i+1] = Math.min(255, data[i+1] * 0.7);
        data[i+2] = Math.min(255, data[i+2] * 1.3);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filter === 'vaporwave') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        data[i] = Math.min(255, r * 1.1 + 40);
        data[i+1] = Math.min(255, g * 0.7 + 10);
        data[i+2] = Math.min(255, b * 1.2 + 80);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filter === 'blur') {
      ctx.filter = 'blur(3px)';
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(ctx.canvas, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(tempCanvas, 0, 0);
      }
      ctx.filter = 'none';
    }
  };

  // Capture a single frame
  const captureRawFrame = (): string | null => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 640;
    tempCanvas.height = 480;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return null;

    if (!isSimulatorMode && videoRef.current) {
      tempCtx.save();
      if (isMirrored) {
        tempCtx.translate(640, 0);
        tempCtx.scale(-1, 1);
      }
      tempCtx.drawImage(videoRef.current, 0, 0, 640, 480);
      tempCtx.restore();
    } else if (canvasRef.current) {
      const currentFrame = simulatorFrameRef.current;
      drawSimulatorFrame(tempCtx, 640, 480, currentFrame);
    } else {
      return null;
    }

    applyCanvasFilter(tempCtx, 640, 480, activeFilter);
    return tempCanvas.toDataURL('image/png');
  };

  // Take a single photo
  const captureSinglePhoto = () => {
    playShutterSound();
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    const dataUrl = captureRawFrame();
    if (!dataUrl) return;

    const newItem: CapturedItem = {
      id: Date.now().toString(),
      dataUrl,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      filter: FILTER_PRESETS.find(f => f.id === activeFilter)?.name || 'Normal'
    };

    const updated = [newItem, ...capturedItems];
    saveItems(updated);
  };

  // Stitch 4 photos in a 2x2 grid
  const handleStitchGrid = async (photos: string[]) => {
    if (photos.length < 4) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const w = 320;
    const h = 240;
    const coords = [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: 0, y: h },
      { x: w, y: h }
    ];
    
    const loadImg = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };
    
    try {
      const imgs = await Promise.all(photos.map(loadImg));
      imgs.forEach((img, idx) => {
        ctx.drawImage(img, coords[idx].x, coords[idx].y, w, h);
      });
      
      const gridDataUrl = canvas.toDataURL('image/png');
      
      const newPhoto: CapturedItem = {
        id: Date.now().toString(),
        dataUrl: gridDataUrl,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        filter: '4-Shot Grid'
      };
      
      const updated = [newPhoto, ...capturedItems];
      saveItems(updated);
    } catch (err) {
      console.error("Gagal menggabungkan foto grid:", err);
    }
  };

  // Start 4-shot grid sequence capture
  const startPhotoboothSeriesCapture = () => {
    if (isSeriesCapturing) return;
    setIsSeriesCapturing(true);
    setSeriesPhotoIndex(0);
    setTemporarySeriesPhotos([]);
    setSeriesCountdown(3);
    playTickSound();
  };

  // Countdown timer handler for grid capture sequence
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isSeriesCapturing && seriesCountdown > 0) {
      timerId = setTimeout(() => {
        const nextSec = seriesCountdown - 1;
        setSeriesCountdown(nextSec);
        if (nextSec > 0) {
          playTickSound();
        }
      }, 1000);
    } else if (isSeriesCapturing && seriesCountdown === 0) {
      playShutterSound();
      setIsFlashActive(true);
      setTimeout(() => setIsFlashActive(false), 180);

      const dataUrl = captureRawFrame();
      if (dataUrl) {
        const currentPhotos = [...temporarySeriesPhotos, dataUrl];
        setTemporarySeriesPhotos(currentPhotos);

        const nextPhotoIndex = seriesPhotoIndex + 1;
        if (nextPhotoIndex < 4) {
          setSeriesPhotoIndex(nextPhotoIndex);
          setTimeout(() => {
            setSeriesCountdown(3);
            playTickSound();
          }, 1200);
        } else {
          setIsSeriesCapturing(false);
          handleStitchGrid(currentPhotos);
        }
      } else {
        setIsSeriesCapturing(false);
      }
    }

    return () => clearTimeout(timerId);
  }, [isSeriesCapturing, seriesCountdown]);

  // Delete item
  const deleteItem = (id: string) => {
    const updated = capturedItems.filter(p => p.id !== id);
    saveItems(updated);
  };

  // Download item
  const downloadItem = (item: CapturedItem) => {
    const link = document.createElement('a');
    link.href = item.dataUrl;
    link.download = `PhotoBooth_Image_${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShutterClick = () => {
    if (mode === 'grid') {
      startPhotoboothSeriesCapture();
    } else {
      captureSinglePhoto();
    }
  };

  const activePreset = FILTER_PRESETS.find(f => f.id === activeFilter);

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-slate-100 font-sans select-none overflow-hidden rounded-b-2xl">
      
      {/* 1. Bezel & Viewfinder Display */}
      <div className="relative flex-1 bg-black flex flex-col items-center justify-center overflow-hidden group border-b border-zinc-900/60 min-h-[260px]">
        
        {/* Apple iMac style Bezel Green Cam LED Indicator */}
        <div className="absolute top-2.5 w-full flex justify-center items-center pointer-events-none z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${!isSimulatorMode ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-zinc-700'} transition-colors duration-300`} />
        </div>

        {/* Viewfinder Preview */}
        {!isSimulatorMode ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
            className={`w-full h-full object-cover transition-all duration-300 ${activePreset?.css || ''}`}
          />
        ) : (
          <canvas
            ref={canvasRef}
            style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
            className={`w-full h-full object-cover transition-all duration-300 ${activePreset?.css || ''}`}
          />
        )}

        {/* Flash Flare */}
        {isFlashActive && (
          <div className="absolute inset-0 bg-white z-40 transition-none" />
        )}

        {/* Shutter Grid Countdown Overlay */}
        {isSeriesCapturing && seriesCountdown > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 text-white animate-fade-in">
            <div className="bg-white/10 border border-white/20 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full mb-3 uppercase text-purple-300 backdrop-blur-md">
              Pose {seriesPhotoIndex + 1} dari 4
            </div>
            <div className="text-7xl font-extrabold tracking-tighter text-white animate-[ping_1.2s_infinite]">
              {seriesCountdown}
            </div>
          </div>
        )}

        {/* Camera Info HUD */}
        <div className="absolute top-4 right-4 bg-black/75 border border-white/10 px-2.5 py-0.5 rounded-full text-[9px] font-semibold text-zinc-400 tracking-wider z-10 flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isSimulatorMode ? 'bg-amber-400' : 'bg-cyan-400'}`} />
          <span>{isSimulatorMode ? 'SIMULATOR' : 'WEBCAM'}</span>
        </div>

        {/* Camera Error / Fallback Alert Overlay */}
        {cameraError && (
          <div className="absolute bottom-4 left-4 right-4 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md rounded-xl p-2.5 text-[10px] text-amber-300 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <AlertTriangle size={13} className="shrink-0" />
              <span className="leading-snug">{cameraError}</span>
            </div>
            <button 
              onClick={startCamera} 
              className="text-[9px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-white px-2 py-0.5 rounded transition-all cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* 3x3 Effects Grid Popup Panel Overlay */}
        {isEffectsOpen && (
          <div className="absolute inset-0 bg-zinc-950/95 z-30 flex flex-col p-4 backdrop-blur-md animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pilih Efek Kamera</span>
              <button 
                onClick={() => setIsEffectsOpen(false)}
                className="w-6 h-6 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>

            {/* Effects 3x3 Grid */}
            <div className="grid grid-cols-3 gap-3 flex-1 overflow-y-auto pr-0.5 scrollbar-thin select-none">
              {FILTER_PRESETS.map((preset) => {
                const isSelected = activeFilter === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setActiveFilter(preset.id);
                      setIsEffectsOpen(false);
                    }}
                    className={`bg-zinc-900/60 border rounded-lg p-1.5 flex flex-col items-center justify-between hover:bg-zinc-800/80 hover:border-purple-500/50 transition-all cursor-pointer group ${
                      isSelected ? 'border-purple-500 bg-purple-950/20' : 'border-white/5'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] rounded overflow-hidden bg-zinc-800 shadow-inner">
                      <img
                        src="/preset.jpeg"
                        alt={preset.name}
                        className={`w-full h-full object-cover grayscale-[10%] ${preset.css}`}
                      />
                    </div>
                    <span className="text-[9px] font-semibold text-zinc-300 mt-1 truncate max-w-full text-center">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* macOS Photo Booth style pagination dots Indicator */}
            <div className="flex justify-center items-center gap-1.5 mt-3 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.2 h-1.2 rounded-full bg-zinc-700" />
              <span className="w-1.2 h-1.2 rounded-full bg-zinc-700" />
            </div>
          </div>
        )}

      </div>

      {/* 2. Filmstrip horizontal scrolling gallery (only shown if user has captured items) */}
      {capturedItems.length > 0 && (
        <div className="bg-zinc-950/80 border-b border-zinc-900/80 py-1.5 px-4 overflow-x-auto whitespace-nowrap flex items-center gap-2.5 scrollbar-thin select-none h-[60px] shrink-0">
          {capturedItems.map((item) => (
            <div 
              key={item.id}
              className="group relative w-[64px] h-[48px] rounded-lg overflow-hidden border border-zinc-900 bg-zinc-900 aspect-[4/3] shadow-md hover:border-purple-500/40 transition-all shrink-0"
            >
              <img 
                src={item.dataUrl} 
                alt="Snapshot" 
                className="w-full h-full object-cover"
              />

              {/* Hover Actions overlay */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-10">
                <button
                  onClick={() => downloadItem(item)}
                  className="w-5 h-5 rounded-full bg-purple-500 text-white hover:bg-purple-400 flex items-center justify-center transition-all shadow-md cursor-pointer"
                  title="Unduh"
                >
                  <Download size={8} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="w-5 h-5 rounded-full bg-rose-500 text-white hover:bg-rose-400 flex items-center justify-center transition-all shadow-md cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 size={8} />
                </button>
              </div>

              {/* Small filter timestamp badge */}
              <div className="absolute bottom-0.5 right-1 bg-black/75 border border-white/5 px-0.5 py-px rounded text-[5px] font-medium text-zinc-400 tracking-wide select-none">
                {item.filter}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Bottom Controls Dashboard */}
      <div className="bg-zinc-900/90 border-t border-zinc-800/40 px-6 py-2 flex items-center justify-between shrink-0 select-none">
        
        {/* Left Side: Mode selectors */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/5 p-1 rounded-xl shadow-inner shrink-0">
          <button
            onClick={() => setMode('grid')}
            disabled={isSeriesCapturing}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              mode === 'grid' 
                ? 'bg-zinc-800 text-white border border-white/10 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'
            } ${isSeriesCapturing ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Mode 4-Shot Grid Collage"
          >
            <LayoutGrid size={15} />
          </button>
          
          <button
            onClick={() => setMode('single')}
            disabled={isSeriesCapturing}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              mode === 'single' 
                ? 'bg-zinc-800 text-white border border-white/10 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'
            } ${isSeriesCapturing ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Mode Single Shot Photo"
          >
            <User size={15} />
          </button>
        </div>

        {/* Center: Red Circular Shutter Button */}
        <div className="flex items-center justify-center">
          <div className="p-1 bg-white/10 rounded-full border border-white/5 shadow-inner">
            <button
              onClick={handleShutterClick}
              disabled={isSeriesCapturing}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)] ${
                isSeriesCapturing ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title="Ambil Foto"
            >
              <Camera size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Right Side: Effects Access Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={() => setIsEffectsOpen(!isEffectsOpen)}
            disabled={isSeriesCapturing}
            className={`px-3.5 py-1.5 rounded-lg border text-[11px] font-bold tracking-wide transition-all active:scale-95 cursor-pointer ${
              isEffectsOpen
                ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 shadow-sm'
                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200 hover:text-white shadow-md'
            } ${isSeriesCapturing ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Pilih efek dan filter kamera"
          >
            Effects
          </button>
        </div>

      </div>

    </div>
  );
};
