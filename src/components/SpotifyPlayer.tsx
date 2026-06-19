import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Heart,
  Music
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const SpotifyPlayer: React.FC = () => {
  const {
    isPlaying,
    currentTrackIndex,
    currentTime,
    duration,
    isMuted,
    likedTracks,
    currentTrack,
    togglePlay,
    handleNext,
    handlePrev,
    toggleMute,
    toggleLiked,
    seek
  } = useAudio();

  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const isLiked = likedTracks[currentTrackIndex] || false;

  // Format seconds to text (e.g. 2:16)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // 24 Symmetric sound wave bars for highly compact design
  const totalWaveBars = 24;
  const staticWaveHeights = [
    12, 22, 34, 48, 62, 54, 40, 52, 64, 70, 
    58, 44, 44, 58, 70, 54, 42, 52, 62, 48, 
    34, 22, 14, 8
  ];

  // Map clicks on the visual waveform bars to player seek
  const handleWaveBarClick = (barIndex: number) => {
    const targetRatio = barIndex / (totalWaveBars - 1);
    seek(targetRatio * duration);
  };

  return (
    <div id="visual-player-container" className="w-full h-full flex flex-col justify-center text-slate-100 select-none pb-1">
      {/* 1. COMPACT ROW: ALBUM ART & METADATA COMBID */}
      <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
        
        {/* Album Cover Art */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-white/20 shrink-0 group">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Glass light glare overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-white/10 pointer-events-none" />
          
          {/* Audio stream status indicator */}
          {isPlaying && (
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-[pulse_1s_infinite]" />
              <span className="text-[8px] font-extrabold text-rose-300 tracking-wider">LIVE</span>
            </div>
          )}
        </div>

        {/* Track Metadata Deck */}
        <div className="flex-1 min-w-0 flex flex-col justify-center h-28 sm:h-36 py-1.5">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-2xl font-extrabold text-white tracking-tight  leading-tight truncate">
              {currentTrack.title}
            </h1>
            
            <button
              id="like-track-btn"
              onClick={toggleLiked}
              className={`transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer p-1 shrink-0 ${
                isLiked ? 'text-rose-500' : 'text-zinc-400 hover:text-white'
              }`}
              title={isLiked ? "Hapus dari disukai" : "Sukai Lagu"}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          <p className="text-xs sm:text-sm font-light tracking-wider text-white/90 truncate mt-1">
            {currentTrack.artist} 
          </p>
          
          <p className="text-[10px] sm:text-xs text-zinc-400 mt-1.5 truncate ">
            Album: {currentTrack.album}
          </p>

          {/* <div className="mt-auto hidden sm:flex items-center gap-1.5 text-[10px]  text-zinc-500 tracking-wider">
            <Music size={11} className="text-rose-500/60" />
            <span>HQ STEREO OUTPUT • 320 KBPS</span>
          </div> */}
        </div>

      </div>

      {/* 2. AUDIO PLAYER CONTROLS ROW */}
      <div className="flex items-center justify-center gap-5 my-5">
        
        {/* Toggle Muted state */}
        <button
          id="mute-toggle-btn"
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center border border-white/5 cursor-pointer active:scale-95 transition"
          title={isMuted ? "Suara Nyala" : "Bisukan Suara"}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {/* Skip Track Back */}
        <button
          id="prev-track-btn"
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 cursor-pointer active:scale-90 transition shadow-inner"
          title="Lagu Sebelumnya"
        >
          <SkipBack size={15} fill="currentColor" />
        </button>

        {/* LARGE TRANSLUCENT GLASS PLAY BUTTON */}
        <button
          id="play-pause-btn"
          onClick={togglePlay}
          className="w-14 h-14 rounded-full border border-white/40 bg-white/20 hover:bg-white/35 flex items-center justify-center text-white backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={20} fill="currentColor" className="text-white" />
          ) : (
            <Play size={20} fill="currentColor" className="text-white ml-0.5" />
          )}
        </button>

        {/* Skip Track Forward */}
        <button
          id="next-track-btn"
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 cursor-pointer active:scale-90 transition shadow-inner"
          title="Lagu Berikutnya"
        >
          <SkipForward size={15} fill="currentColor" />
        </button>

        {/* Quick jump skip forward indicator */}
        <button
          id="jump-forward-btn"
          onClick={() => seek(currentTime + 10)}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center border border-white/5 cursor-pointer text-[10px] font-bold transition"
          title="Maju 10 Detik"
        >
          +10s
        </button>
      </div>

      {/* 3. SYMMETRIC INTEGRATED WAVEFORM PROGRESS BAR */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center gap-3">
          
          {/* Elapsed track duration labels */}
          <span className="text-[10px] font-bold text-zinc-400 w-8 text-left shrink-0">
            {formatTime(currentTime)}
          </span>

          {/* Symmetrical audio waveform columns mapped across remaining container */}
          <div className="flex-1 flex items-end justify-between h-9 px-1 relative">
            {staticWaveHeights.map((originHeight, idx) => {
              const fraction = idx / (totalWaveBars - 1);
              const progressTime = fraction * duration;
              const isPlayed = currentTime >= progressTime;

              const isHovered = hoveredBarIndex !== null && idx <= hoveredBarIndex;
              const activeFill = isPlayed || isHovered;

              // Smooth dynamic movement on play status matching authentic wave visualizer
              const dynamicMv = isPlaying && isPlayed
                ? Math.sin((currentTime * 10) + idx) * 4
                : 0;

              const barHeight = Math.max(8, Math.min(68, originHeight * 0.5 + dynamicMv));

              return (
                <div
                  key={idx}
                  onClick={() => handleWaveBarClick(idx)}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  style={{ height: `${barHeight}%` }}
                  className={`w-[4px] rounded-full cursor-pointer transition-all duration-300 ${
                    activeFill 
                      ? 'bg-white opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                      : 'bg-white/20 opacity-30'
                  }`}
                  title={`Lompat ke ${formatTime(progressTime)}`}
                />
              );
            })}
          </div>

          {/* Full track duration metadata */}
          <span className="text-[10px] font-bold text-zinc-400 w-8 text-right shrink-0">
            {formatTime(duration)}
          </span>

        </div>
      </div>

    </div>
  );
};
