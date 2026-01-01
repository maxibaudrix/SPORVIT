// src/config/calculators.ts
import { 
  Calculator, 
  Activity, 
  Flame, 
  TrendingDown, 
  Heart,
  Scale,
  Dumbbell,
  Ruler,
  Droplet,
  type LucideIcon 
} from 'lucide-react';

export interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  category: 'nutrition' | 'training' | 'body' | 'performance';
  icon: LucideIcon;
  complexity: 'simple' | 'medium' | 'complex';
  phase: 1 | 2 | 3; // Fase de implementación
}

export const CALCULATOR_CATEGORIES = {
  nutrition: {
    id: 'nutrition',
    name: 'Nutrición',
    icon: '🍎',
    color: 'emerald',
  },
  training: {
    id: 'training',
    name: 'Entrenamiento',
    icon: '💪',
    color: 'blue',
  },
  body: {
    id: 'body',
    name: 'Composición Corporal',
    icon: '📊',
    color: 'purple',
  },
  performance: {
    id: 'performance',
    name: 'Rendimiento',
    icon: '⚡',
    color: 'amber',
  },
} as const;

export const CALCULATORS: CalculatorConfig[] = [
  // FASE 1: MVP (5 calculadoras)
  {
    id: 'imc',
    name: 'IMC',
    description: 'Índice de Masa Corporal',
    category: 'body',
    icon: Scale,
    complexity: 'simple',
    phase: 1,
  },
  {
    id: '1rm',
    name: '1RM',
    description: 'Repetición Máxima',
    category: 'training',
    icon: Dumbbell,
    complexity: 'simple',
    phase: 1,
  },
  {
    id: 'macros',
    name: 'Macros',
    description: 'Macronutrientes',
    category: 'nutrition',
    icon: Calculator,
    complexity: 'simple',
    phase: 1,
  },
  {
    id: 'deficit',
    name: 'Déficit Calórico',
    description: 'Planificar pérdida de grasa',
    category: 'nutrition',
    icon: TrendingDown,
    complexity: 'simple',
    phase: 1,
  },
  {
    id: 'harris-benedict',
    name: 'Harris-Benedict',
    description: 'Gasto Energético Total',
    category: 'nutrition',
    icon: Flame,
    complexity: 'simple',
    phase: 1,
  },

  // FASE 2: Esenciales (5 calculadoras)
  {
    id: 'protein',
    name: 'Proteína',
    description: 'Ingesta de Proteína',
    category: 'nutrition',
    icon: Activity,
    complexity: 'simple',
    phase: 2,
  },
  {
    id: 'running-pace',
    name: 'Ritmo Carrera',
    description: 'Zonas de ritmo',
    category: 'performance',
    icon: Activity,
    complexity: 'simple',
    phase: 2,
  },
  {
    id: 'heart-rate-zones',
    name: 'Zonas FC',
    description: 'Frecuencia Cardíaca',
    category: 'performance',
    icon: Heart,
    complexity: 'simple',
    phase: 2,
  },
  {
    id: 'body-fat',
    name: 'Grasa Corporal',
    description: '% de Grasa',
    category: 'body',
    icon: Ruler,
    complexity: 'medium',
    phase: 2,
  },
  {
    id: 'water',
    name: 'Hidratación',
    description: 'Consumo de Agua',
    category: 'nutrition',
    icon: Droplet,
    complexity: 'simple',
    phase: 2,
  },

  // FASE 3: Avanzadas (5 calculadoras)
  // ... Se pueden añadir después
];

// Helper: Get calculators by phase
export const getCalculatorsByPhase = (phase: 1 | 2 | 3) => {
  return CALCULATORS.filter((calc) => calc.phase === phase);
};

// Helper: Get calculators by category
export const getCalculatorsByCategory = (category: string) => {
  return CALCULATORS.filter((calc) => calc.category === category);
};

// Helper: Get calculator by ID
export const getCalculatorById = (id: string) => {
  return CALCULATORS.find((calc) => calc.id === id);
};

// Helper: Search calculators
export const searchCalculators = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return CALCULATORS.filter(
    (calc) =>
      calc.name.toLowerCase().includes(lowerQuery) ||
      calc.description.toLowerCase().includes(lowerQuery) ||
      calc.id.toLowerCase().includes(lowerQuery)
  );
};