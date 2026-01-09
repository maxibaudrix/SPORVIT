import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getRecipeBySlug } from '@/lib/recipeUtils';

/**
 * GET /api/recipes/[slug]
 * Obtiene el detalle completo de una receta por su slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug requerido' },
        { status: 400 }
      );
    }

    // Buscar receta
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
      return NextResponse.json(
        { error: 'Receta no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      recipe
    });

  } catch (error) {
    console.error('Error al obtener receta:', error);
    return NextResponse.json(
      { error: 'Error al obtener receta' },
      { status: 500 }
    );
  }
}
