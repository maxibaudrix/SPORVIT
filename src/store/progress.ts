// src/store/progress.ts
import { create } from 'zustand';

// --- Tipos de Datos ---
interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number; // kg
}

interface MeasurementEntry {
  date: string;
  waist: number; // cm
  chest: number; // cm
  hips: number; // cm
  bicep: number; // cm
}

interface PhotoEntry {
  id: string;
  date: string;
  url: string;
  type: 'frontal' | 'lateral';
}

interface ProgressState {
  // Datos principales
  currentWeight: number;
  initialWeight: number;
  targetWeight: number;
  currentIMC: number;
  dailyStreak: number;
  adherencePercentage: number;
  
  // Históricos
  weightHistory: WeightEntry[];
  measurementsHistory: MeasurementEntry[];
  photos: PhotoEntry[];
  
  // Predicciones
  predictionWeeks: number;
  averageLossRate: number; // kg/week
  
  // Acciones (simuladas)
  fetchProgress: (period: string) => Promise<void>;
  registerWeight: (date: string, weight: number) => Promise<void>;
  registerMeasurements: (measurements: Omit<MeasurementEntry, 'date'>) => Promise<void>;
  uploadPhoto: (file: File, type: 'frontal' | 'lateral') => Promise<void>;
}

// --- Implementación del Store ---
export const useProgressStore = create<ProgressState>((set, get) => ({
  // Estado Inicial Mock
  currentWeight: 82.5,
  initialWeight: 87.0,
  targetWeight: 78.0,
  currentIMC: 24.8,
  dailyStreak: 12,
  adherencePercentage: 85,
  predictionWeeks: 8,
  averageLossRate: 0.6,

  // Datos Históricos Mock
  weightHistory: [
    { date: '2025-10-01', weight: 87.0 },
    { date: '2025-10-15', weight: 86.2 },
    { date: '2025-10-30', weight: 85.5 },
    { date: '2025-11-15', weight: 83.8 },
    { date: '2025-11-30', weight: 82.5 },
  ],
  
  measurementsHistory: [
    { date: '2025-10-01', waist: 95, chest: 100, hips: 105, bicep: 35 },
    { date: '2025-11-30', waist: 90, chest: 101, hips: 102, bicep: 36 },
  ],
  
  photos: [
    { id: 'p1', date: '2025-10-01', url: 'https://placehold.co/300x400/1e293b/475569?text=Inicio', type: 'frontal' },
    { id: 'p2', date: '2025-11-30', url: 'https://placehold.co/300x400/1e293b/10b981?text=Actual', type: 'frontal' },
  ],

  // --- Implementación de Acciones ---
  
  // Simulación de llamada a GET /api/progress?period=...
  fetchProgress: async (period) => {
    console.log(`[Store] Fetching progress for period: ${period}`);
    // Aquí iría la llamada fetch
    // const response = await fetch(`/api/progress?period=${period}`);
    // const data = await response.json();
    // set(data); // Actualizar el estado con los datos reales
  },

  // Simulación de llamada a POST /api/progress/weight
  registerWeight: async (date, weight) => {
    console.log(`[Store] Registering weight: ${weight}kg on ${date}`);
    // await fetch('/api/progress/weight', { method: 'POST', body: JSON.stringify({ date, weight }) });
    set(state => ({
      currentWeight: weight,
      weightHistory: [...state.weightHistory, { date, weight }],
    }));
  },
  
  // Simulación de llamada a POST /api/progress/measurements
  registerMeasurements: async (measurements) => {
    const date = new Date().toISOString().split('T')[0];
    console.log(`[Store] Registering measurements for ${date}`);
    // await fetch('/api/progress/measurements', { method: 'POST', body: JSON.stringify({ date, ...measurements }) });
    set(state => ({
      measurementsHistory: [...state.measurementsHistory, { date, ...measurements }],
    }));
  },

  // Simulación de llamada a POST /api/progress/photo
  uploadPhoto: async (file, type) => {
    console.log(`[Store] Uploading photo (${type}): ${file.name}`);
    // Simular subida y obtención de URL
    const newPhoto: PhotoEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      url: `https://placehold.co/300x400/1e293b/10b981?text=Foto_${type}_${new Date().getMinutes()}`,
      type,
    };

    // await fetch('/api/progress/photo', { method: 'POST', body: formData });
    set(state => ({
      photos: [...state.photos, newPhoto],
    }));
  },
}));