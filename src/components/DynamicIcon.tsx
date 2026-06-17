import React from 'react';
import { 
  Globe, 
  // Instagram, 
  Linkedin, 
  Github, 
  MessageSquare, 
  Music, 
  Compass, 
  Image as ImageIcon, 
  FileText, 
  Smile,
  Terminal,
  Trash2,
  User,
  Camera
} from 'lucide-react';
import { WhatsApp } from './icon/WhatsApp';
import { TikTok } from './icon/Tiktok';
import { Insta } from './icon/Instagram';
import { LinkedIn } from './icon/Linkedin';
import { GitHub } from './icon/Github';
import { Spotify } from './icon/Spotify';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = '', size = 24 }) => {
  const normName = name.toLowerCase();

  // Custom high-fidelity layered liquid glass SVGs
  if (normName === 'tiktok') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-xl overflow-hidden ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: 'linear-gradient(135deg, rgba(20,20,20,0.85) 0%, rgba(0,0,0,0.95) 100%)',
          // border: '1px solid rgba(255, 255, 255, 0.15)',
          // boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.3)'
        }}
      >
        {/* Soft internal gloss overlay */}
        <img src="/iconn/tiktok.png" alt="" srcset="" className="w-full h-full" />

      </div>
    );
  }

  if (normName === 'instagram') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          // border: '1px solid rgba(255, 255, 255, 0.25)',
          // boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 10px rgba(220,39,67,0.3)'
        }}
      >
        {/* <Instagram size={size} className="text-white relative z-10 drop-shadow-sm" strokeWidth={2.2} /> */}
        {/* <Insta /> */}
        <img src="/iconn/instagram.png" alt="" srcset="" className="w-full h-full" />

      </div>
    );
  }

  if (normName === 'linkedin') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden  ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: 'linear-gradient(135deg, #0a66c2 0%, #0077b5 100%)',
          // border: '1px solid rgba(255, 255, 255, 0.25)',
          // boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 10px rgba(10,102,194,0.3)'
        }}
      >
        {/* <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" /> */}
        {/* <LinkedIn  /> */}
        <img src="/iconn/linkedin.png" alt="" srcset="" className="w-full h-full" />

      </div>
    );
  }

  if (normName === 'github') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden  ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: 'linear-gradient(135deg, #2c3e50 0%, #0f172a 100%)',
          // border: '1px solid rgba(255, 255, 255, 0.15)',
          // boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 4px 10px rgba(15,23,42,0.4)'
        }}
      >
        {/* <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" /> */}
        {/* <GitHub  /> */}
        <img src="/iconn/github.png" alt="" srcset="" className="w-full h-full" />

      </div>
    );
  }

  if (normName === 'whatsapp') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden  ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: 'linear-gradient(135deg, #171717 0%, #2f2f2f 100%)',
          // border: '1px solid rgba(255, 255, 255, 0.25)',
          // boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 10px rgba(18,140,126,0.3)'
        }}
      >
        {/* <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" /> */}
        {/* <WhatsApp /> */}
        <img src="/iconn/whatsApp.png" alt="" />
        {/* <MessageSquare size={size} className="text-white relative z-10" fill="currentColor" strokeWidth={1} style={{ transform: 'scaleX(-1)' }} /> */}
        {/* <svg fill="none" viewBox="0 0 360 362"><path fill="#25D366" fill-rule="evenodd" d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234l.008-.017Z" clip-rule="evenodd"/></svg> */}
      </div>
    );
  }

  if (normName === 'portfolio' || normName === 'safari' || normName === 'website') {
    // Elegant crystal compass styled safari/globe mix
    const isSafari = normName === 'safari';
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden  ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: 'white',
          // border: '1px solid rgba(255, 255, 255, 0.25)',
          // boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 10px rgba(23,54,149,0.3)'
        }}
      >
        {/* <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" /> */}
        {isSafari ? (
            <img src="/iconn/safari.png" alt="" srcset=""  />
        ) : (
            <img src="/iconn/browser.png" alt="" srcset="" />
        )}
      </div>
    );
  }

  if (normName === 'finder') {
    // macOS Classic Finder Split Face
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-md cursor-pointer  ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: 'linear-gradient(135deg, #a5d3f8 0%, #3e8bf5 50%, #0d5be1 100%)',
          // border: '1px solid rgba(255, 255, 255, 0.3)',
          // boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 4px 10px rgba(13,91,225,0.4)'
        }}
      >
      <img src="/iconn/finder.png" alt="" srcset="" />

      </div>
    );
  }

  if (normName === 'spotify') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden  ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: 'linear-gradient(135deg, #1db954 0%, #121212 90%)',
          // border: '1px solid rgba(255, 255, 255, 0.15)',
          // boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 4px 10px rgba(29,185,84,0.25)'
        }}
      >
        {/* <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" /> */}
        {/* <Music size={size} className="text-white relative z-10" strokeWidth={2.2} /> */}
        <img src="/iconn/spotify.png" alt="" srcset="" />

      </div>
    );
  }

  if (normName === 'photos' || normName === 'gallery') {
    // macOS Photos aperture colored kaleidoscope design
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden  ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // border: '1px solid rgba(255, 255, 255, 0.5)',
          // boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 4px 10px rgba(0,0,0,0.15)'
        }}
      >
        <img src="/iconn/photos.png" alt="" srcset="" />
      </div>
    );
  }

  if (normName === 'notes') {
    // iOS/macOS Notes styled pad
    return (
      <div 
        className={`relative flex flex-col justify-between rounded-2xl overflow-hidden  ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: 'linear-gradient(135deg, #ffd754 0%, #ffbe25 100%)',
          // border: '1px solid rgba(255, 255, 255, 0.3)',
          // boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 4px 10px rgba(255,190,37,0.3)',
          // paddingTop: '2px'
        }}
      >
        {/* Header grid texture */}
        <img src="/iconn/stickynotes.png" alt="" srcset="" />

      </div>
    );
  }

  if (normName === 'trash') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-md ${className}`}
        style={{ 
          width: size * 1.8, 
          height: size * 1.8,
          background: 'linear-gradient(135deg, rgba(200,200,200,0.6) 0%, rgba(100,100,100,0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 10px rgba(0,0,0,0.15)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <Trash2 size={size} className="text-white relative z-10" strokeWidth={2} />
      </div>
    );
  }

  if (normName === 'profile') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-md ${className}`}
        style={{ 
          width: size * 1.8, 
          height: size * 1.8,
          background: 'linear-gradient(135deg, #083344 0%, #0e7490 50%, #06b6d4 100%)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 10px rgba(6,182,212,0.3)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <User size={size} className="text-white relative z-10" strokeWidth={2} />
      </div>
    );
  }

  if (normName === 'camera') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden ${className}`}
        style={{ 
          width: size * 2.5, 
          height: size * 2.5,
          // background: '#e1e0e4',
          // border: '1px solid rgba(255, 255, 255, 0.25)',
          // boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 10px rgba(168,85,247,0.3)'
        }}
      >

        <img src="/iconn/camera.png" alt="" srcset="" />

      </div>
    );
  }

  if (normName === 'terminal') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-md ${className}`}
        style={{ 
          width: size * 1.8, 
          height: size * 1.8,
          background: 'linear-gradient(135deg, #1e1e3f 0%, #0d0d1e 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 4px 10px rgba(13,13,30,0.4)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
        <Terminal size={size} className="text-emerald-400 relative z-10 animate-pulse" strokeWidth={2.5} />
      </div>
    );
  }

  // Fallback icon
  return <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md border border-white/20"><Globe size={size} /></div>;
};
