'use client';
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Plus, 
  MoreHorizontal, Flame, Droplet, Dumbbell, 
  CheckCircle2, Circle, Utensils, Trash2, Edit2,
  TrendingUp, ArrowRight
} from 'lucide-react';

// --- TIPOS DE DATOS (Simulando tu esquema de BDD/Store) ---
type FoodItem = {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type Meal = {
  id: string;
  name: string; // 'Desayuno', 'Almuerzo', etc.
  items: FoodItem[];
};

type Exercise = {
  id: string;
  name: string;
  sets: string;
  weight: string;
  completed: boolean;
};

// --- MOCK DATA (Simulando respuesta GET /api/diary?date=...) ---
const initialMeals: Meal[] = [
  {
    id: 'breakfast',
    name: 'Desayuno',
    items: [
      { id: '1', name: 'Avena con Proteína', quantity: '1 bol', calories: 350, protein: 25, carbs: 40, fats: 6 },
      { id: '2', name: 'Café solo', quantity: '1 taza', calories: 5, protein: 0, carbs: 1, fats: 0 },
    ]
  },
  {
    id: 'lunch',
    name: 'Almuerzo',
    items: [
      { id: '3', name: 'Pechuga de Pollo', quantity: '200g', calories: 330, protein: 60, carbs: 0, fats: 7 },
      { id: '4', name: 'Arroz Basmati', quantity: '150g', calories: 350, protein: 8, carbs: 75, fats: 2 },
      { id: '5', name: 'Aceite de Oliva', quantity: '10ml', calories: 90, protein: 0, carbs: 0, fats: 10 },
    ]
  },
  {
    id: 'dinner',
    name: 'Cena',
    items: [] // Sin registrar aún
  },
  {
    id: 'snacks',
    name: 'Snacks',
    items: [
      { id: '6', name: 'Manzana', quantity: '1 unidad', calories: 52, protein: 0, carbs: 14, fats: 0 },
    ]
  }
];

const initialWorkout = {
  id: 'push-day',
  name: 'Empuje (Pecho + Hombro)',
  duration: '60 min',
  exercises: [
    { id: 'ex1', name: 'Press Banca Plano', sets: '4x8', weight: '80kg', completed: true },
    { id: 'ex2', name: 'Press Militar', sets: '3x10', weight: '40kg', completed: true },
    { id: 'ex3', name: 'Fondos en Paralelas', sets: '3x12', weight: 'BW', completed: false },
    { id: 'ex4', name: 'Elevaciones Laterales', sets: '4x15', weight: '12kg', completed: false },
  ]
};

export default function DiaryPage() {
  // --- ESTADOS (Store Local) ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [workout, setWorkout] = useState(initialWorkout);
  const [waterIntake, setWaterIntake] = useState(8); // Vasos de 250ml (8 vasos = 2L)
  const [waterCurrent, setWaterCurrent] = useState(5); // Estado actual

  // Objetivos (Hardcoded por ahora, vendrían del User Profile)
  const targets = {
    calories: 2100,
    protein: 165,
    carbs: 210,
    fats: 70,
    water: 2000 // ml
  };

  // --- CÁLCULOS DINÁMICOS (Derived State) ---
  const calculateTotals = () => {
    let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
    meals.forEach(meal => {
      meal.items.forEach(item => {
        totalCal += item.calories;
        totalP += item.protein;
        totalC += item.carbs;
        totalF += item.fats;
      });
    });
    return { totalCal, totalP, totalC, totalF };
  };

  const { totalCal, totalP, totalC, totalF } = calculateTotals();

  // --- HANDLERS (Simulando llamadas a API) ---
  
  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
    // Aquí se llamaría a: GET /api/diary?date=YYYY-MM-DD
  };

  const toggleExercise = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )
    }));
    // Aquí se llamaría a: PATCH /api/diary/exercise
  };

  const handleWaterClick = (index: number) => {
    // Si clickas en uno vacío, se llena hasta ahí. Si clickas en uno lleno, se reduce.
    const newValue = index + 1 === waterCurrent ? index : index + 1;
    setWaterCurrent(newValue);
    // Aquí se llamaría a: POST /api/diary/water
  };

  // Formateador de fecha
  const formattedDate = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'short' 
  }).format(currentDate);

  // Helper para barras de progreso
  const ProgressBar = ({ current, max, colorClass }: { current: number, max: number, colorClass: string }) => {
    const percentage = Math.min(100, (current / max) * 100);
    return (
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
        <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      
      {/* --- HEADER STICKY --- */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-md">
          <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
            <span className="text-sm font-bold flex items-center gap-2 capitalize">
              <Calendar className="w-4 h-4 text-emerald-500" />
              {formattedDate}
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
              {currentDate.toDateString() === new Date().toDateString() ? 'Hoy' : 'Histórico'}
            </span>
          </div>

          <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl space-y-6">

        {/* --- 1. RESUMEN DE CALORÍAS Y MACROS --- */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-900/50 rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <h2 className="text-3xl font-bold text-white">{totalCal.toLocaleString()}</h2>
              <p className="text-xs text-slate-400 font-medium">kcal consumidas / {targets.calories}</p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-bold ${targets.calories - totalCal < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {Math.abs(targets.calories - totalCal)}
              </span>
              <p className="text-xs text-slate-500">kcal {targets.calories - totalCal < 0 ? 'exceso' : 'restantes'}</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-blue-300">Proteína</span>
                <span className="text-slate-400">{totalP} / {targets.protein}g</span>
              </div>
              <ProgressBar current={totalP} max={targets.protein} colorClass="bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-orange-300">Carbohidratos</span>
                <span className="text-slate-400">{totalC} / {targets.carbs}g</span>
              </div>
              <ProgressBar current={totalC} max={targets.carbs} colorClass="bg-orange-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-yellow-300">Grasas</span>
                <span className="text-slate-400">{totalF} / {targets.fats}g</span>
              </div>
              <ProgressBar current={totalF} max={targets.fats} colorClass="bg-yellow-500" />
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* --- 2. SECCIÓN COMIDAS (Columna Izquierda) --- */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Utensils className="w-5 h-5 text-emerald-500" />
                Registro de Comidas
              </h3>
            </div>

            {meals.map((meal) => {
              const mealCalories = meal.items.reduce((acc, item) => acc + item.calories, 0);
              
              return (
                <div key={meal.id} className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
                  {/* Meal Header */}
                  <div className="bg-slate-900/80 p-3 px-4 flex justify-between items-center border-b border-slate-800">
                    <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wide">{meal.name}</h4>
                    <span className="text-xs font-mono text-slate-400">{mealCalories} kcal</span>
                  </div>

                  {/* Meal Items List */}
                  <div className="divide-y divide-slate-800/50">
                    {meal.items.length > 0 ? (
                      meal.items.map((item) => (
                        <div key={item.id} className="p-3 px-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors group">
                          <div>
                            <p className="font-medium text-sm text-slate-200">{item.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {item.quantity} • <span className="text-blue-400/70">P:{item.protein}</span> <span className="text-orange-400/70">C:{item.carbs}</span> <span className="text-yellow-400/70">F:{item.fats}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400">{item.calories}</span>
                            <button className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition-all rounded-lg hover:bg-red-500/10">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-600 italic">
                        No hay alimentos registrados
                      </div>
                    )}
                    
                    {/* Add Food Button */}
                    <button className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/5 transition-colors uppercase tracking-wide">
                      <Plus className="w-4 h-4" />
                      Añadir a {meal.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- 3. SECCIÓN ENTRENAMIENTO E HIDRATACIÓN (Columna Derecha) --- */}
          <div className="space-y-6">
            
            {/* Workout Card */}
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 bg-gradient-to-br from-purple-900/20 to-slate-900">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-purple-200 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5" />
                    Entreno de Hoy
                  </h3>
                  <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                    Editar <Edit2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-lg font-bold text-white">{workout.name}</p>
                <p className="text-xs text-purple-300/60 font-medium mt-1">{workout.duration} • {workout.exercises.length} ejercicios</p>
              </div>

              <div className="p-2">
                {workout.exercises.map((ex) => (
                  <button 
                    key={ex.id}
                    onClick={() => toggleExercise(ex.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                      ex.completed ? 'opacity-50 hover:opacity-75' : 'hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {ex.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 group-hover:text-purple-400 flex-shrink-0" />
                      )}
                      <div className="flex-grow min-w-0">
                        <p className={`text-sm font-medium truncate ${ex.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {ex.name}
                        </p>
                        <p className="text-xs text-slate-500">{ex.sets} @ {ex.weight}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="p-3 border-t border-slate-800">
                <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 active:scale-95">
                  <TrendingUp className="w-4 h-4" />
                  Comenzar Entreno
                </button>
              </div>
            </div>

            {/* Water Tracker */}
            <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-blue-200 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-400" />
                  Hidratación
                </h3>
                <div className="text-right">
                  <span className="text-xl font-bold text-white">{waterCurrent * 250}</span>
                  <span className="text-xs text-slate-500 ml-1">/ {targets.water} ml</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3 mb-2">
                {[...Array(waterIntake)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => handleWaterClick(i)}
                    className={`h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden group ${
                      i < waterCurrent 
                        ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-100' 
                        : 'bg-slate-800 hover:bg-slate-700 scale-95 border border-slate-700'
                    }`}
                  >
                    {/* Efecto de ola simple con CSS si está lleno */}
                    {i < waterCurrent && (
                      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-400/30"></div>
                    )}
                    <Droplet className={`w-5 h-5 transition-transform group-hover:scale-110 ${i < waterCurrent ? 'text-white fill-white' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500 px-1">
                <span>0 ml</span>
                <span>Objetivo: 2L</span>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}