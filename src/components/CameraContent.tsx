import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, 
  Download, 
  RefreshCw, 
  Sparkles, 
  AlertTriangle, 
  Image as ImageIcon, 
  Sliders, 
  Trash2, 
  CameraOff, 
  Eye, 
  Printer, 
  RotateCcw,
  Check,
  Type
} from 'lucide-react';

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  filter: string;
}

const FILTER_PRESETS = [
  { id: 'normal', name: 'Normal', css: '' },
  { id: 'grayscale', name: 'Grayscale', css: 'grayscale' },
  { id: 'sepia', name: 'Sepia', css: 'sepia' },
  { id: 'vintage', name: 'Vintage Warm', css: 'sepia contrast-[1.15] saturate-[1.3] brightness-[0.95]' },
  { id: 'vaporwave', name: 'Cyber Neon', css: 'hue-rotate-[130deg] saturate-[1.8] contrast-[1.2]' },
  { id: 'cobalt', name: 'Cobalt Chill', css: 'hue-rotate-[210deg] saturate-[1.4] contrast-[1.1]' },
  { id: 'invert', name: 'Invert Tech', css: 'invert' },
  { id: 'blur', name: 'Dream Blur', css: 'blur-[2px]' },
  { id: 'pixelate', name: 'Retro Pixel', css: 'contrast-[1.4] saturate-[1.2] brightness-[1.1]' }
];

