import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [isPhoneView, setIsPhoneView] = useState(true);

  return (
    <div className="min-h-screen bg-[#080A10] text-[#F0F4FF] flex flex-col items-center justify-start p-2 sm:p-4 md:p-6">
      {/* Top Bar for View Mode Selection & iQOO Hackathon Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-black">
            iQOO HACKATHON 2026
          </span>
          <span className="text-xs text-[#8E99B7] hidden sm:inline-block">
            Track: Open Innovation • On-Device AI Voice Security
          </span>
        </div>

        <button
          onClick={() => setIsPhoneView(!isPhoneView)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111420] border border-[#ffffff15] hover:border-[#00F2FE50] text-xs font-medium transition-all"
        >
          {isPhoneView ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>Expanded View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>iQOO Phone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Frame Container */}
      {isPhoneView ? (
        <div className="relative w-full max-w-[410px] h-[850px] max-h-[92vh] bg-[#000000] rounded-[48px] p-3 shadow-[0_0_60px_rgba(0,242,254,0.15)] border-[4px] border-[#222738] flex flex-col overflow-hidden">
          {/* Speaker / Camera Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-[#111420] rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#05060A] border border-[#ffffff20]"></div>
            <div className="w-8 h-1 rounded-full bg-[#222738] ml-2"></div>
          </div>

          {/* Inner Screen */}
          <div className="relative w-full h-full bg-[#080A10] rounded-[38px] overflow-y-auto overflow-x-hidden pt-7 flex flex-col">
            {children}
          </div>

          {/* Android Bottom Navigation Bar Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#ffffff40] rounded-full"></div>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-[#080A10] rounded-3xl border border-[#ffffff15] p-4 sm:p-6 shadow-2xl min-h-[800px]">
          {children}
        </div>
      )}
    </div>
  );
};
