/**
 * Vectorizer
 *
 * Operaciones vectoriales para cálculo de similitud entre contextos.
 * Implementa cosine similarity, euclidean distance y variantes ponderadas.
 */

/**
 * Normaliza un vector a magnitud 1 (unit vector)
 *
 * @param vector - Vector a normalizar
 * @returns Vector normalizado
 */
export function normalize(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));

  if (magnitude === 0) {
    return vector.map(() => 0);
  }

  return vector.map((val) => val / magnitude);
}

/**
 * Calcula el producto punto entre dos vectores
 *
 * @param v1 - Primer vector
 * @param v2 - Segundo vector
 * @returns Producto punto (dot product)
 */
export function dotProduct(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) {
    throw new Error(`Vector dimensions don't match: ${v1.length} vs ${v2.length}`);
  }

  return v1.reduce((sum, val, idx) => sum + val * v2[idx], 0);
}

/**
 * Calcula la magnitud (norma L2) de un vector
 *
 * @param vector - Vector
 * @returns Magnitud del vector
 */
export function magnitude(vector: number[]): number {
  return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Calcula cosine similarity entre dos vectores
 * Resultado: 1.0 (idénticos) a 0.0 (ortogonales) a -1.0 (opuestos)
 *
 * Formula: similarity = (v1 · v2) / (||v1|| × ||v2||)
 *
 * @param v1 - Primer vector
 * @param v2 - Segundo vector
 * @returns Similarity score entre -1 y 1
 */
export function cosineSimilarity(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) {
    throw new Error(`Vector dimensions don't match: ${v1.length} vs ${v2.length}`);
  }

  const dot = dotProduct(v1, v2);
  const mag1 = magnitude(v1);
  const mag2 = magnitude(v2);

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dot / (mag1 * mag2);
}

/**
 * Calcula weighted cosine similarity
 * Aplica pesos por dimensión para priorizar features importantes
 *
 * @param v1 - Primer vector
 * @param v2 - Segundo vector
 * @param weights - Pesos por dimensión
 * @returns Weighted similarity score entre 0 y 1
 */
export function weightedCosineSimilarity(
  v1: number[],
  v2: number[],
  weights: number[]
): number {
  if (v1.length !== v2.length || v1.length !== weights.length) {
    throw new Error(
      `Vector/weight dimensions don't match: ${v1.length}, ${v2.length}, ${weights.length}`
    );
  }

  // Aplicar pesos a ambos vectores
  const weighted1 = v1.map((val, idx) => val * weights[idx]);
  const weighted2 = v2.map((val, idx) => val * weights[idx]);

  // Calcular cosine similarity de los vectores ponderados
  return cosineSimilarity(weighted1, weighted2);
}

/**
 * Calcula distancia euclidiana entre dos vectores
 * Resultado: 0 (idénticos) a infinito (muy diferentes)
 *
 * @param v1 - Primer vector
 * @param v2 - Segundo vector
 * @returns Distancia euclidiana
 */
export function euclideanDistance(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) {
    throw new Error(`Vector dimensions don't match: ${v1.length} vs ${v2.length}`);
  }

  const squaredDiffs = v1.map((val, idx) => Math.pow(val - v2[idx], 2));
  return Math.sqrt(squaredDiffs.reduce((sum, val) => sum + val, 0));
}

/**
 * Convierte similarity (0-1) a distance (0-1)
 * Útil para comparar ambas métricas en la misma escala
 *
 * @param similarity - Score de similitud
 * @returns Distancia normalizada
 */
export function similarityToDistance(similarity: number): number {
  return 1 - similarity;
}

/**
 * Convierte distance a similarity score
 * Asume distancia normalizada entre 0 y 1
 *
 * @param distance - Distancia normalizada
 * @returns Similarity score
 */
export function distanceToSimilarity(distance: number): number {
  return Math.max(0, 1 - distance);
}

/**
 * Calcula la media de un array de números
 *
 * @param values - Array de valores
 * @returns Media aritmética
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calcula la desviación estándar de un array
 *
 * @param values - Array de valores
 * @returns Desviación estándar
 */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;

  const avg = mean(values);
  const squaredDiffs = values.map((val) => Math.pow(val - avg, 2));
  const variance = mean(squaredDiffs);

  return Math.sqrt(variance);
}
