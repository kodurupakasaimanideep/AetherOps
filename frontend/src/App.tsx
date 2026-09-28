import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Incidents } from './pages/Incidents';
import { Memory } from './pages/Memory';
import { Settings } from './pages/Settings';
import { ChatPanel } from './components/ChatPanel';
import { useIncidents } from './hooks/useIncidents';
import { useAgent } from './hooks/useAgent';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { incidents, loading, refreshIncidents } = useIncidents();
  const { investigation, investigating, runInvestigation, chatMessages, sendMessage } = useAgent();

  const handleInvestigate = (incident: any) => {
    runInvestigation(incident.id);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {activeTab === 'dashboard' && (
            <Dashboard
              incidents={incidents}
              loading={loading}
              onInvestigate={handleInvestigate}
              investigation={investigation}
              investigating={investigating}
              onRefresh={refreshIncidents}
            />
          )}
          {activeTab === 'incidents' && (
            <Incidents
              incidents={incidents}
              onInvestigate={handleInvestigate}
              investigating={investigating}
            />
          )}
          {activeTab === 'memory' && <Memory />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
      <div className="w-80 border-l border-slate-800 p-4 bg-slate-900/50 hidden xl:block">
        <ChatPanel messages={chatMessages} onSendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default App;
