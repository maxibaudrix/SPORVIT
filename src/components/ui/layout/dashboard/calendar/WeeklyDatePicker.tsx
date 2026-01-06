'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { DayPlan } from '@/types/calendar';
import { getDayName, isToday } from '@/lib/utils/calendar';

interface WeekDay {
  id: string;
  label: string; // 'Lun', 'Mar', etc.
  num: number;   // 8, 9, 10, etc.
  date: Date;    // ISO Date object
  dateISO: string; // ISO string
  completed: boolean;
  workoutCompleted: boolean;
  nutritionCompleted: boolean;
  workoutType?: string;
  workoutIntensity?: number; // 1-3
  isRest?: boolean;
}

interface WeeklyDatePickerProps {
  days: DayPlan[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function WeeklyDatePicker({
  days,
  selectedDate,
  onDateSelect,
}: WeeklyDatePickerProps) {
  // Ref para el contenedor scroll en mobile
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Transformar DayPlan[] a WeekDay[]
  const weekDays = useMemo((): WeekDay[] => {
    return days.map((dayPlan, index) => {
      const workouts = dayPlan.events.filter(e => e.type === 'workout');
      const meals = dayPlan.events.filter(e => e.type === 'meal');

      const workoutCompleted = workouts.length > 0 && workouts.every(w => w.completed);
      const nutritionCompleted = meals.length > 0; // Asumimos que si hay comidas, está completo
      const completed = workoutCompleted && nutritionCompleted;

      // Detectar tipo de entrenamiento y intensidad
      let workoutType = 'strength'; // default
      let workoutIntensity = 2; // default
      let isRest = workouts.length === 0;

      if (workouts.length > 0) {
        const firstWorkout = workouts[0];
        workoutType = firstWorkout.workoutType || 'strength';
        // Calcular intensidad basada en duración (ejemplo)
        workoutIntensity = firstWorkout.durationMinutes > 60 ? 3 :
                          firstWorkout.durationMinutes > 30 ? 2 : 1;
      }

      return {
        id: dayPlan.date.toISOString(),
        label: getDayName(dayPlan.date, true).substring(0, 3), // 'Lun', 'Mar', etc.
        num: dayPlan.date.getDate(),
        date: dayPlan.date,
        dateISO: dayPlan.date.toISOString(),
        completed,
        workoutCompleted,
        nutritionCompleted,
        workoutType,
        workoutIntensity,
        isRest,
      };
    });
  }, [days]);

  const handleDayClick = (day: WeekDay) => {
    onDateSelect(day.date);
  };

  // Auto-scroll al día seleccionado en mobile
  useEffect(() => {
    if (scrollContainerRef.current && selectedDate) {
      const selectedIndex = weekDays.findIndex(
        day => day.date.toDateString() === selectedDate.toDateString()
      );

      if (selectedIndex !== -1) {
        const container = scrollContainerRef.current;
        const cardWidth = 96; // w-24 = 6rem = 96px
        const gap = 16; // gap-4 = 1rem = 16px
        const scrollPosition = selectedIndex * (cardWidth + gap);

        container.scrollTo({
          left: scrollPosition - (container.clientWidth / 2) + (cardWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedDate, weekDays]);

  // Función para obtener clases de color por tipo de entrenamiento
  const getWorkoutColorClasses = (type: string, isRest: boolean) => {
    if (isRest) {
      return {
        border: 'border-slate-500',
        shadow: 'shadow-slate-500/10',
        text: 'text-slate-400',
        bg: 'bg-slate-500',
        bgSelected: 'bg-slate-500/20',
        textSelected: 'text-slate-300',
        dot: 'bg-slate-400',
      };
    }

    switch (type) {
      case 'strength':
        return {
          border: 'border-emerald-500',
          shadow: 'shadow-emerald-500/10',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500',
          bgSelected: 'bg-emerald-500/20',
          textSelected: 'text-emerald-300',
          dot: 'bg-emerald-400',
        };
      case 'running':
      case 'cycling':
        return {
          border: 'border-blue-500',
          shadow: 'shadow-blue-500/10',
          text: 'text-blue-400',
          bg: 'bg-blue-500',
          bgSelected: 'bg-blue-500/20',
          textSelected: 'text-blue-300',
          dot: 'bg-blue-400',
        };
      case 'swimming':
        return {
          border: 'border-orange-500',
          shadow: 'shadow-orange-500/10',
          text: 'text-orange-400',
          bg: 'bg-orange-500',
          bgSelected: 'bg-orange-500/20',
          textSelected: 'text-orange-300',
          dot: 'bg-orange-400',
        };
      case 'yoga':
      case 'stretching':
        return {
          border: 'border-purple-500',
          shadow: 'shadow-purple-500/10',
          text: 'text-purple-400',
          bg: 'bg-purple-500',
          bgSelected: 'bg-purple-500/20',
          textSelected: 'text-purple-300',
          dot: 'bg-purple-400',
        };
      default:
        return {
          border: 'border-slate-500',
          shadow: 'shadow-slate-500/10',
          text: 'text-slate-400',
          bg: 'bg-slate-500',
          bgSelected: 'bg-slate-500/20',
          textSelected: 'text-slate-300',
          dot: 'bg-slate-400',
        };
    }
  };

  return (
    <div className="w-full">
      {/* Mobile: Scroll horizontal */}
      <div
        ref={scrollContainerRef}
        className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 py-6 scrollbar-hide"
      >
        {weekDays.map((day) => {
          const isSelected = selectedDate &&
            day.date.toDateString() === selectedDate.toDateString();
          const isCurrentDay = isToday(day.date);
          const colors = getWorkoutColorClasses(day.workoutType || 'strength', day.isRest || false);

          return (
            <button
              key={day.id}
              onClick={() => handleDayClick(day)}
              className={`
                flex-shrink-0 snap-center
                w-24 min-w-[6rem]
                rounded-[2.5rem]
                bg-white/5 backdrop-blur-xl
                border-2 transition-all duration-300
                p-4 flex flex-col items-center gap-2
                ${isSelected
                  ? `${colors.border} shadow-xl ${colors.shadow} scale-105`
                  : 'border-transparent hover:border-white/10 hover:scale-[1.02]'
                }
              `}
            >
              {/* Day label */}
              <span className={`
                text-xs font-medium uppercase tracking-wider
                ${isSelected ? colors.text : 'text-slate-400'}
              `}>
                {day.label}
              </span>

              {/* Day number */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                transition-colors duration-300
                ${isCurrentDay
                  ? `${colors.bg} text-white`
                  : isSelected
                    ? `${colors.bgSelected} ${colors.textSelected}`
                    : 'bg-slate-800/50 text-slate-300'
                }
              `}>
                <span className="text-lg font-bold">{day.num}</span>
              </div>

              {/* Intensity indicators (dots) */}
              {!day.isRest && (
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`
                        w-1.5 h-1.5 rounded-full transition-all duration-300
                        ${level <= (day.workoutIntensity || 0)
                          ? colors.dot
                          : 'bg-slate-700'
                        }
                      `}
                    />
                  ))}
                </div>
              )}

              {/* Completion indicators */}
              <div className="flex gap-1.5 mt-2">
                {/* Workout indicator */}
                <div className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${day.workoutCompleted
                    ? colors.dot
                    : day.isRest
                      ? 'bg-slate-600'
                      : 'bg-slate-700'
                  }
                `} />

                {/* Nutrition indicator */}
                <div className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${day.nutritionCompleted
                    ? 'bg-amber-400'
                    : 'bg-slate-700'
                  }
                `} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Desktop: Grid 7 columnas */}
      <div className="hidden lg:grid lg:grid-cols-7 gap-4 px-6 py-6">
        {weekDays.map((day) => {
          const isSelected = selectedDate &&
            day.date.toDateString() === selectedDate.toDateString();
          const isCurrentDay = isToday(day.date);
          const colors = getWorkoutColorClasses(day.workoutType || 'strength', day.isRest || false);

          return (
            <button
              key={day.id}
              onClick={() => handleDayClick(day)}
              className={`
                rounded-[2.5rem]
                bg-white/5 backdrop-blur-xl
                border-2 transition-all duration-300
                p-5 flex flex-col items-center gap-3
                cursor-pointer
                ${isSelected
                  ? `${colors.border} shadow-xl ${colors.shadow} scale-105`
                  : 'border-transparent hover:border-white/10 hover:scale-[1.02]'
                }
              `}
            >
              {/* Day label */}
              <span className={`
                text-xs font-medium uppercase tracking-wider
                ${isSelected ? colors.text : 'text-slate-400'}
              `}>
                {day.label}
              </span>

              {/* Day number */}
              <div className={`
                w-14 h-14 rounded-full flex items-center justify-center
                transition-colors duration-300
                ${isCurrentDay
                  ? `${colors.bg} text-white`
                  : isSelected
                    ? `${colors.bgSelected} ${colors.textSelected}`
                    : 'bg-slate-800/50 text-slate-300'
                }
              `}>
                <span className="text-xl font-bold">{day.num}</span>
              </div>

              {/* Workout type label */}
              {!day.isRest && (
                <span className={`
                  text-[10px] font-medium uppercase tracking-wider
                  ${isSelected ? colors.text : 'text-slate-500'}
                `}>
                  {day.workoutType}
                </span>
              )}

              {day.isRest && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Descanso
                </span>
              )}

              {/* Intensity indicators (dots) */}
              {!day.isRest && (
                <div className="flex gap-1.5 mt-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${level <= (day.workoutIntensity || 0)
                          ? colors.dot
                          : 'bg-slate-700'
                        }
                      `}
                    />
                  ))}
                </div>
              )}

              {/* Completion indicators */}
              <div className="flex gap-2 mt-2">
                {/* Workout indicator */}
                <div className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${day.workoutCompleted
                    ? colors.dot
                    : day.isRest
                      ? 'bg-slate-600'
                      : 'bg-slate-700'
                  }
                `} />

                {/* Nutrition indicator */}
                <div className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${day.nutritionCompleted
                    ? 'bg-amber-400'
                    : 'bg-slate-700'
                  }
                `} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
