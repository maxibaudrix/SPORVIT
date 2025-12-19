// src/utils/safeJson.ts

/**
 * Parsea JSON de forma segura evitando errores de runtime.
 */
export const safeJsonParse = <T>(jsonString: string | null, fallback: T): T => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
};