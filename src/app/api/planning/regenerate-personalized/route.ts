/**
 * POST /api/planning/regenerate-personalized
 *
 * Regenera el plan cuando el usuario completa su perfil con los datos detallados
 * de training y diet. Usa los datos del store/localStorage más los nuevos datos.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateWeekInChunks } from '@/lib/ai/geminiPlanning';
import { calculateTargetsAndPlanning } from '@/lib/planning/calculateTargetsAndPlanning';
import type { UserPlanningContext } from '@/types/planning';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    console.log('[Regenerate Personalized] Request body:', body);

    const { startDate } = body;

    if (!startDate) {
      return NextResponse.json(
        { error: 'Falta campo requerido: startDate' },
        { status: 400 }
      );
    }

    // ========== OBTENER DATOS EXISTENTES DEL ONBOARDING ==========

    const onboardingData = await prisma.onboardingData.findUnique({
      where: { userId },
    });

    if (!onboardingData) {
      return NextResponse.json(
        { error: 'No se encontró información de onboarding. Por favor completa el onboarding primero.' },
        { status: 404 }
      );
    }

    // Parsear datos guardados
    const savedData = JSON.parse(onboardingData.data);
    console.log('[Regenerate Personalized] Saved data:', savedData);

    // Verificar que tengamos todos los datos necesarios
    if (!savedData.biometrics || !savedData.goal || !savedData.activity) {
      return NextResponse.json(
        { error: 'Datos de onboarding incompletos' },
        { status: 400 }
      );
    }

    // Verificar que tengamos training y diet (datos detallados)
    if (!savedData.training || !savedData.diet) {
      return NextResponse.json(
        { error: 'Faltan datos de training o diet. Por favor completa tu perfil primero.' },
        { status: 400 }
      );
    }

    // ========== RECALCULAR TARGETS CON DATOS COMPLETOS ==========

    const newTargets = calculateTargetsAndPlanning({
      age: savedData.biometrics.age,
      gender: savedData.biometrics.gender,
      weight: savedData.biometrics.weight,
      height: savedData.biometrics.height,
      activityLevel: savedData.activity.activityLevel,
      goal: savedData.goal.goalType,
      timeline: savedData.goal.targetTimeline,
    });

    console.log('[Regenerate Personalized] Recalculated targets:', newTargets);

    // ========== CONSTRUIR CONTEXTO COMPLETO CON DATOS PERSONALIZADOS ==========

    const userContext: UserPlanningContext = {
      meta: {
        userId,
        createdAt: new Date().toISOString(),
        version: '1.0.0',
      },
      biometrics: {
        age: savedData.biometrics.age,
        gender: savedData.biometrics.gender,
        weight: savedData.biometrics.weight,
        height: savedData.biometrics.height,
        bodyFatPercentage: savedData.biometrics.bodyFatPercentage || null,
      },
      objective: {
        primaryGoal: savedData.goal.goalType,
        targetTimeline: savedData.goal.targetTimeline,
        targetWeight: savedData.goal.targetWeight || null,
        hasCompetition: savedData.training?.hasCompetition || false,
        competitionDate: savedData.training?.competitionDate || null,
      },
      activity: {
        dailyActivityLevel: savedData.activity.activityLevel,
        dailySteps: savedData.activity.dailySteps || null,
        sittingHours: savedData.activity.sittingHours || null,
        workType: savedData.activity.workType || null,
        activeCommute: null,
      },
      training: {
        experienceLevel: savedData.training.trainingLevel || savedData.training.experienceLevel,
        trainingFrequency: savedData.training.trainingFrequency,
        trainingTypes: savedData.training.trainingTypes || ['STRENGTH', 'HYPERTROPHY'],
        sessionDuration: savedData.training.sessionDuration || '60_90',
        intensity: savedData.training.intensity || 'MODERATE',
        preferredSplit: savedData.training.preferredSplit || 'UPPER_LOWER',
        hasCompetition: savedData.training.hasCompetition || false,
        competitionDate: savedData.training.competitionDate || null,
      },
      nutrition: {
        dietType: savedData.diet.dietType,
        allergies: savedData.diet.allergies || [],
        intolerances: savedData.diet.excludedIngredients || savedData.diet.intolerances || [],
        dislikedIngredients: savedData.diet.dislikedIngredients || [],
        preferredCuisines: savedData.diet.preferredCuisines || ['MEDITERRANEAN'],
        mealsPerDay: savedData.diet.mealsPerDay || 4,
        supplements: savedData.diet.supplements || [],
      },
      targets: {
        calories: {
          trainingDay: newTargets.calories.trainingDay,
          restDay: newTargets.calories.restDay,
        },
        macros: {
          protein: newTargets.macros.protein,
          carbs: newTargets.macros.carbs,
          fat: newTargets.macros.fat,
          fiber: newTargets.macros.fiber || 30,
        },
        water: Math.round(savedData.biometrics.weight * 35),
      },
      planning: {
        startDate,
        blockSize: newTargets.blockSize,
        totalBlocks: newTargets.totalBlocks,
        phases: newTargets.phases,
      },
    };

    console.log('[Regenerate Personalized] User context:', userContext);

    // ========== GENERAR NUEVA SEMANA 1 CON DATOS COMPLETOS ==========

    console.log('[Regenerate Personalized] Generating Week 1 with personalized data...');
    const weekOutput = await generateWeekInChunks(userContext, 1);

    if (!weekOutput || !weekOutput.days || weekOutput.days.length === 0) {
      throw new Error('AI generation returned empty or invalid week');
    }

    console.log('[Regenerate Personalized] Week 1 regenerated successfully');

    // ========== ACTUALIZAR BASE DE DATOS ==========

    // Actualizar OnboardingData
    await prisma.onboardingData.update({
      where: { userId },
      data: {
        data: JSON.stringify({
          ...savedData,
          startDate, // Nueva fecha de inicio
          calculatedMacros: newTargets.macros,
        }),
        onboardingType: 'complete',
        completedModules: JSON.stringify({
          trainingDetailed: true,
          nutritionDetailed: true,
        }),
        pendingRegeneration: false,
        updatedAt: new Date(),
      },
    });

    console.log('[Regenerate Personalized] OnboardingData updated');

    // Desactivar planes antiguos
    await prisma.generatedPlan.updateMany({
      where: {
        userId,
        status: 'active',
      },
      data: {
        status: 'archived',
      },
    });

    console.log('[Regenerate Personalized] Old plans archived');

    // Crear nuevo GeneratedPlan
    const generatedPlan = await prisma.generatedPlan.create({
      data: {
        userId,
        onboardingDataId: onboardingData.id,
        weekNumber: 1,
        weekData: JSON.stringify(weekOutput),
        targetCalories: newTargets.calories.trainingDay,
        startDate: new Date(startDate),
        endDate: new Date(new Date(startDate).getTime() + 6 * 24 * 60 * 60 * 1000),
        status: 'active',
        version: '1.0.0',
      },
    });

    console.log('[Regenerate Personalized] New GeneratedPlan created:', generatedPlan.id);

    // Crear notificación de éxito
    await prisma.notification.create({
      data: {
        userId,
        type: 'PLAN_READY',
        title: '¡Tu plan personalizado está listo!',
        message: 'Hemos regenerado tu plan con todos tus datos personalizados de entrenamiento y nutrición.',
        actionUrl: '/dashboard',
        actionLabel: 'Ver plan',
        read: false,
      },
    });

    console.log('[Regenerate Personalized] Success notification created');

    // ========== RESPUESTA ==========

    return NextResponse.json({
      success: true,
      message: 'Plan regenerado exitosamente con datos personalizados',
      data: {
        planId: generatedPlan.id,
        weekNumber: 1,
        week: weekOutput,
        isPersonalized: true,
        completedModules: {
          trainingDetailed: true,
          nutritionDetailed: true,
        },
      },
    });
  } catch (error: any) {
    console.error('[Regenerate Personalized] Error:', error);
    return NextResponse.json(
      {
        error: 'Error al regenerar plan personalizado',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
