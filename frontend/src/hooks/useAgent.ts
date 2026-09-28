import { useState } from 'react';
import { InvestigationResult } from '../types/incident';
import { apiService } from '../services/api';

export function useAgent() {
  const [investigation, setInvestigation] = useState<InvestigationResult | null>(null);
  const [investigating, setInvestigating] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'agent'; text: string }[]>([]);

  const runInvestigation = async (incidentId: string) => {
    try {
      setInvestigating(true);
      const result = await apiService.investigateIncident(incidentId);
      setInvestigation(result);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setInvestigating(false);
    }
  };

  const sendMessage = async (text: string, context?: any) => {
    setChatMessages((prev) => [...prev, { sender: 'user', text }]);
    try {
      const reply = await apiService.sendAgentChat(text, context);
      setChatMessages((prev) => [...prev, { sender: 'agent', text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'agent', text: 'Error connecting to agent server.' },
      ]);
    }
  };

  return { investigation, investigating, runInvestigation, chatMessages, sendMessage };
}
