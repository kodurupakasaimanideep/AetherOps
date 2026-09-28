import React from 'react';
import { Bell, User, ShieldCheck, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-medium text-indigo-300">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>What is happening right now, what caused it, and have we seen this before?</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Autonomous Guard Active</span>
        </div>

        <button className="relative text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2 border-l border-slate-800 pl-4 text-xs">
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-200 font-semibold block leading-tight">DevOps Engineer</span>
            <span className="text-[10px] text-slate-400 font-mono">SRE Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
};
