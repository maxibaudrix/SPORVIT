// src/lib/recipeFormatters.ts

export function parseISODuration(duration: string): string {
  if (!duration) return 'N/A';
  
  const match = duration.match(/PT(\d+)M/);
  if (match && match[1]) {
    const minutes = parseInt(match[1]);
    if (minutes === 0) return 'Sin cocción';
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}min`;
  }
  
  return duration;
}

export function mapCategoryToUI(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('desayuno') || lowerCategory.includes('breakfast')) return 'Desayunos';
  if (lowerCategory.includes('almuerzo') || lowerCategory.includes('comida') || lowerCategory.includes('lunch')) return 'Comidas';
  if (lowerCategory.includes('cena') || lowerCategory.includes('dinner')) return 'Cenas';
  if (lowerCategory.includes('snack') || lowerCategory.includes('aperitivo')) return 'Snacks';
  if (lowerCategory.includes('postre') || lowerCategory.includes('dessert')) return 'Postres';
  if (lowerCategory.includes('batido') || lowerCategory.includes('smoothie')) return 'Batidos';
  
  return 'Otras';
}