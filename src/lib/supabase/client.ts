import { createBrowserClient as createClient } from '@supabase/ssr';

/**
 * Cliente de Supabase para el NAVEGADOR
 * Usa la clave ANON (segura para el cliente)
 */
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
