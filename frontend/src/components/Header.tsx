import React from 'react';
import { Bell, Search, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident memory, logs, or runbooks..."
            className="w-full bg-slate-800/80 text-sm text-slate-200 pl-9 pr-4 py-1.5 rounded-lg border border-slate-700/60 focus:outline-none focus:border-indigo-500"
          />
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
      </div>
    </header>
  );
};
