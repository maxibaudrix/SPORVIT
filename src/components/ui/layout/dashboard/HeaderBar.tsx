'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Search, Bell, ChevronDown, User, Settings, CreditCard, 
  LogOut, Download, Trash2, Target, Crown, Dumbbell
} from 'lucide-react';
import {Logo} from '@/components/ui/Logo';

// ============================================
// SEARCH BAR COMPONENT
// ============================================
const SearchBar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
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
                {results.map((result, i) => (
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
// NOTIFICATIONS BELL
// ============================================
const NotificationsBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && notifications.length === 0) {
      loadNotifications();
    }
  }, [open]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-40">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-bold text-white">Notificaciones</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                  <p className="mt-2 text-sm text-slate-400">Cargando...</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`w-full px-4 py-3 hover:bg-slate-800 transition-colors text-left border-b border-slate-800/50 ${
                      !notif.read ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.read && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{notif.timeAgo}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No tienes notificaciones
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-800">
                <Link
                  href="/dashboard/notifications"
                  className="block w-full text-sm text-emerald-400 hover:text-emerald-300 font-medium text-center"
                  onClick={() => setOpen(false)}
                >
                  Ver todas las notificaciones
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// USER MENU DROPDOWN
// ============================================
const UserMenu = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState(null);
  
  if (!session?.user) return null;

  const user = {
    name: session.user.name || 'Usuario',
    email: session.user.email || '',
    avatar: session.user.image || null,
    plan: session.user.plan || 'free' // Viene del onboarding guardado en DB
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const MenuItem = ({ icon: Icon, label, href, onClick, badge, danger = false, hasSubmenu = false }) => {
    const Component = href ? Link : 'button';
    const props = href ? { href, onClick: () => setOpen(false) } : { onClick };

    return (
      <Component
        {...props}
        // Si no hay href, nos aseguramos de no pasarlo o pasar un string vacío si es Link
        href={props.href ?? undefined} 
        className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
          danger 
            ? 'hover:bg-red-500/10 text-red-400' 
            : 'hover:bg-slate-800 text-slate-300 hover:text-white'
        }`}
      >
        {/* contenido */}
      </Component>
    );
    };

  const SubMenuItem = ({ label, href }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="w-full px-10 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-left block"
    >
      {label}
    </Link>
  );

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
          <div className="fixed inset-0 z-30" onClick={() => { setOpen(false); setSubmenu(null); }} />
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
              {/* Mi Perfil */}
              <MenuItem 
                icon={User}
                label="Mi Perfil"
                onClick={() => setSubmenu(submenu === 'mi perfil' ? null : 'mi perfil')}
                hasSubmenu href={undefined} badge={undefined}              />
              {submenu === 'mi perfil' && (
                <div className="bg-slate-950/50 py-1">
                  <SubMenuItem label="Datos personales" href="/dashboard/profile" />
                  <SubMenuItem label="Foto de perfil" href="/dashboard/profile#photo" />
                  <SubMenuItem label="Biometría" href="/dashboard/profile#biometrics" />
                </div>
              )}

              {/* Configuración */}
              <MenuItem 
                icon={Settings}
                label="Configuración"
                onClick={() => setSubmenu(submenu === 'configuración' ? null : 'configuración')}
                hasSubmenu href={undefined} badge={undefined}              />
              {submenu === 'configuración' && (
                <div className="bg-slate-950/50 py-1">
                  <SubMenuItem label="Objetivos" href="/dashboard/settings/goals" />
                  <SubMenuItem label="Preferencias" href="/dashboard/settings/preferences" />
                  <SubMenuItem label="Privacidad" href="/dashboard/settings/privacy" />
                </div>
              )}

              {/* Suscripción */}
              <MenuItem 
                icon={user.plan === 'premium' ? Crown : CreditCard}
                label="Suscripción"
                onClick={() => setSubmenu(submenu === 'suscripción' ? null : 'suscripción')}
                badge={user.plan === 'premium' ? 'Premium' : null}
                hasSubmenu href={undefined}              />
              {submenu === 'suscripción' && (
                <div className="bg-slate-950/50 py-1">
                  <SubMenuItem label="Plan actual" href="/dashboard/subscription" />
                  {user.plan === 'free' && (
                    <SubMenuItem label="Upgrade a Premium" href="/dashboard/subscription/upgrade" />
                  )}
                  <SubMenuItem label="Historial de pagos" href="/dashboard/subscription/billing" />
                </div>
              )}

              <div className="my-2 border-t border-slate-800" />

              {/* Cerrar Sesión */}
              <MenuItem 
                icon={LogOut}
                label="Cerrar Sesión"
                onClick={handleSignOut}
                danger href={undefined} badge={undefined}              />
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
export default function HeaderBar() {
  return (
    <header className="sticky top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Logo - Left */}
        <Link href="/dasboard" className="flex-shrink-0">
          <Logo size="sm" />
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
          <NotificationsBell />

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
