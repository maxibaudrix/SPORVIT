// src/types/user.d.ts

// NOTA: Si usas la CLI de Supabase, reemplaza con tu tipo Database
// import { Database } from '@/lib/supabase/types';

/**
 * Tipos para la información del perfil del usuario (coincide con la tabla UserProfile de Prisma).
 * Se utilizan String | null para campos opcionales y compatibilidad con JSON/cadenas para SQLite.
 */
export interface UserProfile {
  id: string; // UUID del usuario, coincide con auth.users.id
  firstName: string | null;
  lastName: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  dateOfBirth: string | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE' | null;
  goal: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE' | null;
  dietType: string | null;
  
  // Importante: Usamos String? para compatibilidad con SQLite en desarrollo (antes era String[])
  allergies: string | null; // Cadena JSON o separada por comas
  excludedIngredients: string | null; // Cadena JSON o separada por comas
  
  targetWeightKg: number | null;
  weeklyGoalKg: number | null;
  
  // AÑADIDO: Metas nutricionales
  targetCalories: number | null;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
    tdee
  } | null;
}

/**
 * Tipo para las metas del usuario
 */
export interface UserGoals {
  id: string;
  userId: string;
  targetCalories: number | null;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
  } | null;
  tdee?: number; // <-- agregar esta línea (opcional si puede no existir)
  createdAt: string;
  updatedAt: string;
}

/**
 * Tipo para la configuración de Dieta y Preferencias Alimentarias.
 * Basado en la sección DietSection de settings/page.tsx.
 */
export interface UserDiet {
  dietType: 'Omnívora' | 'Vegetariana' | 'Vegana' | 'Cetogénica' | null;
  allergies: string[] | null; // Usamos string[] ya que se trabaja con un array de strings en el frontend.
  maxNovaLevel: 1 | 2 | 3 | 4 | null;
  minNutriScore: 'A' | 'B' | 'C' | 'D' | 'E' | null;
}

/**
 * Tipo para la configuración de Nivel de Actividad y Entrenamientos.
 * Basado en la sección ActivitySection de settings/page.tsx.
 */
export interface UserActivity {
  activityLevel: 'Sedentario' | 'Ligeramente activo' | 'Moderadamente activo' | 'Muy activo' | 'Extremadamente activo' | null;
  trainingDaysPerWeek: number | null;
  predominantType: 'Fuerza' | 'Cardio' | 'Mixto' | null;
}

/**
 * Tipo para la configuración de Notificaciones.
 * Basado en la sección NotificationsSection de settings/page.tsx.
 */
export interface UserNotifications {
  email: boolean | null;
  push: boolean | null;
  waterReminderEnabled: boolean | null;
  waterReminderIntervalHours: number | null;
  mealReminderEnabled: boolean | null;
}


/**
 * Extensión del tipo de usuario para incluir el perfil asociado y otras configuraciones.
 */
export interface AuthenticatedUser {
  id: string;
  email: string | undefined;
  name: string | null;
  image: string | null;

  // Relaciones existentes
  profile: UserProfile | null;
  goals: UserGoals | null;
  
  // AÑADIDO: Nuevas secciones de configuración
  diet: UserDiet | null;
  activity: UserActivity | null;
  notifications: UserNotifications | null;
}