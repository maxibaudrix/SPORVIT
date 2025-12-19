// src/lib/calculations/phases.ts

import { OnboardingData} from '@/types/onboarding.d'; // Asumiendo que existe este tipo

// Define la estructura de salida de las fases
interface TrainingPhase {
    name: string; // ej. Base, Specific, Peak, Taper
    durationWeeks: number;
    focus: string; // ej. Volumen, Intensidad, Descarga
}

/**
 * Calcula las fases de entrenamiento recomendadas basadas en el objetivo principal
 * y la línea de tiempo.
 * * @param targetTimelineWeeks La duración total en semanas del plan (ej. 12, 16, 24).
 * @param hasCompetition Indica si el objetivo es una competición con fecha fija.
 * @returns Un array de objetos TrainingPhase.
 */
export function calculatePhases(targetTimelineWeeks: number, hasCompetition: boolean): TrainingPhase[] {
    const minWeeks = 4;
    let remainingWeeks = targetTimelineWeeks;
    const phases: TrainingPhase[] = [];

    // 1. Fase de BASE/Preparación General (Siempre es necesaria)
    // Se recomienda una base de al menos 8 semanas si el tiempo lo permite.
    let baseDuration = Math.max(minWeeks, Math.floor(targetTimelineWeeks * 0.4));
    
    // Si la duración total es corta (menos de 10 semanas), la base es más corta.
    if (targetTimelineWeeks < 10) {
        baseDuration = Math.max(minWeeks, Math.floor(targetTimelineWeeks * 0.5));
    }
    
    // Aseguramos que la duración no exceda el tiempo total
    baseDuration = Math.min(baseDuration, remainingWeeks);
    
    phases.push({
        name: "Base General",
        durationWeeks: baseDuration,
        focus: "Construcción de volumen y acondicionamiento general. Baja intensidad, alta frecuencia."
    });
    remainingWeeks -= baseDuration;

    // 2. Fase Específica / Pre-Competición
    if (remainingWeeks >= minWeeks) {
        let specificDuration = remainingWeeks;
        
        // Si hay competición, reservamos 1-2 semanas para el Taper (descarga)
        if (hasCompetition && remainingWeeks >= (minWeeks + 2)) {
            specificDuration = remainingWeeks - 2;
        }

        phases.push({
            name: "Fase Específica",
            durationWeeks: specificDuration,
            focus: "Aumento de la intensidad, simulación de condiciones de competición y ejercicios específicos."
        });
        remainingWeeks -= specificDuration;
    }

    // 3. Fase Taper / Descarga (Solo si hay competición)
    if (hasCompetition && remainingWeeks > 0) {
        const taperDuration = Math.min(2, remainingWeeks); // Taper de 1 o 2 semanas
        phases.push({
            name: "Taper y Puesta a Punto",
            durationWeeks: taperDuration,
            focus: "Reducción drástica del volumen, mantenimiento de la intensidad, recuperación activa."
        });
        remainingWeeks -= taperDuration;
    }

    // 4. Ajuste final (Si queda tiempo residual)
    if (remainingWeeks > 0) {
        // Añadir el tiempo restante a la última fase no-taper para completar el timeline
        const lastIndex = phases.length - (hasCompetition ? 2 : 1);
        if (lastIndex >= 0) {
            phases[lastIndex].durationWeeks += remainingWeeks;
        }
    }
    
    // Normalización: Asegurar que el total sea el tiempo original
    const totalWeeks = phases.reduce((sum, p) => sum + p.durationWeeks, 0);
    if (totalWeeks !== targetTimelineWeeks && phases.length > 0) {
        // Ajuste fino: añadir o quitar 1 semana a la fase base si es necesario
        phases[0].durationWeeks += (targetTimelineWeeks - totalWeeks);
    }


    return phases.filter(p => p.durationWeeks > 0);
}