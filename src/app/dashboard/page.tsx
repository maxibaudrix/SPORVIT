'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePlanGenerationStatus } from '@/hooks/usePlanGenerationStatus';
import { Loader2, CheckCircle2, X } from 'lucide-react';
import { getProgramBySlug, type ProgramaPlan } from '@/lib/data/trainingPlans';

import WeeklyCalendar from '@/components/ui/layout/dashboard/calendar/WeeklyCalendar';
import { PlanGenerationToast } from '@/components/dashboard/PlanGenerationToast';
import { WeekStatusDrawer } from '@/components/dashboard/WeekStatusDrawer';

export default function DashboardPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  

  // Estados para carga de plan desde URL
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadedProgram, setLoadedProgram] = useState<ProgramaPlan | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Hook de status de generación (Polling)
  const {
    status: planStatus,
    loading: statusLoading,
    error: statusError
  } = usePlanGenerationStatus();

  // 4. Efecto para cargar plan desde URL (?loadPlan=slug)
  useEffect(() => {
    const planSlug = searchParams.get('loadPlan');
    
    if (planSlug && !loadingPlan && !loadedProgram && session?.user?.id) {
      setLoadingPlan(true);
      
      const loadPlan = async () => {
        try {
          const program = getProgramBySlug(planSlug);
          
          if (program) {
            setLoadedProgram(program);
            
            const response = await fetch('/api/user/load-plan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                userId: session.user.id,
                programSlug: planSlug,
                programData: program 
              }),
            });

            if (!response.ok) {
              throw new Error('Error guardando plan');
            }

            const result = await response.json();
            console.log('✅ Plan guardado en DB:', result);
            
            router.replace('/dashboard', { scroll: false });
          } else {
            console.error('❌ Programa no encontrado:', planSlug);
            router.replace('/dashboard', { scroll: false });
          }
        } catch (error) {
          console.error('❌ Error cargando programa:', error);
          router.replace('/dashboard', { scroll: false });
        } finally {
          setLoadingPlan(false);
        }
      };

      loadPlan();
    }
  }, [searchParams, router, loadingPlan, loadedProgram, session?.user?.id]);

  // 5. Mostrar mensaje de éxito cuando se carga un plan
  useEffect(() => {
    if (loadedProgram && !loadingPlan) {
      setShowSuccessMessage(true);
      
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [loadedProgram, loadingPlan]);


  // --- RENDERIZADO CONDICIONAL ---

  if (statusLoading || !session?.user?.id || loadingPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-400">
            {loadingPlan ? 'Cargando tu programa de entrenamiento...' : 'Cargando tu perfil...'}
          </p>
        </div>
      </div>
    );
  }

  if (statusError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-xl p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-slate-300 mb-4">{statusError}</p>
          <a href="/onboarding/step-6-macros" className="inline-block px-6 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
            Volver a intentar
          </a>
        </div>
      </div>
    );
  }

  if (!planStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">No hay plan activo</h2>
          <p className="text-slate-400 mb-6">Completa el onboarding para crear tu plan personalizado</p>
          <a href="/onboarding/step-1-biometrics" className="inline-block px-6 py-3 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
            Crear mi plan
          </a>
        </div>
      </div>
    );
  }

  // --- CONTENIDO PRINCIPAL ---
  return (
    <div className="h-full flex flex-col bg-slate-950 min-h-screen relative">
      
      {/* Success Toast - Esquina superior derecha */}
      {showSuccessMessage && loadedProgram && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-gradient-to-br from-emerald-900/95 to-teal-900/95 backdrop-blur-xl border border-emerald-500/50 rounded-xl p-4 shadow-2xl shadow-emerald-500/20 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-white">¡Programa cargado!</h4>
                  <button
                    onClick={() => setShowSuccessMessage(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {loadedProgram.meta.title} está listo en tu calendario.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-emerald-400">
                  <span>📅 {loadedProgram.metadata.duracion_total_semanas} semanas</span>
                  <span>•</span>
                  <span>💪 {loadedProgram.stats.totalEjercicios} ejercicios</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Generation Toast - Esquina inferior derecha */}
      {planStatus && !planStatus.isComplete && (
        <PlanGenerationToast
          generatedWeeks={planStatus.generatedWeeks}
          totalWeeks={planStatus.totalWeeks}
        />
      )}

      {/* Week Status Drawer - Esquina inferior izquierda */}
      {planStatus && (
        <WeekStatusDrawer
          weeks={planStatus.weeks}
          generatedWeeks={planStatus.generatedWeeks}
        />
      )}

      {/* Calendario principal - FULL WIDTH */}
      <div className="flex-1 overflow-y-auto">
        <WeeklyCalendar userId={session.user.id} />
      </div>
    </div>
  );
}