// 1. ELIMINAMOS "use client" de aquí para que sea un Server Component
import { redirect } from 'next/navigation';
import { auth } from '@/auth'; // Función de servidor de NextAuth v5
import { HeaderBar } from '@/components/ui/layout/dashboard/HeaderBar';
import VerticalTabs from '@/components/ui/layout/dashboard/VerticalTabs';
import CollapsibleSidebar from '@/components/ui/layout/dashboard/CollapsibleSidebar';
import { Providers } from "@/components/Providers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Protección de ruta en el servidor (más rápido y seguro)
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    // 3. Envolvemos TODO con Providers para que HeaderBar y otros puedan usar useSession()
    <Providers>
      <div className="min-h-screen bg-slate-950">
        {/* Header Bar */}
        <HeaderBar />

        {/* Main Layout with Tabs System */}
        <div className="relative">
          {/* Vertical Tabs - Fixed left (48px) */}
          <VerticalTabs />

          {/* Collapsible Sidebar - Fixed left after tabs (0-320px) */}
          <CollapsibleSidebar />

          {/* Main Content - Adjusts based on sidebar state */}
          <main 
            className="min-h-[calc(100vh-64px)] transition-all duration-300 ease-in-out"
            style={{
              marginLeft: 'calc(3rem)', // 48px for tabs
            }}
          >
            <div className="dashboard-content-wrapper">
              {children}
            </div>
          </main>
        </div>

        {/* 4. El tag <style jsx> requiere que el componente sea Cliente. 
           Si necesitas mantener esta lógica aquí, lo ideal es mover estos estilos 
           a un archivo .css global o usar clases de Tailwind dinámicas.
        */}
        <style dangerouslySetInnerHTML={{ __html: `
          .dashboard-content-wrapper {
            transition: margin-left 300ms ease-in-out;
          }
          body:has([data-sidebar-open="true"]) .dashboard-content-wrapper {
            margin-left: 320px;
          }
        `}} />
      </div>
    </Providers>
  );
}