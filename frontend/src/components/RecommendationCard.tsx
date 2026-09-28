import React from 'react';
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  remediationSteps: string[];
  recommendedRunbook?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  remediationSteps,
  recommendedRunbook,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>Recommended Remediation Plan</span>
        </h3>
        {recommendedRunbook && (
          <div className="flex items-center space-x-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Runbook: {recommendedRunbook}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {remediationSteps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3 bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-xs text-slate-200"
          >
            <ArrowRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
