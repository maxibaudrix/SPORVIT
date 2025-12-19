// src/app/api/pantry/add/route.ts
import { NextResponse } from 'next/server';

// Endpoint Mock para añadir items (en el futuro conectará con Supabase)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Simular respuesta exitosa DB
    return NextResponse.json({ success: true, item: { ...body, id: Date.now().toString() } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}