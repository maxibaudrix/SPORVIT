// src/lib/validations/product.ts
export type UserPreferences = {
  excludedIngredients?: string[]; // e.g. ["lactose", "gluten"]
  maxNova?: number; // 1..4
  allowedNutriScore?: string[]; // e.g. ["a","b","c"]
};

export function normalizeNutriScore(s: any): string | null {
  if (!s && s !== 0) return null;
  try {
    const v = String(s).toLowerCase().trim();
    if (/^[abcde]$/.test(v)) return v;
    return null;
  } catch {
    return null;
  }
}

export function parseNova(g: any): number | null {
  const n = Number(g);
  if (Number.isFinite(n)) return n;
  return null;
}
