import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Github, Twitter, Linkedin, Instagram, Mail, Heart } from 'lucide-react';

export const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="md:col-span-4">
            <Logo variant="full" className="mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Tu entrenador personal y nutricionista impulsado por IA. 
              Planes personalizados que se adaptan a tu vida.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com/sporvit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/sporvit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/company/sporvit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/sporvit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4">Producto</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/features" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Calculadoras
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4">Recursos</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/blog" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Guías
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4">Compañía</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Carreras
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Prensa
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/legal/privacy" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span>© {currentYear} Sporvit. Todos los derechos reservados.</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span>Hecho con</span>
              <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500" />
              <span>en España</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};