import React from 'react';
import { Calendar, Music, Play, Pause, SkipForward, Radio, Heart } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import ProfileCard from './ProfileCard';
import { Spotify } from './icon/Spotify';
import { SpotifyWidget } from './SpotifyWidget';

interface DesktopWidgetsProps {
  time: Date;
  onTriggerToast: (msg: string) => void;
  isMobile?: boolean;
}

export const DesktopWidgets: React.FC<DesktopWidgetsProps> = ({ time, onTriggerToast, isMobile = false }) => {
  const {
    isPlaying,
    isLiked,
    currentTrack,
    togglePlay,
    handleNext,
    toggleLiked
  } = useAudio();

  // Get Indonesian date parts
  const dayName = time.toLocaleDateString('id-ID', { weekday: 'long' });
  const dayNum = time.toLocaleDateString('id-ID', { day: 'numeric' });
  const monthName = time.toLocaleDateString('id-ID', { month: 'short' });
  const yearName = time.toLocaleDateString('id-ID', { year: 'numeric' });

  // Render dummy days of the calendar surrounding the current day
  const renderCalendarMiniGrid = () => {
    const days = [5, 6, 7, 8, 9, 10, 11, 12, 13];
    const currentNum = parseInt(dayNum);
    return (
      <div className="grid grid-cols-7 gap-1.5 mt-2.5 text-[10px] font-mono text-slate-300 ">
        {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((d, idx) => (
          <div key={idx} className="text-center font-bold text-slate-500 text-[8px]">{d}</div>
        ))}
        {days.map((d, idx) => {
          const isToday = d === currentNum;
          return (
            <div
              key={idx}
              className={`text-center py-0.5 rounded-md ${isToday
                ? 'bg-rose-500 text-white font-bold shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                : 'hover:text-cyan-300'
                }`}
            >
              {d}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-stretch gap-4 p-1 w-full select-none px-2  ">
      {/* 1. Date Widget on Desktop / Profile Card on Mobile (replacing Calendar widget) */}
      {isMobile ? (
        <div className="w-full">
          <ProfileCard
            behindGlowEnabled={true}
            showUserInfo={false}
            enableTilt={true}
            enableMobileTilt={true}
            innerGradient="linear-gradient(145deg,#ffffff0 0%,#0f72b90 100%)"
            onContactClick={() => {
              onTriggerToast("✉️ Menghubungi Muhammad Yazid...");
              window.open("mailto:locallhost8000@gmail.com", "_blank");
            }}
          />
        </div>
      ) : (
        <div
          id="date-mini-widget"
          className="flex-1 min-w-[150px] min-h-[190px] p-3.5 rounded-2xl border border-white/10 backdrop-blur-3xl bg-slate-900/40 text-slate-200 shadow-xl relative overflow-hidden"
        >
          {/* Subtle glass reflection glow */}
          <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
              {/* <Calendar size={11} /> Kalender */}
              <img src="/iconn/calender.png" alt="" srcset="" className="w-7" /> Kalender

            </span>
            <span className="text-[9px] font-mono text-white">{yearName}</span>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight leading-none">
              {dayNum}
            </span>
            <div className="flex flex-col ">
              <span className="text-[10px] font-bold text-slate-300 uppercase leading-none">{dayName}</span>
              <span className="text-xs font-semibold text-cyan-300 leading-none mt-1">{monthName}</span>
            </div>
          </div>

          {renderCalendarMiniGrid()}
        </div>
      )}

      {/* 2. Spotify Music Widget (Premium Glassmorphism Widget) */}
      <SpotifyWidget />
    </div>
  );
};
