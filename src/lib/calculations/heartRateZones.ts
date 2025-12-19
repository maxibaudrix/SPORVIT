// src/lib/calculations/heartRateZones.ts

/**
 * Zonas cardíacas clásicas (5 zonas) basadas en % de FCMáx
 * Método simple y efectivo para principiantes e intermedios
 */
const CLASSIC_ZONES = {
  1: { name: 'Recuperación activa', min: 50, max: 60, color: '#94a3b8' },
  2: { name: 'Aeróbico base',       min: 61, max: 70, color: '#60a5fa' },
  3: { name: 'Tempo',               min: 71, max: 80, color: '#34d399' },
  4: { name: 'Umbral',              min: 81, max: 90, color: '#facc15' },
  5: { name: 'VO2 Máx',             min: 91, max: 100, color: '#f87171' },
} as const;

/**
 * Calcula la FCMáx usando la fórmula más precisa actual (Tanaka, 2001)
 * FCMáx = 207 - (0.7 × edad)
 */
export const calculateMaxHR = (age: number): number => {
  if (!age || age < 12 || age > 100) return 180;
  return Math.round(207 - 0.7 * age);
};

/**
 * Calcula zonas cardíacas clásicas basadas en edad
 */
export const calculateClassicHeartRateZones = (age: number) => {
  const maxHR = calculateMaxHR(age);

  return {
    maxHR,
    zones: {
      1: {
        ...CLASSIC_ZONES[1],
        bpm: {
          min: Math.round((maxHR * CLASSIC_ZONES[1].min) / 100),
          max: Math.round((maxHR * CLASSIC_ZONES[1].max) / 100),
        },
      },
      2: {
        ...CLASSIC_ZONES[2],
        bpm: {
          min: Math.round((maxHR * CLASSIC_ZONES[2].min) / 100),
          max: Math.round((maxHR * CLASSIC_ZONES[2].max) / 100),
        },
      },
      3: {
        ...CLASSIC_ZONES[3],
        bpm: {
          min: Math.round((maxHR * CLASSIC_ZONES[3].min) / 100),
          max: Math.round((maxHR * CLASSIC_ZONES[3].max) / 100),
        },
      },
      4: {
        ...CLASSIC_ZONES[4],
        bpm: {
          min: Math.round((maxHR * CLASSIC_ZONES[4].min) / 100),
          max: Math.round((maxHR * CLASSIC_ZONES[4].max) / 100),
        },
      },
      5: {
        ...CLASSIC_ZONES[5],
        bpm: {
          min: Math.round((maxHR * CLASSIC_ZONES[5].min) / 100),
          max: maxHR, // Zona 5 va hasta el máximo
        },
      },
    },
  };
};

/**
 * Zonas basadas en LTHR (más preciso para entrenados)
 */
const LTHR_ZONES = {
  1: { name: 'Recuperación',     min: 0,   max: 68 },
  2: { name: 'Resistencia',      min: 69,  max: 83 },
  3: { name: 'Tempo',            min: 84,  max: 94 },
  4: { name: 'Umbral',           min: 95,  max: 105 },
  5: { name: 'Anaeróbico',       min: 106, max: 999 },
} as const;

export const calculateLTHRZones = (lthr: number) => {
  if (!lthr || lthr < 100 || lthr > 220) {
    throw new Error('LTHR debe estar entre 100 y 220 lpm');
  }

  return {
    lthr,
    zones: {
      1: { ...LTHR_ZONES[1], bpm: { min: 0, max: Math.round(lthr * 0.68) } },
      2: { ...LTHR_ZONES[2], bpm: { min: Math.round(lthr * 0.69), max: Math.round(lthr * 0.83) } },
      3: { ...LTHR_ZONES[3], bpm: { min: Math.round(lthr * 0.84), max: Math.round(lthr * 0.94) } },
      4: { ...LTHR_ZONES[4], bpm: { min: Math.round(lthr * 0.95), max: Math.round(lthr * 1.05) } },
      5: { ...LTHR_ZONES[5], bpm: { min: Math.round(lthr * 1.06), max: 'Máx' } },
    },
  };
};

/**
 * Función principal: elige el mejor método disponible
 */
export type HeartRateZones =
  | { method: 'classic'; maxHR: number; zones: ReturnType<typeof calculateClassicHeartRateZones>['zones'] }
  | { method: 'lthr'; lthr: number; zones: ReturnType<typeof calculateLTHRZones>['zones'] };

export const calculateHeartRateZones = (
  age: number,
  lthr?: number | null
): HeartRateZones => {
  // Si tiene LTHR → usamos el método más preciso
  if (lthr && lthr >= 100 && lthr <= 220) {
    return {
      method: 'lthr',
      ...calculateLTHRZones(lthr),
    };
  }

  // Por defecto: método clásico
  const result = calculateClassicHeartRateZones(age);
  return {
    method: 'classic',
    maxHR: result.maxHR,
    zones: result.zones,
  };
};