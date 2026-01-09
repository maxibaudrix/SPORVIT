import { useEffect, useState, useRef } from 'react';
import type { PlanGenerationStatus } from '@/types/planning';

export function usePlanGenerationStatus() {
  const [status, setStatus] = useState<PlanGenerationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retriedWeeksRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    async function retryWeek(weekNumber: number) {
      try {
        console.log(`🔄 [Auto-Retry] Retrying week ${weekNumber}`);
        const response = await fetch('/api/planning/retry-week', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weekNumber }),
        });

        if (response.ok) {
          console.log(`✅ [Auto-Retry] Week ${weekNumber} retry initiated`);
          retriedWeeksRef.current.add(weekNumber);
        } else {
          console.error(`❌ [Auto-Retry] Failed to retry week ${weekNumber}`);
        }
      } catch (err) {
        console.error(`❌ [Auto-Retry] Error retrying week ${weekNumber}:`, err);
      }
    }

    async function fetchStatus() {
      try {
        const response = await fetch('/api/planning/status');

        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data: PlanGenerationStatus = await response.json();
        setStatus(data);
        setError(null);

        // ✅ NUEVO: Auto-reintentar semanas con error (solo una vez por semana)
        const errorWeeks = data.weeks.filter(w => w.status === 'error');
        for (const week of errorWeeks) {
          if (!retriedWeeksRef.current.has(week.weekNumber)) {
            await retryWeek(week.weekNumber);
          }
        }

        // Detener polling si no hay plan O si está completo
        if ((data.totalWeeks === 0 || data.isComplete) && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (err: any) {
        setError(err.message);
        // Detener polling en caso de error
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

    // Polling cada 30 segundos
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