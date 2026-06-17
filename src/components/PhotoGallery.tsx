import React, { useState } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight, Map, Heart, Share2 } from 'lucide-react';

interface Photo {
  id: number;
  title: string;
  location: string;
  url: string;
  photographer: string;
}

export const PhotoGallery: React.FC = () => {
  const [activePhotoId, setActivePhotoId] = useState<number>(1);
  const [likes, setLikes] = useState<Record<number, boolean>>({});

  const photos: Photo[] = [
    {
      id: 1,
      title: "Lake Tahoe Emerald Shallows",
      location: "Emerald Bay, Lake Tahoe",
      url: "https://images.pexels.com/photos/1106472/pexels-photo-1106472.jpeg",
      photographer: "Sebastian Voortman"
    },
    {
      id: 2,
      title: "Crystal Clear Aqua Waves",
      location: "East Shore, Tahoe",
      url: "https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg",
      photographer: "John Doe"
    },
    {
      id: 3,
      title: "Serene Cosmic Horizon Reflection",
      location: "Sierra Mountains, Tahoe",
      url: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg",
      photographer: "Yuri"
    }
  ];

  const activePhoto = photos.find(p => p.id === activePhotoId) || photos[0];

  const handleNext = () => {
    setActivePhotoId(prev => (prev % photos.length) + 1);
  };

  const handlePrev = () => {
    setActivePhotoId(prev => (prev === 1 ? photos.length : prev - 1));
  };

  const toggleLike = (id: number) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full font-sans select-none text-slate-100">
      {/* Lightbox / Large Image viewer */}
      <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-white/10 group bg-black/80">
        <img
          src={activePhoto.url}
          alt={activePhoto.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Liquid Glass Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
        
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-slate-900/80 transition-all active:scale-90 focus:outline-none"
        >
          <ChevronLeft size={16} />
        </button>

        <button 
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-slate-900/80 transition-all active:scale-90 focus:outline-none"
        >
          <ChevronRight size={16} />
        </button>

        {/* Details Tag */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-cyan-300 tracking-wider flex items-center gap-1">
              <Map size={10} /> {activePhoto.location}
            </span>
            <h4 className="text-sm font-bold text-white drop-shadow-md">{activePhoto.title}</h4>
            <p className="text-[10px] text-slate-300 opacity-80">Photo by {activePhoto.photographer}</p>
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => toggleLike(activePhoto.id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md active:scale-75 transition-all ${
                likes[activePhoto.id] ? 'bg-rose-500/80 border-rose-500 text-white' : 'bg-slate-900/55 hover:bg-slate-900/85 text-white/80'
              }`}
            >
              <Heart size={13} fill={likes[activePhoto.id] ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Thumbnail selector */}
      <div className="mt-4">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider pl-1 mb-2 block">All Assets</span>
        <div className="grid grid-cols-3 gap-3">
          {photos.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhotoId(item.id)}
              className={`relative h-14 sm:h-18 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                activePhotoId === item.id 
                  ? 'border-cyan-400 ring-2 ring-cyan-400/30 ring-offset-2 ring-offset-transparent scale-98 shadow-md' 
                  : 'border-white/10 hover:border-white/20 hover:scale-[1.02]'
              }`}
            >
              <img
                src={item.url}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 transition-opacity ${activePhotoId === item.id ? 'bg-transparent' : 'bg-black/20 hover:bg-transparent'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
