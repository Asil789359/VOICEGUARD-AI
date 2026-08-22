import React from 'react';
import { ShieldCheck, Cpu, Languages, History, Home } from 'lucide-react';
import { AppLanguage } from '../types';

interface HeaderProps {
  language: AppLanguage;
  onToggleLanguage: () => void;
  activeTab: 'home' | 'history' | 'protection';
  onChangeTab: (tab: 'home' | 'history' | 'protection') => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  activeTab,
  onChangeTab
}) => {
  return (
    <header className="w-full px-4 py-3 bg-[#0D0F17]/90 backdrop-blur-md border-b border-[#ffffff10] sticky top-0 z-40 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onChangeTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F2FE] to-[#4FACFE] flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              VOICEGUARD <span className="text-[#00F2FE] text-xs px-1.5 py-0.5 rounded bg-[#00F2FE15] border border-[#00F2FE40]">AI</span>
            </h1>
            <p className="text-[10px] text-[#8E99B7] font-medium">On-Device Security</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* On-Device AI Badge */}
          <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#34C75915] border border-[#34C75940] text-[10px] font-semibold text-[#34C759]">
            <Cpu className="w-3 h-3 text-[#34C759]" />
            <span>On-Device</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#181C2E] border border-[#ffffff15] hover:border-[#00F2FE50] text-xs font-bold text-[#F0F4FF] transition-all"
            title="Toggle Language (English / Tamil)"
          >
            <Languages className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav className="flex items-center justify-around pt-1 border-t border-[#ffffff08]">
        <button
          onClick={() => onChangeTab('home')}
          className={`flex items-center gap-1.5 py-1 px-3 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'home' 
              ? 'text-[#00F2FE] bg-[#00F2FE10] border border-[#00F2FE30]' 
              : 'text-[#8E99B7] hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onChangeTab('protection')}
          className={`flex items-center gap-1.5 py-1 px-3 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'protection' 
              ? 'text-[#00F2FE] bg-[#00F2FE10] border border-[#00F2FE30]' 
              : 'text-[#8E99B7] hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protection</span>
        </button>

        <button
          onClick={() => onChangeTab('history')}
          className={`flex items-center gap-1.5 py-1 px-3 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'history' 
              ? 'text-[#00F2FE] bg-[#00F2FE10] border border-[#00F2FE30]' 
              : 'text-[#8E99B7] hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </nav>
    </header>
  );
};
