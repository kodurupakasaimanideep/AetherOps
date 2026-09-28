export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  summary: string;
  symptoms: string[];
  root_cause?: string;
  resolution?: string;
  created_at: string;
  resolved_at?: string;
  tags: string[];
  match_score?: number;
}

export interface InvestigationStep {
  step_number: number;
  tool_used: string;
  action: string;
  observation: string;
  timestamp: string;
}

export interface InvestigationResult {
  incident_id: string;
  status: string;
  root_cause: string;
  confidence_score: number;
  matched_past_incidents: Incident[];
  investigation_steps: InvestigationStep[];
  recommended_runbook?: string;
  remediation_steps: string[];
  ai_analysis_text?: string;
}
