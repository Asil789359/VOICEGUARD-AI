import React from 'react';
import { History, Trash2, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface HistoryViewProps {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onClearHistory
}) => {
  return (
    <div className="w-full flex flex-col gap-4 p-4 min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#00F2FE]" />
            <span>ANALYSIS HISTORY</span>
          </h2>
          <p className="text-xs text-[#8E99B7]">Local encrypted scan logs</p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF3B3015] text-[#FF3B30] border border-[#FF3B3030] text-xs font-semibold hover:bg-[#FF3B3030] transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="w-full glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-3 my-auto">
          <History className="w-10 h-10 text-[#5C6784]" />
          <h3 className="text-sm font-bold text-white">No Scan History Yet</h3>
          <p className="text-xs text-[#8E99B7] max-w-[240px]">
            Voice recordings analyzed on your device will appear here for local reference.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {history.map((item) => {
            const isHigh = item.authenticityScore >= 60;
            const formattedDate = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={item.id}
                onClick={() => onSelectResult(item)}
                className="p-3.5 rounded-xl bg-[#141828] border border-[#ffffff10] hover:border-[#00F2FE50] cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isHigh ? 'bg-[#FF3B3020] text-[#FF3B30]' : 'bg-[#34C75920] text-[#34C759]'
                    }`}
                  >
                    {isHigh ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.audioName}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-[#8E99B7] mt-0.5">
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <span className="font-mono font-bold text-white">{item.authenticityScore}/100 Risk</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isHigh ? 'bg-[#FF3B3020] text-[#FF3B30]' : 'bg-[#34C75920] text-[#34C759]'
                    }`}
                  >
                    {item.status.replace(/_/g, ' ')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#8E99B7] group-hover:text-[#00F2FE] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
