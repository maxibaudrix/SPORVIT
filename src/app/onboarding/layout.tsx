
// src/app/onboarding/layout.tsx
import React from 'react';

// Este layout envuelve todos los pasos del onboarding para centrar el contenido.
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-none">
        {children}
      </div>
    </div>
  );
}
        