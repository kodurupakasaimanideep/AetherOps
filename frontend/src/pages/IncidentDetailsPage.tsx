import React from 'react';
import { Incident } from '../types/incident';
import { IncidentDetails } from '../components/IncidentDetails';

interface IncidentDetailsPageProps {
  incident: Incident;
  onInvestigate: () => void;
  investigating: boolean;
}

export const IncidentDetailsPage: React.FC<IncidentDetailsPageProps> = ({
  incident,
  onInvestigate,
  investigating,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <IncidentDetails
        incident={incident}
        onInvestigate={onInvestigate}
        investigating={investigating}
      />
    </div>
  );
};
