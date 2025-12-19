// hooks/useUserMetrics.ts

import { useState, useEffect } from 'react';

interface UserMetrics {
  caloriesConsumed: number;
  caloriesTarget: number;
  protein: number;
  carbs: number;
  fats: number;
  tdee: number;
  weight: number;
  steps: number;
  stepsTarget: number;
}

export function useUserMetrics() {
  const [metrics, setMetrics] = useState<UserMetrics>({
    caloriesConsumed: 0,
    caloriesTarget: 2400,
    protein: 0,
    carbs: 0,
    fats: 0,
    tdee: 2400,
    weight: 0,
    steps: 0,
    stepsTarget: 10000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const res = await fetch('/api/dashboard/metrics/today');
      
      if (!res.ok) {
        throw new Error('Error al cargar métricas');
      }
      
      const data = await res.json();
      setMetrics(data.metrics);
      setError(null);
    } catch (err) {
      console.error('Error loading metrics:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMetric = async (field: string, value: number) => {
    try {
      const res = await fetch('/api/dashboard/metrics/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
      });

      if (!res.ok) {
        throw new Error('Error al actualizar métrica');
      }

      const data = await res.json();
      
      // Actualizar estado local
      setMetrics((prev) => ({
        ...prev,
        [field]: value,
      }));

      return data;
    } catch (err) {
      console.error('Error updating metric:', err);
      throw err;
    }
  };

  return {
    metrics,
    isLoading,
    error,
    updateMetric,
    refresh: loadMetrics,
  };
}