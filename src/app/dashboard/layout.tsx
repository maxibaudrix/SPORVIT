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
        {/* Header - Height: 64px (h-16) */}
        <HeaderBar />

        {/* Top Metrics Bar - Height: ~48px (más compacta) */}
        {!isAccountSection && (
          <div className="hidden lg:block sticky top-16 z-40">
            <TopMetricsBar />
          </div>
        )}

        <div className="flex flex-1">
          {/* Sidebar - Width: 200px (reducida de 256px) */}
          <aside className="hidden lg:block w-[200px] border-r border-slate-800/50 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
            <Sidebar />
          </aside>

          {/* Main Content - SIN max-width para maximizar calendario */}
          <main className="flex-1 min-h-[calc(100vh-64px)] w-full">
            {children}
          </main>
        </div>
        
        <AppFooter />
      </div>
    </AuthSessionProvider>
  );
}