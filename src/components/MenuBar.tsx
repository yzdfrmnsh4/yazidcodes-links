import React from 'react';
import { Clock, Calendar, MapPin, Wifi, Battery } from 'lucide-react';
import { SystemLocation } from '../types';

interface MenuBarProps {
  time: Date;
  location: SystemLocation;
  activeWindowLabel: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ time, location, activeWindowLabel }) => {
  // Format Indonesian Date e.g., "Senin, 10 Juni 2026"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format Time: HH:MM:SS
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div 
      className="fixed top-0 left-0 w-full h-[40px] z-50 flex items-center justify-between px-3 selection:bg-cyan-500/30 text-white/90 text-sm font-sans backdrop-blur-xl  border-b border-white/10 shadow-sm"
      id="macos-menubar"
    >
      {/* Absolute top glare highlight for liquid glass look */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Left section: Apple / Finder context */}
      <div className="flex items-center space-x-5 select-none relative z-10">
        <svg
          viewBox="0 0 17 20"
          width="15"
          height="15"
          fill="currentColor"
          className="cursor-pointer hover:opacity-100 opacity-85 transition-opacity"
          id="apple-logo-icon"
        >
          <path d="M15.03 10.62c-.06-2.51 2.05-3.72 2.14-3.78-1.17-1.71-3-1.94-3.65-2.01-1.55-.16-3.03.92-3.81.92-.79 0-2.02-.91-3.32-.88-1.71.03-3.29.99-4.17 2.53-1.78 3.09-.45 7.64 1.27 10.12.84 1.21 1.83 2.57 3.14 2.52 1.26-.05 1.74-.81 3.26-.81 1.51 0 1.96.81 3.27.79 1.34-.02 2.22-1.22 3.05-2.43.96-1.4 1.36-2.76 1.38-2.83-.03-.01-2.66-1.02-2.69-4.07zM12.03 3.18c.67-.81 1.12-1.93.99-3.06-.97.04-2.14.65-2.84 1.47-.6.69-1.12 1.83-.98 2.94 1.08.08 2.17-.54 2.83-1.35z" />
        </svg>

        <span className="font-semibold cursor-pointer text-white/100">
          {activeWindowLabel}
        </span>
        <span className="hidden md:inline cursor-pointer hover:text-white/100 opacity-75 transition-opacity">File</span>
        <span className="hidden md:inline cursor-pointer hover:text-white/100 opacity-75 transition-opacity">Edit</span>
        <span className="hidden md:inline cursor-pointer hover:text-white/100 opacity-75 transition-opacity">View</span>
        <span className="hidden lg:inline cursor-pointer hover:text-white/100 opacity-75 transition-opacity">Go</span>
        <span className="hidden lg:inline cursor-pointer hover:text-white/100 opacity-75 transition-opacity">Window</span>
        {/* <span className="hidden md:inline cursor-pointer hover:text-white/100 opacity-75 transition-opacity font-medium text-cyan-400">Bio</span> */}
      </div>

      {/* Middle section: Username */}
      <div className="absolute left-1/2 -translate-x-1/2 select-none pointer-events-none text-center">
        <span className="font-semibold tracking-wide text-xs lowercase text-white drop-shadow-sm">
          yazidcodes
        </span>
      </div>

      {/* Right section: System state, date, time, location */}
      <div className="flex items-center space-x-4 select-none relative z-10">
        {/* Status Pills */}
        <div className="hidden sm:flex items-center space-x-2 text-white/65 mr-2">
          <Wifi size={14} className="hover:text-white transition-colors cursor-pointer" />
          <Battery size={15} className="hover:text-white transition-colors cursor-pointer" />
        </div>

        {/* Location display */}
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-xs" title="Location Info">
          <MapPin size={12} className="text-white" />
          <span>{location.city}, {location.country}</span>
        </div>

        {/* Calendar widget */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs font-thin cursor-pointer  transition-colors">
          {/* <Calendar size={13} className="opacity-75 text-cyan-400" /> */}
          <span className="">{formatDate(time)}</span>
          <span className="">{formatTime(time)}</span>
        </div>

        {/* Time widget */}
        <div className="flex items-center  text-white  text-xs font-normal">
          {/* <Clock size={12} className="animate-pulse text-cyan-400" /> */}
        </div>
      </div>
    </div>
  );
};
