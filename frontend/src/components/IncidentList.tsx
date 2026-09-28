import React from 'react';
import { Incident } from '../types/incident';
import { IncidentCard } from './IncidentCard';

interface IncidentListProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({ incidents, onSelectIncident }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {incidents.map((incident, idx) => (
        <IncidentCard
          key={`${incident.id}-${idx}`}
          incident={incident}
          onClick={() => onSelectIncident(incident)}
        />
      ))}
    </div>
  );
};
