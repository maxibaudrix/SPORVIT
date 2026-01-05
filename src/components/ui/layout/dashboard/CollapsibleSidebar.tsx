// src/components/ui/layout/dashboard/CollapsibleSidebar.tsx
'use client';

import { useEffect } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import MonthlyCalendarWidget from '@/components/ui/layout/dashboard/MonthlyCalendarWidget';
import TimerWidget from '@/components/ui/layout/dashboard/TimerWidget';
import CalculatorsBrowser from '@/components/ui/layout/dashboard/sidebar/CalculatorsBrowser';
import CalculatorWrapper from '@/components/ui/layout/dashboard/sidebar/CalculatorWrapper';
import TrackingWidget from '@/components/ui/layout/dashboard/TrackingWidget';


export default function CollapsibleSidebar() {
  const { activeTab, isOpen, activeCalculator } = useSidebarStore();

  // Set data attribute on body for CSS targeting
  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute('data-sidebar-open', 'true');
    } else {
      document.body.removeAttribute('data-sidebar-open');
    }
  }, [isOpen]);

  return (
    <aside
      className={`
        fixed left-12 top-16 h-[calc(100vh-64px)]
        bg-slate-900/95 backdrop-blur-sm border-r border-slate-800 z-20
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}
        overflow-hidden
      `}
    >
      {/* Content container - siempre 320px (80 = 20rem) */}
      <div className="w-80 h-full overflow-y-auto overflow-x-hidden">
        {/* Si hay calculadora activa, mostrar wrapper */}
        {activeTab === 'calculators' && activeCalculator ? (
          <CalculatorWrapper />
        ) : (
          <>
            {activeTab === 'calendar' && <MonthlyCalendarWidget />}
            {activeTab === 'timer' && <TimerWidget />}
            {activeTab === 'calculators' && <CalculatorsBrowser />}
            {activeTab === 'tracking' && <TrackingWidget />}
          </>
        )}
      </div>
    </aside>
  );
}