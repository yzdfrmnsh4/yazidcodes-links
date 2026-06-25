import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Search, 
  Home, 
  ChevronRight, 
  Globe, 
  ExternalLink,
  MousePointerClick
} from 'lucide-react';

interface TabPageState {
  url: string;
  title: string;
}

export const SafariContent: React.FC = () => {
  const [history, setHistory] = useState<TabPageState[]>([
    { url: 'https://yazid.dev/portfolio', title: 'Muhammad Yazid — Portfolio Hub' }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [addressInput, setAddressInput] = useState<string>('https://yazid.dev/portfolio');
  const currentPage = history[historyIndex];

  const navigateTo = (url: string, title: string) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push({ url, title });
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setAddressInput(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let destUrl = addressInput.trim();
      if (!destUrl.startsWith('http://') && !destUrl.startsWith('https://')) {
        destUrl = `https://${destUrl}`;
      }
      navigateTo(destUrl, `Simulated: ${destUrl}`);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAddressInput(history[historyIndex - 1].url);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAddressInput(history[historyIndex + 1].url);
    }
  };

  const handleHome = () => {
    navigateTo('https://yazid.dev/portfolio', 'Muhammad Yazid — Portfolio Hub');
  };

  return (
    <div className="flex flex-col h-full font-sans select-none text-slate-100 min-h-[300px]">
      {/* Browser Chrome Header bar */}
      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-2.5 flex items-center justify-between space-x-3 shadow-inner">
        {/* Nav arrows group */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button 
            disabled={historyIndex === 0} 
            onClick={handleBack}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none"
            title="Back"
          >
            <ArrowLeft size={14} />
          </button>
          
          <button 
            disabled={historyIndex === history.length - 1} 
            onClick={handleForward}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none"
            title="Forward"
          >
            <ArrowRight size={14} />
          </button>
          
          <button 
            onClick={() => setAddressInput(currentPage.url)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
            title="Reload"
          >
            <RotateCw size={13} />
          </button>

          <button 
            onClick={handleHome}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
            title="Home"
          >
            <Home size={13} />
          </button>
        </div>

        {/* Address bar search field */}
        <div className="flex-1 max-w-lg relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Globe size={11} className="text-cyan-400" />
          </div>
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full h-7 bg-slate-900/60 rounded-md pl-7 pr-3 text-[11px] font-mono text-cyan-300 border border-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            placeholder="Type web address or search..."
            id="safari-address-box"
          />
        </div>

        {/* Action badge */}
        {/* <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-500/20 text-[10px] uppercase font-bold text-cyan-300 border border-cyan-400/20 shrink-0 select-none">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
          <span>Safari</span>
        </div> */}
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center space-x-4 px-2 py-2 border-b border-white/5 text-[10px] text-slate-400 font-medium">
        <span className="text-slate-500 uppercase tracking-widest font-semibold scale-90">Bookmarked:</span>
        <button onClick={() => navigateTo('https://yaziddev.vercel.app', 'Muhammad Yazid Portfolio')} className="hover:text-cyan-200 flex items-center gap-1 transition-colors">🔥 My Portfolio</button>
        <button onClick={() => navigateTo('https://github.com/yzdfrmnsh4', 'GitHub Repositories')} className="hover:text-cyan-200 flex items-center gap-1 transition-colors">💻 OpenGitHub</button>
        <button onClick={() => navigateTo('https://wa.me/628818208207', 'WhatsApp Private Dial')} className="hover:text-cyan-200 flex items-center gap-1 transition-colors">📞 WhatsApp</button>
      </div>

      {/* Browser Viewport View */}
      <div className="flex-1 bg-slate-950/20 rounded-xl p-4 mt-3 border border-white/5 overflow-auto">
        {currentPage.url === 'https://yazid.dev/portfolio' ? (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="p-4 bg-gradient-to-tr from-cyan-900/40 to-slate-900/40 rounded-xl border border-cyan-500/15">
              <h4 className="text-sm font-bold text-cyan-200 flex items-center gap-1.5">
                <span>Featured Project: Link Bio macOS Style</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-bold uppercase py-0.5 px-1.5 rounded">Core-SPA</span>
              </h4>
              <p className="text-slate-300 mt-2 leading-relaxed">
                Platform portfolio web mandiri super interaktif yang dirancang untuk mensimulasikan lingkungan sistem operasi desktop lengkap dengan glassmorphism real-time, navigasi micro-bouncing dock, dynamic widget ticker, dan panel detail pekerjaan.
              </p>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-0.5 bg-white/5 border border-white/5 text-[10px] text-slate-400 rounded-md">React 19</span>
                <span className="px-2 py-0.5 bg-white/5 border border-white/5 text-[10px] text-slate-400 rounded-md">Tailwind v4</span>
                <span className="px-2 py-0.5 bg-white/5 border border-white/5 text-[10px] text-slate-400 rounded-md">Framer Motion</span>
                <span className="px-2 py-0.5 bg-white/5 border border-white/5 text-[10px] text-slate-400 rounded-md">WebGl</span>
                <span className="px-2 py-0.5 bg-white/5 border border-white/5 text-[10px] text-slate-400 rounded-md">macOS Icon</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 bg-slate-900/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">UI Design</span>
                <h5 className="font-bold text-white text-xs mt-0.5">Liquid Glass Architecture</h5>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-normal">Penerapan blur latar belakang bertumpuk (nested layers), shadow reflektif, serta pencahayaan linear miring (diagonal glow) yang meniru kaca cair.</p>
              </div>

              <div className="p-3.5 bg-slate-900/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Performance</span>
                <h5 className="font-bold text-white text-xs mt-0.5">Optimized Client-Side Hub</h5>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-normal">Memecah komponen ke bundel sub-modul terpisah serta sinkronisasi state non-blocking untuk performa rendering 120 FPS tanpa lag.</p>
              </div>
            </div>

            {/* Simulated CTA Link Button */}
            <div className="pt-2 text-center">
              <a 
                href="https://github.com/username" 
                target="_blank" 
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold transition-all shadow-md active:scale-95"
              >
                <span>Lihat Kode Sumber GitHub</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5 mb-3">
              <Search className="text-slate-400" size={18} />
            </div>
            <h4 className="text-sm font-bold text-white">Direct URL Proxy Simulator</h4>
            <p className="text-slate-400 text-[11px] max-w-sm mt-2 leading-relaxed">
              Anda sedang melihat domain eksternal disimulasikan: <span className="text-cyan-300 font-mono text-[10px]">{currentPage.url}</span>.
              <br />
              Klik tombol di bawah ini untuk membuka navigasi url asli di tab browser eksternal Anda.
            </p>
            <a 
              href={currentPage.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <MousePointerClick size={12} />
              Buka {currentPage.url.replace('https://', '')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
