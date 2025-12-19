// src/utils/classifyNOVA.ts

/**
 * Devuelve la descripción de un grupo NOVA.
 * @param group - Número del grupo NOVA (1-4).
 */
export const classifyNOVA = (group: number | null): string => {
    if (group === null || group < 1 || group > 4) return 'Desconocido';
    switch (group) {
        case 1: return 'Grupo 1: Alimentos mínimamente procesados';
        case 2: return 'Grupo 2: Ingredientes culinarios procesados';
        case 3: return 'Grupo 3: Alimentos procesados';
        case 4: return 'Grupo 4: Productos ultraprocesados';
        default: return 'No clasificado';
    }
};