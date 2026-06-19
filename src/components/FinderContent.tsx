import React, { useState } from 'react';
import { 
  User, 
  Code, 
  Terminal, 
  HelpCircle, 
  FileText, 
  Folder, 
  Cpu, 
  HardDrive, 
  Map, 
  Globe,
  Briefcase
} from 'lucide-react';
import { Nextjs } from './icon/tech/NextJs';
import { TailwindCSS } from './icon/tech/Tailwind';
import { Motion } from './icon/tech/motion';
import { TypeScript } from './icon/tech/TypeScript';
import { Laravel } from './icon/tech/Laravel';
import { Reactjs } from './icon/tech/React';
import { Php } from './icon/tech/Php';
import { JavaScript } from './icon/tech/Javascript';
import { MySQL } from './icon/tech/Mysql';
import { PostgreSQL } from './icon/tech/Postgree';

interface TabItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const FinderContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('about');

  const tabs: TabItem[] = [
    { id: 'about', name: 'Profile Bio', icon: <User size={15} className="text-cyan-400" /> },
    { id: 'skills', name: 'Tech Stack', icon: <Code size={15} className="text-emerald-400" /> },
    { id: 'experience', name: 'Experiences', icon: <Briefcase size={15} className="text-amber-400" /> },
    { id: 'system', name: 'System Info', icon: <Cpu size={15} className="text-rose-400" /> },
  ];

  return (
    <div className="flex h-full min-h-[320px] select-none text-slate-200 text-sm">
      {/* Sidebar navigation */}
      <div className="w-[150px] sm:w-[180px] border-r border-white/5 pr-4 flex flex-col justify-between shrink-0 font-sans">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400/80 tracking-wider pl-2 block mb-1">Favorites</span>
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors focus:outline-none ${
                      activeTab === tab.id 
                        ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/20 font-medium' 
                        : 'hover:bg-white/5 active:bg-white/10 text-slate-300'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400/80 tracking-wider pl-2 block mb-1">Locations</span>
            <ul className="space-y-1 text-xs text-slate-400 pl-2.5 font-medium">
              <li className="flex items-center space-x-2 py-0.5"><HardDrive size={12} className="text-teal-400" /> <span>Tahoe SSD</span></li>
              <li className="flex items-center space-x-2 py-0.5"><Globe size={12} className="text-indigo-400" /> <span>Cloud Network</span></li>
            </ul>
          </div>
        </div>

        <div className="p-2 border-t border-white/5 text-[10px] text-slate-500 leading-normal">
          <span>Yazid OS build v26.04</span>
        </div>
      </div>

      {/* Main Directory Area */}
      <div className="flex-1 pl-4 sm:pl-6 overflow-auto">
        {activeTab === 'about' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-20  shrink-0 shadow-lg border border-white/15 overflow-hidden rounded-md ">
                {/* <span className="font-bold text-2xl">Y</span> */}
                <img src="foto.png" alt="" srcset="" className=" size-fit fit" />

              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Muhammad Yazid</h2>
                <p className="text-xs text-slate-400">Front-End Developer & UI Architect</p>
                <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
                  {/* <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" /> */}
                  Available for new contracts / freelance queries
                </p>
              </div>
            </div>

            <hr className="border-white/5 mt-3" />

            <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
              <p>
                Saya adalah pengembang front-end ahli dengan spesialisasi dalam membangun antarmuka web interaktif yang kompleks, kaya animasi, dan berperforma tinggi. Saya suka bereksperimen dengan konsep UI revolusioner seperti <strong>Glassmorphic Liquid Web UI</strong> dan <strong>Framer Motion orchestration</strong>.
              </p>
              <p>
                Website internal ini dibangun di atas React, dikonfigurasi dengan integrasi CSS yang dioptimalkan, serta didesain meniru evolusi fiksi dari macOS (Tahoe) dan iOS 26.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                <div className="text-xs text-slate-400">Fokus Utama</div>
                <div className="text-sm font-semibold text-cyan-300 mt-1">Creative Styling & Animations</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                <div className="text-xs text-slate-400">Pekerjaan Saat Ini</div>
                <div className="text-sm font-semibold text-emerald-300 mt-1">SaaS & Rich Web Widgets</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 mb-1">Core Competency Folders</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { name: 'Next.js 14/15', icon: <Nextjs className="w-16" /> },
                { name: 'Tailwind CSS',  icon: <TailwindCSS className="w-16" />},
                { name: 'Framer Motion',  icon: <Motion className="w-16" />},
                { name: 'Lravel', icon: <Laravel className="w-16"  />},
                { name: 'TypeScript', icon: <TypeScript className="w-16" /> },
                { name: 'React Redux', icon: <Reactjs className="w-16" />},
                { name: 'PHP', icon: <Php className="w-16" />},
                { name: 'Javascript', icon: <JavaScript className="w-16" />},
                { name: 'Mysql', icon: <MySQL className="w-16" />},
                { name: 'Postgree', icon: <PostgreSQL className="w-16" />}
              ].map((skill, index) => (
                <div 
                  key={index} 
                  className="p-1 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all    flex items-center justify-center"
                >
                  <div>
                    {/* <div className="flex justify-between items-center">
                      <span className="font-semibold text-white text-xs">{skill.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-cyan-300 font-mono scale-90">{skill.level}</span>
                    </div> */}
                    {skill.icon}
                    {/* <p className="text-[10px] text-slate-400 mt-1 leading-normal">{skill.desc}</p> */}
                  </div>
                  {/* Skill level progress visualizer */}
                  {/* <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${skill.color}`} style={{ width: skill.level === 'Expert' ? '95%' : '85%' }} />
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 mb-2">My Creative Career Paths</h3>

            <div className="relative border-l border-white/10 pl-4 ml-2 space-y-5">
              {[
                { period: '2024 - Sekarang', title: 'Senior Front-End Architect', company: 'Interactive Solutions', desc: 'Memimpin arsitektur web micro-frontends berbasis Next.js App Router, menghemat load time 40% dan mengorkestrasikan animasi high-fidelity.' },
                { period: '2022 - 2024', title: 'Creative Interactive Developer', company: 'Nebula Creative Lab', desc: 'Mendesain website pemasaran premium, landing page interaktif dengan visual 3D Three.js dan transisi GSAP.' },
                { period: '2020 - 2022', title: 'Fullstack Web Engineer', company: 'Digital Agency Bandung', desc: 'Pengembangan full-stack aplikasi logistik dengan React, Node, Express, serta optimalisasi basis data relational.' }
              ].map((exp, index) => (
                <div key={index} className="relative">
                  {/* Timeline Node dot */}
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-900 ring-4 ring-cyan-500/20" />
                  <div className="text-[10px] font-mono text-cyan-400 font-semibold">{exp.period}</div>
                  <h4 className="text-xs font-bold text-white mt-0.5">{exp.title} — <span className="text-xs font-medium text-slate-300">{exp.company}</span></h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-3">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-white/10 flex items-center space-x-4">
              <Cpu className="text-rose-400 w-10 h-10 animate-pulse shrink-0" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">YAZID TAHOE CHIP (X26 CORE)</div>
                <div className="text-[11px] text-slate-400 font-mono">Processors: TSMC 1.8nm liquid computing nodes</div>
                <div className="text-[11px] text-emerald-400 font-mono">Frequency: 5.6 GHz turbo charge</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-white/10 space-y-2 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Platform Model:</span>
                <span>macOS Tahoe v26.0.4</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">System Memory:</span>
                <span>128 GB Unified LPDDR9</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Database Core:</span>
                <span>Relational Client State Cache</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Rendering Engine:</span>
                <span>Vite Webpack-free & GPU Accelerated</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Network:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-ping" />
                  Secured
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
