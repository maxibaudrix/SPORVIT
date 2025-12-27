// src/app/(public)/planes-entrenamiento/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Calendar, TrendingUp, Users,
  Star, ArrowRight, Sparkles, Loader2, Target
} from 'lucide-react';
import { 
  filterPlans, 
  getAllObjetivos, 
  getAllNiveles, 
  getAllDuraciones,
  getCatalogStats,
  type TrainingPlan 
} from '@/lib/data/trainingPlans';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Normaliza textos de filtros para mejor visualización
 */
function normalizeText(text: string): string {
  const map: Record<string, string> = {
    'salud_general': 'Salud General',
    'ganancia_muscular': 'Ganancia Muscular',
    'perdida_peso': 'Pérdida de Peso',
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
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObjetivo, setSelectedObjetivo] = useState<string>('todos');
  const [selectedNivel, setSelectedNivel] = useState<string>('todos');
  const [selectedDuracion, setSelectedDuracion] = useState<string>('todos');

  // Cargar datos al montar
  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const allPlans = filterPlans({});
        setPlans(allPlans);
      } catch (error) {
        console.error('Error loading plans:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  // Obtener opciones de filtros
  const objetivos = ['todos', ...getAllObjetivos()];
  const niveles = ['todos', ...getAllNiveles()];
  const duraciones = ['todos', ...getAllDuraciones().map(d => `${d}`)];

  // Filtrado de planes
  const filteredPlans = useMemo(() => {
    return filterPlans({
      query: searchQuery,
      objetivo: selectedObjetivo !== 'todos' ? selectedObjetivo : undefined,
      nivel: selectedNivel !== 'todos' ? selectedNivel : undefined,
      duracion: selectedDuracion !== 'todos' ? parseInt(selectedDuracion) : undefined
    });
  }, [searchQuery, selectedObjetivo, selectedNivel, selectedDuracion]);

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
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            {stats.totalPlanes}+ Planes de Entrenamiento Gratuitos
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-tight">
            Encuentra tu Plan de
            <br />Entrenamiento Perfecto
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Planes profesionales diseñados por expertos. Filtrados por objetivo, nivel y duración. 
            100% gratis.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o palabra clave..."
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
            <StatBadge icon={<TrendingUp className="w-5 h-5" />} value={`${stats.totalPlanes}+`} label="Planes" />
            <StatBadge icon={<Target className="w-5 h-5" />} value={`${stats.totalEjerciciosUnicos}+`} label="Ejercicios" />
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
              {/* Header (Fijo) */}
              <div className="flex items-center gap-2 p-6 pb-4 border-b border-slate-700/50">
                <Filter className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-white">Filtros</h2>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6 custom-scrollbar">
                {/* Objetivo */}
                <FilterGroup
                  label="Objetivo"
                  options={objetivos}
                  selected={selectedObjetivo}
                  onChange={setSelectedObjetivo}
                />

                {/* Nivel */}
                <FilterGroup
                  label="Nivel"
                  options={niveles}
                  selected={selectedNivel}
                  onChange={setSelectedNivel}
                />

                {/* Duración */}
                <FilterGroup
                  label="Duración (semanas)"
                  options={duraciones}
                  selected={selectedDuracion}
                  onChange={setSelectedDuracion}
                />
              </div>

              {/* Footer (Fijo) */}
              <div className="p-6 pt-4 border-t border-slate-700/50 bg-slate-900/50">
                <button
                  onClick={() => {
                    setSelectedObjetivo('todos');
                    setSelectedNivel('todos');
                    setSelectedDuracion('todos');
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-all hover:shadow-lg border border-slate-700"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Plans Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {filteredPlans.length} planes encontrados
              </h2>
            </div>

            {filteredPlans.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-800">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 mb-4 text-lg">No se encontraron planes con esos filtros.</p>
                <button
                  onClick={() => {
                    setSelectedObjetivo('todos');
                    setSelectedNivel('todos');
                    setSelectedDuracion('todos');
                    setSearchQuery('');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Limpiar filtros y ver todos
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
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
              ¿Ningún plan se ajusta a ti?
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

function PlanCard({ plan }: { plan: TrainingPlan }) {
  // Mejorar el título del plan
  const formatTitle = (title: string) => {
    return title
      .replace(/_/g, ' ')
      .replace(/pérdida_grasa/gi, 'Pérdida de Grasa')
      .replace(/ganancia_muscular/gi, 'Ganancia Muscular')
      .replace(/salud_general/gi, 'Salud General')
      .replace(/\s+-\s+Semana\s+\d+/i, '')
      .replace(/\(intermedio\)/gi, '')
      .replace(/\(principiante\)/gi, '')
      .replace(/\(avanzado\)/gi, '')
      .trim();
  };

  // Extraer número de semana si existe
  const weekMatch = plan.meta.title.match(/Semana\s+(\d+)/i);
  const weekNumber = weekMatch ? parseInt(weekMatch[1]) : null;

  return (
    <Link
      href={`/plan/${plan.slug}`}
      className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 rounded-2xl transition-all duration-300"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
              {normalizeText(plan.metadata.objetivo)}
            </span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
              {normalizeText(plan.metadata.nivel)}
            </span>
            {weekNumber && (
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                Semana {weekNumber}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="font-medium">4.8</span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2 text-white leading-tight">
          {formatTitle(plan.meta.title)}
        </h3>

        <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">
          {plan.meta.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {plan.metadata.duracion_semanas} sem
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {plan.metadata.dias_por_semana}d/sem
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

// ============================================
// GLOBAL STYLES (Add to globals.css or use CSS-in-JS)
// ============================================
// Custom scrollbar styles - Add this to your global CSS or create a <style> tag
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgb(15 23 42 / 0.3);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgb(71 85 105 / 0.5);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgb(100 116 139 / 0.7);
  }
  
  /* Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgb(71 85 105 / 0.5) rgb(15 23 42 / 0.3);
  }
`;

// Inject styles (if not using globals.css)
if (typeof document !== 'undefined' && !document.getElementById('custom-scrollbar-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'custom-scrollbar-styles';
  styleSheet.textContent = customScrollbarStyles;
  document.head.appendChild(styleSheet);
}