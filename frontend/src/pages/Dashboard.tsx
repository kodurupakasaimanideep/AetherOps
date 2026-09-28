import React, { useState } from 'react';
import { Incident } from '../types/incident';
import { IncidentList } from '../components/IncidentList';
import { IncidentDetails } from '../components/IncidentDetails';
import { RootCauseCard } from '../components/RootCauseCard';
import { MemoryCard } from '../components/MemoryCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { Timeline } from '../components/Timeline';
import { LoadingState } from '../components/LoadingState';
import { AlertCircle, CheckCircle, Flame, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  incidents: Incident[];
  loading: boolean;
  onInvestigate: (inc: Incident) => void;
  investigation: any;
  investigating: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  incidents,
  loading,
  onInvestigate,
  investigation,
  investigating,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED');
  const resolvedIncidents = incidents.filter((i) => i.status === 'RESOLVED');

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Incidents</p>
            <h3 className="text-2xl font-bold text-white mt-1">{activeIncidents.length}</h3>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Resolved Incidents</p>
            <h3 className="text-2xl font-bold text-white mt-1">{resolvedIncidents.length}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Hindsight Memories</p>
            <h3 className="text-2xl font-bold text-white mt-1">{incidents.length}</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Avg MTTR with AI</p>
            <h3 className="text-2xl font-bold text-white mt-1">12m</h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-4">Active System Incidents</h3>
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
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-indigo-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Select an Incident</h4>
              <p className="text-xs text-slate-400">
                Click any incident card from the list to view detailed symptoms and trigger AI root cause analysis.
              </p>
            </div>
          )}

          {investigation && investigation.matched_past_incidents?.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white">
                Matched Past Incidents (Hindsight DNA)
              </h3>
              {investigation.matched_past_incidents.map((mem: any) => (
                <MemoryCard key={mem.id} memory={mem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
