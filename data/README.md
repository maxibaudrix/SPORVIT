# Directorio de Datos Preservados

Este directorio contiene los datos de entrenamientos y recetas generadas por IA que han sido preservados cuando los usuarios eliminan sus cuentas.

## Estructura de Directorios

```
data/
├── preserved/
│   ├── workouts/
│   │   ├── workouts_database.json     # Base de datos principal de entrenamientos
│   │   └── user_XXXXX_timestamp.json  # Backups individuales por usuario
│   └── recipes/
│       ├── recipes_database.json      # Base de datos principal de recetas
│       └── user_XXXXX_timestamp.json  # Backups individuales por usuario
└── README.md
```

## Propósito

### ¿Por qué preservamos estos datos?

1. **Mejora del Sistema de IA**: Los entrenamientos y recetas generadas por IA son valiosos para mejorar nuestros algoritmos de generación de contenido.

2. **Análisis de Patrones**: Nos permite identificar patrones comunes en entrenamientos efectivos y recetas populares.

3. **Base de Conocimiento**: Construimos una base de datos de entrenamientos y recetas que puede ser utilizada para:
   - Sugerencias personalizadas
   - Plantillas de entrenamientos
   - Biblioteca de recetas
   - Entrenamiento de modelos de IA

### Privacidad y Anonimización

- **Datos Anonimizados**: Los IDs de usuario se reemplazan con hashes irreversibles
- **Sin Información Personal**: No se almacena ninguna información de identificación personal (nombre, email, etc.)
- **Solo Contenido**: Solo se preservan los entrenamientos y recetas, sin datos biométricos ni de progreso

## Formato de Datos

### Entrenamientos Preservados

```json
{
  "id": "clxxxxx",
  "workoutType": "strength",
  "title": "Rutina de Fuerza - Día 1",
  "description": "Enfoque en grupos musculares grandes",
  "durationMinutes": 60,
  "estimatedCalories": 350,
  "adaptedFromCalories": 2200,
  "adaptationReason": "Ajustado por objetivo de déficit calórico",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "originalUserId": "aGFzaGVkX3VzZXI=",
  "preservedAt": "2024-02-01T15:45:00.000Z"
}
```

### Recetas Preservadas

```json
{
  "id": "clxxxxx",
  "title": "Pollo al Horno con Vegetales",
  "description": "Receta alta en proteínas, baja en carbohidratos",
  "servings": 2,
  "caloriesPerServing": 450,
  "prepTimeMinutes": 15,
  "cookTimeMinutes": 35,
  "protein": 45.5,
  "carbs": 20.3,
  "fats": 15.8,
  "fiber": 6.2,
  "rating": 4,
  "createdAt": "2024-01-20T14:20:00.000Z",
  "originalUserId": "aGFzaGVkX3VzZXI=",
  "preservedAt": "2024-02-01T15:45:00.000Z"
}
```

## Uso de los Datos

### Consultar Estadísticas

Para ver estadísticas de los datos preservados:

```bash
# Endpoint API (requiere autenticación de admin)
GET /api/admin/preserved-data/stats
```

Respuesta esperada:
```json
{
  "success": true,
  "data": {
    "workouts": {
      "total": 1250,
      "byType": {
        "strength": 450,
        "cardio": 380,
        "hiit": 280,
        "rest": 140
      }
    },
    "recipes": {
      "total": 890,
      "avgRating": 4.2,
      "avgCalories": 425
    },
    "totalItems": 2140
  },
  "timestamp": "2024-02-01T16:00:00.000Z"
}
```

### Utilización Futura

Estos datos pueden ser utilizados para:

1. **Sistema de Recomendaciones**
   - Sugerir entrenamientos similares basados en patrones comunes
   - Recomendar recetas basadas en objetivos calóricos

2. **Generación Mejorada de IA**
   - Entrenar modelos con datos reales de entrenamientos efectivos
   - Mejorar la generación de recetas balanceadas

3. **Plantillas Predefinidas**
   - Crear plantillas de entrenamientos basadas en los más populares
   - Ofrecer recetas verificadas como opciones rápidas

## Mantenimiento

### Limpieza de Datos

Se recomienda revisar y limpiar los archivos de backup individuales periódicamente:

```bash
# Eliminar backups individuales mayores a 6 meses
find data/preserved/*/user_*.json -mtime +180 -delete
```

### Backup de Bases de Datos Principales

Los archivos `workouts_database.json` y `recipes_database.json` deben ser respaldados regularmente:

```bash
# Crear backup con timestamp
cp data/preserved/workouts/workouts_database.json \
   backups/workouts_database_$(date +%Y%m%d).json

cp data/preserved/recipes/recipes_database.json \
   backups/recipes_database_$(date +%Y%m%d).json
```

## Cumplimiento Legal

- ✅ Datos completamente anonimizados
- ✅ Sin información de identificación personal
- ✅ Cumple con GDPR y CCPA
- ✅ Los usuarios son informados de esta práctica en los términos de servicio

## Contacto

Para preguntas sobre el uso de estos datos o solicitudes de eliminación específicas, contactar al equipo de desarrollo.
