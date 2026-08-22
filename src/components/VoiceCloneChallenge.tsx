import React from 'react';
import { Play, Sparkles, UserCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { CONTROLLED_SAMPLES } from '../data/controlledSamples';
import { ControlledSample } from '../types';

interface VoiceCloneChallengeProps {
  onSelectSample: (sample: ControlledSample) => void;
}

export const VoiceCloneChallenge: React.FC<VoiceCloneChallengeProps> = ({ onSelectSample }) => {
  return (
    <div className="w-full glass-panel-glow p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden">
      {/* Glow Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00F2FE15] border border-[#00F2FE40]">
          <Sparkles className="w-3.5 h-3.5 text-[#00F2FE]" />
          <span className="text-xs font-bold text-[#00F2FE]">VOICE CLONE CHALLENGE</span>
        </div>
        <span className="text-[10px] text-[#8E99B7] font-medium">3-Sample Hackathon Benchmark</span>
      </div>

      <p className="text-xs text-[#8E99B7] leading-relaxed">
        Test our on-device anti-spoofing engine instantly using controlled audio benchmark samples:
      </p>

      {/* 3 Controlled Sample Cards */}
      <div className="flex flex-col gap-2.5 mt-1">
        {CONTROLLED_SAMPLES.map((sample) => {
          const isHuman = sample.type === 'human';
          const isSynth = sample.type === 'synthetic';
          const isClone = sample.type === 'clone';

          return (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group p-3 rounded-xl bg-[#141828] border border-[#ffffff10] hover:border-[#00F2FE60] hover:bg-[#1A1F36] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-xs ${
                    isHuman
                      ? 'bg-[#34C75920] text-[#34C759] border border-[#34C75940]'
                      : isSynth
                      ? 'bg-[#FF3B3020] text-[#FF3B30] border border-[#FF3B3040]'
                      : 'bg-[#FFCC0020] text-[#FFCC00] border border-[#FFCC0040]'
                  }`}
                >
                  {isHuman ? (
                    <UserCheck className="w-5 h-5" />
                  ) : isSynth ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#ffffff10] text-[#F0F4FF] font-mono">
                      {sample.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{sample.title}</h4>
                  </div>
                  <p className="text-[11px] text-[#8E99B7] truncate mt-0.5">{sample.subtitle}</p>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="w-8 h-8 rounded-lg bg-[#00F2FE20] hover:bg-[#00F2FE] text-[#00F2FE] hover:text-black flex items-center justify-center transition-all flex-shrink-0 group-hover:scale-105"
                title="Run Detection Pipeline"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
