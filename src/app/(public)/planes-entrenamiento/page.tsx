// app/planes-entrenamiento/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Calendar, TrendingUp, Users,
  Star, ArrowRight, Sparkles, ChevronDown 
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface TrainingPlan {
  id: string;
  slug: string;
  metadata: {
    objetivo: string;
    nivel: string;
    duracion_semanas: number;
    dias_por_semana: number;
    equipo: string[];
    tags: string[];
  };
  meta: {
    title: string;
    description: string;
  };
}

// ============================================
// MOCK DATA (reemplazar con fetch real)
// ============================================
const MOCK_PLANS: TrainingPlan[] = [
  {
    id: "tpl_88ab2c77_wk1",
    slug: "plan-resistencia-principiante-semana-1",
    metadata: {
      objetivo: "resistencia",
      nivel: "principiante",
      duracion_semanas: 4,
      dias_por_semana: 5,
      equipo: ["peso corporal"],
      tags: ["cardio", "resistencia"]
    },
    meta: {
      title: "Plan de Resistencia para Principiantes - 4 Semanas",
      description: "Plan completo de 4 semanas para mejorar tu resistencia cardiovascular desde cero."
    }
  },
  // ... más planes (cargar dinámicamente)
];

// ============================================
// PAGE COMPONENT
// ============================================
export default function PlanesEntrenamientoHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObjetivo, setSelectedObjetivo] = useState<string>('todos');
  const [selectedNivel, setSelectedNivel] = useState<string>('todos');
  const [selectedDuracion, setSelectedDuracion] = useState<string>('todos');

  // Filtros disponibles
  const objetivos = ['todos', 'resistencia', 'fuerza', 'perdida-peso', 'hipertrofia', 'definicion'];
  const niveles = ['todos', 'principiante', 'intermedio', 'avanzado'];
  const duraciones = ['todos', '4-semanas', '8-semanas', '12-semanas'];

  // Filtrado de planes
  const filteredPlans = useMemo(() => {
    return MOCK_PLANS.filter(plan => {
      const matchesSearch = plan.meta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           plan.meta.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesObjetivo = selectedObjetivo === 'todos' || plan.metadata.objetivo === selectedObjetivo;
      const matchesNivel = selectedNivel === 'todos' || plan.metadata.nivel === selectedNivel;
      
      let matchesDuracion = true;
      if (selectedDuracion !== 'todos') {
        const weeks = parseInt(selectedDuracion.split('-')[0]);
        matchesDuracion = plan.metadata.duracion_semanas === weeks;
      }

      return matchesSearch && matchesObjetivo && matchesNivel && matchesDuracion;
    });
  }, [searchQuery, selectedObjetivo, selectedNivel, selectedDuracion]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            1,800+ Planes de Entrenamiento Gratuitos
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Encuentra tu Plan de
            <br />Entrenamiento Perfecto
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
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
              className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-900/50 border-b border-slate-800 py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatBadge icon={<TrendingUp className="w-5 h-5" />} value="1,800+" label="Planes" />
            <StatBadge icon={<Users className="w-5 h-5" />} value="50K+" label="Usuarios" />
            <StatBadge icon={<Star className="w-5 h-5" />} value="4.8/5" label="Rating" />
            <StatBadge icon={<Calendar className="w-5 h-5" />} value="100%" label="Gratis" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 sticky top-24 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold">Filtros</h2>
              </div>

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
                label="Duración"
                options={duraciones}
                selected={selectedDuracion}
                onChange={setSelectedDuracion}
              />

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedObjetivo('todos');
                  setSelectedNivel('todos');
                  setSelectedDuracion('todos');
                  setSearchQuery('');
                }}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </aside>

          {/* Plans Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {filteredPlans.length} planes encontrados
              </h2>
              {/* Sort Dropdown - TODO */}
            </div>

            {filteredPlans.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-400 mb-4">No se encontraron planes con esos filtros.</p>
                <button
                  onClick={() => {
                    setSelectedObjetivo('todos');
                    setSelectedNivel('todos');
                    setSelectedDuracion('todos');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Limpiar filtros
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
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Ningún plan se ajusta a ti?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Crea un plan 100% personalizado basado en tu edad, peso, objetivo y disponibilidad.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:shadow-white/20 hover:scale-105"
          >
            Crear Mi Plan Personalizado <ArrowRight className="w-5 h-5" />
          </Link>
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
      <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
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
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selected === option
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <span className="capitalize">{option.replace('-', ' ')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: TrainingPlan }) {
  return (
    <Link
      href={`/plan/${plan.slug}`}
      className="group bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full capitalize">
            {plan.metadata.objetivo}
          </span>
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-full capitalize">
            {plan.metadata.nivel}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-amber-400">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>4.8</span>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
        {plan.meta.title}
      </h3>

      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {plan.meta.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{plan.metadata.duracion_semanas} semanas</span>
          <span>•</span>
          <span>{plan.metadata.dias_por_semana} días/sem</span>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
