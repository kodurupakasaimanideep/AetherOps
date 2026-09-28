import React, { useState } from 'react';
import { Incident } from '../types/incident';
import { IncidentList } from '../components/IncidentList';
import { IncidentDetails } from '../components/IncidentDetails';
import { RootCauseCard } from '../components/RootCauseCard';
import { MemoryCard } from '../components/MemoryCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { Timeline } from '../components/Timeline';
import { LoadingState } from '../components/LoadingState';
import { AlertCircle, CheckCircle, Flame, Clock, BrainCircuit, Sparkles } from 'lucide-react';

interface DashboardProps {
  incidents: Incident[];
  loading: boolean;
  onInvestigate: (inc: Incident) => void;
  investigation: any;
  investigating: boolean;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  incidents,
  loading,
  onInvestigate,
  investigation,
  investigating,
  onRefresh,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED');
  const resolvedIncidents = incidents.filter((i) => i.status === 'RESOLVED');

  if (loading) return <LoadingState message="Loading OpsMemory AI Production Intelligence..." />;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">GOOD EVENING, DEVOPS ENGINEER</h2>
          <p className="text-xs text-slate-400 mt-0.5">Production Intelligence & Real-time Organizational Memory</p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">ACTIVE INCIDENTS</p>
            <h3 className="text-2xl font-bold text-white mt-1">{activeIncidents.length}</h3>
          </div>
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">RESOLVED INCIDENTS</p>
            <h3 className="text-2xl font-bold text-white mt-1">{resolvedIncidents.length + 124}</h3>
          </div>
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">MEMORIES LOADED</p>
            <h3 className="text-2xl font-bold text-white mt-1">2,481</h3>
          </div>
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">AVG MTTR WITH AI</p>
            <h3 className="text-2xl font-bold text-white mt-1">18 min</h3>
          </div>
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Incidents & AI Memory Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Flame className="w-4 h-4 text-red-400" />
              <span>Active System Incidents</span>
            </h3>
            <IncidentList
              incidents={incidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
            />
          </div>

          {investigation && (
            <>
              <RootCauseCard investigation={investigation} />
              <RecommendationCard
                remediationSteps={investigation.remediation_steps}
                recommendedRunbook={investigation.recommended_runbook}
              />
              <Timeline steps={investigation.investigation_steps} />
            </>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          {selectedIncident ? (
            <IncidentDetails
              incident={selectedIncident}
              onInvestigate={() => onInvestigate(selectedIncident)}
              investigating={investigating}
              onRefresh={onRefresh}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-indigo-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Select an Incident</h4>
              <p className="text-xs text-slate-400">
                Click any incident card from the left panel to inspect live metrics and trigger AI root cause analysis.
              </p>
            </div>
          )}

          {/* AI Memory Insights Panel */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">AI Memory Insights</h3>
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                Hindsight DNA Engine
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>INC-001 PostgreSQL Pool Exhaustion</span>
                  <span className="text-emerald-400 font-mono font-bold">92% Match</span>
                </div>
                <p className="text-slate-400 text-[11px]">Unclosed DB connections in tracking middleware after v2.4.1 release.</p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>INC-002 Payment Gateway Timeout</span>
                  <span className="text-emerald-400 font-mono font-bold">87% Match</span>
                </div>
                <p className="text-slate-400 text-[11px]">Worker thread pool starvation during third-party provider latency.</p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>INC-003 Redis Cache OOM Crash</span>
                  <span className="text-emerald-400 font-mono font-bold">81% Match</span>
                </div>
                <p className="text-slate-400 text-[11px]">Unbounded session token caching without eviction TTL policy.</p>
              </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg text-xs">
              <span className="text-indigo-400 font-bold block mb-1">Common Root Cause Pattern:</span>
              <p className="text-slate-300">Database connection pool exhaustion and unindexed table scans following deployment releases.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Production Incident Timeline</h3>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 px-4 border-t border-slate-800">
          <div className="flex flex-col items-center space-y-1">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span className="text-slate-200 font-semibold">10:30 AM</span>
            <span>Deployment Release</span>
          </div>
          <div className="w-full h-0.5 bg-slate-800 mx-2"></div>
          <div className="flex flex-col items-center space-y-1">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-red-400 font-semibold">10:32 AM</span>
            <span>HTTP 503 Spike</span>
          </div>
          <div className="w-full h-0.5 bg-slate-800 mx-2"></div>
          <div className="flex flex-col items-center space-y-1">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-amber-400 font-semibold">10:34 AM</span>
            <span>Memory Match Found</span>
          </div>
          <div className="w-full h-0.5 bg-slate-800 mx-2"></div>
          <div className="flex flex-col items-center space-y-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-400 font-semibold">10:45 AM</span>
            <span>Incident Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
