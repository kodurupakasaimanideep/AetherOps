import React from 'react';
import { Incident } from '../types/incident';
import { SeverityBadge } from './SeverityBadge';
import { Play, CheckCircle, AlertCircle, Cpu, Server } from 'lucide-react';

interface IncidentDetailsProps {
  incident: Incident;
  onInvestigate: () => void;
  investigating: boolean;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  incident,
  onInvestigate,
  investigating,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-sm font-mono text-indigo-400 font-bold">{incident.id}</span>
            <SeverityBadge severity={incident.severity} />
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
              {incident.status}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{incident.title}</h2>
        </div>
        <button
          onClick={onInvestigate}
          disabled={investigating}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          <span>{investigating ? 'Investigating...' : 'Run Agent Root-Cause Analysis'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800 flex items-center space-x-3">
          <Server className="w-5 h-5 text-indigo-400" />
          <div>
            <span className="text-slate-500 block">Target Service</span>
            <span className="text-slate-200 font-semibold">{incident.service}</span>
          </div>
        </div>
        <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800 flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-slate-500 block">Created At</span>
            <span className="text-slate-200 font-semibold">
              {new Date(incident.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Summary & Overview
        </h4>
        <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
          {incident.summary}
        </p>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Detected Symptoms
        </h4>
        <ul className="space-y-2">
          {incident.symptoms.map((symptom, idx) => (
            <li
              key={idx}
              className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/30 px-3 py-2 rounded border border-slate-800"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      {incident.root_cause && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            Confirmed Root Cause
          </h4>
          <p className="text-sm text-slate-200">{incident.root_cause}</p>
        </div>
      )}
    </div>
  );
};
