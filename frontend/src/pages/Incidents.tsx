import React, { useState } from 'react';
import { Incident } from '../types/incident';
import { IncidentList } from '../components/IncidentList';
import { IncidentDetails } from '../components/IncidentDetails';

interface IncidentsProps {
  incidents: Incident[];
  onInvestigate: (inc: Incident) => void;
  investigating: boolean;
}

export const Incidents: React.FC<IncidentsProps> = ({
  incidents,
  onInvestigate,
  investigating,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Production Incidents Registry</h2>
        <IncidentList
          incidents={incidents}
          onSelectIncident={(inc) => setSelectedIncident(inc)}
        />
      </div>
      <div className="lg:col-span-6">
        {selectedIncident ? (
          <IncidentDetails
            incident={selectedIncident}
            onInvestigate={() => onInvestigate(selectedIncident)}
            investigating={investigating}
          />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
            Select an incident to view details
          </div>
        )}
      </div>
    </div>
  );
};
