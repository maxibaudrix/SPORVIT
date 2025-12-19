// app/dashboard/layout.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import HeaderBar from '@/components/ui/layout/dashboard/HeaderBar';
import { AppFooter } from '@/components/ui/layout/dashboard/AppFooter';
import TopMetricsBar from '@/components/ui/layout/dashboard/TopMetricsBar';
import Sidebar from '@/components/ui/layout/dashboard/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header Bar */}
      <HeaderBar />

      {/* Top Metrics Bar - Desktop only */}
      <div className="hidden lg:block sticky top-16 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <TopMetricsBar />
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex">
        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:block w-64 border-r border-slate-800 min-h-[calc(100vh-64px)] sticky top-16">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
      <AppFooter /> {/* Versión pequeña */}
    </div>
  );
}
