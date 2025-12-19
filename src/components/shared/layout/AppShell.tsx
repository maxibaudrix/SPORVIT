// src/components/shared/layout/AppShell.tsx
import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
}

/**
 * Componente de layout principal que envuelve el contenido del dashboard.
 * Incluiría Navbars, Sidebars y AuthProviders en una app completa.
 */
const AppShell: React.FC<AppShellProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-4">
            {/* Aquí irían la navegación y el menú de usuario */}
            <span className="text-sm text-gray-500">Menú de Usuario</span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AppShell;