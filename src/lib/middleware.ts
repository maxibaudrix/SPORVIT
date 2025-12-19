import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas a proteger (si no está loggeado, redirigir al login)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/onboarding',
  '/settings',
];

// Rutas a las que redirigir si ya estás loggeado (no tiene sentido estar en /login)
const PUBLIC_REDIRECT_ROUTES = [
  '/',
  '/login',
  '/signup'
];

export async function middleware(req: NextRequest) {
  // 1. Inicializa el cliente Supabase de middleware
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresca la sesión para obtener el usuario actual y actualizar cookies
  const { data: { session } } = await supabase.auth.getSession();

  const currentPath = req.nextUrl.pathname;

  // 2. Manejo de RUTAS PROTEGIDAS
  const isProtectedRoute = PROTECTED_ROUTES.some(route => currentPath.startsWith(route));

  if (isProtectedRoute && !session) {
    // Redirigir al login si es privada y no hay sesión
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirectedFrom', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Manejo de RUTAS PÚBLICAS
  const isPublicRedirectRoute = PUBLIC_REDIRECT_ROUTES.includes(currentPath);
  
  if (isPublicRedirectRoute && session) {
    // Si estás loggeado, redirigir al dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Continuar con la respuesta
  return res;
}

// Configuración de rutas que el middleware debe observar
export const config = {
  matcher: [
    // Aplica el middleware a todas las rutas excepto a archivos estáticos y API
    '/((?!api|_next/static|_next/image|favicon.ico|assets|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};