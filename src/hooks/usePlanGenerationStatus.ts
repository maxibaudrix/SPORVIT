import { useEffect, useState } from 'react';
import type { PlanGenerationStatus } from '@/types/planning';

export function usePlanGenerationStatus() {
  const [status, setStatus] = useState<PlanGenerationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    async function fetchStatus() {
      try {
        const response = await fetch('/api/planning/status');
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('No plan found');
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch status');
        }

        const data: PlanGenerationStatus = await response.json();
        setStatus(data);
        setError(null);

        // Si el plan está completo, detener polling
        if (data.isComplete && intervalId) {
          clearInterval(intervalId);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Fetch inicial
    fetchStatus();

    // Polling cada 10 segundos
    intervalId = setInterval(fetchStatus, 10000);

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return { status, loading, error };
}