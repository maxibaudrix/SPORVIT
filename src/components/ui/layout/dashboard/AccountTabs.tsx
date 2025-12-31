// src/components/ui/layout/dashboard/AccountTabs.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Settings, Crown, ChevronLeft } from 'lucide-react';

export function AccountTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Mi Perfil', href: '/dashboard/profile', icon: User },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
    { name: 'Suscripción', href: '/dashboard/subscription', icon: Crown },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Botón de Salida al Dashboard Principal */}
      <Link 
        href="/dashboard" 
        className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-400 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Volver al Panel Principal
      </Link>

      {/* Tabs de Navegación */}
      <div className="flex overflow-x-auto border-b border-slate-800 scrollbar-hide">
        {tabs.map((tab) => {
          // Usamos startsWith para que la pestaña "Settings" se quede activa 
          // incluso si estamos en /dashboard/settings/goals
          const isActive = pathname.startsWith(tab.href);
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                isActive ? 'text-emerald-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
              {tab.name}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}