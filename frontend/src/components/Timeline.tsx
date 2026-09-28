import React from 'react';
import { InvestigationStep } from '../types/incident';
import { Activity, Wrench } from 'lucide-react';

interface TimelineProps {
  steps: InvestigationStep[];
}

export const Timeline: React.FC<TimelineProps> = ({ steps }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <h3 className="text-base font-bold text-white flex items-center space-x-2">
        <Activity className="w-5 h-5 text-indigo-400" />
        <span>Agent Investigation Audit Timeline</span>
      </h3>

      <div className="relative border-l-2 border-indigo-500/30 ml-3 space-y-6 pl-6 py-2">
        {steps.map((step) => (
          <div key={step.step_number} className="relative group">
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center"></div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-indigo-400 font-mono">
                  Step {step.step_number}: [{step.tool_used}]
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 mt-0.5">{step.action}</p>
              <p className="text-xs text-slate-400 bg-slate-800/50 p-2.5 rounded mt-1.5 border border-slate-800">
                {step.observation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
