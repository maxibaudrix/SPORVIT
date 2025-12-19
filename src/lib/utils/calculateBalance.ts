// src/utils/calculateBalance.ts

/**
 * Calcula el balance calórico y el porcentaje de progreso.
 */
export const calculateBalance = (consumed: number, burned: number, target: number) => {
  const net = consumed - burned;
  const remaining = target - net;
  const progress = Math.min(100, Math.max(0, (net / target) * 100));
  
  return {
    net,
    remaining,
    progress,
    status: net > target ? 'Over' : 'Under'
  };
};