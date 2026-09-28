import React from 'react';
import { Sliders, Shield, Cpu, Key, Database, RefreshCw } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Sliders className="w-6 h-6 text-indigo-400" />
          <span>OpsMemory Copilot Configuration</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage AI reasoning providers, Hindsight vector thresholds, and human-in-the-loop guardrails.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        {/* Reasoning Provider */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>AI Reasoning Provider</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-lg border border-indigo-500/50 shadow-md">
              <span className="text-xs font-bold text-indigo-400 block">Google Gemini 1.5 Flash</span>
              <span className="text-[11px] text-slate-400">Primary SRE reasoning & log analysis LLM</span>
            </div>
            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800 opacity-60">
              <span className="text-xs font-bold text-slate-300 block">Azure OpenAI GPT-4o</span>
              <span className="text-[11px] text-slate-400">Fallback enterprise model</span>
            </div>
          </div>
        </div>

        {/* Hindsight Vector Engine Config */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Hindsight Incident Memory Settings</span>
          </h3>
          <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Similarity Vector Threshold:</span>
              <span className="text-emerald-400 font-mono font-bold">0.25 Cosine Score</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Max Top-K Memory Matches:</span>
              <span className="text-indigo-400 font-mono font-bold">5 Incidents</span>
            </div>
          </div>
        </div>

        {/* Action Guardrails */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Autonomous Action Guardrails</span>
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <label className="flex items-center space-x-3 bg-slate-800/40 p-3 rounded-lg border border-slate-800 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-0" />
              <span>Require SRE approval before scaling database connection pools or applying hotfixes</span>
            </label>
            <label className="flex items-center space-x-3 bg-slate-800/40 p-3 rounded-lg border border-slate-800 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-0" />
              <span>Automatically index verified incident resolutions into Hindsight Memory</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
