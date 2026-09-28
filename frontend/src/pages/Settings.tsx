import React from 'react';
import { Sliders, Shield, Cpu } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Sliders className="w-6 h-6 text-indigo-400" />
          <span>OpsMind Copilot Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure AI LLM models, vector thresholds, and automated guardrails.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>AI Reasoning Provider</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-lg border border-indigo-500/40">
              <span className="text-xs font-bold text-indigo-400 block">Google Gemini 1.5</span>
              <span className="text-[11px] text-slate-400">Primary reasoning LLM engine</span>
            </div>
            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800 opacity-60">
              <span className="text-xs font-bold text-slate-300 block">Azure OpenAI GPT-4o</span>
              <span className="text-[11px] text-slate-400">Fallback enterprise model</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Autonomous Action Guardrails</span>
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <label className="flex items-center space-x-3 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
              <span>Require SRE approval before scaling database connection pools</span>
            </label>
            <label className="flex items-center space-x-3 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
              <span>Automatically index resolved incidents into Hindsight Memory</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
