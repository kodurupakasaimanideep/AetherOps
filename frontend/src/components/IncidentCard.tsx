import React from 'react';
import { Incident } from '../types/incident';
import { SeverityBadge } from './SeverityBadge';
import { Clock, Tag, ArrowRight } from 'lucide-react';

interface IncidentCardProps {
  incident: Incident;
  onClick: () => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-slate-800/90 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            {incident.id}
          </span>
          <SeverityBadge severity={incident.severity} />
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium ${
              incident.status === 'RESOLVED'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : incident.status === 'INVESTIGATING'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {incident.status}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 min-w-0">
            {incident.title}
          </h3>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
        </div>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{incident.summary}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center space-x-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="truncate">{new Date(incident.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Tag className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate">{incident.service}</span>
        </div>
      </div>
    </div>
  );
};
