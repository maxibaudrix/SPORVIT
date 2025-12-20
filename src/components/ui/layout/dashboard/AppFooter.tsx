import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50 py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo y Copyright */}
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xs">
              © {currentYear} Sporvit. Todos los derechos reservados.
            </span>
          </div>

          {/* Links Legales */}
          <div className="flex items-center gap-6 text-xs">
            <Link href="/legal/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">
              Privacidad
            </Link>
            <Link href="/legal/terms" className="text-slate-500 hover:text-slate-300 transition-colors">
              Términos
            </Link>
            <Link href="/contact" className="text-slate-500 hover:text-slate-300 transition-colors">
              Contacto
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};