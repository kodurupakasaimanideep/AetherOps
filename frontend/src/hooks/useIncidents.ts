import { useState, useEffect, useCallback } from 'react';
import { Incident } from '../types/incident';
import { apiService } from '../services/api';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchIncidents();
      setIncidents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load incidents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  return { incidents, loading, error, refreshIncidents: loadIncidents };
}
