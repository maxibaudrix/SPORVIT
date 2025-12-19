// src/app/api/onboarding/complete/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1) Validar usuario autenticado
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión nuevamente." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    // 2) Obtener datos enviados desde Step 6
    const body = await req.json();
    console.log("BODY RECEIVED →", JSON.stringify(body, null, 2));

    const {
      biometrics,
      goal,
      activity,
      training,
      diet,
      macros,
    } = body;

    // 3) VALIDACIONES SIMPLES (opcional, más seguridad)
    if (!biometrics || !goal || !activity || !training || !diet || !macros) {
      return NextResponse.json(
        { error: "Faltan datos del onboarding." },
        { status: 400 }
      );
    }

    const mapSessionDuration = (value: string) => {
      const mapping: Record<string, number> = {
        "30_45": 30,
        "45_60": 45,
        "60_90": 60,
        "90_120": 90
      };
      return mapping[value] ?? null;
    };

    const mapTrainingFrequency = (value: string) => {
      const mapping: Record<string, number> = {
        "1_2": 2,
        "2_3": 3,
        "3_4": 4,
        "4_5": 5,
        "5_6": 6,
        "6_7": 7
      };
      return mapping[value] ?? 0;
    };


    // 4) GUARDAR / ACTUALIZAR USER PROFILE (Biometrics + Activity + Training)
    await prisma.userProfile.upsert({
  where: { userId: user.id },
  update: {
    age: biometrics.age,
    gender: biometrics.gender,
    heightCm: biometrics.height,
    currentWeight: biometrics.weight,
    bodyFatPercentage: biometrics.bodyFatPercentage ?? null,

    activityLevel: activity.activityLevel,
    dailySteps: activity.dailySteps ?? null,
    sittingHours: activity.sittingHours ?? null,
    workType: activity.workType ?? null,

    trainingLevel: training.trainingLevel,
    trainingTypes: JSON.stringify(training.trainingTypes ?? []),
    sessionDuration: mapSessionDuration(training.sessionDuration),
    intensity: training.intensity ?? null,
    workoutDaysPerWeek: mapTrainingFrequency(training.trainingFrequency),
  },
  create: {
    userId: user.id,

    age: biometrics.age,
    gender: biometrics.gender,
    heightCm: biometrics.height,
    currentWeight: biometrics.weight,
    bodyFatPercentage: biometrics.bodyFatPercentage ?? null,

    activityLevel: activity.activityLevel,
    dailySteps: activity.dailySteps ?? null,
    sittingHours: activity.sittingHours ?? null,
    workType: activity.workType ?? null,

    trainingLevel: training.trainingLevel,
    trainingTypes: JSON.stringify(training.trainingTypes ?? []),
    sessionDuration: mapSessionDuration(training.sessionDuration),
    intensity: training.intensity ?? null,
    workoutDaysPerWeek: mapTrainingFrequency(training.trainingFrequency),
  },
});


    // 5) GUARDAR / ACTUALIZAR USER GOALS (Objetivos + Dieta + Macros)
    await prisma.userGoals.upsert({
      where: { userId: user.id },
      update: {
        // Goal
        goalType: goal.goalType,
        goalSpeed: goal.goalSpeed ?? null,
        targetWeight: goal.targetWeight ?? 0,

        // Diet
        dietType: diet.dietType,
        allergies: JSON.stringify(diet.allergies ?? []),
        excludedIngredients: JSON.stringify(diet.excludedIngredients ?? []),

        // Macros calculados
        targetCalories: macros.targetCalories,
        targetProteinG: macros.protein,
        targetCarbsG: macros.carbs,
        targetFatG: macros.fats,

        // Metabolismo
        bmr: macros.bmr,
        tdee: macros.tdee,
      },
      create: {
        userId: user.id,

        // Goal
        goalType: goal.goalType,
        goalSpeed: goal.goalSpeed ?? null,
        targetWeight: goal.targetWeight ?? 0,

        // Diet
        dietType: diet.dietType,
        allergies: JSON.stringify(diet.allergies ?? []),
        excludedIngredients: JSON.stringify(diet.excludedIngredients ?? []),

        // Macros calculados
        targetCalories: macros.targetCalories,
        targetProteinG: macros.protein,
        targetCarbsG: macros.carbs,
        targetFatG: macros.fats,

        // Metabolismo
        bmr: macros.bmr,
        tdee: macros.tdee,
      },
    });

    // 6) RESPUESTA FINAL
    return NextResponse.json({ message: "Onboarding completado correctamente." });
  } catch (error) {
    console.error("❌ Error en onboarding/complete:", error);
    return NextResponse.json(
      { error: "Error interno al completar el onboarding." },
      { status: 500 }
    );
  }
}
