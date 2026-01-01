// src/components/ui/layout/dashboard/VerticalTabs.tsx
'use client';

import { Calendar, Timer, Calculator, TrendingUp } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import type { SidebarTab } from '@/store/sidebarStore';

interface TabConfig {
  id: SidebarTab;
  icon: React.ReactNode;
  label: string;
}

const TABS: TabConfig[] = [
  {
    id: 'calendar',
    icon: <Calendar className="w-5 h-5" />,
    label: 'Vista Mensual',
  },
  {
    id: 'timer',
    icon: <Timer className="w-5 h-5" />,
    label: 'Timer',
  },
  {
    id: 'calculators',
    icon: <Calculator className="w-5 h-5" />,
    label: 'Calculadoras',
  },
  {
    id: 'progress',
    icon: <TrendingUp className="w-5 h-5" />,
    label: 'Progreso Semanas',
  },
];

export default function VerticalTabs() {
  const { activeTab, toggleTab } = useSidebarStore();

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-64px)] w-12 bg-slate-900 border-r border-slate-800 flex flex-col z-30">
      {/* Tabs */}
      <div className="flex-1 flex flex-col py-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => toggleTab(tab.id)}
              className={`
                relative group h-12 flex items-center justify-center
                transition-colors
                ${isActive 
                  ? 'text-emerald-400 bg-slate-800' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }
              `}
              title={tab.label}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-400" />
              )}
              
              {/* Icon */}
              {tab.icon}
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-700">
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Close button cuando hay tab activo */}
      {activeTab && (
        <button
          onClick={() => toggleTab(activeTab)}
          className="h-12 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors border-t border-slate-800"
          title="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}