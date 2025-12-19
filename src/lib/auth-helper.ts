// src/lib/auth-helper.ts 
import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function getUserIdFromSession(request?: NextRequest) {
  // FIX: Se aplica un casting para forzar a TypeScript a usar la sobrecarga
  // que acepta NextRequest, asumiendo que el tipo real de 'auth' en tu entorno 
  // está configurado para manejar esto. Se usa 'Promise<any>' para simplificar el tipo de retorno.
  const session = request 
        ? await (auth as (req: NextRequest) => Promise<any>)(request) 
        : await auth(); 
        
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id as string;
}

export function handleUnauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}