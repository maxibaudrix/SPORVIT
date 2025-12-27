// src/app/(public)/plan/[slug]/page.tsx
'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Calendar, Clock, TrendingUp, Users, Dumbbell, 
  CheckCircle2, ArrowRight, Star, ChevronDown, ArrowLeft,
  Target, Zap, Award
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
  
  const program = getProgramBySlug(params.slug);
  
  if (!program) {
    notFound();
  }

  const similarPrograms = getSimilarPrograms(program, 3);
  const currentWeek = program.semanas.find(s => s.numero === activeWeek);

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
                      onClick={() => setActiveWeek(semana.numero)}
                      className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all ${
                        activeWeek === semana.numero
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700/50'
                      }`}
                    >
                      <div className="text-sm">Semana {semana.numero}</div>
                      <div className="text-xs opacity-75 mt-0.5">{semana.titulo}</div>
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

                  {/* Days Accordion */}
                  <div className="space-y-4">
                    {Object.entries(currentWeek.plan).map(([day, exercises]) => (
                      <DayAccordion 
                        key={day} 
                        day={day} 
                        exercises={exercises as Exercise[]} 
                      />
                    ))}
                  </div>
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
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 sticky top-24">
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
                  {similarPrograms.map((similar) => (
                    <Link 
                      key={similar.slug}
                      href={`/plan/${similar.slug}`}
                      className="block p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50"
                    >
                      <h4 className="font-medium text-sm mb-1 line-clamp-2 text-white">
                        {similar.meta.title}
                      </h4>
                      <p className="text-xs text-slate-400 capitalize">
                        {similar.metadata.duracion_total_semanas} semanas • {normalizeText(similar.metadata.nivel)}
                      </p>
                    </Link>
                  ))}
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

function DayAccordion({ day, exercises }: { day: string; exercises: Exercise[] }) {
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

  if (exercises.length === 0) {
    return (
      <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">{dayNames[day.toLowerCase()] || day}</h3>
          <span className="text-sm text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Descanso
          </span>
        </div>
      </div>
    );
  }

  return (
    <details className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden">
      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors">
        <div>
          <h3 className="font-bold text-white">{dayNames[day.toLowerCase()] || day}</h3>
          <p className="text-sm text-slate-400">{exercises.length} ejercicios</p>
        </div>
        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
      </summary>
      
      <div className="p-4 pt-0 space-y-3">
        {exercises.map((exercise, i) => (
          <div key={i} className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-white">{exercise.ejercicio}</h4>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">#{i + 1}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
              {exercise.series && (
                <div className="bg-slate-900/50 rounded px-3 py-2">
                  <span className="text-slate-500 text-xs block mb-1">Series</span>
                  <span className="font-bold text-emerald-400">{exercise.series}</span>
                </div>
              )}
              {exercise.repeticiones && (
                <div className="bg-slate-900/50 rounded px-3 py-2">
                  <span className="text-slate-500 text-xs block mb-1">Reps</span>
                  <span className="font-bold text-emerald-400">{exercise.repeticiones}</span>
                </div>
              )}
              {exercise.descanso_seg && (
                <div className="bg-slate-900/50 rounded px-3 py-2">
                  <span className="text-slate-500 text-xs block mb-1">Descanso</span>
                  <span className="font-bold text-emerald-400">{exercise.descanso_seg}s</span>
                </div>
              )}
              {exercise.duracion_min && (
                <div className="bg-slate-900/50 rounded px-3 py-2">
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
    </details>
  );
}