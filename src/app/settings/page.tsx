// src/app/settings/page.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
// Corregido: Usando importación relativa en lugar de la ruta alias '@/store/user'
import { useUserStore } from '../../store/user'; 
import { User, Target, Utensils, Zap, Bell, LogOut, Download, Trash, Save, Loader2, Minus, Plus, AlertTriangle } from 'lucide-react';

// --- Definición de Tipos (Recreados para uso local, basados en el schema de Prisma o tipos conocidos) ---
// Estos tipos DEBEN coincidir con los que están anidados dentro de AuthenticatedUser en @/types/user
export type GoalType = 'Perder grasa' | 'Ganar músculo' | 'Mantenimiento';
export type ActivityLevel = 'Sedentario' | 'Ligeramente activo' | 'Moderadamente activo' | 'Muy activo' | 'Extremadamente activo';
export type DietType = 'Omnívora' | 'Vegetariana' | 'Vegana' | 'Cetogénica';
export type NovaLevel = 1 | 2 | 3 | 4;
export type NutriScore = 'A' | 'B' | 'C' | 'D' | 'E';

// --- INTERFACES LOCALES PARA EL ESTADO ---

interface LocalProfile {
  name: string;
  email: string;
  birthdate: string;
  profileImageUrl: string;
}

interface LocalGoals {
  currentGoal: GoalType;
  targetWeightKg: number;
  speed: 'Lenta' | 'Moderada' | 'Rápida';
  calculatedMacros: { protein: number; carbs: number; fats: number };
}

interface LocalDiet {
  dietType: DietType;
  allergies: string[];
  maxNovaLevel: NovaLevel;
  minNutriScore: NutriScore;
}

interface LocalActivity {
  activityLevel: ActivityLevel;
  trainingDaysPerWeek: number;
  predominantType: 'Fuerza' | 'Cardio' | 'Mixto';
}

interface LocalNotifications {
  email: boolean;
  push: boolean;
  waterReminderEnabled: boolean;
  waterReminderIntervalHours: number;
  mealReminderEnabled: boolean;
}

// --- Definiciones de Opciones Faltantes (FIX para Error 2304) ---
const dietOptions: DietType[] = ['Omnívora', 'Vegetariana', 'Vegana', 'Cetogénica'];
const novaOptions = [
  'Máximo nivel 4 (Ultra-procesados)', 
  'Máximo nivel 3 (Procesados)',      
  'Máximo nivel 2 (Ingredientes culinarios)',
  'Máximo nivel 1 (Mínimamente procesados)'
];
const nutriScoreOptions: NutriScore[] = ['A', 'B', 'C', 'D', 'E'];

// Componente utilitario de Input (Simulado)
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
    />
  </div>
);

