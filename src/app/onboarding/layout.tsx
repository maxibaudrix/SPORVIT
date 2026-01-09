'use client';

// src/app/onboarding/layout.tsx
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Este layout envuelve todos los pasos del onboarding para centrar el contenido.
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [hasPlan, setHasPlan] = useState(false);

  useEffect(() => {
    const checkExistingPlan = async () => {
      try {
        // Solo verificar si no estamos en la página welcome o complete
        if (pathname === '/onboarding/welcome' || pathname === '/onboarding/complete') {
          setIsChecking(false);
          return;
        }

        const response = await fetch('/api/planning/check');

        if (response.ok) {
          const data = await response.json();

          if (data.hasPlan) {
            console.log('[Onboarding Layout] Usuario ya tiene un plan, redirigiendo al dashboard...');
            setHasPlan(true);
            router.push('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('[Onboarding Layout] Error checking plan:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkExistingPlan();
  }, [pathname, router]);

  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm">Verificando...</p>
        </div>
      </div>
    );
  }

  // No renderizar nada si tiene plan (evita flash de contenido)
  if (hasPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-none">
        {children}
      </div>
    </div>
  );
}
