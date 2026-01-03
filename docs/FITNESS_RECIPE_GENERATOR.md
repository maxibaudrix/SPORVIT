# Generador de Recetas Fitness

## Descripción

El Generador de Recetas Fitness es una funcionalidad que permite a los usuarios crear recetas personalizadas basadas en sus ingredientes disponibles y objetivos fitness. Utiliza inteligencia artificial (Google Gemini) para generar recetas balanceadas con información nutricional completa en formato Schema.org.

## Archivos Creados

### Tipos TypeScript
- **`src/types/fitness-recipe.d.ts`**: Definiciones de tipos para recetas fitness siguiendo el estándar Schema.org

### API Endpoints
- **`src/app/api/recipes/fitness/generate/route.ts`**: Endpoint POST que genera recetas usando Google Gemini AI

### Componentes React
- **`src/components/recipes/RecipeGeneratorForm.tsx`**: Formulario para ingresar ingredientes y objetivos
- **`src/components/recipes/RecipeDisplay.tsx`**: Componente para visualizar la receta generada

### Páginas
- **`src/app/recipes/fitness-generator/page.tsx`**: Página principal del generador de recetas

## Características

### Formulario de Entrada
- **Ingredientes**: Agregar ingredientes disponibles
- **Tipo de comida**: Desayuno, Almuerzo, Cena, Snack, Pre-entreno, Post-entreno
- **Porciones**: Número de porciones deseadas
- **Objetivo fitness**:
  - Perder grasa
  - Ganar músculo
  - Mantener
  - Rendimiento
- **Restricciones dietéticas**: Vegetariano, Vegano, Sin Gluten, Cetogénica, etc.
- **Alergias**: Lista de alergias alimentarias
- **Objetivos nutricionales**: Calorías y proteína objetivo (opcional)

### Receta Generada
- **Información básica**: Nombre, descripción, categoría, dificultad
- **Tiempos**: Preparación, cocción, tiempo total (formato ISO 8601)
- **Información nutricional completa**:
  - Calorías
  - Proteína
  - Carbohidratos
  - Grasas
  - Fibra
  - Azúcar
  - Grasa saturada
  - Sodio
- **Ingredientes**: Lista detallada con cantidades
- **Instrucciones**: Pasos numerados para la preparación
- **Tags y categorización**: Para búsqueda y filtrado
- **Información SEO**: Título, meta descripción, palabra clave

### Funcionalidades de Exportación
- **Descargar JSON**: Descarga la receta en formato JSON Schema.org
- **Copiar JSON**: Copia el JSON al portapapeles
- **Compartir**: Opción para compartir la receta

## Formato de Receta (Schema.org)

Las recetas generadas siguen el estándar Schema.org Recipe, lo que permite:
- Mejor SEO
- Compatibilidad con motores de búsqueda
- Fácil integración con otras plataformas
- Formato estructurado y reutilizable

Ejemplo de estructura:
```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "id": "recipe-001",
  "name": "Nombre de la Receta",
  "category": "almuerzo",
  "difficulty": "fácil",
  "prepTime": "PT10M",
  "cookTime": "PT15M",
  "totalTime": "PT25M",
  "recipeYield": "2 porciones",
  "description": "Descripción de la receta",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "450 kcal",
    "proteinContent": "35g",
    "carbohydrateContent": "40g",
    "fatContent": "15g"
  },
  "recipeIngredient": [...],
  "recipeInstructions": [...],
  "tags": [...],
  "seo": {...}
}
```

## Uso de la API

### Endpoint
```
POST /api/recipes/fitness/generate
```

### Request Body
```json
{
  "ingredientes": ["Pollo", "Arroz integral", "Brócoli"],
  "categoria": "almuerzo",
  "objetivos": {
    "objetivo": "ganar_musculo",
    "restricciones_dieteticas": ["Sin Gluten"],
    "alergias": ["Nueces"],
    "calorias_objetivo": 500,
    "proteina_objetivo": 40
  },
  "porciones": 2
}
```

### Response
```json
{
  "success": true,
  "recipe": {
    "@context": "https://schema.org",
    "@type": "Recipe",
    ...
  }
}
```

## Tecnologías Utilizadas

- **Next.js 14**: Framework React
- **TypeScript**: Tipado estático
- **Google Generative AI (Gemini)**: Generación de recetas con IA
- **Tailwind CSS**: Estilos
- **Lucide React**: Iconos

## Configuración

### Variables de Entorno Requeridas
```env
GOOGLE_AI_API_KEY=tu_api_key_de_google_ai
```

## Acceso a la Aplicación

La aplicación está disponible en:
```
/recipes/fitness-generator
```

## Flujo de Uso

1. El usuario accede a `/recipes/fitness-generator`
2. Completa el formulario con:
   - Ingredientes disponibles
   - Tipo de comida deseada
   - Objetivos fitness
   - Restricciones y preferencias (opcional)
3. Hace clic en "Generar Receta Fitness"
4. La IA procesa la solicitud (puede tardar unos segundos)
5. Se muestra la receta generada con:
   - Información nutricional completa
   - Ingredientes y cantidades
   - Instrucciones paso a paso
   - Opciones para descargar/copiar JSON
6. El usuario puede crear una nueva receta o modificar la búsqueda

## Mejoras Futuras

- Guardar recetas favoritas en base de datos
- Historial de recetas generadas
- Compartir recetas con otros usuarios
- Generar plan semanal de comidas
- Ajustar recetas según macros diarios restantes
- Integración con lista de compras
- Valoraciones y comentarios de recetas
- Galería de recetas generadas por la comunidad
- Modo offline con recetas cacheadas
- Sugerencias de sustituciones de ingredientes

## Notas Técnicas

### Manejo de Errores
- Validación de entrada en el cliente y servidor
- Retry logic con fallback entre modelos de IA
- Mensajes de error descriptivos al usuario
- Logging de errores para debugging

### Optimizaciones
- Caching de respuestas comunes
- Lazy loading de componentes
- Optimización de imágenes
- Scroll suave a la receta generada

### Seguridad
- Validación de inputs para prevenir injection
- Rate limiting en el API (recomendado)
- Sanitización de datos generados por IA
