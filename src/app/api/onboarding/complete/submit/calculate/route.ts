// src/app/api/onboarding/calculate/route.ts

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
// 1. Importar las funciones de cálculo (asumiendo que se crearán en /lib/calculations)
import { calculateBMR } from '@/lib/calculations/bmr';
import { calculateTDEE } from '@/lib/calculations/tdee';
import { calculateMacros } from '@/lib/calculations/macros';
import { calculatePhases } from '@/lib/calculations/phases';
// 2. Importar el validador (asumiendo que se creará en /lib/onboarding/validator)
import { OnboardingCalculatorInputSchema } from '@/lib/onboarding/validator';


/**
 * Maneja la solicitud POST para calcular BMR, TDEE, Macros y Fases de entrenamiento
 * basados en los datos de biometría, objetivo y actividad.
 * @param request La solicitud HTTP entrante (contiene los datos del formulario).
 * @returns Un objeto JSON con los cálculos o un error.
 */
export async function POST(request: Request) {
  try {
    const rawData = await request.json();

    // 3. VALIDACIÓN: Asegura que los datos sean correctos antes de calcular
    const validatedData = OnboardingCalculatorInputSchema.parse(rawData);

    const { biometrics, objective, activity, training } = validatedData;
    
    // 4. CÁLCULOS
    
    // BMR y TDEE
    // CORRECCIÓN: calculateBMR ahora recibe un objeto
    const bmr = calculateBMR({
        weight: biometrics.weight, 
        height: biometrics.height, 
        age: biometrics.age, 
        gender: biometrics.gender
    });
    const tdee = calculateTDEE(bmr, activity.dailyActivityLevel, training.daysPerWeek);
    
    // Calorías Objetivo
    const targetCalories = objective.primaryGoal === 'weightloss' ? tdee - 500 : tdee;
    
    // Deducir el objetivo de peso semanal: -0.5kg/semana para pérdida de peso/déficit, 0 para mantenimiento/rendimiento.
    const weeklyGoalKg = objective.primaryGoal === 'weightloss' ? -0.5 : 0; 

    // Distribución de Macros
    // CORRECCIÓN: calculateMacros ahora recibe 3 argumentos
    const macros = calculateMacros(targetCalories, biometrics.weight, weeklyGoalKg);

    // Fases del Plan de Entrenamiento
    const phases = calculatePhases(objective.targetTimeline, objective.hasCompetition || false);

    // 5. RESPUESTA DE ÉXITO
    return NextResponse.json({
      success: true,
      calculations: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        macros,
        phases,
      }
    }, { status: 200 });

  } catch (error) {
    if (error instanceof ZodError) {
      // Error de validación de datos
      return NextResponse.json({ 
        success: false, 
        error: "Datos de entrada incompletos o incorrectos.",
        details: error.flatten() 
      }, { status: 400 });
    }
    
    // Otros errores (ej. error en la función de cálculo)
    console.error("Error en el cálculo del Onboarding:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor durante el cálculo." 
    }, { status: 500 });
  }
}