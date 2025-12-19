// src/lib/recommenderEngine.ts
import { UserPreferences, normalizeNutriScore, parseNova } from "./validations/product";

/**
 * Motor de puntuación simple que devuelve un valor de 0 a 100 
 * (cuanto más alto, más saludable y/o alineado con las preferencias del usuario).
 * @param product Objeto parcial de producto de OpenFoodFacts.
 * @param prefs {UserPreferences} Preferencias de usuario (excluir ingredientes, NOVA máximo, etc.)
 * @returns Puntuación de 0 a 100.
 */
export function scoreProduct(product: any, prefs?: UserPreferences): number {
    // Puntuación base inicial.
    let score = 50;

    // Normalizar y parsear puntuaciones clave
    const nutri = product?.nutriscore_grade ? normalizeNutriScore(product.nutriscore_grade) : null;
    const nova = product?.nova_group != null ? parseNova(product.nova_group) : null;
    const nutriments = product?.nutriments || {};

    // 1. Influencia del Nutri-Score
    if (nutri) {
        switch (nutri) {
            case "a": score += 30; break;
            case "b": score += 20; break;
            case "c": score += 5; break;
            case "d": score -= 15; break;
            case "e": score -= 30; break;
        }
    }

    // 2. Influencia del Grupo NOVA (mayor NOVA -> más procesado -> penalización)
    // [Image of NOVA food classification groups]
    if (nova != null) {
        if (nova <= 2) score += 10;
        else if (nova === 3) score -= 5;
        else if (nova >= 4) score -= 20;
    }

    // 3. Influencia de Nutrientes (comprobaciones básicas por 100g)
    const sugar = Number(nutriments.sugars_100g ?? nutriments.sugars ?? 0);
    const saturated = Number(nutriments["saturated-fat_100g"] ?? nutriments.saturated_fat_100g ?? 0);
    // Asumimos que la sal está en gramos (salt_100g) o sodio (sodium_100g).
    const salt = Number(nutriments.salt_100g ?? nutriments.sodium_100g ?? 0); 

    if (sugar > 15) score -= 10;
    else if (sugar > 5) score -= 2;

    if (saturated > 5) score -= 6;
    if (salt > 1) score -= 6;

    // 4. Preferencias del Usuario: Ingredientes Excluidos
    if (prefs?.excludedIngredients?.length) {
        const labels = (product?.ingredients_text || "").toLowerCase();
        for (const ex of prefs.excludedIngredients) {
            if (labels.includes(ex.toLowerCase())) {
                score -= 40; // Penalización fuerte por ingrediente excluido
            }
        }
    }

    // 5. Preferencias del Usuario: Límite Máximo de NOVA
    if (prefs?.maxNova != null && nova != null) {
        if (nova > prefs.maxNova) {
            score -= 25; // Penalización por exceder el límite NOVA del usuario
        }
    }

    // 6. Asegurar que la puntuación se mantenga entre 0 y 100
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    return Math.round(score);
}