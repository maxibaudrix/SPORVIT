// src/tests/calculations.test.ts
import { describe, it, expect } from 'vitest';
// NOTA: Asumimos que calculateBalance.ts existe en src/utils
import { calculateBalance } from '../lib/utils/calculateBalance';

describe('calculateBalance', () => {
  const TARGET = 2000;

  it('debe calcular el balance neto, restante y el progreso correctamente cuando está por debajo del target', () => {
    const consumed = 1500;
    const burned = 300; // Neto = 1200

    const result = calculateBalance(consumed, burned, TARGET);

    expect(result.net).toBe(1200);
    expect(result.remaining).toBe(800);
    expect(result.progress).toBe(60); // 1200 / 2000 * 100
    expect(result.status).toBe('Under');
  });

  it('debe calcular el balance cuando se excede el target', () => {
    const consumed = 2500;
    const burned = 100; // Neto = 2400

    const result = calculateBalance(consumed, burned, TARGET);

    expect(result.net).toBe(2400);
    expect(result.remaining).toBe(-400); // Exceso
    expect(result.progress).toBe(120);
    expect(result.status).toBe('Over');
  });

  it('debe manejar el caso de progreso cero o negativo (quemadas > consumidas)', () => {
    const consumed = 500;
    const burned = 600; // Neto = -100

    const result = calculateBalance(consumed, burned, TARGET);

    expect(result.net).toBe(-100);
    expect(result.remaining).toBe(2100);
    expect(result.progress).toBe(0); // El progreso no debe ser negativo
    expect(result.status).toBe('Under');
  });

  it('debe manejar un target de cero (aunque no es realista en nutrición, es robusto)', () => {
    const consumed = 1000;
    const burned = 0; 
    const target = 0;

    const result = calculateBalance(consumed, burned, target);

    // La lógica de progreso se ajusta para que no sea NaN
    expect(result.net).toBe(1000);
    expect(result.remaining).toBe(-1000); 
    // Cuando el target es 0, net/target es infinito, la función Math.min(100, (net / target) * 100)
    // devolvería 100 si net > 0.
    expect(result.progress).toBe(100); 
    expect(result.status).toBe('Over');
  });
});