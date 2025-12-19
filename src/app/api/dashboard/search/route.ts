// app/api/dashboard/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import  Auth  from 'next-auth';
import { auth } from '@/auth';
import prisma  from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Buscar en recetas
    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5,
      select: {
        id: true,
        title: true,
        description: true
      }
    });

    // Buscar en workouts (si tienes tabla de biblioteca de workouts)
    // Por ahora simulamos con datos estáticos
    const workouts = [
      { id: 'wk1', title: 'Sentadilla con Barra', category: 'Fuerza - Piernas' },
      { id: 'wk2', title: 'Press de Banca', category: 'Fuerza - Pecho' },
      { id: 'wk3', title: 'Peso Muerto', category: 'Fuerza - Espalda' },
      { id: 'wk4', title: 'Running HIIT', category: 'Cardio' },
      { id: 'wk5', title: 'Natación Técnica', category: 'Cardio' }
    ].filter(w => w.title.toLowerCase().includes(query));

    // Buscar en artículos del blog (si existe)
    const articles = [
      { id: 'art1', title: 'Guía de Meal Prep', category: 'Blog - Nutrición' },
      { id: 'art2', title: 'Cómo calcular tus macros', category: 'Blog - Guías' },
      { id: 'art3', title: 'Periodización del entrenamiento', category: 'Blog - Entrenamiento' }
    ].filter(a => a.title.toLowerCase().includes(query));

    // Combinar resultados
    const results = [
      ...recipes.map(r => ({
        type: 'recipe',
        title: r.title,
        category: 'Receta',
        url: `/dashboard/recipes/${r.id}`
      })),
      ...workouts.slice(0, 3).map(w => ({
        type: 'workout',
        title: w.title,
        category: w.category,
        url: `/dashboard/workouts/${w.id}`
      })),
      ...articles.slice(0, 2).map(a => ({
        type: 'article',
        title: a.title,
        category: a.category,
        url: `/blog/${a.id}`
      }))
    ].slice(0, 10);

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error en la búsqueda' },
      { status: 500 }
    );
  }
}
