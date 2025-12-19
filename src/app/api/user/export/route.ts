// ============================================
// 6. app/api/user/export/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        goals: true,
        onboardingData: true,
        workouts: true,
        meals: true,
        recipes: true,
        weightEntries: true,
        measurements: true,
        progressPhotos: true,
        diaryMeals: {
          include: {
            product: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      exportVersion: '1.0.0',
      
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      
      profile: user.profile,
      goals: user.goals,
      onboarding: user.onboardingData,
      
      workouts: user.workouts,
      meals: user.meals,
      recipes: user.recipes,
      
      progress: {
        weight: user.weightEntries,
        measurements: user.measurements,
        photos: user.progressPhotos
      },
      
      diary: user.diaryMeals
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = Buffer.from(jsonString, 'utf-8');

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="Sporvit-export-${user.id}-${Date.now()}.json"`
      }
    });

  } catch (error) {
    console.error('Export data error:', error);
    return NextResponse.json(
      { error: 'Error al exportar datos' },
      { status: 500 }
    );
  }
}