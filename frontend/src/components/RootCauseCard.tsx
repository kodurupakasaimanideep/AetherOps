import React from 'react';
import { InvestigationResult } from '../types/incident';
import { CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface RootCauseCardProps {
  investigation: InvestigationResult;
}

export const RootCauseCard: React.FC<RootCauseCardProps> = ({ investigation }) => {
  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-6 space-y-4 shadow-xl shadow-indigo-500/5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">AI Root-Cause Diagnosis</h3>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">
          <span className="text-xs text-indigo-400 font-semibold">
            Confidence: {investigation.confidence_score}%
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Root Cause Hypothesis
        </h4>
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-lg flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-slate-200">{investigation.root_cause}</p>
        </div>
      </div>

      {investigation.ai_analysis_text && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Reasoning Details
          </h4>
          <pre className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap font-mono">
            {investigation.ai_analysis_text}
          </pre>
        </div>
      )}
    </div>
  );
};
