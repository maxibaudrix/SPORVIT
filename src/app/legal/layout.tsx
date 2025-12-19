// apps/web/src/app/legal/layout

import React from 'react';
import { ChevronLeft, Dumbbell } from 'lucide-react';
import Link from 'next/link'; // Usar Link de Next.js para SPA navigation

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      
      {/* Aquí se renderizará page.tsx de terms, privacy o cookies */}
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
         {children}
      </main>
    </div>
  );
}