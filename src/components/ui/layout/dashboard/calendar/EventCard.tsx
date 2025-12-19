'use client';

import { DayEvent, WorkoutEvent, MealEvent, RestEvent } from '@/types/calendar';
import { 
  Dumbbell, 
  Bike, 
  Activity, 
  Droplets, 
  Heart,
  Utensils,
  Cookie,
  Zap,
  Coffee,
  BedDouble
} from 'lucide-react';

interface EventCardProps {
  event: DayEvent;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  if (event.type === 'workout') {
    return <WorkoutCard event={event} onClick={onClick} />;
  }
  
  if (event.type === 'meal') {
    return <MealCard event={event} onClick={onClick} />;
  }
  
  if (event.type === 'rest') {
    return <RestCard event={event} onClick={onClick} />;
  }

  return null;
}

function WorkoutCard({ event, onClick }: { event: WorkoutEvent; onClick: () => void }) {
  const icon = getWorkoutIcon(event.workoutType);
  const color = getWorkoutColor(event.workoutType);

  return (
    <div
      onClick={onClick}
      className={`
        relative p-3 rounded-lg cursor-pointer
        transition-all hover:scale-[1.02]
        ${color.bg} ${color.border}
        ${event.completed ? 'opacity-80' : ''}
      `}
    >
      {/* Completed badge */}
      {event.completed && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${color.iconBg} rounded-lg p-2`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">
            {event.title}
          </h4>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">
              {event.durationMinutes} min
            </span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {event.estimatedCalories} kcal
            </span>
          </div>

          {event.series && event.repetitions && (
            <div className="text-xs text-slate-500 mt-1">
              {event.series}x{event.repetitions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MealCard({ event, onClick }: { event: MealEvent; onClick: () => void }) {
  const icon = getMealIcon(event.mealType);
  const color = getMealColor(event.mealType);

  return (
    <div
      onClick={onClick}
      className={`
        relative p-3 rounded-lg cursor-pointer
        transition-all hover:scale-[1.02]
        ${color.bg} ${color.border}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${color.iconBg} rounded-lg p-2`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            {getMealTypeLabel(event.mealType)}
          </h4>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-white">
              {event.totalCalories} kcal
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>P: {event.totalProteinG.toFixed(0)}g</span>
            <span>C: {event.totalCarbsG.toFixed(0)}g</span>
            <span>G: {event.totalFatG.toFixed(0)}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RestCard({ event, onClick }: { event: RestEvent; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="
        p-3 rounded-lg cursor-pointer
        transition-all hover:scale-[1.02]
        bg-slate-900/50 border border-slate-800
      "
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="bg-slate-800 rounded-lg p-2">
          <BedDouble className="w-5 h-5 text-slate-500" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-slate-400">
            {event.title}
          </h4>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getWorkoutIcon(type: string) {
  const iconClass = "w-5 h-5";
  
  switch (type) {
    case 'running':
      return <Activity className={iconClass} />;
    case 'cycling':
      return <Bike className={iconClass} />;
    case 'strength':
      return <Dumbbell className={iconClass} />;
    case 'swimming':
      return <Droplets className={iconClass} />;
    case 'yoga':
    case 'stretching':
      return <Heart className={iconClass} />;
    default:
      return <Activity className={iconClass} />;
  }
}

function getWorkoutColor(type: string) {
  switch (type) {
    case 'running':
      return {
        bg: 'bg-blue-950/50',
        border: 'border border-blue-900/50',
        iconBg: 'bg-blue-900/30',
      };
    case 'cycling':
      return {
        bg: 'bg-emerald-950/50',
        border: 'border border-emerald-900/50',
        iconBg: 'bg-emerald-900/30',
      };
    case 'strength':
      return {
        bg: 'bg-orange-950/50',
        border: 'border border-orange-900/50',
        iconBg: 'bg-orange-900/30',
      };
    case 'swimming':
      return {
        bg: 'bg-cyan-950/50',
        border: 'border border-cyan-900/50',
        iconBg: 'bg-cyan-900/30',
      };
    case 'yoga':
    case 'stretching':
      return {
        bg: 'bg-purple-950/50',
        border: 'border border-purple-900/50',
        iconBg: 'bg-purple-900/30',
      };
    default:
      return {
        bg: 'bg-slate-900/50',
        border: 'border border-slate-800',
        iconBg: 'bg-slate-800',
      };
  }
}

function getMealIcon(type: string) {
  const iconClass = "w-5 h-5";
  
  switch (type) {
    case 'meal':
      return <Utensils className={iconClass} />;
    case 'snack':
      return <Cookie className={iconClass} />;
    case 'pre_workout':
      return <Zap className={iconClass} />;
    case 'post_workout':
      return <Coffee className={iconClass} />;
    default:
      return <Utensils className={iconClass} />;
  }
}

function getMealColor(type: string) {
  return {
    bg: 'bg-slate-900/50',
    border: 'border border-slate-800',
    iconBg: 'bg-slate-800',
  };
}

function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    meal: 'Comida',
    snack: 'Snack',
    pre_workout: 'Pre entreno',
    post_workout: 'Post entreno',
  };
  return labels[type] || type;
}
