import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording?: boolean;
  isAnalyzing?: boolean;
  spectralCentroid?: number;
  zeroCrossingRate?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording = false,
  isAnalyzing = false,
  spectralCentroid = 2800,
  zeroCrossingRate = 0.12
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Spectrogram Frequency Bars
      const numBars = 36;
      const barWidth = (width - 40) / numBars;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 12;

        if (isRecording || isAnalyzing) {
          const mult = isAnalyzing ? 1.5 : 1.0;
          barHeight = Math.sin(phase + i * 0.2) * 35 * mult + Math.cos(phase * 1.5 + i * 0.1) * 20 + 40;
        } else {
          barHeight = 15 + Math.sin(i * 0.5) * 8;
        }

        barHeight = Math.max(6, Math.min(height - 20, barHeight));

        const x = 20 + i * barWidth;
        const y = (height - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y + barHeight, 0, y);
        if (isAnalyzing && i > 24) {
          // Warning synthetic frequency indicator
          grad.addColorStop(0, '#FF3B30');
          grad.addColorStop(1, '#FFCC00');
        } else {
          grad.addColorStop(0, '#00F2FE');
          grad.addColorStop(1, '#4FACFE');
        }

        ctx.fillStyle = grad;
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = isRecording || isAnalyzing ? 8 : 0;
        ctx.fillRect(x, y, barWidth - 3, barHeight);
      }

      // Draw Waveform Overlay Line
      ctx.beginPath();
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00F2FE';

      for (let x = 0; x < width; x += 4) {
        const freqMult = isRecording ? 0.05 : 0.02;
        const amp = isRecording ? 25 : isAnalyzing ? 15 : 6;
        const y = height / 2 + Math.sin(x * freqMult + phase) * amp * Math.cos(x * 0.01 + phase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isRecording ? 0.12 : isAnalyzing ? 0.08 : 0.03;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRecording, isAnalyzing]);

  return (
    <div className="w-full relative glass-panel p-3 rounded-2xl flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold text-[#8E99B7] flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-[#FF3B30] animate-ping' : isAnalyzing ? 'bg-[#00F2FE] animate-pulse' : 'bg-[#34C759]'}`}></span>
          {isRecording ? 'LIVE AUDIO SPECTROGRAM' : isAnalyzing ? 'SPECTRAL FEATURE ENGINE' : 'SPECTRAL STANDBY'}
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono text-[#8E99B7]">
          <span>ZCR: {zeroCrossingRate}</span>
          <span>Centroid: {spectralCentroid} Hz</span>
        </div>
      </div>

      <div className="relative w-full h-28 bg-[#05060A] rounded-xl overflow-hidden border border-[#ffffff10]">
        <canvas
          ref={canvasRef}
          width={380}
          height={112}
          className="w-full h-full block"
        />
        {isAnalyzing && <div className="scan-beam" />}
      </div>
    </div>
  );
};
