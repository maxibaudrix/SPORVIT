// src/app/(public)/planes-entrenamiento/[objetivo]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, TrendingUp, Star, ArrowRight,
  Target, Dumbbell
} from 'lucide-react';
import { 
  getAllObjetivos, 
  getPlansByObjetivo,
  type TrainingPlan 
} from '@/lib/data/trainingPlans';

// ============================================
// TIPOS
// ============================================
interface PageProps {
  params: {
    objetivo: string;
  };
}

// ============================================
// METADATA DINÁMICO (SEO)
// ============================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { objetivo } = params;
  const plans = getPlansByObjetivo(objetivo);

  if (plans.length === 0) {
    return {
      title: 'Objetivo no encontrado | Sporvit',
      description: 'Este tipo de plan no existe.'
    };
  }

  const titleMap: Record<string, string> = {
    'resistencia': 'Planes de Entrenamiento de Resistencia',
    'fuerza': 'Planes de Entrenamiento de Fuerza',
    'hipertrofia': 'Planes de Hipertrofia Muscular',
    'perdida-peso': 'Planes para Pérdida de Peso',
    'definicion': 'Planes de Definición Muscular',
    'rendimiento': 'Planes de Alto Rendimiento'
  };

  const descriptionMap: Record<string, string> = {
    'resistencia': `Descubre ${plans.length} planes de entrenamiento de resistencia cardiovascular. Mejora tu capacidad aeróbica con rutinas estructuradas para todos los niveles.`,
    'fuerza': `${plans.length} planes de fuerza diseñados para aumentar tu potencia muscular. Desde principiante hasta avanzado.`,
    'hipertrofia': `${plans.length} rutinas de hipertrofia para maximizar tu crecimiento muscular. Programas científicos basados en volumen e intensidad.`,
    'perdida-peso': `${plans.length} planes efectivos para perder peso de forma saludable. Combina cardio y fuerza para resultados óptimos.`,
    'definicion': `${plans.length} programas de definición muscular. Reduce grasa corporal manteniendo tu masa muscular.`,
    'rendimiento': `${plans.length} planes de alto rendimiento deportivo. Mejora tu desempeño atlético con periodización profesional.`
  };

  const title = titleMap[objetivo] || `Planes de ${objetivo}`;
  const description = descriptionMap[objetivo] || `${plans.length} planes de entrenamiento de ${objetivo}.`;

  return {
    title: `${title} | Sporvit`,
    description,
    keywords: `planes ${objetivo}, entrenamiento ${objetivo}, rutina ${objetivo}, programa ${objetivo}`,
    openGraph: {
      title: `${title} | Sporvit`,
      description,
      type: 'website',
      url: `https://sporvit.com/planes-entrenamiento/${objetivo}`
    }
  };
}

// ============================================
// STATIC GENERATION
// ============================================
export async function generateStaticParams() {
  const objetivos = getAllObjetivos();
  return objetivos.map((objetivo) => ({
    objetivo
  }));
}

// ============================================
// PAGE COMPONENT
// ============================================
export default function ObjetivoPage({ params }: PageProps) {
  const { objetivo } = params;
  const plans = getPlansByObjetivo(objetivo);

  if (plans.length === 0) {
    notFound();
  }

  // Agrupar por nivel
  const plansPorNivel = {
    principiante: plans.filter(p => p.metadata.nivel === 'principiante'),
    intermedio: plans.filter(p => p.metadata.nivel === 'intermedio'),
    avanzado: plans.filter(p => p.metadata.nivel === 'avanzado')
  };

  const contentMap: Record<string, { title: string; intro: string; benefits: string[] }> = {
    'resistencia': {
      title: 'Planes de Entrenamiento de Resistencia',
      intro: 'Mejora tu capacidad cardiovascular y resistencia aeróbica con nuestros planes estructurados. Diseñados para aumentar progresivamente tu capacidad de mantener esfuerzos prolongados.',
      benefits: [
        'Mejora tu sistema cardiovascular',
        'Aumenta tu capacidad pulmonar',
        'Reduce la fatiga en actividades diarias',
        'Prepárate para carreras y competiciones'
      ]
    },
    'fuerza': {
      title: 'Planes de Entrenamiento de Fuerza',
      intro: 'Desarrolla fuerza máxima y potencia con rutinas basadas en movimientos compuestos y sobrecarga progresiva. Ideal para todos los niveles.',
      benefits: [
        'Aumenta tu fuerza máxima',
        'Mejora la densidad ósea',
        'Acelera tu metabolismo',
        'Previene lesiones y mejora postura'
      ]
    },
    'hipertrofia': {
      title: 'Planes de Hipertrofia Muscular',
      intro: 'Maximiza tu crecimiento muscular con programas de alto volumen e intensidad moderada. Periodización científica para resultados óptimos.',
      benefits: [
        'Aumenta masa muscular magra',
        'Define y esculpe tu físico',
        'Mejora simetría muscular',
        'Aumenta tu metabolismo basal'
      ]
    },
    'perdida-peso': {
      title: 'Planes para Pérdida de Peso',
      intro: 'Pierde grasa de forma saludable con la combinación perfecta de cardio y fuerza. Programas sostenibles a largo plazo.',
      benefits: [
        'Quema grasa manteniendo músculo',
        'Mejora tu composición corporal',
        'Aumenta tu energía diaria',
        'Resultados sostenibles'
      ]
    }
  };

  const content = contentMap[objetivo] || {
    title: `Planes de ${objetivo}`,
    intro: `Descubre nuestros planes de entrenamiento especializados en ${objetivo}.`,
    benefits: ['Mejora tu rendimiento', 'Alcanza tus objetivos', 'Progresión estructurada']
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Breadcrumbs */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/planes-entrenamiento" className="hover:text-emerald-400 transition-colors">
              Planes
            </Link>
            <span>/</span>
            <span className="text-slate-300 capitalize">{objetivo.replace('-', ' ')}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16">
        <Link 
          href="/planes-entrenamiento"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a todos los planes
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-emerald-400" />
              <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium rounded-full capitalize">
                {objetivo.replace('-', ' ')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {content.title}
            </h1>

            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              {content.intro}
            </p>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-emerald-400" />
                Beneficios principales
              </h2>
              <ul className="space-y-3">
                {content.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h3 className="font-bold mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <StatItem label="Total de planes" value={plans.length} />
                <StatItem label="Principiante" value={plansPorNivel.principiante.length} />
                <StatItem label="Intermedio" value={plansPorNivel.intermedio.length} />
                <StatItem label="Avanzado" value={plansPorNivel.avanzado.length} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-6">
              <h3 className="font-bold mb-3">¿Plan personalizado?</h3>
              <p className="text-sm text-slate-300 mb-4">
                Crea un plan adaptado a tu nivel y disponibilidad
              </p>
              <Link
                href="/onboarding"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-sm transition-colors"
              >
                Crear Ahora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Plans by Level */}
      {Object.entries(plansPorNivel).map(([nivel, levelPlans]) => 
        levelPlans.length > 0 && (
          <section key={nivel} className="container mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold mb-6 capitalize">
              Nivel {nivel} ({levelPlans.length} planes)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levelPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================
function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="font-bold text-emerald-400">{value}</span>
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
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-full capitalize">
          {plan.metadata.nivel}
        </span>
        <div className="flex items-center gap-1 text-xs text-amber-400">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>4.8</span>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
        {plan.meta.title}
      </h3>

      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {plan.meta.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {plan.metadata.duracion_semanas}sem
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {plan.metadata.dias_por_semana}d/sem
          </span>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}