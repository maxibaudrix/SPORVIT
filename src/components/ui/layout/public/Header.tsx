"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Dumbbell } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (window.scrollY > lastScrollY) {
        setScrollDirection('down'); // Bajando
      } else {
        setScrollDirection('up'); // Subiendo
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Cómo funciona', href: '/comofunciona' },
    { name: 'Precios', href: '/pricing' },
    { name: 'Calculadoras', href: '/calculators' },
  ];

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <header
      className={`
        fixed top-0 w-full z-50 transition-all duration-300
        ${scrolled ? 'bg-slate-950/95 backdrop-blur-lg shadow-lg shadow-emerald-500/10' : 'bg-transparent'}
        ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Logo variant="full" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Login
            </Link>

            {/* CTA */}
            <Link
              href="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105 inline-flex items-center justify-center text-white"
            >
              Empezar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-emerald-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 text-slate-300 hover:text-emerald-400"
                onClick={handleLinkClick}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              className="block py-2 text-slate-300 hover:text-emerald-400"
              onClick={handleLinkClick}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full text-center block px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold text-white mt-4"
              onClick={handleLinkClick}
            >
              Empezar Gratis
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
