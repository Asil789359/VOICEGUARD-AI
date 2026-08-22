import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Upload, FileAudio, AlertCircle } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { audioProcessor } from '../services/audioProcessor';
import { AcousticFeatures } from '../types';

interface RecordingViewProps {
  onFinishRecording: (audioBuffer: ArrayBuffer, audioName: string, durationSeconds: number) => void;
  onCancel: () => void;
}

export const RecordingView: React.FC<RecordingViewProps> = ({
  onFinishRecording,
  onCancel
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [liveFeatures, setLiveFeatures] = useState<Partial<AcousticFeatures>>({
    spectralCentroid: 2400,
    zeroCrossingRate: 0.1
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startMicRecording = async () => {
    try {
      setErrorMsg(null);
      audioChunksRef.current = [];

      const stream = await audioProcessor.startMicrophone((features) => {
        setLiveFeatures(features);
      });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        audioProcessor.stopMicrophone();
        onFinishRecording(arrayBuffer, 'Live Mic Recording.wav', seconds || 5);
      };

      recorder.start();
      setIsRecording(true);
      setSeconds(0);

      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setErrorMsg('Microphone access denied or not supported on this device. You can import an audio file below.');
      audioProcessor.stopMicrophone();
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      onFinishRecording(arrayBuffer, file.name, 6);
    } catch (err) {
      setErrorMsg('Could not process selected audio file. Please use WAV, MP3, or M4A format.');
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      audioProcessor.stopMicrophone();
    };
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#00F2FE]" />
            <span>VOICE CAPTURE</span>
          </h2>
          <p className="text-xs text-[#8E99B7]">Record live speech or import an audio file</p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-[#8E99B7] hover:text-white px-2.5 py-1 rounded-lg bg-[#ffffff08]"
        >
          Cancel
        </button>
      </div>

      {/* Live Audio Visualizer */}
      <AudioVisualizer
        isRecording={isRecording}
        spectralCentroid={liveFeatures.spectralCentroid}
        zeroCrossingRate={liveFeatures.zeroCrossingRate}
      />

      {/* Recording Timer & Pulse Animation */}
      <div className="w-full glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
        <div className="relative flex items-center justify-center">
          <button
            onClick={isRecording ? stopMicRecording : startMicRecording}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all ${
              isRecording
                ? 'bg-[#FF3B30] text-white pulsing-mic shadow-[0_0_40px_rgba(255,59,48,0.6)]'
                : 'bg-gradient-to-br from-[#00F2FE] to-[#4FACFE] text-black hover:scale-105 shadow-[0_0_30px_rgba(0,242,254,0.4)]'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-8 h-8 fill-current" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase">STOP</span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase">RECORD</span>
              </>
            )}
          </button>
        </div>

        <div>
          <div className="text-2xl font-mono font-bold text-white tracking-widest">
            {formatTimer(seconds)}
          </div>
          <p className="text-xs text-[#8E99B7] mt-1 font-medium">
            {isRecording ? '● Listening & Extracting Acoustic Features...' : 'Tap record to capture voice'}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-[#FF3B3015] border border-[#FF3B3040] text-xs text-[#FF3B30] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Import File Section */}
      <div className="w-full glass-panel p-4 rounded-2xl flex flex-col gap-2">
        <span className="text-xs font-bold text-white flex items-center gap-2">
          <FileAudio className="w-4 h-4 text-[#00F2FE]" />
          <span>IMPORT AUDIO FILE</span>
        </span>
        <p className="text-[11px] text-[#8E99B7]">Supports WAV, MP3, M4A, AAC, OGG audio samples</p>

        <label className="w-full mt-2 py-3 px-4 rounded-xl bg-[#141828] border border-dashed border-[#00F2FE50] hover:border-[#00F2FE] text-xs text-[#00F2FE] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
          <Upload className="w-4 h-4" />
          <span>Browse File from Device</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
