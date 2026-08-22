import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2 } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface AnalysisViewProps {
  audioName: string;
  onCompleteAnalysis: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ audioName, onCompleteAnalysis }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { label: 'Audio Quality & Normalization', desc: 'Resampling, noise profiling & gain check' },
    { label: 'Voice Activity Detection (VAD)', desc: 'Speech segmentation & silence filtering' },
    { label: 'Spectral & Acoustic Extraction', desc: 'Spectral Centroid, ZCR & prosody variance' },
    { label: 'Anti-Spoofing Model Classifier', desc: 'Neural vocoder phase artifact analysis' },
    { label: 'Social Engineering Threat Analysis', desc: 'NLP threat & scam context scanning' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onCompleteAnalysis();
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 p-4 min-h-[550px] justify-between">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#00F2FE15] border border-[#00F2FE40] flex items-center justify-center">
          <Cpu className="w-5 h-5 text-[#00F2FE] animate-pulse" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">ANALYZING VOICE</h2>
          <p className="text-xs text-[#8E99B7] truncate max-w-[240px] font-mono">{audioName}</p>
        </div>
      </div>

      {/* Visualizer */}
      <AudioVisualizer isAnalyzing={true} spectralCentroid={3600} zeroCrossingRate={0.16} />

      {/* Checklist */}
      <div className="w-full glass-panel p-4 rounded-2xl flex flex-col gap-3">
        {steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl transition-all flex items-center justify-between border ${
                isCurrent
                  ? 'bg-[#00F2FE10] border-[#00F2FE50] shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                  : isDone
                  ? 'bg-[#141828] border-[#34C75930]'
                  : 'bg-[#0D0F17] border-[#ffffff08] opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-[#34C759] flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-[#00F2FE] animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-[#ffffff30] flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">{step.label}</h4>
                  <p className="text-[10px] text-[#8E99B7]">{step.desc}</p>
                </div>
              </div>

              {isDone && <span className="text-[10px] font-bold text-[#34C759] font-mono">✓ PASS</span>}
              {isCurrent && <span className="text-[10px] font-bold text-[#00F2FE] font-mono animate-pulse">RUNNING</span>}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-[#5C6784] font-medium">
        On-Device Inference • Privacy-Preserving Bio-Signal Processing
      </div>
    </div>
  );
};
