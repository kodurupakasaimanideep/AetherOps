import React from 'react';
import { Incident } from '../types/incident';
import { Database, ArrowUpRight } from 'lucide-react';

interface MemoryCardProps {
  memory: Incident;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory }) => {
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-lg p-4 space-y-2 hover:border-indigo-500/40 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono font-semibold text-indigo-400">{memory.id}</span>
        </div>
        {memory.match_score !== undefined && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {memory.match_score}% DNA Match
          </span>
        )}
      </div>

      <h4 className="text-sm font-semibold text-white">{memory.title}</h4>
      <p className="text-xs text-slate-400">{memory.summary}</p>

      {memory.resolution && (
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 text-xs text-slate-300 mt-2">
          <span className="text-emerald-400 font-semibold block mb-0.5">Verified Solution:</span>
          {memory.resolution}
        </div>
      )}
    </div>
  );
};