export const CameraContent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const compositeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(false);
  const [simulatorFrame, setSimulatorFrame] = useState<number>(0);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);

  // States for 4-shot automated loop (classic Photobooth style)
  const [isSeriesCapturing, setIsSeriesCapturing] = useState<boolean>(false);
  const [seriesCountdown, setSeriesCountdown] = useState<number>(0);
  const [seriesPhotoIndex, setSeriesPhotoIndex] = useState<number>(0);
  const [temporarySeriesPhotos, setTemporarySeriesPhotos] = useState<string[]>([]);

  // Text template editor for the printable strip (matching user's uploaded image style)
  const [stripTitle, setStripTitle] = useState<string>('Chief Executive Officer');
  const [stripSubtitle, setStripSubtitle] = useState<string>('at Linkedist from 2019');
  const [stripTags, setStripTags] = useState<string>('Ambitious • Strategic • Curious');
  const [paperColor, setPaperColor] = useState<string>('#faf9f6'); // Clean warm off-white / ivory

  // Load photos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mac_tahoe_camera_photos');
    if (saved) {
      try {
        setCapturedPhotos(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const savePhotos = (updated: CapturedPhoto[]) => {
    setCapturedPhotos(updated);
    localStorage.setItem('mac_tahoe_camera_photos', JSON.stringify(updated));
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

  // Simulator Mode Loop for procedural movement
  useEffect(() => {
    let animId: number;
    if (isSimulatorMode) {
      const render = () => {
        setSimulatorFrame(prev => prev + 1);
        animId = requestAnimationFrame(render);
      };
      animId = requestAnimationFrame(render);
    }
    return () => cancelAnimationFrame(animId);
  }, [isSimulatorMode]);

  // Audio snapshot click synth
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

  // Actual single-shot capture subroutine
  const captureRawFrame = (): string | null => {
    if (!canvasRef.current) return null;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const width = 640;
    const height = 480;
    canvas.width = width;
    canvas.height = height;

    // Draw frame
    if (!isSimulatorMode && videoRef.current) {
      ctx.save();
      if (isMirrored) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      ctx.restore();
    } else {
      // Render beautiful interactive simulated live face tracking graphic
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Draw synthetic ambient background waves
      const timeVal = simulatorFrame * 0.04;
      for (let y = 0; y < height; y += 5) {
        const offset = Math.sin(y * 0.008 + timeVal) * 110;
        ctx.fillStyle = `rgba(168, 85, 247, ${0.12 + Math.sin(y * 0.015) * 0.04})`;
        ctx.fillRect(width / 2 - 160 + offset, y, 320, 3);
      }

      // Modern face contour silhouette (smiling outline)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Outer face oval
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

      // Cyber tech guides
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1;
      ctx.strokeRect(width / 2 - 140, height / 2 - 150, 280, 280);

      // Tech target corners green
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(width / 2 - 145, height / 2 - 155, 25, 4);
      ctx.fillRect(width / 2 - 145, height / 2 - 155, 4, 25);
      ctx.fillRect(width / 2 + 120, height / 2 - 155, 25, 4);
      ctx.fillRect(width / 2 + 141, height / 2 - 155, 4, 25);

      ctx.fillStyle = '#22c55e';
      ctx.fillRect(width / 2 - 145, height / 2 + 126, 25, 4);
      ctx.fillRect(width / 2 - 145, height / 2 + 105, 4, 25);
      ctx.fillRect(width / 2 + 120, height / 2 + 126, 25, 4);
      ctx.fillRect(width / 2 + 141, height / 2 + 105, 4, 25);

      ctx.font = 'bold 36px font-sans';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText("PHOTOBOOTH", width / 2, height / 2 + 50);

      ctx.font = '12px font-mono';
      ctx.fillStyle = '#c084fc';
      ctx.fillText("SYS_WEBCAM_ONLINE", width / 2, height / 2 + 80);
    }

    // Apply Filter to Canvas
    const selectedPreset = FILTER_PRESETS.find(f => f.id === activeFilter);
    if (selectedPreset) {
      if (activeFilter === 'grayscale') {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
          data[i] = avg;
          data[i+1] = avg;
          data[i+2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);
      } else if (activeFilter === 'sepia') {
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
      } else if (activeFilter === 'vintage') {
        // Soft warm nostalgic overlay
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          // Mix sepia and boost warm tones
          data[i] = Math.min(255, (r * 0.393 + g * 0.769 + b * 0.189) * 1.05);
          data[i+1] = Math.min(255, (r * 0.349 + g * 0.686 + b * 0.168) * 0.95);
          data[i+2] = Math.min(255, (r * 0.272 + g * 0.534 + b * 0.131) * 0.85);
        }
        ctx.putImageData(imgData, 0, 0);
      } else if (activeFilter === 'invert') {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i+1] = 255 - data[i+1];
          data[i+2] = 255 - data[i+2];
        }
        ctx.putImageData(imgData, 0, 0);
      } else if (activeFilter === 'pixelate') {
        // Vintage camera blockiness pixelation
        const size = 12;
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
      } else if (activeFilter === 'cobalt') {
        // Cold blue filter tint
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 0.4);
          data[i+1] = Math.min(255, data[i+1] * 0.7);
          data[i+2] = Math.min(255, data[i+2] * 1.3);
        }
        ctx.putImageData(imgData, 0, 0);
      } else if (activeFilter === 'vaporwave') {
        // Dreamy purple & hot cyan tint
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
      }
    }

    return canvas.toDataURL('image/png');
  };

  // Actions: Capture a Single Free Photo
  const captureSinglePhoto = () => {
    // Shutter flare + sound
    playShutterSound();
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    const dataUrl = captureRawFrame();
    if (!dataUrl) return;

    const newPhoto: CapturedPhoto = {
      id: Date.now().toString(),
      dataUrl,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      filter: FILTER_PRESETS.find(f => f.id === activeFilter)?.name || 'Normal'
    };

    const updated = [newPhoto, ...capturedPhotos];
    savePhotos(updated);
  };

  // Actions: Automated 4-shot photobooth strip trigger!
  const startPhotoboothSeriesCapture = () => {
    if (isSeriesCapturing) return;
    
    setIsSeriesCapturing(true);
    setSeriesPhotoIndex(0);
    setTemporarySeriesPhotos([]);
    setSeriesCountdown(3);
    playTickSound();
  };

  // Cascade countdown timer loop for the 4-shot system
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isSeriesCapturing && seriesCountdown > 0) {
      // Periodic count down
      timerId = setTimeout(() => {
        const nextSec = seriesCountdown - 1;
        setSeriesCountdown(nextSec);
        if (nextSec > 0) {
          playTickSound();
        }
      }, 1000);
    } else if (isSeriesCapturing && seriesCountdown === 0) {
      // SNAP TRIGGER!
      playShutterSound();
      setIsFlashActive(true);
      setTimeout(() => setIsFlashActive(false), 180);

      const dataUrl = captureRawFrame();
      if (dataUrl) {
        const currentPhotos = [...temporarySeriesPhotos, dataUrl];
        setTemporarySeriesPhotos(currentPhotos);

        // Record it to the general gallery as well so they have backup individual copies
        const newPhoto: CapturedPhoto = {
          id: `${Date.now()}_idx_${seriesPhotoIndex}`,
          dataUrl,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          filter: FILTER_PRESETS.find(f => f.id === activeFilter)?.name || 'Normal'
        };
        setCapturedPhotos(prev => [newPhoto, ...prev]);

        const nextPhotoIndex = seriesPhotoIndex + 1;
        if (nextPhotoIndex < 4) {
          // Prepare next photo after short break
          setSeriesPhotoIndex(nextPhotoIndex);
          setTimeout(() => {
            setSeriesCountdown(3);
            playTickSound();
          }, 1200);
        } else {
          // Process finish and save to localStorage
          setIsSeriesCapturing(false);
          // Persist the combined general queue
          localStorage.setItem('mac_tahoe_camera_photos', JSON.stringify([newPhoto, ...capturedPhotos]));
        }
      } else {
        setIsSeriesCapturing(false);
      }
    }

    return () => clearTimeout(timerId);
  }, [isSeriesCapturing, seriesCountdown]);

  // Delete mechanisms
  const deletePhoto = (id: string) => {
    const updated = capturedPhotos.filter(p => p.id !== id);
    savePhotos(updated);
  };

  const clearGallery = () => {
    if (window.confirm("Hapus seluruh folder galeri foto Anda?")) {
      savePhotos([]);
      setTemporarySeriesPhotos([]);
    }
  };

  // Single downloading helper
  const downloadPhoto = (photo: CapturedPhoto) => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `Photobooth_${photo.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Collage composite generation algorithm (2x2 grid, gorgeous metadata section below)
  const downloadStitchedStrip = () => {
    // Determine which pictures to use for the strip
    // If we just captured a 4-shot series, use those
    // Otherwise, grab the 4 newest items in capturedPhotos
    let photosToStitch: string[] = [];
    
    if (temporarySeriesPhotos.length === 4) {
      photosToStitch = [...temporarySeriesPhotos];
    } else if (capturedPhotos.length >= 4) {
      photosToStitch = capturedPhotos.slice(0, 4).map(p => p.dataUrl);
    } else if (capturedPhotos.length > 0) {
      // Replicate the latest photos to fill up the 4 boxes easily
      const len = capturedPhotos.length;
      for (let i = 0; i < 4; i++) {
        photosToStitch.push(capturedPhotos[i % len].dataUrl);
      }
    } else {
      alert("Harap ambil minimal 1 foto terlebih dahulu!");
      return;
    }

    const canvas = compositeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Output dimension calculations (High Resolution print scale)
    const baseWidth = 800;
    const baseHeight = 1000;
    
    canvas.width = baseWidth;
    canvas.height = baseHeight;

    // 1. Draw elegant ivory textured background card
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Subtle ivory card soft gradient effect to mimic premium real paper stock
    const grad = ctx.createLinearGradient(0, 0, 0, baseHeight);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.02)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Draw card margins
    const margin = 40;
    const gap = 20;
    const photoWidth = (baseWidth - (margin * 2) - gap) / 2;
    const photoHeight = photoWidth * 0.75; // preserves 4:3 native ratio of elements cleanly

    // Image positions mapped inside 2x2 grid
    const coords = [
      { x: margin, y: margin },
      { y: margin, x: margin + photoWidth + gap },
      { x: margin, y: margin + photoHeight + gap },
      { y: margin + photoHeight + gap, x: margin + photoWidth + gap }
    ];

    let imagesLoaded = 0;
    const imgElements = photosToStitch.map((src) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.crossOrigin = 'anonymous';
      img.src = src;
      return img;
    });

    const triggerCanvasDownload = () => {
      // Write metadata text nicely layout exactly like user graphic [after.webp]
      const textTop = margin * 2 + photoHeight * 2 + gap + 30;

      // Draw horizontal separator thin line
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin, textTop - 15);
      ctx.lineTo(baseWidth - margin, textTop - 15);
      ctx.stroke();

      // Bold Title Header bottom-left
      ctx.font = 'bold 38px "Inter", "system-ui", sans-serif';
      ctx.fillStyle = '#111111';
      ctx.textAlign = 'left';
      
      // Splitting long titles if needed
      const maxTitleWidth = baseWidth - (margin * 2) - 150;
      const titleLines = [];
      const words = stripTitle.split(' ');
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTitleWidth && i > 0) {
          titleLines.push(currentLine.trim());
          currentLine = words[i] + ' ';
        } else {
          currentLine = testLine;
        }
      }
      titleLines.push(currentLine.trim());

      let currentTextY = textTop + 25;
      titleLines.forEach((line) => {
        ctx.fillText(line, margin, currentTextY);
        currentTextY += 50;
      });

      // Medium Subtitle on right side, aligning opposite matching perfect modern balance
      ctx.font = '500 24px "Inter", "system-ui", sans-serif';
      ctx.fillStyle = '#4b5563';
      ctx.textAlign = 'right';
      ctx.fillText(stripSubtitle, baseWidth - margin, textTop + 25);

      // Footer key concepts text aligned below
      ctx.font = '500 21px "Inter", "system-ui", sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'left';
      ctx.fillText(stripTags, margin, baseHeight - margin - 5);

      // Aesthetic small Photobooth branding on bottom right
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'right';
      ctx.fillText("OS_PHOTOBOOTH", baseWidth - margin, baseHeight - margin - 5);

      // Convert to image download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Photobooth_PrintStrip_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    imgElements.forEach((img, idx) => {
      img.onload = () => {
        // Draw image frame onto canvas coordinate
        const coord = coords[idx];
        ctx.drawImage(img, coord.x, coord.y, photoWidth, photoHeight);

        // Elegant paper border frame for each individual photo slot
        ctx.strokeStyle = 'rgba(0,0,0,0.04)';
        ctx.lineWidth = 1;
        ctx.strokeRect(coord.x, coord.y, photoWidth, photoHeight);

        imagesLoaded += 1;
        if (imagesLoaded === 4) {
          triggerCanvasDownload();
        }
      };
      
      img.onerror = () => {
        // If image fails, fallback immediately and draw a dark styled filler
        const coord = coords[idx];
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(coord.x, coord.y, photoWidth, photoHeight);
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`FOTO ERROR #${idx+1}`, coord.x + photoWidth / 2, coord.y + photoHeight / 2);
        
        imagesLoaded += 1;
        if (imagesLoaded === 4) {
          triggerCanvasDownload();
        }
      };
    });
  };

  // Helpers to fetch photos representing the ongoing compilation
  const getSelectedPreviewPhotos = (): string[] => {
    if (temporarySeriesPhotos.length === 4) {
      return temporarySeriesPhotos;
    }
    
    // Fallback to latest 4 from general gallery
    const list: string[] = [];
    if (capturedPhotos.length >= 4) {
      return capturedPhotos.slice(0, 4).map(p => p.dataUrl);
    }
    
    // Repeat latest photos to fill the 4 boxes easily
    if (capturedPhotos.length > 0) {
      const len = capturedPhotos.length;
      for (let i = 0; i < 4; i++) {
        list.push(capturedPhotos[i % len].dataUrl);
      }
      return list;
    }

    // Default placeholders
    return [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80'
    ];
  };

  const previewPhotos = getSelectedPreviewPhotos();

  return (
    <div id="photobooth-overall-layout" className="flex flex-col lg:grid lg:grid-cols-12 gap-5 text-slate-100 select-none pb-4 font-sans items-start w-full">
      
      {/* LEFT COLUMN: Clean macOS Window Frame containing Viewfinder & Controllers (Col span: 7) */}
      <div className="lg:col-span-7 flex flex-col gap-4.5 w-full">
        
        {/* Alerts if camera access block / user info */}
        {cameraError && (
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] sm:text-xs text-amber-300">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <div className="flex-1 leading-normal">
              {cameraError} 
              <button 
                onClick={startCamera} 
                className="font-bold underline ml-2 text-white hover:text-cyan-300 cursor-pointer"
              >
                Coba Akses Lagi
              </button>
            </div>
          </div>
        )}

        {/* macOS Style Viewfinder Canvas Shield Bezel */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 aspect-video max-w-full w-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center group">
          
          {/* Top Apple iMac Green Lens indicator led */}
          <div className="absolute top-2 w-full flex justify-center items-center pointer-events-none z-10">
            <div className={`w-1.5 h-1.5 rounded-full ${!isSimulatorMode ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-slate-600'} transition-colors duration-300`} />
          </div>

          {/* Guidelines framing overlays */}
          {showGrid && !isSeriesCapturing && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-20">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div className="w-full h-full" />
            </div>
          )}

          {/* Active webcam element */}
          {!isSimulatorMode ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
              className={`w-full h-full object-cover transition-all duration-300 ${FILTER_PRESETS.find(f => f.id === activeFilter)?.css || ''}`}
            />
          ) : (
            /* Cyber Aesthetic simulated preview loop */
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-slate-950 min-h-[220px]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,rgba(168,85,247,0.06),rgba(0,190,255,0.02),rgba(168,85,247,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-40" />
              
              <div className="text-center flex flex-col items-center p-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-purple-500/40 animate-[spin_10s_linear_infinite] flex items-center justify-center p-3 mb-3">
                  <Camera size={20} className="text-purple-400 animate-pulse" />
                </div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-purple-400 font-bold mb-1">
                  Kamera Simulator Aktif
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  Synthesizing environment #{simulatorFrame}
                </span>
              </div>
            </div>
          )}

          {/* Snapshot countdown visual layout */}
          {isSeriesCapturing && seriesCountdown > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 animate-fade-in text-white">
              <div className="bg-white/10 border border-white/20 text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-full mb-3 uppercase text-purple-300 backdrop-blur-md">
                Menangkap Foto {seriesPhotoIndex + 1} dari 4
              </div>
              <div className="text-7xl sm:text-8xl font-extrabold tracking-tighter text-white animate-[ping_1s_infinite]">
                {seriesCountdown}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-4">Tahan pose kamu...</p>
            </div>
          )}

          {/* Flash Shutter blink node overlay */}
          {isFlashActive && (
            <div className="absolute inset-0 bg-white z-40 transition-none" />
          )}

          {/* Top badges state */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 bg-black/75 px-3 py-1 rounded-full border border-white/10 text-[9px] sm:text-[10px] font-mono tracking-wider text-white z-10">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-[pulse_1s_infinite]" />
            <span className="uppercase">{isSimulatorMode ? 'MODE SIMULATOR' : 'WEBCAM AKTIF'}</span>
          </div>

          <div className="absolute top-3.5 right-3.5 bg-black/75 px-3 py-1 rounded-full border border-white/10 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-purple-300 z-10 flex items-center gap-1">
            <Sparkles size={11} className="text-purple-400" />
            <span>FX: {FILTER_PRESETS.find(f => f.id === activeFilter)?.name}</span>
          </div>

          {/* Countdown indicator during the break between series shots */}
          {isSeriesCapturing && seriesCountdown === 0 && (
            <div className="absolute inset-0 bg-white/20 z-10 pointer-events-none" />
          )}
        </div>

        {/* Hidden work canvases */}
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={compositeCanvasRef} className="hidden" />

        {/* Simplified Matte Control Deck Grid */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/40 border border-white/10 rounded-2xl p-4 w-full backdrop-blur-md">
          
          <div className="flex items-center justify-between sm:justify-start gap-2.5">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-3 py-2 rounded-xl border text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                showGrid 
                  ? 'border-purple-500/50 bg-purple-950/30 text-purple-200' 
                  : 'border-white/5 bg-white/5 hover:bg-white/10 text-zinc-300'
              }`}
              title="Aktifkan/nonaktifkan grid rule of thirds"
            >
              Grid {showGrid ? 'On' : 'Off'}
            </button>
            <button
              onClick={() => setIsMirrored(!isMirrored)}
              className={`px-3 py-2 rounded-xl border text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isMirrored 
                  ? 'border-purple-500/50 bg-purple-950/30 text-purple-200' 
                  : 'border-white/5 bg-white/5 hover:bg-white/10 text-zinc-300'
              }`}
              title="Aktifkan/nonaktifkan mode pencerminan horisontal kamera"
            >
              Cermin {isMirrored ? 'On' : 'Off'}
            </button>
            <button
              onClick={startCamera}
              className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset sistem koneksi webcam"
            >
              <RefreshCw size={11} />
              Reset Hardware
            </button>
          </div>

          {/* Main take photo triggers */}
          <div className="flex items-center gap-2">
            {/* 4-Shot Strip Mode Trigger button */}
            <button
              onClick={startPhotoboothSeriesCapture}
              disabled={isSeriesCapturing}
              className={`px-4.5 py-2.5 rounded-xl text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSeriesCapturing 
                  ? 'bg-zinc-800 border border-zinc-700 opacity-50 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-500 border border-purple-400/20 active:scale-95 shadow-[0_8px_20px_rgba(147,51,234,0.3)]'
              }`}
              title="Ambil 4 foto berturut-turut untuk membuat strip photobooth"
            >
              <Printer size={13} strokeWidth={2.5} />
              4-SHOT STRIP
            </button>

            {/* Traditional Single Snapshot */}
            <button
              onClick={captureSinglePhoto}
              disabled={isSeriesCapturing}
              className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              title="Ambil foto tunggal"
            >
              <Camera size={14} strokeWidth={2.5} className="text-zinc-950" />
              SINGLE SHOT
            </button>
          </div>

        </div>

        {/* Sliders for Effects Preferences */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 w-full">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Sliders size={13} className="text-purple-500" />
            Vibe & Efek Kamera Retro
          </div>

          {/* Quick inline selectors */}
          <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/10">
            {FILTER_PRESETS.map((preset) => {
              const isSelected = activeFilter === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActiveFilter(preset.id)}
                  className={`py-2 px-3 rounded-xl border text-[10px] font-semibold whitespace-nowrap flex flex-col items-center justify-center gap-1.5 transition-all min-w-[85px] cursor-pointer ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-950/40 text-purple-200 shadow-md scale-[1.02]' 
                      : 'border-white/5 bg-zinc-950/20 hover:border-white/10 hover:bg-zinc-950/40 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow font-black text-white/50 text-[9px] ${preset.css}`}>
                    FX
                  </div>
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Captures Snapshot Gallery list */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex flex-col min-h-[180px] w-full">
          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <ImageIcon size={13} className="text-purple-400" />
              Folder Snapshot ({capturedPhotos.length})
            </div>
            {capturedPhotos.length > 0 && (
              <button
                onClick={clearGallery}
                className="text-[9px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={10} />
                Hapus Folder
              </button>
            )}
          </div>

          {capturedPhotos.length === 0 ? (
            <div className="py-6 flex flex-col items-center justify-center text-center opacity-45 border border-dashed border-white/5 rounded-xl flex-1 w-full">
              <CameraOff size={22} className="text-zinc-500 mb-2" />
              <p className="text-[10px] leading-relaxed font-mono">Hasil foto Anda akan tersimpan di sini</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[170px] overflow-y-auto pr-0.5 scrollbar-thin">
              {capturedPhotos.map((photo) => (
                <div 
                  key={photo.id}
                  className="group relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-video shadow-md hover:border-purple-500/40 transition-all"
                >
                  <img 
                    src={photo.dataUrl} 
                    alt="Captured portrait" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Hover Actions overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                    <button
                      onClick={() => downloadPhoto(photo)}
                      className="w-7 h-7 rounded-full bg-purple-500 text-white hover:bg-purple-400 flex items-center justify-center transition-all shadow-md cursor-pointer"
                      title="Unduh foto tunggal"
                    >
                      <Download size={11} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="w-7 h-7 rounded-full bg-rose-500 text-white hover:bg-rose-400 flex items-center justify-center transition-all shadow-md cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>

                  <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[7px] font-mono text-zinc-400">
                    {photo.filter}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Custom Digital Paper-Print Photobooth Collage Maker Layout (Col span: 5) */}
      <div className="lg:col-span-5 flex flex-col gap-5 w-full">
        
        {/* Strip Template Designer controls */}
        <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-4.5 w-full backdrop-blur-md text-left">
          <div className="flex items-center gap-1.5 mb-3.5 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Type size={13} className="text-purple-500" />
            Modifikasi Teks Strip Desain
          </div>

          <div className="space-y-3.5">
            {/* Title template */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase tracking-wider">Line 1: Utama (Role / Nama)</label>
              <input
                type="text"
                value={stripTitle}
                onChange={(e) => setStripTitle(e.target.value)}
                maxLength={45}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                placeholder="cth. Software Engineer"
              />
            </div>

            {/* Subtitle template */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase tracking-wider">Line 2: Detail (Lokasi / Waktu)</label>
              <input
                type="text"
                value={stripSubtitle}
                onChange={(e) => setStripSubtitle(e.target.value)}
                maxLength={60}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                placeholder="cth. at Linkedist from 2024"
              />
            </div>

            {/* Footnote tags template */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase tracking-wider">Line 3: Tagline / Kata Karakter (Gunakan bullet •)</label>
              <input
                type="text"
                value={stripTags}
                onChange={(e) => setStripTags(e.target.value)}
                maxLength={90}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                placeholder="cth. Creative • Techie • Ambitious"
              />
            </div>

            {/* Paper Theme Color */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase tracking-wider">Warna Kertas Strip</label>
              <div className="flex items-center gap-2">
                {[
                  { value: '#faf9f6', label: 'Ivory Warm' },
                  { value: '#ffffff', label: 'Pure White' },
                  { value: '#f3f4f6', label: 'Cool Grey' },
                  { value: '#fef3c7', label: 'Vintage Gold' },
                  { value: '#09090b', label: 'Ink Black' }
                ].map((col) => (
                  <button
                    key={col.value}
                    onClick={() => setPaperColor(col.value)}
                    className={`h-6 px-2.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                      paperColor === col.value 
                        ? 'border-purple-500 bg-purple-950/25 text-purple-200' 
                        : 'border-white/5 bg-black/20 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive real-time styled CSS Print Card strip preview */}
        <div className="flex flex-col items-center w-full">
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">Live Slip Print Preview</div>
          
          {/* Card body container */}
          <div 
            id="printed-strip-preview"
            style={{ 
              backgroundColor: paperColor, 
              color: paperColor === '#09090b' ? '#f4f4f5' : '#111827' 
            }}
            className="w-[280px] sm:w-[320px] rounded-2xl border border-white/10 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.5)] flex flex-col items-stretch transition-colors duration-300 relative text-left select-text"
          >
            {/* Elegant retro print noise/sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 pointer-events-none rounded-2xl mix-blend-overlay" />
            
            {/* 2x2 grid preview of snaps */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {previewPhotos.map((src, index) => (
                <div 
                  key={index} 
                  className="rounded-lg overflow-hidden aspect-[4/3] border border-black/5 bg-zinc-800 shadow-sm"
                >
                  <img 
                    src={src} 
                    alt={`Box slot #${index + 1}`} 
                    className="w-full h-full object-cover grayscale-[15%] brightness-[97%]"
                  />
                </div>
              ))}
            </div>

            {/* Separator block lines */}
            <div 
              style={{ borderColor: paperColor === '#09090b' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}
              className="border-t pb-3.5"
            />

            {/* Typography metadata matching output */}
            <div className="flex flex-col gap-0.5 pb-2">
              <div className="flex items-start justify-between gap-1.5 leading-tight">
                <h3 className="font-extrabold text-[15px] tracking-tight uppercase line-clamp-2">
                  {stripTitle || 'Untitled Member'}
                </h3>
                <span className="text-[10px] font-medium shrink-0 pt-0.5 opacity-80 text-right max-w-[120px] truncate">
                  {stripSubtitle || 'at Linkedist'}
                </span>
              </div>
            </div>

            <div className="mt-2.5 flex justify-between items-center text-[9px] font-semibold opacity-70">
              <span className="truncate">{stripTags || 'Creative • Ambitious'}</span>
              <span className="font-mono text-[8px] font-bold shrink-0 opacity-50 uppercase tracking-widest pl-1.5">OS_PRINT</span>
            </div>
          </div>

          {/* Action Trigger for Stitched Collages */}
          <button
            onClick={downloadStitchedStrip}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2.5 shadow-[0_12px_28px_rgba(109,40,217,0.35)] hover:shadow-[0_12px_28px_rgba(109,40,217,0.5)] active:scale-95 duration-200 cursor-pointer"
            title="Download full 2x2 photobooth strip with paper layout texture"
          >
            <Download size={13} strokeWidth={2.5} />
            CETAK & UNDUH STRIP PHOTOBOOTH
          </button>
        </div>

      </div>

    </div>
  );
};
