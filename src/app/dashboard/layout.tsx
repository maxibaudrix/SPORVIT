'use client';

import { usePathname } from 'next/navigation';
import AuthSessionProvider from '@/components/providers/SessionProvider';
import { HeaderBar } from '@/components/ui/layout/dashboard/HeaderBar';
import { AppFooter } from '@/components/ui/layout/dashboard/AppFooter';
import TopMetricsBar from '@/components/ui/layout/dashboard/TopMetricsBar';
import Sidebar from '@/components/ui/layout/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAccountSection = pathname.startsWith('/dashboard/profile') || 
                           pathname.startsWith('/dashboard/settings') || 
                           pathname.startsWith('/dashboard/subscription');

  return (
    <AuthSessionProvider>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        <HeaderBar />

        {!isAccountSection && (
          <div className="hidden lg:block sticky top-16 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <TopMetricsBar />
          </div>
        )}

        <div className="flex flex-1">
          <aside className="hidden lg:block w-64 border-r border-slate-800 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
            <Sidebar />
          </aside>

          {/* QUITAMOS EL "max-w-5xl mx-auto" DE AQUÍ */}
          <main className="flex-1 min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </div>
        <AppFooter />
      </div>
    </AuthSessionProvider>
  );
}