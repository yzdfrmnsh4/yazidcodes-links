import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  title: string;
  artist: string;
  duration: number;
  album: string;
  src: string;
  coverGradient: string;
  coverUrl: string; // Dynamic high quality cover photo
  ambientBackdrop: string; // Artist ambient background photo (Apple Music style)
  ambientColor: string; // CSS color string or gradient for overlay styling
  lyrics: LyricLine[]; // Real-time scrolling lyrics
}

interface AudioContextType {
  isPlaying: boolean;
  currentTrackIndex: number;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  likedTracks: { [key: number]: boolean };
  tracks: Track[];
  currentTrack: Track;
  togglePlay: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  toggleMute: () => void;
  toggleLiked: () => void;
  seek: (seconds: number) => void;
  setTrackIndex: (index: number) => void;
  loadLocalFile: (url: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(182); // default fallback duration
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Track-specific likes
  const [likedTracks, setLikedTracks] = useState<{ [key: number]: boolean }>({
    0: true, // pre-like the first track
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [tracks, setTracks] = useState<Track[]>([
    {
      title: "RED",
      artist: "Taylor Swift",
      duration: 223,
      album: "Red (Taylor's Version)",
      src: "/RED.mp3",
      coverGradient: "from-amber-600 via-red-600 to-rose-800",
      coverUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      ambientBackdrop: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=80",
      ambientColor: "from-red-950 via-rose-900 to-stone-900",
      lyrics: []
    },
    {
      title: "Ini Abadi",
      artist: "Perunggu",
      duration: 182,
      album: "Memorandum",
      src: "/music.mp3",
      coverGradient: "from-amber-500 via-orange-600 to-red-700",
      coverUrl: "/album/momerandum.jpg",
      // ambientBackdrop: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80",
      // ambientColor: "from-amber-600/40 via-amber-900/60 to-slate-950",
      lyrics: []
    },
    {
      title: "Neon Synths",
      artist: "Digital Native",
      duration: 372,
      album: "System Symphony",
      src: "/Neon-Synths.mp3",
      coverGradient: "from-pink-500 via-purple-600 to-indigo-700",
      coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80",
      ambientBackdrop: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1600&q=80",
      ambientColor: "from-pink-600/30 via-purple-900/50 to-slate-950",
      lyrics: []
    },
    {
      title: "Late Night Commit Logs",
      artist: "Lo-Fi Compiler",
      duration: 502,
      album: "Coffee & Code",
      src: "/Late-Night.mp3",
      coverGradient: "from-emerald-400 via-teal-500 to-cyan-600",
      coverUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
      ambientBackdrop: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80",
      ambientColor: "from-teal-600/30 via-slate-900/60 to-slate-950",
      lyrics: []
    }
  ]);

  const currentTrack = tracks[currentTrackIndex];

  // Initialize Audio
  useEffect(() => {
    // Re-create audio client with current track src
    const audio = new Audio();
    audio.src = currentTrack.src;
    audio.muted = isMuted;
    audioRef.current = audio;

    // Set volume a bit lower in case it's loud
    audio.volume = 0.55;

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        const d = audioRef.current.duration || currentTrack.duration || 180;
        setDuration(d);
        setTracks(prev => prev.map((t, i) => i === currentTrackIndex ? { ...t, duration: d } : t));
      }
    };

    const handleEnded = () => {
      // Go next Automatically
      handleNext();
    };

    const handlePlayError = (e: any) => {
      console.warn("Audio play failed or was interrupted:", e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(handlePlayError);
    }

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, [currentTrackIndex]);

  // Sync isPlaying state changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Global audio play rejected:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Sync muted state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length);
    setCurrentTime(0);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleLiked = () => {
    setLikedTracks(prev => ({
      ...prev,
      [currentTrackIndex]: !prev[currentTrackIndex]
    }));
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      const clamped = Math.max(0, Math.min(duration, seconds));
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  };

  const setTrackIndex = (index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
      setCurrentTime(0);
    }
  };

  const loadLocalFile = (url: string) => {
    setTracks(prev => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        src: url,
        title: "Local MP3 File",
        artist: "Uploaded File",
        album: "My Computer Source",
        coverUrl: "https://images.unsplash.com/photo-1588615419958-30687f174c88?auto=format&fit=crop&w=400&q=80",
        ambientBackdrop: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=1600&q=80",
        ambientColor: "from-blue-600/30 via-slate-900/60 to-slate-950",
      };
      return updated;
    });
    setCurrentTrackIndex(0);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      currentTrackIndex,
      currentTime,
      duration,
      isMuted,
      likedTracks,
      tracks,
      currentTrack,
      togglePlay,
      handleNext,
      handlePrev,
      toggleMute,
      toggleLiked,
      seek,
      setTrackIndex,
      loadLocalFile
    }}>
      {children}
    </AudioContext.Provider>
  );
};
