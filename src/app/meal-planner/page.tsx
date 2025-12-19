// src/app/meal-planner/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, ShoppingCart, Heart, RefreshCw, Plus, Loader2 } from 'lucide-react';
import { useMealPlanStore } from '@/store/meal-plan';
import type { MealPlanEntry, PlanPreferences } from '@/store/meal-plan'; 

// --- Componentes Mocks de UI (Para la estructura visual) ---

// Componente MOCK: Tarjeta de Receta
const RecipeCard = ({ recipe, onAssign, onReplace, onFavoriteToggle }: any) => {
  if (!recipe) return (
    <button onClick={onAssign} className="flex flex-col items-center justify-center h-full w-full bg-slate-800/50 p-2 rounded-lg border border-dashed border-indigo-500/50 text-indigo-400 hover:bg-slate-700/50 transition-colors">
      <Plus className="w-4 h-4" />
      <span className="text-xs mt-1">➕ Añadir</span>
    </button>
  );

  return (
    <div className="p-3 bg-slate-800 rounded-xl shadow-lg border-l-4 border-indigo-500 h-full flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-white mb-1 truncate">{recipe.name}</h4>
        <p className="text-[10px] text-slate-400">
          P: {recipe.macros.protein}g | C: {recipe.macros.carbs}g | G: {recipe.macros.fats}g
        </p>
        <p className="text-xs font-semibold text-indigo-400 mt-1">{recipe.calories} kcal</p>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onFavoriteToggle} className="text-yellow-400 p-1 rounded-full hover:bg-slate-700"><Heart className="w-4 h-4" /></button>
        <button onClick={onReplace} className="text-cyan-400 p-1 rounded-full hover:bg-slate-700"><RefreshCw className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

// Componente MOCK: Modal de Generación Automática
const AutoGenerateModal = ({ onClose, onGenerate }: { onClose: () => void, onGenerate: (preferences: PlanPreferences) => void }) => {
  const [prefs, setPrefs] = useState<PlanPreferences>({ useFavorites: false, varietyLevel: 'medium', avoidRepeat: false });
  
  const handleGenerate = () => {
    onGenerate(prefs);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> Generar Plan Automático</h3>
        
        {/* Checkbox: Usar solo recetas favoritas */}
        <label className="flex items-center space-x-2 text-slate-300 mb-3 cursor-pointer">
            <input type="checkbox" checked={prefs.useFavorites} onChange={(e) => setPrefs(p => ({ ...p, useFavorites: e.target.checked }))} className="form-checkbox text-indigo-500 rounded h-4 w-4 bg-slate-700 border-slate-600 focus:ring-indigo-500" />
            <span>Usar solo recetas favoritas</span>
        </label>
        
        {/* Checkbox: Evitar repetir ingredientes */}
        <label className="flex items-center space-x-2 text-slate-300 mb-6 cursor-pointer">
            <input type="checkbox" checked={prefs.avoidRepeat} onChange={(e) => setPrefs(p => ({ ...p, avoidRepeat: e.target.checked }))} className="form-checkbox text-indigo-500 rounded h-4 w-4 bg-slate-700 border-slate-600 focus:ring-indigo-500" />
            <span>Evitar repetir ingredientes clave</span>
        </label>

        {/* Slider: Variedad */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">Nivel de Variedad ({prefs.varietyLevel})</label>
            <input 
                type="range" 
                min="0" 
                max="2" 
                value={prefs.varietyLevel === 'low' ? 0 : prefs.varietyLevel === 'medium' ? 1 : 2}
                onChange={(e) => {
                    const level = ['low', 'medium', 'high'][parseInt(e.target.value)];
                    setPrefs(p => ({ ...p, varietyLevel: level as 'low' | 'medium' | 'high' }));
                }}
                className="w-full h-2 bg-indigo-600 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${prefs.varietyLevel === 'low' ? 0 : prefs.varietyLevel === 'medium' ? 50 : 100}%, #475569 ${prefs.varietyLevel === 'low' ? 0 : prefs.varietyLevel === 'medium' ? 50 : 100}%, #475569 100%)` }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1"><span>Baja</span><span>Media</span><span>Alta</span></div>
        </div>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white rounded-lg transition-colors">Cancelar</button>
          <button onClick={handleGenerate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
            <Zap className="w-4 h-4" /> Generar Plan
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente MOCK de barra de macros
const MacroBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex items-center text-sm">
        <span className="w-24 text-slate-400">{label}:</span>
        <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }}></div>
        </div>
        <span className="w-10 text-right font-semibold text-white ml-2">{value}g</span>
    </div>
);

// --- Componente Principal ---

export default function MealPlannerPage() {
  const { currentWeek, weekLabel, weekPlan, weeklyStats, isLoading, fetchMealPlan, generateAutoPlan, navigateWeek, assignRecipe } = useMealPlanStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mealTypes: (keyof MealPlanEntry['meals'])[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Carga el plan cuando el componente se monta o cuando cambia la semana (currentWeek)
  useEffect(() => {
    if (currentWeek) {
        fetchMealPlan(currentWeek);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek]); 

  // MOCK: ID de recetas simple para simular la asignación desde un selector
  const RECIPE_IDS_MOCK = ["r1", "r2", "r3", "r4", "r5"];

  // Asigna una receta (simula que el selector de recetas devuelve un ID)
  const handleAssignRecipe = (date: string, mealType: keyof MealPlanEntry['meals']) => {
      // Usamos un ID de receta mock aleatorio para simular la selección
      const mockRecipeId = RECIPE_IDS_MOCK[Math.floor(Math.random() * RECIPE_IDS_MOCK.length)];
      assignRecipe(date, mealType, mockRecipeId);
  }
  
  // Quita una receta (DELETE)
  const handleRemoveRecipe = (date: string, mealType: keyof MealPlanEntry['meals']) => {
      assignRecipe(date, mealType, null); // recipeId: null para indicar DELETE/Remove
  }
  
  const handleGenerate = (preferences: PlanPreferences) => {
    generateAutoPlan(preferences);
  };
  
  // Preparar los datos: asegura que weekPlan siempre tenga 7 días con las fechas correctas si es posible
  const structuredPlan: MealPlanEntry[] = daysOfWeek.map((day, index) => {
      // Intenta encontrar la entrada correspondiente en el plan cargado
      const loadedEntry = weekPlan.find(entry => entry.day === day);
      
      // Si no hay entrada cargada, crea una entrada vacía para ese día.
      if (loadedEntry) return loadedEntry;

      // Esto es un fallback, idealmente el API siempre devuelve 7 días estructurados.
      return { 
          date: `2024-XX-${index + 1}`, // Fecha de fallback
          day: day, 
          meals: { breakfast: null, lunch: null, dinner: null, snacks: null } 
      };
  });


  // --- Renderización del componente ---
  return (
    <div className="min-h-screen bg-slate-950 text-white flex font-inter">
      
      {/* --- Contenido Principal (Plan Semanal) --- */}
      <main className="flex-1 p-6 overflow-x-auto">
        
        {/* --- Header y Navegación --- */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-950/90 py-4 z-10 border-b border-slate-800 min-w-[700px]">
          <h1 className="text-2xl font-bold">Planificador Semanal</h1>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigateWeek('prev')} 
              className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold text-indigo-400 whitespace-nowrap">
              {weekLabel}
            </span>
            <button 
              onClick={() => navigateWeek('next')} 
              className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-slate-900 font-bold rounded-lg transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            Generar plan automático
          </button>
        </div>

        {/* Indicador de Carga */}
        {isLoading && <div className="text-center py-8 text-indigo-400 flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Cargando plan...</div>}
        
        {/* --- Grid Semanal --- */}
        <div className="grid border border-slate-700 rounded-xl overflow-hidden shadow-2xl" style={{ gridTemplateColumns: `repeat(${daysOfWeek.length + 1}, minmax(130px, 1fr))` }}>
          
          {/* Fila de Encabezados de Comidas */}
          <div className="bg-slate-800 text-sm font-semibold p-3 sticky left-0 z-20 border-r border-slate-700">Comida</div>
          {daysOfWeek.map(day => (
            <div key={day} className="bg-slate-800 text-sm font-semibold p-3 text-center border-l border-slate-700">
              {day}
            </div>
          ))}

          {/* Filas de Recetas */}
          {mealTypes.map((mealType) => (
            <React.Fragment key={mealType}>
              
              {/* Etiqueta de la Comida (Fila) */}
              <div className="bg-slate-900 text-xs font-bold uppercase text-slate-300 p-3 sticky left-0 z-10 border-t border-slate-700 border-r border-slate-700 flex items-center">
                {mealType === 'breakfast' ? 'Desayuno' : 
                 mealType === 'lunch' ? 'Almuerzo' : 
                 mealType === 'dinner' ? 'Cena' : 'Snacks'}
              </div>

              {/* Celdas del Plan (Días) */}
              {structuredPlan.map((dayEntry: MealPlanEntry, index) => (
                <div 
                  key={`${dayEntry.date}-${mealType}`} 
                  className={`p-1.5 border-l border-t border-slate-700 h-36 ${index === 6 ? '' : ''}`} // Borde derecho en el último
                >
                  <RecipeCard 
                    recipe={dayEntry.meals[mealType]} 
                    onAssign={() => handleAssignRecipe(dayEntry.date, mealType)}
                    onReplace={() => handleRemoveRecipe(dayEntry.date, mealType)} // Reemplazar = Quitar y luego Añadir
                    onFavoriteToggle={() => console.log(`Toggle Favorite para ${dayEntry.date}/${mealType}`)}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        
        {/* Mensaje de Error */}
        {useMealPlanStore.getState().error && (
            <div className="mt-4 p-3 bg-red-900 border border-red-500 rounded-lg text-red-100">
                Error: {useMealPlanStore.getState().error}
            </div>
        )}
      </main>

      {/* --- Sidebar (Resumen Semanal) --- */}
      <aside className="w-80 bg-slate-900 p-6 border-l border-slate-800 flex-shrink-0">
        <h3 className="text-xl font-bold text-white mb-4">Resumen Semanal</h3>
        
        {/* Estadística de Calorías */}
        <div className="mb-4 p-4 bg-slate-800 rounded-xl border-l-4 border-indigo-500">
          <p className="text-sm text-slate-400">Promedio calorías/día</p>
          <p className="text-3xl font-extrabold text-white mt-1">{weeklyStats.avgCalories} <span className="text-sm text-slate-400">kcal</span></p>
        </div>

        {/* Estadística de Macros */}
        <div className="space-y-3 p-4 bg-slate-800 rounded-xl">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Promedio Macros/día</h4>
          <MacroBar label="Proteína" value={weeklyStats.avgMacros.protein} color="bg-red-500" />
          <MacroBar label="Carbohidratos" value={weeklyStats.avgMacros.carbs} color="bg-green-500" />
          <MacroBar label="Grasas" value={weeklyStats.avgMacros.fats} color="bg-yellow-500" />
        </div>

        {/* Botón de Lista de Compra */}
        <button className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Generar Lista de Compra
        </button>
      </aside>
      
      {/* Modal de Generación */}
      {isModalOpen && <AutoGenerateModal onClose={() => setIsModalOpen(false)} onGenerate={handleGenerate} />}
    </div>
  );
}