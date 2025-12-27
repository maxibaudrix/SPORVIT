// app/(public)/plan/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Clock, TrendingUp, Users, Dumbbell, 
  CheckCircle2, ArrowRight, Star, ChevronDown 
} from 'lucide-react';
import { 
  getPlanBySlug, 
  getSimilarPlans,
  getAllPlans,
  type TrainingPlan,
  type Exercise
} from '@/lib/data/trainingPlans';

// ============================================
// STATIC GENERATION
// ============================================
export async function generateStaticParams() {
  const plans = getAllPlans();
  return plans.map((plan) => ({
    slug: plan.slug
  }));
}

// ============================================
// METADATA (SEO)
// ============================================
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const plan = getPlanBySlug(params.slug);
  
  if (!plan) {
    return {
      title: 'Plan no encontrado | Sporvit',
      description: 'Este plan de entrenamiento no existe.'
    };
  }

  return {
    title: plan.meta.title,
    description: plan.meta.description,
    keywords: plan.metadata.tags.join(', '),
    openGraph: {
      title: plan.meta.title,
      description: plan.meta.description,
      type: 'article',
      url: `https://sporvit.com/plan/${plan.slug}`,
      images: [{
        url: `/og-images/plan-${plan.id}.png`,
        width: 1200,
        height: 630,
        alt: plan.meta.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: plan.meta.title,
      description: plan.meta.description
    },
    alternates: {
      canonical: `https://sporvit.com/plan/${plan.slug}`
    }
  };
}

// ============================================
// PAGE COMPONENT
// ============================================
export default function PlanDetailPage({ params }: { params: { slug: string } }) {
  const plan = getPlanBySlug(params.slug);
  
  if (!plan) {
    notFound();
  }

  const similarPlans = getSimilarPlans(plan, 3);

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ExercisePlan",
    "name": plan.meta.title,
    "description": plan.meta.description,
    "activityDuration": `P${plan.metadata.duracion_semanas}W`,
    "exerciseType": plan.metadata.objetivo,
    "intensity": plan.metadata.nivel,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
              <span className="text-slate-300">{plan.metadata.objetivo}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full capitalize">
                    {plan.metadata.objetivo}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium rounded-full capitalize">
                    {plan.metadata.nivel}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {plan.meta.title}
                </h1>

                <p className="text-xl text-slate-400 mb-6">
                  {plan.meta.description}
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
                  value={`${plan.metadata.duracion_semanas} semanas`}
                />
                <StatCard 
                  icon={<Clock className="w-5 h-5" />}
                  label="Días/semana"
                  value={`${plan.metadata.dias_por_semana} días`}
                />
                <StatCard 
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Nivel"
                  value={plan.metadata.nivel}
                />
                <StatCard 
                  icon={<Users className="w-5 h-5" />}
                  label="Usuarios"
                  value="5.2K"
                />
              </div>

              {/* Description */}
              {plan.resumen_semana && (
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Descripción del Plan
                  </h2>
                  <p className="text-slate-400 leading-relaxed">
                    {plan.resumen_semana}
                  </p>
                </div>
              )}

              {/* Weekly Plan */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Plan Semanal</h2>
                <div className="space-y-4">
                  {Object.entries(plan.plan).map(([day, exercises]) => (
                    <DayAccordion 
                      key={day} 
                      day={day} 
                      exercises={exercises as Exercise[]} 
                    />
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-3">¿Listo para empezar?</h3>
                <p className="text-slate-300 mb-6">
                  Accede a este plan completo y miles más con tu cuenta gratuita de Sporvit.
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Equipment Card */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 sticky top-24">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-emerald-400" />
                  Equipo Necesario
                </h3>
                {plan.metadata.equipo.length > 0 ? (
                  <ul className="space-y-2">
                    {plan.metadata.equipo.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="capitalize">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 text-sm">Sin equipo necesario</p>
                )}

                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-slate-400 mb-3">PERFIL RECOMENDADO</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nivel:</span>
                      <span className="capitalize">{plan.metadata.nivel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Objetivo:</span>
                      <span className="capitalize">{plan.metadata.objetivo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Plans */}
              {similarPlans.length > 0 && (
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <h3 className="font-bold mb-4">Planes Similares</h3>
                  <div className="space-y-3">
                    {similarPlans.map((similar) => (
                      <Link 
                        key={similar.slug}
                        href={`/plan/${similar.slug}`}
                        className="block p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">
                          {similar.meta.title}
                        </h4>
                        <p className="text-xs text-slate-400 capitalize">
                          {similar.metadata.duracion_semanas} semanas • {similar.metadata.nivel}
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
    </>
  );
}

// ============================================
// COMPONENTS
// ============================================
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="text-emerald-400 mb-2">{icon}</div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-bold capitalize">{value}</div>
    </div>
  );
}

function DayAccordion({ day, exercises }: { day: string; exercises: Exercise[] }) {
  const dayNames: Record<string, string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  if (exercises.length === 0) {
    return (
      <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{dayNames[day] || day}</h3>
          <span className="text-sm text-slate-500">Descanso</span>
        </div>
      </div>
    );
  }

  return (
    <details className="group bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors">
        <div>
          <h3 className="font-bold">{dayNames[day] || day}</h3>
          <p className="text-sm text-slate-400">{exercises.length} ejercicios</p>
        </div>
        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
      </summary>
      
      <div className="p-4 pt-0 space-y-3">
        {exercises.map((exercise, i) => (
          <div key={i} className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
            <h4 className="font-bold mb-2">{exercise.ejercicio}</h4>
            <div className="grid grid-cols-3 gap-3 text-sm mb-3">
              {exercise.series && (
                <div>
                  <span className="text-slate-500">Series:</span>
                  <span className="ml-2 font-bold text-emerald-400">{exercise.series}</span>
                </div>
              )}
              {exercise.repeticiones && (
                <div>
                  <span className="text-slate-500">Reps:</span>
                  <span className="ml-2 font-bold text-emerald-400">{exercise.repeticiones}</span>
                </div>
              )}
              {exercise.descanso_seg && (
                <div>
                  <span className="text-slate-500">Descanso:</span>
                  <span className="ml-2 font-bold text-emerald-400">{exercise.descanso_seg}s</span>
                </div>
              )}
              {exercise.duracion_min && (
                <div className="col-span-3">
                  <span className="text-slate-500">Duración:</span>
                  <span className="ml-2 font-bold text-emerald-400">{exercise.duracion_min} min</span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {exercise.descripcion}
            </p>
          </div>
        ))}
      </div>
    </details>
  );
}