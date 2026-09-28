import { Incident, InvestigationResult, TeachAIPayload } from '../types/incident';

const API_BASE = 'http://localhost:8000/api/v1';

export const apiService = {
  async fetchIncidents(): Promise<Incident[]> {
    const res = await fetch(`${API_BASE}/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async fetchIncidentById(id: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}`);
    if (!res.ok) throw new Error('Failed to fetch incident');
    return res.json();
  },

  async investigateIncident(id: string): Promise<InvestigationResult> {
    const res = await fetch(`${API_BASE}/agent/investigate/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to run investigation');
    return res.json();
  },

  async teachAI(id: string, payload: TeachAIPayload): Promise<any> {
    const res = await fetch(`${API_BASE}/incidents/${id}/teach-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save to organizational memory');
    return res.json();
  },

  async fetchMemories(): Promise<Incident[]> {
    const res = await fetch(`${API_BASE}/memory`);
    if (!res.ok) throw new Error('Failed to fetch memories');
    return res.json();
  },

  async searchMemories(query: string): Promise<Incident[]> {
    const res = await fetch(`${API_BASE}/memory/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: 5 }),
    });
    if (!res.ok) throw new Error('Failed to search memories');
    return res.json();
  },

  async sendAgentChat(message: string, context?: any): Promise<string> {
    const res = await fetch(`${API_BASE}/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, incident_context: context }),
    });
    if (!res.ok) throw new Error('Failed to send message to agent');
    const data = await res.json();
    return data.response;
  }
};
