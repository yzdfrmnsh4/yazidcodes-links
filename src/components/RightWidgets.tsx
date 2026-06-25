import React from 'react';
import { Laptop } from 'lucide-react';
import { SpotifyWidget } from './SpotifyWidget';

interface RightWidgetsProps {
  time: Date;
}

export const RightWidgets: React.FC<RightWidgetsProps> = ({ time }) => {
  // Get date names in WIB (Asia/Jakarta) timezone
  const dayNameEnglish = time.toLocaleDateString('id-ID', { weekday: 'long', timeZone: 'Asia/Jakarta' }).toUpperCase();
  const dayNum = time.toLocaleDateString('id-ID', { day: 'numeric', timeZone: 'Asia/Jakarta' });

  // Calculate monthly calendar grid in WIB timezone
  const getCalendarMonthData = (date: Date) => {
    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '2026', 10);
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10) - 1; // 0-indexed
    const todayNum = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);

    const monthName = new Date(year, month, 1).toLocaleDateString('id-ID', { month: 'long' }).toUpperCase();

    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();

    const totalDays = new Date(year, month + 1, 0).getDate();

    const dayCells: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      dayCells.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      dayCells.push(i);
    }

    return {
      monthName,
      todayNum,
      dayCells
    };
  };

  const { monthName, todayNum, dayCells } = getCalendarMonthData(time);

  return (
    <div className="flex flex-col items-stretch gap-3 w-full select-none">
      {/* Row 1: Calendar Widget */}
      <div className="p-3 rounded-[20px] border border-white/15 backdrop-blur-3xl  text-slate-200 shadow-sm relative overflow-hidden flex flex-row gap-3 min-h-[145px]">
        {/* Glass reflection */}
        <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Left side: Date Badge */}
        <div className="flex flex-col items-start justify-start pl-1 pr-3 border-r border-white/5 w-[100px] shrink-0 text-left ">
          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-widest leading-none">
            {dayNameEnglish}
          </span>
          <span className="text-4xl font-extrabold text-white mt-2 mb-4 leading-none">
            {dayNum}
          </span>
          <span className="text-[8px] font-medium text-slate-400 leading-tight">
            No Events Today
          </span>
        </div>

        {/* Right side: Monthly Calendar Grid */}
        <div className="flex-1 flex flex-col justify-center pl-1 text-left">
          <div className="text-[11px] font-bold text-rose-500 uppercase tracking-widest leading-none mb-1.5">
            {monthName}
          </div>
          <div className="grid grid-cols-7 gap-y-1 gap-x-1.5 text-center text-[9px] font-semibold text-slate-300 w-full">
            {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, idx) => (
              <div key={idx} className="text-zinc-200 font-extrabold text-[10px]">{d}</div>
            ))}
            {dayCells.map((day, idx) => {
              if (day === null) {
                return <div key={idx} />;
              }
              const isToday = day === todayNum;
              return (
                <div 
                  key={idx} 
                  className={`flex items-center justify-center w-[16px] h-[16px] rounded-full mx-auto text-[8.5px] ${
                    isToday ? 'bg-[#DF2020] text-white font-black shadow-[0_0_8px_rgba(223,32,32,0.6)]' : 'text-slate-200'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Battery Indicators */}
      <div className="p-3 rounded-[20px] border border-white/15 backdrop-blur-3xl  text-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[80px]">
        <div className="flex items-center justify-between px-1 w-full gap-1.5">
          {/* Ring 1: Active Laptop */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90 ">
                <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="20" 
                  cy="20" 
                  r="16" 
                  stroke="#22C55E" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 16}
                  strokeDashoffset={2 * Math.PI * 16 * (1 - 0.76)} 
                />
              </svg>
              <Laptop size={14} className="text-white relative z-10" />
            </div>
            <span className="text-[10px] font-bold text-white">76%</span>
          </div>

          {/* Ring 2: Empty */}
          <div className="flex-1 flex flex-col items-center gap-1 opacity-40">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute w-full h-full">
                <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="transparent" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500">—</span>
          </div>

          {/* Ring 3: Empty */}
          <div className="flex-1 flex flex-col items-center gap-1 opacity-40">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute w-full h-full">
                <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="transparent" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500">—</span>
          </div>

          {/* Ring 4: Empty */}
          <div className="flex-1 flex flex-col items-center gap-1 opacity-40">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute w-full h-full">
                <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="transparent" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500">—</span>
          </div>
        </div>
      </div>

      {/* Row 3: Music Widget (Preserving SpotifyWidget design) */}
      <div className="w-full">
        <SpotifyWidget />
      </div>

      {/* Row 4: Miles Morales Quote Widget + LEGO Spiderman Widget */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Miles Morales Quote Widget */}
        <div className="flex-1 aspect-square bg-[#FCFAF2] border border-amber-900/10 rounded-[20px] p-2.5 flex flex-col items-center justify-between text-center shadow-md text-stone-850">
          {/* Spiderman Mask Silhouette Icon */}
          <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 text-[#DF2020] shrink-0" fill="currentColor">
            <path d="M 50 10 C 25 10, 15 35, 15 60 C 15 85, 35 90, 50 90 C 65 90, 85 85, 85 60 C 85 35, 75 10, 50 10 Z" />
            <path d="M 28 50 C 33 42, 45 42, 45 50 C 41 58, 29 58, 28 50 Z" fill="white" />
            <path d="M 72 50 C 67 42, 55 42, 55 50 C 59 58, 71 58, 72 50 Z" fill="white" />
          </svg>
          <p 
            className="text-[7.5px] font-semibold leading-normal font-sans italic text-stone-700 my-auto"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            "Don't be afraid of being different, be afraid of being the same as everyone else."
          </p>
          <span className="text-[5.5px] uppercase tracking-wider font-extrabold text-stone-400">Miles Morales</span>
        </div>

        {/* Spiderman LEGO Widget */}
        <div className="flex-1 aspect-square rounded-[20px] overflow-hidden bg-zinc-950 border border-white/10 relative shadow-md flex items-center justify-center p-2">
          <div className="w-[85%] h-[85%] flex flex-col items-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
              {/* Lego stud */}
              <rect x="42" y="5" width="16" height="7" rx="2" fill="#E22020" />
              {/* Lego head shape */}
              <rect x="25" y="12" width="50" height="48" rx="14" fill="#DF2020" stroke="#1E1E1E" strokeWidth="2" />
              {/* Lego shoulders */}
              <path d="M 12 90 L 22 68 L 78 68 L 88 90 Z" fill="#E22020" stroke="#1E1E1E" strokeWidth="2" />
              {/* Spider chest print */}
              <path d="M 50 71 L 50 82 M 45 74 L 55 74 M 43 78 L 57 78 M 46 81 L 54 81" stroke="#1E1E1E" strokeWidth="1.5" />
              {/* Eyes */}
              <path d="M 32 30 C 35 24, 43 24, 47 30 C 44 38, 35 38, 32 30 Z" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="2" />
              <path d="M 68 30 C 65 24, 57 24, 53 30 C 56 38, 65 38, 68 30 Z" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="2" />
              {/* Web lines grid */}
              <path d="M 50 12 L 50 60" stroke="#1E1E1E" strokeWidth="0.8" />
              <path d="M 25 36 L 75 36" stroke="#1E1E1E" strokeWidth="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