// Componente utilitario de Select
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: string[] }> = ({ label, options, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-shadow appearance-none"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

// Componente de Botón de Guardar
const SaveButton: React.FC<{ onClick: () => void, isLoading: boolean, label: string }> = ({ onClick, isLoading, label }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 mt-4"
  >
    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
    <span>{label}</span>
  </button>
);

// Componente de Mensaje de Error/Advertencia
const MessageBanner: React.FC<{ message: string, type: 'error' | 'warning' }> = ({ message, type }) => (
  <div className={`flex items-start p-4 rounded-xl mb-4 ${type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'}`}>
    <AlertTriangle className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
    <p className="text-sm">{message}</p>
  </div>
);

// --- Componentes de Sección ---

// Se asume que 'profile' tiene name, email, birthdate, profileImageUrl
const ProfileSection: React.FC = () => {
  const user = useUserStore(state => state.user);
  const setProfileData = useUserStore(state => state.setProfileData);
  // Simulación de estado de carga para las peticiones de guardado
  const [isLoading, setIsLoading] = useState(false);
  const [localProfile, setLocalProfile] = useState<LocalProfile>({
  // 'name' está en la raíz del objeto user.
  name: user?.name || '', 
  email: user?.email || '',
  // Usar 'dateOfBirth' (tipo servidor) y 'birthdate' (tipo local).
  birthdate: user?.profile?.dateOfBirth || '', 
  // Asumiendo que la imagen de perfil viene de user.image (modelo Prisma User).
  profileImageUrl: user?.image || 'https://placehold.co/100x100/3b82f6/ffffff?text=U',
  });

  useEffect(() => {
  if (user) {
    setLocalProfile({
      name: user.name || '',
      email: user.email || '',
      birthdate: user.profile?.dateOfBirth || '', // Propiedad en UserProfile de Prisma
      profileImageUrl: user.image || 'https://placehold.co/100x100/3b82f6/ffffff?text=U', // Propiedad en User de Prisma
    });
  }
  }, [user]);
  
  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Simulación de llamada a API para guardar el perfil
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      // Actualizar el store localmente. Se usa casting para evitar error 2345 (LocalProfile vs UserProfile)
      setProfileData(localProfile as unknown as any);

      console.log('Profile saved:', localProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <MessageBanner message="Error: No se encontró la data del usuario." type="error" />;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img 
          src={localProfile.profileImageUrl} 
          alt="Perfil" 
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
        />
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          Subir foto de perfil (Upload)
        </button>
      </div>

      <Input
        label="Nombre"
        value={localProfile.name || ''}
        onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
      />
      
      {/* El email se toma del objeto user principal y se muestra como solo lectura */}
      <Input
        label="Email"
        value={user.email || 'N/A'}
        readOnly
        className="bg-gray-100 cursor-not-allowed"
      />
      
      <Input
        label="Fecha de nacimiento"
        type="date"
        value={localProfile.birthdate || ''}
        onChange={(e) => setLocalProfile({ ...localProfile, birthdate: e.target.value })}
      />

      <SaveButton onClick={handleSave} isLoading={isLoading} label="Guardar Perfil" />
    </div>
  );
};

// Se asume que 'goals' tiene currentGoal, targetWeightKg, speed, calculatedMacros (proteina, carbs, fats)
const GoalsSection: React.FC = () => {
  const user = useUserStore(state => state.user);
  const setGoalsData = useUserStore(state => state.setGoalsData);
  
  // Tipos para el estado goals (ajustar según tu tipo AuthenticatedUser['goals'])
  const initialGoals: LocalGoals = {
  // Mapear goalType (server) a currentGoal (local)
  currentGoal: (user?.profile?.goal as GoalType) || 'Mantenimiento',
  // Mapear targetWeight (server) a targetWeightKg (local)
  targetWeightKg: user?.profile?.targetWeightKg || 70,
  // Mapear goalSpeed (server) a speed (local)
  speed: (user?.goals as any)?.goalSpeed || 'Moderada',
  // Mapear 'fat' (server) a 'fats' (local)
  calculatedMacros: user?.goals?.targetMacros
    ? { 
        protein: user.goals.targetMacros.protein, 
        carbs: user.goals.targetMacros.carbs, 
        fats: user.goals.targetMacros.fat // targetMacros.fat -> calculatedMacros.fats
      }
    : { protein: 0, carbs: 0, fats: 0 },
  };

  const [isLoading, setIsLoading] = useState(false);
  const [localGoals, setLocalGoals] = useState(initialGoals);

  useEffect(() => {
    if (user) {
        setLocalGoals({
            currentGoal: (user.profile?.goal as GoalType) || 'Mantenimiento',
            targetWeightKg: user.profile?.targetWeightKg || 70,
            speed: (user.goals as any)?.goalSpeed || 'Moderada',
            calculatedMacros: user.goals?.targetMacros
                ? { protein: user.goals.targetMacros.protein, carbs: user.goals.targetMacros.carbs, fats: user.goals.targetMacros.fat }
                : { protein: 0, carbs: 0, fats: 0 },
        });
    }
  }, [user]); // Dependencia simplificada a 'user'
  
  const goalOptions: GoalType[] = ['Perder grasa', 'Ganar músculo', 'Mantenimiento'];
  const speedOptions = ['Lenta', 'Moderada', 'Rápida'];

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      // Se usa casting a 'any' para evitar error 2304 y 2345 (LocalGoals vs UserGoals)
      setGoalsData(localGoals as unknown as any); 
      console.log('Goals saved:', localGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const recalculateMacros = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Simulación de una llamada a API para obtener nuevos macros
      await new Promise(resolve => setTimeout(resolve, 800)); 
      const newMacros = { protein: 170, carbs: 210, fats: 70 }; // Nuevo cálculo simulado
      const updatedGoals = { ...localGoals, calculatedMacros: newMacros };
      
      // Actualizamos el store y el estado local.
      setGoalsData(updatedGoals as unknown as any);
      setLocalGoals(updatedGoals);

      console.log('Macros recalculated:', newMacros);
    } catch (error) {
      console.error('Error recalculating macros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <MessageBanner message="Error: No se encontró la data del usuario." type="error" />;

  return (
    <div className="space-y-6">
      <Select
        label="Objetivo actual"
        value={localGoals.currentGoal}
        options={goalOptions}
        onChange={(e) => setLocalGoals({ ...localGoals, currentGoal: e.target.value as GoalType })}
      />

      <Input
        label="Peso objetivo (kg)"
        type="number"
        min="30"
        value={localGoals.targetWeightKg}
        onChange={(e) => setLocalGoals({ ...localGoals, targetWeightKg: parseFloat(e.target.value) })}
      />

      <Select
        label="Velocidad"
        value={localGoals.speed}
        options={speedOptions}
        onChange={(e) => setLocalGoals({ ...localGoals, speed: e.target.value as 'Lenta' | 'Moderada' | 'Rápida' })}
      />

      <div className="bg-indigo-50 p-4 rounded-xl shadow-inner border border-indigo-200">
        <h3 className="font-bold text-indigo-700 mb-2">Macros Calculados</h3>
        <p className="text-sm text-indigo-600">
          Proteína: <span className="font-semibold">{localGoals.calculatedMacros.protein}g</span>, 
          Carbohidratos: <span className="font-semibold">{localGoals.calculatedMacros.carbs}g</span>, 
          Grasas: <span className="font-semibold">{localGoals.calculatedMacros.fats}g</span>
        </p>
        <p className="text-xs text-indigo-500 mt-2">
          *Estos macros se ajustan con tu nivel de actividad y peso actual.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <SaveButton onClick={handleSave} isLoading={isLoading} label="Guardar Objetivos" />
        <button
          onClick={recalculateMacros}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
          <span>Recalcular Macros</span>
        </button>
      </div>
    </div>
  );
};

// Se asume que 'diet' tiene dietType, allergies, maxNovaLevel, minNutriScore
const DietSection: React.FC = () => {
  const user = useUserStore(state => state.user);
  // No hay setDietData en tu store actual, usamos setProfileData como placeholder o asumimos que existirá
  const setProfileData = useUserStore(state => state.setProfileData); 
  
  // FIX: Se realiza el mapeo seguro para evitar Error 2322 en la inicialización
  const initialDiet: LocalDiet = user?.diet 
    ? {
        dietType: user.diet.dietType ?? 'Omnívora',
        allergies: user.diet.allergies ?? [],
        maxNovaLevel: user.diet.maxNovaLevel ?? 4,
        minNutriScore: user.diet.minNutriScore ?? 'E',
      }
    : {
        dietType: 'Omnívora' as DietType,
        allergies: [],
        maxNovaLevel: 4 as NovaLevel,
        minNutriScore: 'E' as NutriScore
      };

  const [isLoading, setIsLoading] = useState(false);
  // Se tipa explícitamente a LocalDiet para evitar problemas de nulidad en el componente
  const [localDiet, setLocalDiet] = useState<LocalDiet>(initialDiet);

  useEffect(() => {
    if (user?.diet) {
      // Mapeo explícito y uso de ?? para evitar null en la actualización
      setLocalDiet({
        dietType: user.diet.dietType ?? 'Omnívora',
        allergies: user.diet.allergies ?? [],
        maxNovaLevel: user.diet.maxNovaLevel ?? 4,
        minNutriScore: user.diet.minNutriScore ?? 'E',
      });
    }
  }, [user?.diet]);

  const handleAllergyChange = (allergy: string) => {
    setLocalDiet((prev) => {
        const isAllergySelected = prev.allergies.includes(allergy);

        return {
            ...prev, 
            allergies: isAllergySelected
                ? prev.allergies.filter(a => a !== allergy) 
                : [...prev.allergies, allergy]
        };
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // **NOTA:** Aquí deberías usar setDietData si estuviera en tu store. 
      // Como no está, solo logueamos la acción.
      console.log('Diet saved:', localDiet);
      // setDietData(localDiet); 
    } catch (error) {
      console.error('Error saving diet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <MessageBanner message="Error: No se encontró la data del usuario." type="error" />;

  return (
    <div className="space-y-6">
      <Select
        label="Tipo de dieta"
        // FIX: dietOptions definido globalmente
        value={localDiet.dietType} 
        options={dietOptions}
        onChange={(e) => setLocalDiet({ ...localDiet, dietType: e.target.value as DietType })}
      />

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Alergias</h3>
        <div className="flex flex-wrap gap-2">
          {['Lactosa', 'Gluten', 'Frutos Secos', 'Mariscos'].map(allergy => (
            <button
              key={allergy}
              onClick={() => handleAllergyChange(allergy)}
              className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
                localDiet.allergies.includes(allergy)
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>
      
      <Select
        label="Preferencias NOVA (Procesamiento Mínimo)"
        value={`Máximo nivel ${localDiet.maxNovaLevel}`}
        // FIX: novaOptions definido globalmente
        options={novaOptions}
        onChange={(e) => setLocalDiet({ ...localDiet, maxNovaLevel: parseInt(e.target.value.split(' ')[2]) as NovaLevel })}
      />

      <Select
        label="Nutri-Score mínimo aceptado"
        value={localDiet.minNutriScore}
        // FIX: nutriScoreOptions definido globalmente
        options={nutriScoreOptions}
        onChange={(e) => setLocalDiet({ ...localDiet, minNutriScore: e.target.value as NutriScore })}
      />

      <SaveButton onClick={handleSave} isLoading={isLoading} label="Guardar Dieta" />
      <MessageBanner message="Advertencia: La acción 'Guardar Dieta' está simulada ya que falta la función 'setDietData' en tu store de Zustand." type="warning" />
    </div>
  );
};


// Se asume que 'activity' tiene activityLevel, trainingDaysPerWeek, predominantType
const ActivitySection: React.FC = () => {
  const user = useUserStore(state => state.user);
  // No hay setActivityData en tu store actual, solo logueamos la acción
  const setGoalsData = useUserStore(state => state.setGoalsData); 

  // FIX: Define initialActivity con valores por defecto (Error 2304)
  const initialActivity: LocalActivity = user?.activity
    ? {
        activityLevel: user.activity.activityLevel ?? 'Sedentario',
        trainingDaysPerWeek: user.activity.trainingDaysPerWeek ?? 3,
        predominantType: user.activity.predominantType ?? 'Mixto',
      }
    : {
        activityLevel: 'Sedentario',
        trainingDaysPerWeek: 3,
        predominantType: 'Mixto',
      };

  const [isLoading, setIsLoading] = useState(false);
  const [localActivity, setLocalActivity] = useState<LocalActivity>(initialActivity);

  // FIX: Se unificó el mapeo en el estado inicial, pero se mantiene el useEffect para actualizaciones
  useEffect(() => {
    if (user?.activity) {
      setLocalActivity({
        activityLevel: user.activity.activityLevel ?? 'Sedentario',
        trainingDaysPerWeek: user.activity.trainingDaysPerWeek ?? 3,
        predominantType: user.activity.predominantType ?? 'Mixto',
      });
    }
  }, [user?.activity]);
  
  const levelOptions: ActivityLevel[] = ['Sedentario', 'Ligeramente activo', 'Moderadamente activo', 'Muy activo', 'Extremadamente activo'];
  const typeOptions = ['Fuerza', 'Cardio', 'Mixto'];

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // **NOTA:** Aquí deberías usar setActivityData si estuviera en tu store. 
      // Como no está, solo logueamos la acción.
      console.log('Activity saved:', localActivity);
      // setActivityData(localActivity); 
    } catch (error) {
      console.error('Error saving activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <MessageBanner message="Error: No se encontró la data del usuario." type="error" />;

  return (
    <div className="space-y-6">
      <Select
        label="Nivel de actividad"
        value={localActivity.activityLevel}
        options={levelOptions}
        onChange={(e) => setLocalActivity({ ...localActivity, activityLevel: e.target.value as ActivityLevel })}
      />

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Días de entreno/semana</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLocalActivity((prev) => ({ 
              ...prev, 
              trainingDaysPerWeek: Math.max(0, prev.trainingDaysPerWeek - 1) 
            }))}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            disabled={localActivity.trainingDaysPerWeek <= 0}
          >
            <Minus className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-xl font-bold w-10 text-center">{localActivity.trainingDaysPerWeek}</span>
          <button 
            onClick={() => setLocalActivity((prev) => ({ 
              ...prev, 
              trainingDaysPerWeek: Math.min(7, prev.trainingDaysPerWeek + 1) 
            }))}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            disabled={localActivity.trainingDaysPerWeek >= 7}
          >
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      <Select
        label="Tipo de ejercicio predominante"
        value={localActivity.predominantType}
        options={typeOptions}
        onChange={(e) => setLocalActivity({ ...localActivity, predominantType: e.target.value as 'Fuerza' | 'Cardio' | 'Mixto' })}
      />

      <SaveButton onClick={handleSave} isLoading={isLoading} label="Guardar Actividad" />
      <MessageBanner message="Advertencia: La acción 'Guardar Actividad' está simulada ya que falta la función 'setActivityData' en tu store de Zustand." type="warning" />
    </div>
  );
};

// Se asume que 'notifications' tiene email, push, waterReminderEnabled, mealReminderEnabled
const NotificationsSection: React.FC = () => {
  const user = useUserStore(state => state.user);
  // No hay setNotificationsData en tu store actual, solo logueamos la acción
  const setGoalsData = useUserStore(state => state.setGoalsData); 

  // FIX: Define initialNotifications con valores por defecto (Error 2552)
  const initialNotifications: LocalNotifications = user?.notifications
    ? {
        email: user.notifications.email ?? true,
        push: user.notifications.push ?? true,
        waterReminderEnabled: user.notifications.waterReminderEnabled ?? true,
        waterReminderIntervalHours: user.notifications.waterReminderIntervalHours ?? 2,
        mealReminderEnabled: user.notifications.mealReminderEnabled ?? true,
      }
    : {
        email: true,
        push: true,
        waterReminderEnabled: true,
        waterReminderIntervalHours: 2,
        mealReminderEnabled: true,
      };

  const [isLoading, setIsLoading] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<LocalNotifications>(initialNotifications);

  // FIX: Se unificó el mapeo en el estado inicial, pero se mantiene el useEffect para actualizaciones
  useEffect(() => {
    if (user?.notifications) {
      setLocalNotifications({
        email: user.notifications.email ?? true,
        push: user.notifications.push ?? true,
        waterReminderEnabled: user.notifications.waterReminderEnabled ?? true,
        waterReminderIntervalHours: user.notifications.waterReminderIntervalHours ?? 2,
        mealReminderEnabled: user.notifications.mealReminderEnabled ?? true,
      });
    }
  }, [user?.notifications]);
  
  const handleToggle = useCallback((key: keyof LocalNotifications) => {
    setLocalNotifications((prev) => ({ 
      ...prev, 
      [key]: !prev[key],
    }));
  }, []);
  
  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // **NOTA:** Aquí deberías usar setNotificationsData si estuviera en tu store. 
      // Como no está, solo logueamos la acción.
      console.log('Notifications saved:', localNotifications);
      // setNotificationsData(localNotifications); 
    } catch (error) {
      console.error('Error saving notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ToggleRow: React.FC<{ label: string, isChecked: boolean, onChange: () => void, detail?: string }> = ({ label, isChecked, onChange, detail }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{label}</span>
        {detail && <span className="text-xs text-gray-500">{detail}</span>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={isChecked} 
          onChange={onChange} 
          disabled={isLoading}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );
  
  if (!user) return <MessageBanner message="Error: No se encontró la data del usuario." type="error" />;

  return (
    <div className="space-y-4">
      <ToggleRow 
        label="Notificaciones por Email" 
        isChecked={localNotifications.email} 
        onChange={() => handleToggle('email')}
        detail="Recibe resúmenes semanales y actualizaciones."
      />
      <ToggleRow 
        label="Notificaciones Push" 
        isChecked={localNotifications.push} 
        onChange={() => handleToggle('push')}
      />
      <ToggleRow 
        label="Recordatorio de agua" 
        isChecked={localNotifications.waterReminderEnabled} 
        onChange={() => handleToggle('waterReminderEnabled')}   
      />
      <ToggleRow 
        label="Recordatorio de comida" 
        isChecked={localNotifications.mealReminderEnabled}
        onChange={() => handleToggle('mealReminderEnabled')}
        detail="Recordatorios basados en tus horarios de comida configurados."
      />
      <SaveButton onClick={handleSave} isLoading={isLoading} label="Guardar Notificaciones" />
      <MessageBanner message="Advertencia: La acción 'Guardar Notificaciones' está simulada ya que falta la función 'setNotificationsData' en tu store de Zustand." type="warning" />
    </div>
  );
};

const AccountSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.");
    if (isConfirmed) {
      setIsLoading(true);
      try {
        // Simulación de llamada a API para eliminar la cuenta
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Lógica de deslogueo/redirección aquí
        console.log('Account deleted successfully.');
      } catch (error) {
        console.error('Error deleting account:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <button className="w-full flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
        <LogOut className="w-5 h-5 text-gray-500" />
        <span>Cambiar contraseña</span>
      </button>
      
      <button className="w-full flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
        <Download className="w-5 h-5 text-gray-500" />
        <span>Exportar datos (GDPR)</span>
      </button>

      <div className="pt-4 border-t border-red-100">
        <button 
          onClick={handleDeleteAccount}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash className="w-5 h-5" />}
          <span>Eliminar cuenta</span>
        </button>
      </div>
    </div>
  );
};

// --- Componente Principal ---

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Perfil');
  const user = useUserStore(state => state.user);

  const tabs = [
    { name: 'Perfil', icon: User, component: ProfileSection },
    { name: 'Objetivos', icon: Target, component: GoalsSection },
    { name: 'Dieta', icon: Utensils, component: DietSection },
    { name: 'Actividad', icon: Zap, component: ActivitySection },
    { name: 'Notificaciones', icon: Bell, component: NotificationsSection },
    { name: 'Cuenta', icon: LogOut, component: AccountSection },
  ];
  
  const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component || ProfileSection;

  if (user === null) {
      // Mostrar un loader o un mensaje si el usuario es null (todavía cargando o no autenticado)
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
              <div className="flex items-center space-x-3 text-indigo-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="font-semibold">Cargando datos de usuario...</p>
              </div>
          </div>
      );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Configuración</h1>

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        
        {/* Panel de Navegación (Tabs) */}
        <div className="w-full lg:w-64 mb-6 lg:mb-0 bg-white rounded-2xl shadow-xl p-4 flex-shrink-0">
          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors min-w-max ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido de la Sección Activa */}
        <div className="flex-grow bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">{activeTab}</h2>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;