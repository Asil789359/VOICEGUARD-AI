import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Volume2, ShieldAlert, ChevronRight, HelpCircle, FileText, Info } from 'lucide-react';
import { AnalysisResult, AppLanguage } from '../types';
import { ttsService } from '../services/ttsService';

interface ResultViewProps {
  result: AnalysisResult;
  language: AppLanguage;
  onOpenProtection: () => void;
  onNewScan: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  language,
  onOpenProtection,
  onNewScan
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isCritical = result.overallThreat === 'CRITICAL' || result.overallThreat === 'HIGH';
  const isHuman = result.status === 'LIKELY_HUMAN';

  const handlePlayVoiceAlert = () => {
    setIsPlayingAudio(true);
    const textToSpeak = language === 'ta' ? result.explanationTa : result.explanationEn;
    ttsService.speakWarning(textToSpeak, language);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 5000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#FF3B30';
    if (score >= 60) return '#FF9500';
    if (score >= 40) return '#FFCC00';
    return '#34C759';
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {/* Top Risk Status Banner */}
      <div
        className={`w-full p-4 rounded-2xl border flex items-center justify-between shadow-xl ${
          isCritical
            ? 'bg-[#FF3B3015] border-[#FF3B3050] text-[#FF3B30]'
            : isHuman
            ? 'bg-[#34C75915] border-[#34C75950] text-[#34C759]'
            : 'bg-[#FFCC0015] border-[#FFCC0050] text-[#FFCC00]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold ${
              isCritical
                ? 'bg-[#FF3B30] text-white shadow-[0_0_15px_rgba(255,59,48,0.5)]'
                : isHuman
                ? 'bg-[#34C759] text-black'
                : 'bg-[#FFCC00] text-black'
            }`}
          >
            {isCritical ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80">
              OVERALL SECURITY RISK
            </span>
            <h3 className="text-sm font-extrabold tracking-tight">
              {result.overallThreat} THREAT LEVEL
            </h3>
          </div>
        </div>

        <button
          onClick={handlePlayVoiceAlert}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-current text-xs font-bold transition-all ${
            isPlayingAudio ? 'animate-bounce' : 'hover:scale-105'
          }`}
          title="Play Voice Alert"
        >
          <Volume2 className="w-4 h-4" />
          <span>{language === 'ta' ? 'குரல் எச்சரிக்கை' : 'Voice Alert'}</span>
        </button>
      </div>

      {/* Authenticity Score Card */}
      <div className="w-full glass-panel-glow p-5 rounded-2xl flex flex-col items-center gap-3 relative overflow-hidden">
        <span className="text-xs font-bold text-[#8E99B7] tracking-wider uppercase">
          VOICE AUTHENTICITY RISK SCORE
        </span>

        {/* Circular Risk Score Meter */}
        <div className="relative w-36 h-36 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke={getScoreColor(result.authenticityScore)}
              strokeWidth="10"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * result.authenticityScore) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span
              className="text-3xl font-extrabold font-mono tracking-tight"
              style={{ color: getScoreColor(result.authenticityScore) }}
            >
              {result.authenticityScore}
            </span>
            <span className="text-[10px] text-[#8E99B7] font-bold">/ 100</span>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className="px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider border shadow-md font-mono"
          style={{
            borderColor: getScoreColor(result.authenticityScore),
            backgroundColor: `${getScoreColor(result.authenticityScore)}20`,
            color: getScoreColor(result.authenticityScore)
          }}
        >
          {result.status.replace(/_/g, ' ')}
        </div>

        <p className="text-xs text-center text-[#F0F4FF] leading-relaxed px-2 font-medium">
          {language === 'ta' ? result.explanationTa : result.explanationEn}
        </p>
      </div>

      {/* Why Was This Flagged? Signals List */}
      <div className="w-full glass-panel p-4 rounded-2xl flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#00F2FE]" />
            <span>DETECTED SIGNALS</span>
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="text-[11px] font-bold text-[#00F2FE] hover:underline"
          >
            Detailed Metrics →
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {result.keySignals.map((sig, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-[#141828] border border-[#ffffff08] text-xs text-[#8E99B7] flex items-start gap-2">
              <span className="text-[#00F2FE] font-bold font-mono">▸</span>
              <span className="text-white font-medium">{sig}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Engineering Scam Threat Card (If present) */}
      {result.scamAnalysis.detectedSignals.length > 0 && (
        <div className="w-full p-4 rounded-2xl bg-[#FF3B3010] border border-[#FF3B3030] flex flex-col gap-2">
          <span className="text-xs font-extrabold text-[#FF3B30] flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>SOCIAL ENGINEERING SCAM THREAT</span>
          </span>
          <p className="text-xs text-white italic">
            "{result.scamAnalysis.transcript}"
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {result.scamAnalysis.detectedSignals.map((sig, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-[#FF3B3020] text-[#FF3B30] border border-[#FF3B3040] text-[10px] font-bold">
                {language === 'ta' ? sig.labelTa : sig.labelEn}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-1">
        <button
          onClick={onOpenProtection}
          className="btn-cyan w-full text-sm"
        >
          <ShieldCheck className="w-4 h-4 text-black stroke-[2.5]" />
          <span>WHAT SHOULD I DO NEXT?</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        <button
          onClick={onNewScan}
          className="btn-secondary w-full text-xs"
        >
          <span>Analyze Another Voice Recording</span>
        </button>
      </div>

      {/* Detailed Metrics Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-[#00F2FE50]">
            <div className="flex items-center justify-between border-b border-[#ffffff10] pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00F2FE]" />
                <span>ACOUSTIC FEATURE BREAKDOWN</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-xs text-[#8E99B7]">✕</button>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs text-[#8E99B7]">
              <div className="flex justify-between border-b border-[#ffffff05] pb-1">
                <span>Spectral Centroid:</span>
                <span className="text-white font-bold">{result.acousticFeatures.spectralCentroid} Hz</span>
              </div>
              <div className="flex justify-between border-b border-[#ffffff05] pb-1">
                <span>Spectral Flatness:</span>
                <span className="text-white font-bold">{result.acousticFeatures.spectralFlatness}</span>
              </div>
              <div className="flex justify-between border-b border-[#ffffff05] pb-1">
                <span>Zero Crossing Rate:</span>
                <span className="text-white font-bold">{result.acousticFeatures.zeroCrossingRate}</span>
              </div>
              <div className="flex justify-between border-b border-[#ffffff05] pb-1">
                <span>Pitch Stability:</span>
                <span className="text-white font-bold">{result.acousticFeatures.pitchStability}%</span>
              </div>
              <div className="flex justify-between border-b border-[#ffffff05] pb-1">
                <span>Robotic Artifact Index:</span>
                <span className="text-white font-bold">{result.acousticFeatures.roboticArtifacts}%</span>
              </div>
              <div className="flex justify-between border-b border-[#ffffff05] pb-1">
                <span>Prosody Variance:</span>
                <span className="text-white font-bold">{result.acousticFeatures.prosodyVariance}%</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="btn-cyan w-full py-2 text-xs mt-2"
            >
              Close Technical Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
