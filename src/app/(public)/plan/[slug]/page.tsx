// src/app/(public)/plan/[slug]/page.tsx
'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Calendar, Clock, TrendingUp, Users, Dumbbell, 
  CheckCircle2, ArrowRight, Star, ChevronDown, ArrowLeft,
  Target, Zap, Award, X
} from 'lucide-react';
import { 
  getProgramBySlug,
  getSimilarPrograms,
  type ProgramaPlan,
  type SemanaPlan,
  type Exercise
} from '@/lib/data/trainingPlans';

// ============================================
// HELPER FUNCTIONS
// ============================================
function normalizeText(text: string): string {
  const map: Record<string, string> = {
    'perdida_grasa': 'Pérdida de Grasa',
    'perdida_peso': 'Pérdida de Peso',
    'ganancia_muscular': 'Ganancia Muscular',
    'salud_general': 'Salud General',
    'resistencia': 'Resistencia',
    'fuerza': 'Fuerza',
    'hipertrofia': 'Hipertrofia',
    'definicion': 'Definición',
    'rendimiento': 'Rendimiento',
    'principiante': 'Principiante',
    'intermedio': 'Intermedio',
    'avanzado': 'Avanzado'
  };

  return map[text.toLowerCase()] || text
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// ============================================
// PAGE COMPONENT
// ============================================
export default function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  
  const program = getProgramBySlug(params.slug);
  
  if (!program) {
    notFound();
  }

  const similarPrograms = getSimilarPrograms(program, 3);
  const currentWeek = program.semanas.find(s => s.numero === activeWeek);

  // Reset activeDay when changing weeks
  const handleWeekChange = (weekNumber: number) => {
    setActiveWeek(weekNumber);
    setActiveDay(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Breadcrumbs */}
      <div className="bg-slate-900/50 border-b border-slate-800 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/planes-entrenamiento" className="hover:text-emerald-400 transition-colors">
              Programas
            </Link>
            <span>/</span>
            <span className="text-slate-300 capitalize">{normalizeText(program.metadata.objetivo)}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <Link 
          href="/planes-entrenamiento"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a programas
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
                  {normalizeText(program.metadata.objetivo)}
                </span>
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium rounded-full">
                  {normalizeText(program.metadata.nivel)}
                </span>
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium rounded-full">
                  {program.metadata.duracion_total_semanas} Semanas
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-white">
                {program.meta.title}
              </h1>

              <p className="text-xl text-slate-400 mb-6 leading-relaxed">
                {program.meta.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-slate-400 text-sm">4.8 (127 valoraciones)</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={<Calendar className="w-5 h-5" />}
                label="Duración"
                value={`${program.metadata.duracion_total_semanas} semanas`}
              />
              <StatCard 
                icon={<Clock className="w-5 h-5" />}
                label="Días/semana"
                value={`${program.metadata.dias_por_semana} días`}
              />
              <StatCard 
                icon={<Dumbbell className="w-5 h-5" />}
                label="Ejercicios"
                value={`${program.stats.totalEjercicios}`}
              />
              <StatCard 
                icon={<Users className="w-5 h-5" />}
                label="Usuarios"
                value="5.2K"
              />
            </div>

            {/* Week Tabs */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
              {/* Tabs Header */}
              <div className="border-b border-slate-700/50 p-4 bg-slate-900/50">
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                  {program.semanas.map((semana) => (
                    <button
                      key={semana.numero}
                      onClick={() => handleWeekChange(semana.numero)}
                      className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all ${
                        activeWeek === semana.numero
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700/50'
                      }`}
                    >
                      <div className="text-sm leading-tight">Semana {semana.numero}</div>
                      <div className="text-xs opacity-75 mt-1.5 leading-tight">{semana.titulo}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {currentWeek && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-white">
                      Semana {currentWeek.numero}: {currentWeek.titulo}
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                      {currentWeek.descripcion}
                    </p>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
                    {Object.entries(currentWeek.plan).map(([day, exercises]) => (
                      <DayCard 
                        key={day} 
                        day={day} 
                        exercises={exercises as Exercise[]}
                        isActive={activeDay === day}
                        onClick={() => exercises.length > 0 && setActiveDay(day)}
                      />
                    ))}
                  </div>

                  {/* Expanded Day Details */}
                  {activeDay && currentWeek.plan[activeDay] && (
                    <DayDetailsExpanded 
                      day={activeDay}
                      exercises={currentWeek.plan[activeDay] as Exercise[]}
                      onClose={() => setActiveDay(null)}
                    />
                  )}
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-white">¿Listo para empezar?</h3>
                    <p className="text-slate-300 mb-6">
                      Accede a este programa completo y personaliza cada detalle según tus necesidades.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href="/onboarding"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        Empezar Gratis <ArrowRight className="w-5 h-5" />
                      </Link>
                      <Link 
                        href="/onboarding"
                        className="flex-1 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold hover:bg-slate-700 transition-all text-center"
                      >
                        Personalizar Plan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Equipment Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
                <Dumbbell className="w-5 h-5 text-emerald-400" />
                Equipo Necesario
              </h3>
              {program.metadata.equipo.length > 0 ? (
                <ul className="space-y-2">
                  {program.metadata.equipo.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="capitalize">{normalizeText(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm">Sin equipo necesario</p>
              )}

              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                  PERFIL RECOMENDADO
                </h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nivel:</span>
                    <span className="capitalize">{normalizeText(program.metadata.nivel)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Objetivo:</span>
                    <span className="capitalize">{normalizeText(program.metadata.objetivo)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duración:</span>
                    <span>{program.metadata.duracion_total_semanas} semanas</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                  ESTADÍSTICAS
                </h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total ejercicios:</span>
                    <span className="font-bold text-emerald-400">{program.stats.totalEjercicios}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duración promedio:</span>
                    <span className="font-bold text-emerald-400">{program.stats.duracionPromedioDia} min/día</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Programs */}
            {similarPrograms.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h3 className="font-bold mb-4 text-white">Programas Similares</h3>
                <div className="space-y-3">
                  {similarPrograms.map((similar) => {
                    // Limpiar título igual que en el programa principal
                    const cleanTitle = similar.meta.title
                      .replace(/[-_]?\s*semana\s*\d+/gi, '')
                      .replace(/\s*-\s*$/gi, '')
                      .replace(/\(.*?\)/g, '') // Remover paréntesis con nivel
                      .replace(/pérdida_grasa/gi, 'Pérdida de Grasa')
                      .replace(/perdida_grasa/gi, 'Pérdida de Grasa')
                      .replace(/perdida_peso/gi, 'Pérdida de Peso')
                      .replace(/ganancia_muscular/gi, 'Ganancia Muscular')
                      .replace(/salud_general/gi, 'Salud General')
                      .replace(/_/g, ' ')
                      .trim();

                    return (
                      <Link 
                        key={similar.slug}
                        href={`/plan/${similar.slug}`}
                        className="block p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50"
                      >
                        <h4 className="font-medium text-sm mb-1 line-clamp-2 text-white leading-tight">
                          {cleanTitle}
                        </h4>
                        <p className="text-xs text-slate-400 capitalize">
                          {similar.metadata.duracion_total_semanas} semanas • {normalizeText(similar.metadata.nivel)}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
      <div className="text-emerald-400 mb-2">{icon}</div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-bold capitalize text-white">{value}</div>
    </div>
  );
}

function DayCard({ 
  day, 
  exercises, 
  isActive, 
  onClick 
}: { 
  day: string; 
  exercises: Exercise[]; 
  isActive: boolean;
  onClick: () => void;
}) {
  const dayNames: Record<string, string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    miércoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    sábado: 'Sábado',
    domingo: 'Domingo'
  };

  const dayShortNames: Record<string, string> = {
    lunes: 'LUN',
    martes: 'MAR',
    miercoles: 'MIÉ',
    miércoles: 'MIÉ',
    jueves: 'JUE',
    viernes: 'VIE',
    sabado: 'SÁB',
    sábado: 'SÁB',
    domingo: 'DOM'
  };

  // Determinar tipo de entrenamiento e icono
  const getWorkoutInfo = () => {
    if (exercises.length === 0) {
      return {
        icon: '💤',
        type: 'Descanso',
        color: 'from-slate-700/50 to-slate-800/50',
        borderColor: 'border-slate-700/30'
      };
    }

    const types = exercises.flatMap(ex => ex.tipo || []);
    const hasCardio = types.some(t => t.toLowerCase().includes('cardio'));
    const hasFuerza = types.some(t => t.toLowerCase().includes('fuerza'));
    
    if (hasFuerza && hasCardio) {
      return {
        icon: '🔥',
        type: 'Mixto',
        color: 'from-orange-900/30 to-red-900/30',
        borderColor: 'border-orange-500/30'
      };
    } else if (hasFuerza) {
      return {
        icon: '💪',
        type: 'Fuerza',
        color: 'from-blue-900/30 to-indigo-900/30',
        borderColor: 'border-blue-500/30'
      };
    } else if (hasCardio) {
      return {
        icon: '🏃',
        type: 'Cardio',
        color: 'from-emerald-900/30 to-teal-900/30',
        borderColor: 'border-emerald-500/30'
      };
    }

    return {
      icon: '🎯',
      type: 'Entrenamiento',
      color: 'from-purple-900/30 to-pink-900/30',
      borderColor: 'border-purple-500/30'
    };
  };

  const workoutInfo = getWorkoutInfo();
  const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duracion_min || 0), 0);

  return (
    <button
      onClick={onClick}
      disabled={exercises.length === 0}
      className={`relative bg-gradient-to-br ${workoutInfo.color} backdrop-blur-xl rounded-xl p-3 border ${
        isActive ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : workoutInfo.borderColor
      } transition-all duration-300 hover:scale-105 ${
        exercises.length > 0 ? 'cursor-pointer hover:shadow-lg' : 'cursor-default opacity-75'
      } text-left w-full min-h-[180px] flex flex-col`}
    >
      {/* Day Header */}
      <div className="text-center mb-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
          {dayShortNames[day.toLowerCase()] || day.substring(0, 3).toUpperCase()}
        </div>
        <div className="text-xs font-medium text-slate-300 truncate">
          {dayNames[day.toLowerCase()] || day}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-slate-700/50 mb-2"></div>

      {/* Icon */}
      <div className="text-3xl text-center mb-1.5">{workoutInfo.icon}</div>

      {/* Type */}
      <div className="text-center mb-2">
        <div className="text-[10px] font-bold text-white truncate">{workoutInfo.type}</div>
      </div>

      {/* Stats */}
      {exercises.length > 0 && (
        <div className="space-y-1 text-[10px] text-slate-400 mt-auto">
          <div className="flex items-center justify-between">
            <span className="truncate">Duración:</span>
            <span className="font-bold text-emerald-400 ml-1">{totalDuration || '~45'} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate">Ejercicios:</span>
            <span className="font-bold text-emerald-400 ml-1">{exercises.length}</span>
          </div>
        </div>
      )}

      {/* Active indicator */}
      {isActive && exercises.length > 0 && (
        <div className="mt-2 pt-2 border-t border-emerald-500/50 text-center">
          <span className="text-[10px] text-emerald-400 font-bold">● ACTIVO</span>
        </div>
      )}
      
      {/* Ver detalles indicator */}
      {!isActive && exercises.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-700/50 text-center">
          <span className="text-[10px] text-emerald-400 font-medium">Ver detalles →</span>
        </div>
      )}
    </button>
  );
}

function DayDetailsExpanded({ 
  day, 
  exercises, 
  onClose 
}: { 
  day: string; 
  exercises: Exercise[];
  onClose: () => void;
}) {
  const dayNames: Record<string, string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    miércoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    sábado: 'Sábado',
    domingo: 'Domingo'
  };

  const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duracion_min || 0), 0);

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {dayNames[day.toLowerCase()] || day}
            </h3>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {totalDuration || '~45'} minutos
              </span>
              <span className="flex items-center gap-1">
                <Dumbbell className="w-4 h-4" />
                {exercises.length} ejercicios
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        {exercises.map((exercise, i) => (
          <div key={i} className="bg-slate-950/50 rounded-lg p-5 border border-slate-800">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-white text-lg">{exercise.ejercicio}</h4>
              <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full font-bold">
                #{i + 1}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {exercise.series && (
                <div className="bg-slate-900/50 rounded-lg px-3 py-2">
                  <span className="text-slate-500 text-xs block mb-1">Series</span>
                  <span className="font-bold text-emerald-400">{exercise.series}</span>
                </div>
              )}
              {exercise.repeticiones && (
                <div className="bg-slate-900/50 rounded-lg px-3 py-2">
                  <span className="text-slate-500 text-xs block mb-1">Reps</span>
                  <span className="font-bold text-emerald-400">{exercise.repeticiones}</span>
                </div>
              )}
              {exercise.descanso_seg && (
                <div className="bg-slate-900/50 rounded-lg px-3 py-2">
                  <span className="text-slate-500 text-xs block mb-1">Descanso</span>
                  <span className="font-bold text-emerald-400">{exercise.descanso_seg}s</span>
                </div>
              )}
              {exercise.duracion_min && (
                <div className="bg-slate-900/50 rounded-lg px-3 py-2">
                  <span className="text-slate-500 text-xs block mb-1">Duración</span>
                  <span className="font-bold text-emerald-400">{exercise.duracion_min} min</span>
                </div>
              )}
            </div>
            
            {exercise.descripcion && (
              <p className="text-sm text-slate-400 leading-relaxed">
                {exercise.descripcion}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}