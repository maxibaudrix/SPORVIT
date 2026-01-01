// src/config/calculators.ts
import { 
  Calculator, Activity, Flame, TrendingDown, Heart, Scale, Dumbbell, 
  Ruler, Droplet, Zap, Users, Wind, Clock, Target, TrendingUp,
  type LucideIcon 
} from 'lucide-react';

export interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  category: 'nutrition' | 'training' | 'body' | 'performance';
  icon: LucideIcon;
  complexity: 'simple' | 'medium' | 'complex';
  phase: 1 | 2 | 3;
  fileName: string; // Nombre del componente
}

export const CALCULATOR_CATEGORIES = {
  nutrition: { id: 'nutrition', name: 'Nutrición', icon: '🍎', color: 'emerald' },
  training: { id: 'training', name: 'Entrenamiento', icon: '💪', color: 'blue' },
  body: { id: 'body', name: 'Composición Corporal', icon: '📊', color: 'purple' },
  performance: { id: 'performance', name: 'Rendimiento', icon: '⚡', color: 'amber' },
} as const;

export const CALCULATORS: CalculatorConfig[] = [
  // ============ FASE 1: MVP (5 calculadoras) ============
  {
    id: 'imc',
    name: 'IMC',
    description: 'Índice de Masa Corporal',
    category: 'body',
    icon: Scale,
    complexity: 'simple',
    phase: 1,
    fileName: 'BMICalculator',
  },
  {
    id: '1rm',
    name: '1RM',
    description: 'Repetición Máxima',
    category: 'training',
    icon: Dumbbell,
    complexity: 'simple',
    phase: 1,
    fileName: 'OneRMCalculator',
  },
  {
    id: 'macros',
    name: 'Macros',
    description: 'Macronutrientes',
    category: 'nutrition',
    icon: Calculator,
    complexity: 'simple',
    phase: 1,
    fileName: 'MacroCalculator',
  },
  {
    id: 'deficit',
    name: 'Déficit Calórico',
    description: 'Planificar pérdida de grasa',
    category: 'nutrition',
    icon: TrendingDown,
    complexity: 'simple',
    phase: 1,
    fileName: 'CaloricDeficitCalculator',
  },
  {
    id: 'harris-benedict',
    name: 'Harris-Benedict',
    description: 'Gasto Energético Total',
    category: 'nutrition',
    icon: Flame,
    complexity: 'simple',
    phase: 1,
    fileName: 'HarrisBenedictCalculator',
  },

  // ============ FASE 2: Esenciales (5 calculadoras) ============
  {
    id: 'protein',
    name: 'Proteína',
    description: 'Ingesta de Proteína',
    category: 'nutrition',
    icon: Activity,
    complexity: 'simple',
    phase: 2,
    fileName: 'ProteinCalculator',
  },
  {
    id: 'running-pace',
    name: 'Ritmo Carrera',
    description: 'Zonas de ritmo',
    category: 'performance',
    icon: Activity,
    complexity: 'simple',
    phase: 2,
    fileName: 'TrainingPaceCalculator',
  },
  {
    id: 'heart-rate-zones',
    name: 'Zonas FC',
    description: 'Frecuencia Cardíaca',
    category: 'performance',
    icon: Heart,
    complexity: 'simple',
    phase: 2,
    fileName: 'HRZonesCalculator',
  },
  {
    id: 'body-fat',
    name: 'Grasa Corporal',
    description: '% de Grasa',
    category: 'body',
    icon: Ruler,
    complexity: 'medium',
    phase: 2,
    fileName: 'BodyFatCalculator',
  },
  {
    id: 'water',
    name: 'Hidratación',
    description: 'Consumo de Agua',
    category: 'nutrition',
    icon: Droplet,
    complexity: 'simple',
    phase: 2,
    fileName: 'WaterIntakeCalculator',
  },

  // ============ FASE 3: Avanzadas (5 calculadoras) ============
  {
    id: 'vo2max',
    name: 'VO2 Max',
    description: 'Capacidad Aeróbica',
    category: 'performance',
    icon: Wind,
    complexity: 'simple',
    phase: 3,
    fileName: 'VO2MaxCalculator',
  },
  {
    id: 'ftp',
    name: 'FTP',
    description: 'Umbral de Potencia',
    category: 'performance',
    icon: Zap,
    complexity: 'simple',
    phase: 3,
    fileName: 'FTPCalculator',
  },
  {
    id: 'ffmi',
    name: 'FFMI',
    description: 'Índice Masa Libre Grasa',
    category: 'body',
    icon: Users,
    complexity: 'simple',
    phase: 3,
    fileName: 'FFMICalculator',
  },
  {
    id: 'training-volume',
    name: 'Volumen Entreno',
    description: 'Carga de Entrenamiento',
    category: 'training',
    icon: TrendingUp,
    complexity: 'medium',
    phase: 3,
    fileName: 'TrainingVolumeCalculator',
  },
  {
    id: 'progression',
    name: 'Progresión',
    description: 'Planificar progresión',
    category: 'training',
    icon: Target,
    complexity: 'medium',
    phase: 3,
    fileName: 'ProgressionCalculator',
  },
];

// Helpers (sin cambios)
export const getCalculatorsByPhase = (phase: 1 | 2 | 3) => 
  CALCULATORS.filter((calc) => calc.phase === phase);

export const getCalculatorsByCategory = (category: string) => 
  CALCULATORS.filter((calc) => calc.category === category);

export const getCalculatorById = (id: string) => 
  CALCULATORS.find((calc) => calc.id === id);

export const searchCalculators = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return CALCULATORS.filter(
    (calc) =>
      calc.name.toLowerCase().includes(lowerQuery) ||
      calc.description.toLowerCase().includes(lowerQuery) ||
      calc.id.toLowerCase().includes(lowerQuery)
  );
};