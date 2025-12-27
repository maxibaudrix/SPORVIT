// src/app/(public)/planes-entrenamiento/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Calendar, TrendingUp, Users,
  Star, ArrowRight, Sparkles, Loader2, Target, CheckCircle2, Dumbbell
} from 'lucide-react';
import { 
  filterPrograms,
  getAllObjetivos, 
  getAllNiveles,
  getCatalogStats,
  type ProgramaPlan 
} from '@/lib/data/trainingPlans';

// ============================================
// HELPER FUNCTIONS
// ============================================

function normalizeText(text: string): string {
  const map: Record<string, string> = {
    'salud_general': 'Salud General',
    'ganancia_muscular': 'Ganancia Muscular',
    'perdida_peso': 'Pérdida de Peso',
    'perdida_grasa': 'Pérdida de Grasa',
    'resistencia': 'Resistencia',
    'fuerza': 'Fuerza',
    'hipertrofia': 'Hipertrofia',
    'definicion': 'Definición',
    'rendimiento': 'Rendimiento',
    'principiante': 'Principiante',
    'intermedio': 'Intermedio',
    'avanzado': 'Avanzado',
    'todos': 'Todos'
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
export default function PlanesEntrenamientoHub() {
  const [programs, setPrograms] = useState<ProgramaPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObjetivo, setSelectedObjetivo] = useState<string>('todos');
  const [selectedNivel, setSelectedNivel] = useState<string>('todos');

  useEffect(() => {
    const loadPrograms = async () => {
      setLoading(true);
      try {
        const allPrograms = filterPrograms({});
        setPrograms(allPrograms);
      } catch (error) {
        console.error('Error loading programs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, []);

  const objetivos = ['todos', ...getAllObjetivos()];
  const niveles = ['todos', ...getAllNiveles()];

  const filteredPrograms = useMemo(() => {
    let filtered = filterPrograms({
      objetivo: selectedObjetivo !== 'todos' ? selectedObjetivo : undefined,
      nivel: selectedNivel !== 'todos' ? selectedNivel : undefined
    });

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prog => 
        prog.meta.title.toLowerCase().includes(query) ||
        prog.meta.description.toLowerCase().includes(query) ||
        prog.metadata.objetivo.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedObjetivo, selectedNivel]);

  const stats = getCatalogStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            {stats.totalProgramas}+ Programas Completos de Entrenamiento
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-tight">
            Programas de Entrenamiento
            <br />Completos y Progresivos
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Planes estructurados de 4 semanas diseñados por expertos. 
            Progresión garantizada de principio a fin.
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar programas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-800/50 py-8 bg-slate-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatBadge icon={<Target className="w-5 h-5" />} value={`${stats.totalProgramas}+`} label="Programas" />
            <StatBadge icon={<Dumbbell className="w-5 h-5" />} value={`${stats.totalEjerciciosUnicos}+`} label="Ejercicios" />
            <StatBadge icon={<Star className="w-5 h-5" />} value="4.8/5" label="Rating" />
            <StatBadge icon={<Users className="w-5 h-5" />} value="15K+" label="Usuarios" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 p-6 pb-4 border-b border-slate-700/50">
                <Filter className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-white">Filtros</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6 custom-scrollbar">
                <FilterGroup
                  label="Objetivo"
                  options={objetivos}
                  selected={selectedObjetivo}
                  onChange={setSelectedObjetivo}
                />

                <FilterGroup
                  label="Nivel"
                  options={niveles}
                  selected={selectedNivel}
                  onChange={setSelectedNivel}
                />
              </div>

              <div className="p-6 pt-4 border-t border-slate-700/50 bg-slate-900/50">
                <button
                  onClick={() => {
                    setSelectedObjetivo('todos');
                    setSelectedNivel('todos');
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-all hover:shadow-lg border border-slate-700"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Programs Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {filteredPrograms.length} programas encontrados
              </h2>
            </div>

            {filteredPrograms.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-800">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 mb-4 text-lg">No se encontraron programas con esos filtros.</p>
                <button
                  onClick={() => {
                    setSelectedObjetivo('todos');
                    setSelectedNivel('todos');
                    setSearchQuery('');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Limpiar filtros y ver todos
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-3xl p-12 text-center backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              ¿Ningún programa se ajusta a ti?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Crea un plan 100% personalizado basado en tu edad, peso, objetivo y disponibilidad con nuestra IA.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:shadow-white/20 hover:scale-105"
            >
              Crear Mi Plan Personalizado <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-4 text-sm text-slate-400">Sin tarjeta de crédito • 100% gratis</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================
function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
        {icon}
      </div>
      <div className="text-2xl md:text-3xl font-bold mb-1 text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function FilterGroup({ 
  label, 
  options, 
  selected, 
  onChange 
}: { 
  label: string; 
  options: string[]; 
  selected: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">{label}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
              selected === option
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium shadow-lg shadow-emerald-500/10'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {normalizeText(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgramCard({ program }: { program: ProgramaPlan }) {
  return (
    <Link
      href={`/plan/${program.slug}`}
      className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
              {normalizeText(program.metadata.objetivo)}
            </span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
              {normalizeText(program.metadata.nivel)}
            </span>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
              {program.metadata.duracion_total_semanas} Semanas
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="font-medium">4.8</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors text-white leading-tight">
          {program.meta.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">
          {program.meta.description}
        </p>

        {/* Program Structure */}
        <div className="bg-slate-950/50 rounded-xl p-4 mb-6 border border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Estructura del Programa:</h4>
          <div className="space-y-2">
            {program.semanas.slice(0, 4).map((semana) => (
              <div key={semana.numero} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300">
                  <span className="text-emerald-400 font-medium">Semana {semana.numero}:</span> {semana.titulo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5" />
              {program.stats.totalEjercicios} ejercicios
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {program.metadata.dias_por_semana}d/sem
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}