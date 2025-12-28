// src/hooks/usePlanLoader.ts
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProgramBySlug, type ProgramaPlan } from '@/lib/data/trainingPlans';

export function usePlanLoader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadedProgram, setLoadedProgram] = useState<ProgramaPlan | null>(null);

  useEffect(() => {
    const planSlug = searchParams.get('loadPlan');
    
    if (planSlug) {
      setLoadingPlan(true);
      
      try {
        // Obtener el programa por slug
        const program = getProgramBySlug(planSlug);
        
        if (program) {
          setLoadedProgram(program);
          
          // TODO: Aquí puedes guardar el plan en el estado del usuario
          // Por ahora solo lo cargamos en memoria
          console.log('Programa cargado:', program);
          
          // Limpiar el query param después de cargar
          router.replace('/dashboard', { scroll: false });
        } else {
          console.error('Programa no encontrado:', planSlug);
          router.replace('/dashboard', { scroll: false });
        }
      } catch (error) {
        console.error('Error cargando programa:', error);
        router.replace('/dashboard', { scroll: false });
      } finally {
        setLoadingPlan(false);
      }
    }
  }, [searchParams, router]);

  return {
    loadingPlan,
    loadedProgram
  };
}