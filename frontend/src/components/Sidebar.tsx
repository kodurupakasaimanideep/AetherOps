import React from 'react';
import { LayoutDashboard, AlertTriangle, Database, Settings as SettingsIcon, BrainCircuit } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'memory', label: 'Hindsight Memory', icon: Database },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
      <div>
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <BrainCircuit className="w-8 h-8 text-indigo-400" />
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">OpsMind</h1>
            <p className="text-xs text-indigo-400 font-medium">DevOps AI Copilot</p>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        <p>Hindsight Engine v1.0</p>
        <p className="text-emerald-400 flex items-center mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
          Vector Memory Connected
        </p>
      </div>
    </aside>
  );
};
