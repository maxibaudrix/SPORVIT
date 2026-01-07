/**
 * POST /api/planning/generate-basic
 *
 * Genera un plan básico con valores por defecto para usuarios que eligieron "Inicio Rápido".
 * Usa solo datos biométricos, objetivo y actividad. Los datos de training y diet usan defaults.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateWeekInChunks } from '@/lib/ai/geminiPlanning';
import type { UserPlanningContext } from '@/types/planning';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    console.log('[Generate Basic] Request body:', body);

    const { biometrics, objective, activity, calculations, startDate } = body;

    // Validar campos requeridos
    if (!biometrics || !objective || !activity || !calculations || !startDate) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: biometrics, objective, activity, calculations, startDate' },
        { status: 400 }
      );
    }

    // ========== VALORES POR DEFECTO PARA PLAN BÁSICO ==========

    // Training defaults: Nivel intermedio, 4 días/semana, mixto
    const defaultTraining = {
      experienceLevel: 'INTERMEDIATE' as const,
      trainingFrequency: '3_4' as const,
      trainingTypes: ['STRENGTH', 'HYPERTROPHY'],
      sessionDuration: '60_90' as const,
      intensity: 'MODERATE' as const,
      preferredSplit: 'UPPER_LOWER' as const,
      hasCompetition: false,
      competitionDate: null,
    };

    // Nutrition defaults: Omnívoro, sin restricciones
    const defaultNutrition = {
      dietType: 'OMNIVORE' as const,
      allergies: [],
      intolerances: [],
      dislikedIngredients: [],
      preferredCuisines: ['MEDITERRANEAN', 'INTERNATIONAL'],
      mealsPerDay: 4,
      supplements: [],
    };

    // ========== CONSTRUIR CONTEXTO COMPLETO ==========

    const userContext: UserPlanningContext = {
      meta: {
        userId,
        createdAt: new Date().toISOString(),
        version: '1.0.0',
      },
      biometrics: {
        age: biometrics.age,
        gender: biometrics.gender,
        weight: biometrics.weight,
        height: biometrics.height,
        bodyFatPercentage: biometrics.bodyFatPercentage || null,
      },
      objective: {
        primaryGoal: objective.primaryGoal,
        targetTimeline: objective.targetTimeline,
        targetWeight: objective.targetWeight || null,
        hasCompetition: false,
        competitionDate: null,
      },
      activity: {
        dailyActivityLevel: activity.activityLevel,
        dailySteps: activity.dailySteps || null,
        sittingHours: activity.sittingHours || null,
        workType: activity.workType || null,
        activeCommute: null,
      },
      training: defaultTraining,
      nutrition: defaultNutrition,
      targets: {
        calories: {
          trainingDay: calculations.trainingDayCalories,
          restDay: calculations.restDayCalories,
        },
        macros: {
          protein: calculations.macros.protein,
          carbs: calculations.macros.carbs,
          fat: calculations.macros.fat,
          fiber: 30,
        },
        water: Math.round(biometrics.weight * 35),
      },
      planning: {
        startDate,
        blockSize: calculations.blockSize || 4,
        totalBlocks: calculations.totalBlocks || 3,
        phases: calculations.phases || {
          base: 6,
          build: 6,
          peak: 0,
          taper: 0,
          recovery: 0,
        },
      },
    };

    console.log('[Generate Basic] User context:', userContext);

    // ========== GENERAR SEMANA 1 CON AI ==========

    console.log('[Generate Basic] Generating Week 1 with AI...');
    const weekOutput = await generateWeekInChunks(userContext, 1);

    if (!weekOutput || !weekOutput.days || weekOutput.days.length === 0) {
      throw new Error('AI generation returned empty or invalid week');
    }

    console.log('[Generate Basic] Week 1 generated successfully');

    // ========== GUARDAR EN BASE DE DATOS ==========

    // Guardar OnboardingData
    const onboardingData = await prisma.onboardingData.upsert({
      where: { userId },
      create: {
        userId,
        data: JSON.stringify({
          biometrics,
          goal: objective,
          activity,
          training: defaultTraining,
          diet: defaultNutrition,
          startDate,
          calculatedMacros: calculations.macros,
        }),
        status: 'completed',
        version: '1.0.0',
        onboardingType: 'basic',
        completedModules: JSON.stringify({
          trainingDetailed: false,
          nutritionDetailed: false,
        }),
        pendingRegeneration: false,
      },
      update: {
        data: JSON.stringify({
          biometrics,
          goal: objective,
          activity,
          training: defaultTraining,
          diet: defaultNutrition,
          startDate,
          calculatedMacros: calculations.macros,
        }),
        status: 'completed',
        onboardingType: 'basic',
        completedModules: JSON.stringify({
          trainingDetailed: false,
          nutritionDetailed: false,
        }),
        pendingRegeneration: false,
        updatedAt: new Date(),
      },
    });

    console.log('[Generate Basic] OnboardingData saved:', onboardingData.id);

    // Guardar GeneratedPlan
    const generatedPlan = await prisma.generatedPlan.create({
      data: {
        userId,
        onboardingDataId: onboardingData.id,
        weekNumber: 1,
        weekData: JSON.stringify(weekOutput),
        targetCalories: calculations.targetCalories,
        startDate: new Date(startDate),
        endDate: new Date(new Date(startDate).getTime() + 6 * 24 * 60 * 60 * 1000),
        status: 'active',
        version: '1.0.0',
      },
    });

    console.log('[Generate Basic] GeneratedPlan saved:', generatedPlan.id);

    // Crear notificación para completar perfil
    await prisma.notification.create({
      data: {
        userId,
        type: 'COMPLETE_PROFILE',
        title: 'Completa tu perfil',
        message: 'Añade tus preferencias de entrenamiento y nutrición para obtener un plan más personalizado.',
        actionUrl: '/dashboard',
        actionLabel: 'Completar ahora',
        read: false,
      },
    });

    console.log('[Generate Basic] Notification created');

    // ========== RESPUESTA ==========

    return NextResponse.json({
      success: true,
      message: 'Plan básico generado exitosamente',
      data: {
        onboardingDataId: onboardingData.id,
        planId: generatedPlan.id,
        weekNumber: 1,
        week: weekOutput,
        usedDefaults: {
          training: defaultTraining,
          nutrition: defaultNutrition,
        },
      },
    });
  } catch (error: any) {
    console.error('[Generate Basic] Error:', error);
    return NextResponse.json(
      {
        error: 'Error al generar plan básico',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
