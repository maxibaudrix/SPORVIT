// components/ui/layout/dashboard/MonthlyCalendarWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DayWithWorkout {
  date: Date;
  hasWorkout: boolean;
  isToday: boolean;
}

export default function MonthlyCalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysWithWorkouts, setDaysWithWorkouts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Cargar días con entrenamientos del mes actual
    loadWorkoutDays();
  }, [currentMonth]);

  const loadWorkoutDays = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const res = await fetch(`/api/dashboard/workouts/month?year=${year}&month=${month}`);
      const data = await res.json();
      
      const workoutDates = new Set<string>(
        data.workoutDays.map((d: string) => new Date(d).toDateString())
      );
      setDaysWithWorkouts(workoutDates);
    } catch (error) {
      console.error('Error loading workout days:', error);
    }
  };

  const getDaysInMonth = (): DayWithWorkout[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: DayWithWorkout[] = [];
    const today = new Date().toDateString();

    // Días del mes anterior (padding)
    for (let i = 0; i < startingDayOfWeek; i++) {
      const date = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date,
        hasWorkout: false,
        isToday: false
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        hasWorkout: daysWithWorkouts.has(date.toDateString()),
        isToday: date.toDateString() === today
      });
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const days = getDaysInMonth();

  return (
    <div>
      {/* Header con navegación */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </button>
        
        <h4 className="text-xs font-bold text-white capitalize">
          {monthName}
        </h4>
        
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-bold text-slate-500 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.date.getMonth() === currentMonth.getMonth();
          
          return (
            <button
              key={index}
              className={`
                aspect-square flex items-center justify-center text-xs rounded
                relative transition-all
                ${isCurrentMonth 
                  ? 'text-slate-300 hover:bg-slate-800' 
                  : 'text-slate-700'
                }
                ${day.isToday 
                  ? 'bg-emerald-500 text-white font-bold hover:bg-emerald-600' 
                  : ''
                }
                ${day.hasWorkout && !day.isToday
                  ? 'ring-1 ring-emerald-500 ring-inset' 
                  : ''
                }
              `}
            >
              {day.date.getDate()}
              
              {/* Indicador de workout */}
              {day.hasWorkout && !day.isToday && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-3 mt-3 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-500">Hoy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full border border-emerald-500" />
          <span className="text-slate-500">Entreno</span>
        </div>
      </div>
    </div>
  );
}