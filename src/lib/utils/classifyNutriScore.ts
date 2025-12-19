// src/utils/classifyNutriScore.ts
import { SporvitProduct } from '@/types/product';

/**
 * Devuelve la descripción de un grado Nutri-Score.
 * @param grade - Grado Nutri-Score (A-E o NA).
 */
export const classifyNutriScore = (grade: SporvitProduct['nutriScore']): string => {
    switch (grade) {
        case 'A': return 'Clasificación A (Mejor elección)';
        case 'B': return 'Clasificación B (Buena elección)';
        case 'C': return 'Clasificación C (Elección media)';
        case 'D': return 'Clasificación D (Peor elección)';
        case 'E': return 'Clasificación E (Peor elección)';
        case 'NA': return 'No disponible';
        default: return 'No disponible';
    }
};