export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';

export interface LiveSignals {
  cpu: string;
  memory: string;
  errors: string;
  latency: string;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  summary: string;
  symptoms: string[];
  live_signals?: LiveSignals;
  deployment?: string;
  root_cause?: string;
  resolution?: string;
  created_at: string;
  resolved_at?: string;
  tags: string[];
  match_score?: number;
}

export interface EvidenceChainItem {
  title: string;
  incident_id: string;
  match_score: number;
  evidence_type: string;
  description: string;
  resolution: string;
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
  evidence_chain: EvidenceChainItem[];
  investigation_steps: InvestigationStep[];
  recommended_checklist: string[];
  recommended_runbook?: string;
  remediation_steps: string[];
  ai_analysis_text?: string;
}

export interface TeachAIPayload {
  actual_root_cause: string;
  fix_description: string;
  ai_recommendation_useful: boolean;
}
