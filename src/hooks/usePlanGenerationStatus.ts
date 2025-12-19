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
          // ✅ ELIMINADO: Ya no tratamos 404 como error
          throw new Error('Failed to fetch status');
        }

        const data: PlanGenerationStatus = await response.json();
        setStatus(data);
        setError(null);

        // ✅ MODIFICADO: Detener polling si no hay plan O si está completo
        if ((data.totalWeeks === 0 || data.isComplete) && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (err: any) {
        setError(err.message);
        // ✅ NUEVO: Detener polling en caso de error
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } finally {
        setLoading(false);
      }
    }

    // Fetch inicial
    fetchStatus();

    // ✅ MODIFICADO: Polling cada 30 segundos (antes 10s)
    intervalId = setInterval(fetchStatus, 30000);

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return { status, loading, error };
}