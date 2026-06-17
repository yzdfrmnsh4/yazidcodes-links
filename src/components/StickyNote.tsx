import React, { useState, useEffect } from 'react';
import { PenTool, CheckCircle, RotateCw, Trash2 } from 'lucide-react';

export const StickyNote: React.FC = () => {
  const [content, setContent] = useState<string>(() => {
    const saved = localStorage.getItem('yazid_sticky_note');
    return saved || '💡 Welcome to Yazid\'s Tahoe Desktop!\n\nThis is a fully editable sticky note. Feel free to draft thoughts or leave feedback here. Your changes will automatically persist in your localStorage!\n\n🚀 Features implemented:\n- Full Liquid-Glass layouts\n- Genuine React Drag-sorting modals\n- Simulated Spotify playlist streaming\n- Dynamic ipapi location tracker';
  });

  const [lastSaved, setLastSaved] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('yazid_sticky_note', content);
    
    // Simple visual auto-save feedback
    const now = new Date();
    setLastSaved(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [content]);

  const handleReset = () => {
    if (confirm('Verify: Reset sticky note back to defaults?')) {
      setContent('💡 Welcome to Yazid\'s Tahoe Desktop!\n\nThis is a fully editable sticky note. Feel free to draft thoughts or leave feedback here. Your changes will automatically persist in your localStorage!\n\n🚀 Features implemented:\n- Full Liquid-Glass layouts\n- Genuine React Drag-sorting modals\n- Simulated Spotify playlist streaming\n- Dynamic ipapi location tracker');
    }
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs text-white p-2 selection:bg-amber-950/20 select-text">
      {/* Simulation notepad paper lines background */}
      <div 
        className="flex-1 p-4 rounded-xl flex flex-col justify-between shadow-inner"
        style={{
          // background: 'linear-gradient(rgba(255, 230, 110, 0.95), rgba(254, 215, 68, 0.98))',
          border: '1px solid rgba(162, 162, 162, 0.4)',
          // backgroundImage: 'radial-gradient(ellipse at top left, rgba(255, 255, 255, 0.4) 0%, transparent 80%)'
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full flex-1 bg-transparent border-none text-white placeholder-white resize-none font-semibold focus:outline-none focus:ring-0 leading-relaxed scrollbar-none min-h-[180px]"
          placeholder="Tulis catatan di sini..."
          id="sticky-textbox"
        />

        <div className="flex justify-between items-center border-t border-blue-200 pt-2.5 mt-2 text-[10px] text-white leading-none">
          <span className="flex items-center gap-1">
            <CheckCircle size={10} className="text-white" />
            Saved: {lastSaved}
          </span>
          
          <button 
            onClick={handleReset}
            className="hover:text-white/50 text-white flex items-center gap-0.5 transition-colors focus:outline-none"
            title="Reset to original content"
          >
            <RotateCw size={10} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
