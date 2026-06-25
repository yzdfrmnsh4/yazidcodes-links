import React, { useState } from 'react';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Airplay,
  Heart
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { motion, AnimatePresence } from 'motion/react';

export const SpotifyWidget: React.FC = () => {
  const {
    isPlaying,
    currentTrackIndex,
    currentTime,
    duration,
    likedTracks,
    currentTrack,
    togglePlay,
    handleNext,
    handlePrev,
    toggleLiked,
    seek
  } = useAudio();

  // State to manage whether the widget is expanded (showing artwork on top) or minimized (artwork embedded inside)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isLiked = likedTracks[currentTrackIndex] || false;

  const pctCompleted = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Format seconds to time string (e.g. 1:34)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Format remaining time (e.g. -2:30)
  const formatRemainingTime = () => {
    const remaining = duration - currentTime;
    if (isNaN(remaining) || remaining < 0) return "-0:00";
    const mins = Math.floor(remaining / 60);
    const remainingSecs = Math.floor(remaining % 60);
    return `-${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Handle clicking on progress bar to seek
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    seek(percentage * duration);
  };

  return (
    <div id="spotify-widget-container" className="w-full h-full flex flex-col items-center justify-center select-none text-slate-100">

      {/* 1. EMULATED SOUNDWAVE ANIMATIONS */}
      <style>{`
        @keyframes eq-bounce-1 {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes eq-bounce-2 {
          0%, 100% { height: 6px; }
          50% { height: 20px; }
        }
        @keyframes eq-bounce-3 {
          0%, 100% { height: 3px; }
          50% { height: 12px; }
        }
        @keyframes eq-bounce-4 {
          0%, 100% { height: 5px; }
          50% { height: 18px; }
        }
        .eq-bar-1 { animation: eq-bounce-1 0.8s ease-in-out infinite; }
        .eq-bar-2 { animation: eq-bounce-2 1.1s ease-in-out infinite; }
        .eq-bar-3 { animation: eq-bounce-3 0.9s ease-in-out infinite; }
        .eq-bar-4 { animation: eq-bounce-4 1.2s ease-in-out infinite; }
      `}</style>

      <AnimatePresence mode="wait">

        {/* EXPANDED MODE: Beautiful layout with big cover art on top [before.webp] */}
        {isExpanded ? (
          <motion.div
            key="expanded-widget"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center w-full max-w-[420px]"
          >
            {/* Centered Large Album Artwork */}
            <div
              onClick={() => setIsExpanded(false)}
              className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.6)] border border-white/10 shrink-0 cursor-pointer group active:scale-95 transition-all duration-300"
              title="Klik gambar untuk mengecilkan widget"
            >
              <ImageWithSkeleton
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Glossy light reflections */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/15 pointer-events-none" />

              {/* Overlay with Minimize indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                <span className="text-[10px] font-mono tracking-wider font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/15">
                  MINIMIZE
                </span>
              </div>
            </div>

            {/* Micro Spacer */}
            <div className="h-6" />

            {/* Glowing Translucent Control Panel Widget */}
            <div className="w-full p-4.5 rounded-3xl border border-white/10 backdrop-blur-2xl text-slate-200 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {/* Title & Artist & EQ Bars */}
              <div className="flex items-center justify-between mb-4 px-1.5">
                <div className="flex-1 min-w-0 pr-4 text-left">
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-wide truncate leading-tight">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs text-white mt-0.5 font-thin tracking-wide truncate">
                    {currentTrack.artist}
                  </p>
                </div>

                {/* EQ soundwave bars */}
                <div className="flex items-end gap-[2px] h-5 w-5 shrink-0 pr-0.5">
                  <div className={`w-[2.5px] bg-white rounded-t-sm ${isPlaying ? 'eq-bar-1' : 'h-[4px]'}`} />
                  <div className={`w-[2.5px] bg-white rounded-t-sm ${isPlaying ? 'eq-bar-2' : 'h-[6px]'}`} />
                  <div className={`w-[2.5px] bg-white rounded-t-sm ${isPlaying ? 'eq-bar-3' : 'h-[3px]'}`} />
                  <div className={`w-[2.5px] bg-white rounded-t-sm ${isPlaying ? 'eq-bar-4' : 'h-[5px]'}`} />
                </div>
              </div>

              {/* Timeline seek progress element */}
              <div className="space-y-1 mb-4.5">
                <div
                  onClick={handleTimelineClick}
                  className="h-1.5 w-full bg-white/10 hover:bg-white/15 rounded-full cursor-pointer relative transition-all group/seek"
                >
                  {/* Active Seek Fill */}
                  <div
                    style={{ width: `${pctCompleted}%` }}
                    className="absolute top-0 left-0 h-full bg-white rounded-full relative shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  >
                    {/* Handle slider circle */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_6px_rgba(0,0,0,0.5)] scale-0 group-hover/seek:scale-100 transition-transform duration-150" />
                  </div>
                </div>

                {/* Real-time duration texts */}
                <div className="flex justify-between text-[10px] font-mono font-bold tracking-wider text-zinc-400 px-0.5">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatRemainingTime()}</span>
                </div>
              </div>

              {/* Action controller triggers */}
              <div className="flex items-center justify-between px-2">
                {/* Liked / Favourite toggler */}
                <button
                  onClick={toggleLiked}
                  className={`transition duration-200 hover:scale-110 active:scale-90 cursor-pointer ${isLiked ? 'text-rose-500' : 'text-zinc-500 hover:text-white'
                    }`}
                  title={isLiked ? "Hapus dari disukai" : "Sukai"}
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                </button>

                {/* Central Playback navigation buttons */}
                <div className="flex items-center gap-6">
                  {/* Previous Track */}
                  <button
                    onClick={handlePrev}
                    className="text-zinc-400 hover:text-white transition cursor-pointer active:scale-90"
                    title="Lagu Sebelumnya"
                  >
                    <SkipBack size={18} fill="currentColor" />
                  </button>

                  {/* Play/Pause Main Button */}
                  <button
                    onClick={togglePlay}
                    className="w-11 h-11 rounded-full border border-white/50 bg-white/15 hover:bg-white/25 flex items-center justify-center text-white backdrop-blur-md shadow-lg active:scale-95 transition-all duration-300 cursor-pointer"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={16} fill="currentColor" />
                    ) : (
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>

                  {/* Next Track */}
                  <button
                    onClick={handleNext}
                    className="text-zinc-400 hover:text-white transition cursor-pointer active:scale-90"
                    title="Lagu Berikutnya"
                  >
                    <SkipForward size={18} fill="currentColor" />
                  </button>
                </div>

                {/* Cast Output AirPlayer */}
                <button
                  className="text-zinc-500 hover:text-white transition cursor-pointer active:scale-95"
                  title="AirPlay"
                >
                  <Airplay size={16} className="text-rose-400/80" />
                </button>
              </div>

            </div>
          </motion.div>
        ) : (
          // MINIMIZED COMPACT MODE: Folded layout with artwork embedded on the left, matching [after.webp] perfectly
          <motion.div
            key="compact-widget"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-[420px] p-2.5  rounded-xl border border-white/15  backdrop-blur-2xl text-slate-200 shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Embedded Mini Artwork + Meta Titles + Sound Waveform Indicator */}
            <div className="flex items-center gap-3 mb-4 px-1 ">
              {/* Click artwork to expand to premium detailed mode */}
              <div
                onClick={() => setIsExpanded(true)}
                className="relative w-11 h-11 rounded-lg overflow-hidden border border-white/10 shrink-0 group cursor-pointer active:scale-90 transition-all duration-300"
                title="Klik gambar untuk memperbesar"
              >
                <ImageWithSkeleton
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
              </div>

              {/* Centered Track Name and Info */}
              <div className="flex-1 min-w-0 text-left pr-4">
                <h4 className="text-xs sm:text-base font-bold text-white tracking-wide truncate leading-tight">
                  {currentTrack.title}
                </h4>
                <p className="text-[11px] text-white mt-0.5 font-thin tracking-wide truncate">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Dynamic Soundwave Equalizer */}
              <div className="flex items-end gap-[2px] h-4 w-4 shrink-0 pr-0.5">
                <div className={`w-[2.2px] bg-white rounded-t-sm ${isPlaying ? 'eq-bar-1' : 'h-[4px]'}`} />
                <div className={`w-[2.2px] bg-white rounded-t-sm ${isPlaying ? 'eq-bar-2' : 'h-[6px]'}`} />
                <div className={`w-[2.2px] bg-white rounded-t-sm ${isPlaying ? 'eq-bar-3' : 'h-[3px]'}`} />
                <div className={`w-[2.2px] bg-white rounded-t-sm ${isPlaying ? 'eq-bar-4' : 'h-[5px]'}`} />
              </div>
            </div>

            {/* Interactive timeline seeker bar */}
            <div className="space-y-1 mb-4.5 ">
              <div className="flex justify-evenly items-center gap-2">
                  <span className="text-[10px]  font-semibold tracking-wider text-zinc-400">
                    {formatTime(currentTime)}
                  </span>

                <div
                  onClick={handleTimelineClick}
                  className="h-1.5 w-full bg-white/20 hover:bg-white/15 rounded-full cursor-pointer relative transition-all group/seek"
                >
                  {/* Active seek background fill */}
                  <div
                    style={{ width: `${pctCompleted}%` }}
                    className="absolute top-0 left-0 h-full bg-white rounded-full relative shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_6px_rgba(0,0,0,0.5)] scale-0 group-hover/seek:scale-100 transition-transform duration-150" />
                  </div>
                </div>

                {/* Elapsed and remaining duration counts */}
                {/* <div className="flex justify-between text-[10px]  font-bold tracking-wider text-zinc-400 px-0.5"> */}
                <span className="text-[10px]  font-semibold tracking-wider text-zinc-400">
                  {formatRemainingTime()}
                </span>
                {/* </div> */}
              </div>
            </div>

            {/* Playback control nodes */}
            <div className="flex items-center justify-between px-2">
              {/* Liked Button */}
              <button
                onClick={toggleLiked}
                className={`transition duration-200 hover:scale-110 active:scale-95 cursor-pointer ${isLiked ? 'text-rose-500' : 'text-zinc-500 hover:text-white'
                  }`}
                title={isLiked ? "Hapus dari disukai" : "Sukai"}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>

              {/* Standard Seek Controllers */}
              <div className="flex items-center gap-6">
                {/* Previous Track */}
                <button
                  onClick={handlePrev}
                  className="text-zinc-50 hover:text-white transition cursor-pointer active:scale-90"
                  title="Lagu Sebelumnya"
                >
                  <SkipBack size={22} fill="currentColor" />
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="w-11 h-11  flex items-center justify-center text-white  active:scale-95 transition-all duration-300 cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={25} fill="currentColor" />
                  ) : (
                    <Play size={25} fill="currentColor" className="ml-0.5" />
                  )}
                </button>

                {/* Next Track */}
                <button
                  onClick={handleNext}
                  className="text-zinc-50 hover:text-white transition cursor-pointer active:scale-90"
                  title="Lagu Berikutnya"
                >
                  <SkipForward size={22} fill="currentColor" />
                </button>
              </div>

              {/* Airplay button */}
              <button
                className="text-zinc-500 hover:text-white transition cursor-pointer active:scale-95"
                title="AirPlay"
              >
                <Airplay size={16} className="text-white" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
