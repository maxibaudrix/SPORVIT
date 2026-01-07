'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Search, Bell, ChevronDown, User, Settings, CreditCard, 
  LogOut, Crown
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import NotificationBell from '@/components/dashboard/NotificationBell';

// ============================================
// SEARCH BAR COMPONENT
// ============================================
const SearchBar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Buscar en tiempo real
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/dashboard/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative flex-1 max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar recetas, ejercicios..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchOpen(true)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-20 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Search Results Dropdown */}
      {searchOpen && query.length >= 2 && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setSearchOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-40">
            {isSearching ? (
              <div className="px-4 py-8 text-center text-slate-400 text-sm">
                <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                <p className="mt-2">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2 max-h-96 overflow-y-auto">
                {results.map((result: any, i: number) => (
                  <Link
                    key={i}
                    href={result.url}
                    onClick={() => { setSearchOpen(false); setQuery(''); }}
                    className="w-full px-4 py-3 hover:bg-slate-800 transition-colors flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      result.type === 'recipe' ? 'bg-emerald-500/10 text-emerald-400' :
                      result.type === 'workout' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {result.type === 'recipe' ? '🍽️' : result.type === 'workout' ? '💪' : '📖'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{result.title}</p>
                      <p className="text-xs text-slate-400">{result.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-slate-500 text-sm">
                No se encontraron resultados para "{query}"
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// NOTIFICATIONS BELL (DEPRECATED - Now using NotificationBell component)
// ============================================
// const NotificationsBell = () => { ... }
// Reemplazado por el componente NotificationBell importado desde @/components/dashboard/NotificationBell

// ============================================
// USER MENU DROPDOWN
// ============================================
const UserMenu = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  if (!session?.user) return null;

  const user = {
    name: session.user.name || 'Usuario',
    email: session.user.email || '',
    avatar: session.user.image || null,
    plan: (session.user as any).plan || 'free'
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const MenuItem = ({ 
    icon: Icon, 
    label, 
    href, 
    onClick, 
    badge, 
    danger = false
  }: {
    icon: any;
    label: string;
    href?: string;
    onClick?: () => void;
    badge?: string;
    danger?: boolean;
  }) => {
    if (href) {
      return (
        <Link
          href={href}
          onClick={() => setOpen(false)}
          className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
            danger 
              ? 'hover:bg-red-500/10 text-red-400' 
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded">
              {badge}
            </span>
          )}
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
          danger 
            ? 'hover:bg-red-500/10 text-red-400' 
            : 'hover:bg-slate-800 text-slate-300 hover:text-white'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-sm font-bold text-white overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white truncate max-w-[120px]">{user.name}</p>
          <p className="text-xs text-slate-400">{user.plan === 'premium' ? 'Premium' : 'Plan Free'}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-40">
            
            {/* Header con info usuario */}
            <div className="p-4 border-b border-slate-800 bg-gradient-to-br from-slate-800/50 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-lg font-bold text-white overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <MenuItem 
                icon={User}
                label="Mi Perfil"
                href="/dashboard/profile"
              />

              <MenuItem 
                icon={Settings}
                label="Configuración"
                href="/dashboard/settings"
              />

              <MenuItem 
                icon={user.plan === 'premium' ? Crown : CreditCard}
                label="Suscripción"
                href="/dashboard/subscription"
                badge={user.plan === 'premium' ? 'Premium' : undefined}
              />

              <div className="my-2 border-t border-slate-800" />

              <MenuItem 
                icon={LogOut}
                label="Cerrar Sesión"
                onClick={handleSignOut}
                danger
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// MAIN HEADER COMPONENT
// ============================================
export function HeaderBar() {
  return (
    <header className="sticky top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

        {/* Logo - Left */}
        <Link href="/dashboard" className="flex-shrink-0">
          <Logo variant="symbol" size="sm" />
        </Link>

        {/* Search Bar - Center (hidden on mobile) */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search Icon (mobile only) */}
          <button className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-slate-400" />
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
}