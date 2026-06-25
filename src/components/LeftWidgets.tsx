import React from 'react';
import { Cloud, CloudRain, Moon } from 'lucide-react';

interface LeftWidgetsProps {
  time: Date;
}

export const LeftWidgets: React.FC<LeftWidgetsProps> = ({ time }) => {
  // Format 12-hour digital time (e.g. 4:52) without AM/PM in WIB (Asia/Jakarta) timezone
  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Jakarta'
  }).split(' ')[0];

    // Format Time: HH:MM:SS
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="flex flex-col items-stretch gap-3 w-full select-none ">
      {/* Row 1: Clock Widget + Empty Widget */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Clock Widget */}
        <div className="flex-1 aspect-square bg-[#F8F9FA] rounded-[20px] border-[4px] border-[#1E1E1E] text-black p-3 flex flex-col items-center justify-center relative shadow-lg">
          {/* Analog tick marks around inner border */}
          <div className="absolute inset-1.5 border border-black/5 rounded-[14px] pointer-events-none">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-black/40" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-black/40" />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-black/40" />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-black/40" />
          </div>
          {/* Large Digital Time */}
          <div className="text-3xl font-extrabold tracking-tight font-sans leading-none select-text">
            {formatTime(time)}
          </div>
        </div>

        {/* Empty Widget */}
        <div className="flex-1 aspect-square rounded-[20px] border-2 border-dashed  border-white/20  backdrop-blur-sm flex items-center justify-center text-white/25 text-[10px] uppercase tracking-widest font-bold">
          Empty
        </div>
      </div>

      {/* Row 2: Weather Widget */}
      <div className="p-3.5 rounded-[20px] border border-white/10 backdrop-blur-3xl bg-slate-900/40 text-slate-200 shadow-xl relative overflow-hidden flex flex-col gap-3">
        {/* Glass reflection highlight */}
        <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        <div className="flex justify-between items-start">
          <div className="text-left">
            <h3 className="text-xs font-bold text-white tracking-wide">Bandung</h3>
            <p className="text-3xl font-light text-white leading-none mt-1">33°</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-200">Berawan</p>
            <p className="text-[9px] text-slate-400 mt-1">H:71° L:58°</p>
          </div>
        </div>

        {/* Thin Divider */}
        <div className="w-full h-px bg-white/5" />

        {/* Hourly Forecast */}
        <div className="flex justify-between items-center text-center">
          {[
            { time: '5PM', temp: '71°', type: 'cloud' },
            { time: '6PM', temp: '70°', type: 'cloud' },
            { time: '7PM', temp: '68°', type: 'rain' },
            { time: '8PM', temp: '66°', type: 'cloud' },
            { time: '9PM', temp: '65°', type: 'moon' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[8px] text-slate-400 font-medium">{item.time}</span>
              {item.type === 'cloud' && <Cloud size={13} className="text-slate-300" />}
              {item.type === 'rain' && <CloudRain size={13} className="text-cyan-400" />}
              {item.type === 'moon' && <Moon size={13} className="text-indigo-300" />}
              <span className="text-[10px] text-white font-bold">{item.temp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Retro Comic Quote Widget */}
      <div className="p-3 bg-zinc-950 border-2 border-yellow-500 rounded-[16px] shadow-lg flex items-center justify-center min-h-[56px] relative overflow-hidden">
        <div className="border border-yellow-500/20 px-3 py-1.5 w-full text-center">
          <span className="text-[10px] font-mono font-black tracking-widest text-yellow-400 uppercase leading-snug">
            Meanwhile in another another universe...
          </span>
        </div>
      </div>

      {/* Row 4: Name Tag Widget + Spiderman Peace Sign SVG Widget */}
      <div className="grid grid-cols-2 gap-3 w-full ">
        {/* Name Tag Widget */}
        <div className="flex-1 aspect-square bg-[#FCFCFC] border border-neutral-300 rounded-[20px] overflow-hidden flex flex-col shadow-md">
          {/* Hello Header */}
          <div className="bg-[#DF2020] text-white py-1.5 text-center flex flex-col justify-center items-center">
            <span className="text-[9px] font-black tracking-wider leading-none">HELLO</span>
            <span className="text-[6px] font-bold uppercase tracking-widest leading-none mt-0.5 opacity-90">my name is</span>
          </div>
          {/* Signature Body */}
          <div className="flex-1 flex items-center justify-center p-2">
            <span 
              className="font-serif italic text-xs font-black text-neutral-800 tracking-tight leading-none rotate-[-6deg]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Peter Parker
            </span>
          </div>
        </div>

        {/* Spiderman Peace Sign SVG Widget */}
        <div className="flex-1 aspect-square rounded-[20px] overflow-hidden bg-sky-950 border border-white/10 relative shadow-md flex items-center justify-center p-2">
          {/* Skyline silhouette */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[35%] bg-slate-950 opacity-80" 
            style={{ clipPath: 'polygon(0% 100%, 0% 20%, 15% 40%, 30% 10%, 45% 30%, 60% 0%, 75% 25%, 90% 10%, 100% 30%, 100% 100%)' }} 
          />
          
          {/* Spiderman Vector Head */}
          <div className="relative w-[75%] h-[75%]">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              <ellipse cx="50" cy="50" rx="32" ry="42" fill="#DF2020" stroke="#1E1E1E" strokeWidth="2" />
              <path d="M 50 8 Q 50 50 50 92" stroke="#1E1E1E" strokeWidth="1" fill="none" />
              <path d="M 18 50 Q 50 50 82 50" stroke="#1E1E1E" strokeWidth="1" fill="none" />
              <path d="M 23 23 Q 50 50 77 77" stroke="#1E1E1E" strokeWidth="1" fill="none" />
              <path d="M 23 77 Q 50 50 77 23" stroke="#1E1E1E" strokeWidth="1" fill="none" />
              <path d="M 35 50 C 35 40, 65 40, 65 50 C 65 60, 35 60, 35 50 Z" stroke="#1E1E1E" strokeWidth="0.8" fill="none" />
              <path d="M 25 50 C 25 32, 75 32, 75 50 C 75 68, 25 68, 25 50 Z" stroke="#1E1E1E" strokeWidth="0.8" fill="none" />
              <path d="M 22 46 C 26 38, 38 34, 46 44 C 40 54, 28 54, 22 46 Z" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="2.5" />
              <path d="M 78 46 C 74 38, 62 34, 54 44 C 60 54, 72 54, 78 46 Z" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="2.5" />
            </svg>
            
            {/* Peace Sign Overlay badge */}
            <div className="absolute bottom-[3px] right-[3px] w-7 h-7 bg-slate-900/60 rounded-full flex items-center justify-center p-1 border border-white/10 backdrop-blur-sm shadow-md">
              <span className="text-xs">✌️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
