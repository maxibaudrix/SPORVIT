# 📘 Especificación Técnica: Sistema Híbrido AI+Caché

## 🎯 Objetivo del Sistema

Reducir la dependencia de llamadas a la API de Claude AI (actualmente 100% de generaciones) implementando un sistema inteligente de caché que:

- **Reutiliza planes** cuando encuentra usuarios con perfiles similares
- **Adapta planes existentes** cuando hay diferencias menores
- **Genera con AI solo cuando es necesario** o económicamente justificable

**Meta de eficiencia**: Reducir llamadas AI del 100% actual al 20% en 6 meses.

---

## 📊 Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                    POST /api/planning/init                      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
                   ┌───────────────────────┐
                   │   ORCHESTRATOR        │
                   │   (Cerebro Central)   │
                   └───────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │   Hashing   │  │  Similarity │  │    Cost     │
    │   Module    │  │   Matcher   │  │  Optimizer  │
    └─────────────┘  └─────────────┘  └─────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
    ┌─────────────────┐              ┌─────────────────┐
    │  Cache Manager  │              │  Plan Adapter   │
    │  (Persistencia) │              │  (Ajustes)      │
    └─────────────────┘              └─────────────────┘
              │                                 │
              └────────────────┬────────────────┘
                               │
                               ▼
                   ┌───────────────────────┐
                   │   AI Generator        │
                   │   (Fallback/Fresh)    │
                   └───────────────────────┘
```

---

## 📁 Estructura de Archivos a Crear

### **Directorio Base: `src/lib/planning/generation/`**

```
src/lib/planning/generation/
├── orchestrator.ts              # 🧠 Director principal del flujo
├── aiGenerator.ts               # 🤖 Wrapper de Claude API (wrapper del actual)
├── cacheManager.ts              # 💾 Gestión de persistencia
├── similarityMatcher.ts         # 🔍 Motor de búsqueda semántica
├── planAdapter.ts               # 🔧 Adaptador de planes
└── costOptimizer.ts             # 💰 Decisiones económicas
```

### **Directorio: `src/lib/planning/hashing/`**

```
src/lib/planning/hashing/
├── contextHasher.ts             # #️⃣ Generador de hashes
├── featureExtractor.ts          # 📊 Extracción de features numéricos
└── vectorizer.ts                # 🎯 Conversión a vectores
```

### **Directorio: `src/lib/planning/storage/`**

```
src/lib/planning/storage/
├── planRepository.ts            # 🗄️ Acceso a DB
└── analyticsLogger.ts           # 📈 Logging y métricas
```

### **Directorio: `src/config/`**

```
src/config/
└── cacheConfig.ts               # ⚙️ Configuración central
```

### **Modificaciones a archivos existentes**

```
src/app/api/planning/init/route.ts    # ✏️ MODIFICAR: Integrar orchestrator
src/lib/ai/generateCompletePlan.ts    # ✏️ MANTENER: Será wrapped por aiGenerator
```

### **Nuevos endpoints**

```
src/app/api/planning/analytics/
└── cache-stats/route.ts         # 📊 Dashboard de métricas
```

---

## 🔧 Especificación por Archivo

---

### **1. orchestrator.ts** 

**Rol**: Cerebro del sistema. Decide todo el flujo de generación.

**Exports principales**:
```typescript
export async function generatePlan(
  context: UserPlanningContext
): Promise<PlanGenerationResult>

interface PlanGenerationResult {
  plan: CompletePlanningOutput;
  source: 'ai' | 'cache_exact' | 'cache_adapted';
  metadata: {
    planId: string;
    similarityScore?: number;
    costUsd: number;
    responseTimeMs: number;
    cachedPlanId?: string;
  };
}
```

**Flujo lógico**:
1. Recibir `UserPlanningContext`
2. Generar hashes (exacto y semántico) → `contextHasher`
3. Buscar match exacto → `cacheManager.findExactMatch()`
4. Si no hay match exacto:
   - Buscar similares → `similarityMatcher.findSimilar()`
   - Evaluar opciones → `costOptimizer.shouldUseAI()`
5. Ejecutar estrategia elegida:
   - AI: `aiGenerator.generate()`
   - Cache directo: retornar plan
   - Adaptado: `planAdapter.adapt()`
6. Guardar resultado → `cacheManager.savePlan()`
7. Registrar analytics → `analyticsLogger.log()`
8. Retornar plan + metadata

**Dependencias**:
- `contextHasher`, `cacheManager`, `similarityMatcher`
- `costOptimizer`, `planAdapter`, `aiGenerator`, `analyticsLogger`

**Tests críticos**:
- Flujo completo con mock de DB
- Manejo de errores AI (fallback a caché)
- Decisiones correctas según cost optimizer

---

### **2. contextHasher.ts**

**Rol**: Genera identificadores únicos para contextos de usuario.

**Exports principales**:
```typescript
export function generateExactHash(context: UserPlanningContext): string
export function generateSemanticHash(context: UserPlanningContext): string
export function generateCompoundKey(context: UserPlanningContext): string
```

**Lógica `generateExactHash()`**:
- Serializar TODO el contexto en JSON canónico
- Aplicar SHA-256
- Retornar string hex de 64 caracteres
- **Propósito**: Match perfecto (mismos datos → mismo hash)

**Lógica `generateSemanticHash()`**:
- Extraer SOLO features clave:
  - `goalType`, `experienceLevel`, `daysPerWeek`
  - `dietType`, `timeline`, `hasCompetition`
- Bucketizar valores continuos:
  - `age`: 18-25, 26-35, 36-45, 46-55, 56+
  - `weight`: rangos de 5kg
  - `timeline`: 4-8w, 9-12w, 13-16w
- Serializar en formato determinista
- **Propósito**: Match semántico (usuarios similares → mismo hash)

**Lógica `generateCompoundKey()`**:
- Formato: `"{goalType}|{level}|{days}|{diet}|{timeline}"`
- Ejemplo: `"performance|intermediate|5|omnivore|12"`
- **Propósito**: Indexación rápida en DB

**Dependencias**: Ninguna (función pura)

**Tests críticos**:
- Determinismo: mismo input → mismo output
- Bucketización correcta de valores edge
- Colisiones mínimas en semantic hash

---

### **3. featureExtractor.ts**

**Rol**: Convierte contexto en vector numérico de dimensión fija.

**Exports principales**:
```typescript
export function extractFeatures(context: UserPlanningContext): number[]

interface FeatureVector {
  dimensions: number; // 25-30
  values: number[];   // Todos normalizados 0-1
  labels: string[];   // Para debugging
}

export function extractFeatureVector(context: UserPlanningContext): FeatureVector
```

**Categorías de features** (con pesos):

1. **Físicos (peso: 1.0)**:
   - `age_normalized = age / 100`
   - `weight_normalized = weight / 150`
   - `height_normalized = height / 200`
   - `bmi_category = [0, 1, 2, 3]` (underweight, normal, overweight, obese)

2. **Objetivo (peso: 2.0)**:
   - `goalType_encoded = [0, 1, 2, 3]` (lose, maintain, recomp, gain)
   - `timeline_weeks = value / 16`
   - `hasCompetition = [0, 1]`
   - `goalSpeed_encoded = [0, 1, 2]`

3. **Entrenamiento (peso: 1.5)**:
   - `experienceLevel_encoded = [0, 1, 2]`
   - `daysPerWeek = value / 7`
   - `sessionDuration = minutes / 120`
   - `trainingTypes_vector = [cardio, strength, hiit, flex]` (multi-hot)

4. **Nutrición (peso: 0.8)**:
   - `dietType_encoded = one-hot(10 opciones)`
   - `restrictions_count = value / 10`
   - `mealsPerDay = value / 6`

**Output**: Array de 25-30 números entre 0 y 1

**Dependencias**: Ninguna

**Tests críticos**:
- Todos los valores en rango [0, 1]
- Dimensión fija independiente del input
- Encoding coherente de categorías

---

### **4. vectorizer.ts**

**Rol**: Wrapper para normalización y operaciones vectoriales.

**Exports principales**:
```typescript
export function normalize(vector: number[]): number[]
export function cosineSimilarity(v1: number[], v2: number[]): number
export function weightedCosineSimilarity(
  v1: number[], 
  v2: number[], 
  weights: number[]
): number
export function euclideanDistance(v1: number[], v2: number[]): number
```

**Lógica `weightedCosineSimilarity()`**:
```
Formula:
similarity = (v1 · v2 * weights) / (||v1|| × ||v2||)

Donde weights aplica por categoría:
- indices 0-4: peso 1.0 (físicos)
- indices 5-9: peso 2.0 (objetivo)
- indices 10-19: peso 1.5 (entrenamiento)
- indices 20-29: peso 0.8 (nutrición)
```

**Dependencias**: Ninguna (matemática pura)

**Tests críticos**:
- Vectores idénticos → similarity = 1.0
- Vectores ortogonales → similarity = 0.0
- Weights correctamente aplicados

---

### **5. similarityMatcher.ts**

**Rol**: Buscar planes similares en la base de datos.

**Exports principales**:
```typescript
export async function findSimilar(
  context: UserPlanningContext,
  limit: number = 5
): Promise<CachedPlanMatch[]>

interface CachedPlanMatch {
  planId: string;
  score: number; // 0.0 - 1.0
  plan: CompletePlanningOutput;
  originalContext: UserPlanningContext;
  differences: ContextDifferences;
}

interface ContextDifferences {
  age?: number;
  weight?: number;
  intolerances?: string[];
  // ... otros campos diferentes
}
```

**Flujo lógico**:
1. **Pre-filtro rápido** (query DB):
   - `goalType` = exacto
   - `experienceLevel` = mismo o ±1
   - `timeline` ±2 semanas
   - `dietType` compatible
   → Reduce búsqueda de 10k a ~200 planes

2. **Extracción de vectores**:
   - Vector nuevo: `featureExtractor.extractFeatures(context)`
   - Vectores cached: leer de DB (`feature_vector` column)

3. **Cálculo de similarity**:
   - Para cada plan candidato:
     - Calcular `weightedCosineSimilarity(v_new, v_cached)`
     - Aplicar penalizaciones:
       - `dietType` diferente: -0.15
       - `daysPerWeek` diferente: -0.10
       - `hasCompetition` diferente: -0.20
       - `intolerances` conflictivas: -0.30

4. **Filtrado y ranking**:
   - Filtrar scores < 0.75 (threshold mínimo)
   - Ordenar descendente
   - Tomar top 5
   - Calcular `differences` entre contextos

5. **Retornar matches** con metadata

**Dependencias**:
- `featureExtractor`, `vectorizer`, `planRepository`

**Tests críticos**:
- Query de pre-filtro optimizado (usa índices)
- Penalizaciones correctamente aplicadas
- Casos edge: caché vacío, sin matches

---

### **6. planAdapter.ts**

**Rol**: Ajustar un plan cached a un nuevo contexto.

**Exports principales**:
```typescript
export async function adaptPlan(
  cachedPlan: CompletePlanningOutput,
  originalContext: UserPlanningContext,
  newContext: UserPlanningContext
): Promise<AdaptedPlanResult | null>

interface AdaptedPlanResult {
  plan: CompletePlanningOutput;
  adaptations: Adaptation[];
  confidenceScore: number; // 0.0 - 1.0
}

interface Adaptation {
  category: 'training' | 'nutrition' | 'timeline';
  type: 'substitution' | 'scaling' | 'removal' | 'addition';
  description: string;
}
```

**Flujo lógico**:

1. **Análisis de viabilidad**:
   - Comparar contextos campo por campo
   - Clasificar diferencias:
     - `CRITICAL`: No adaptable (ej: vegan → carnivore)
     - `MAJOR`: Requiere ajustes grandes
     - `MINOR`: Ajustes cosméticos
   - Si hay CRITICAL → retornar `null`
   - Si MAJOR > 3 → retornar `null`

2. **Adaptación de ENTRENAMIENTO**:
   - **Si `daysPerWeek` menor**:
     - Consolidar sesiones (merge días cercanos)
     - Mantener volumen total
   - **Si `sessionDuration` diferente**:
     - Ajustar número de ejercicios proporcionalmente
   - **Si `availableEquipment` diferente**:
     - Substituir ejercicios incompatibles
     - Ejemplo: "Barbell Squat" → "Dumbbell Goblet Squat"

3. **Adaptación de NUTRICIÓN**:
   - **Si `weight` diferente**:
     - Recalcular TDEE usando nuevo peso
     - Ajustar calorías target: `new_cal = old_cal * (new_tdee / old_tdee)`
     - Escalar cantidades de ingredientes proporcionalmente
   - **Si `intolerances` adicionales**:
     - Filtrar ingredientes problemáticos
     - Reemplazar con alternativas:
       - "Leche" → "Leche de almendras" (si lactose intolerant)
       - "Pasta de trigo" → "Pasta sin gluten" (si gluten intolerant)
   - **Si `dietType` compatible pero diferente**:
     - Substituir ingredientes principales:
       - Omnivore → Vegetarian: "Pollo" → "Tofu"
       - Vegetarian → Vegan: "Huevos" → "Tofu scramble"

4. **Adaptación de TIMELINE**:
   - **Si `timeline` mayor**:
     - Extender fases proporcionalmente
     - Ejemplo: 8w → 12w: cada fase × 1.5
   - **Si `timeline` menor**:
     - Comprimir fases manteniendo progresión
     - Eliminar semanas de transición

5. **Validación post-adaptación**:
   - Verificar coherencia de macros (±10% del target)
   - Verificar progresión de volumen de entreno
   - Validar que no hay días vacíos
   - Recalcular `weeklyStats`

6. **Metadata de trazabilidad**:
   - Listar todas las adaptaciones realizadas
   - Calcular `confidenceScore` basado en:
     - Número de adaptaciones
     - Tipo de adaptaciones (MINOR > MAJOR)
     - Validaciones pasadas

**Reglas de NO adaptación**:
```typescript
const NON_ADAPTABLE = {
  goalType_different: true,           // lose ≠ gain
  dietType_incompatible: true,        // vegan ≠ carnivore
  experienceLevel_gap: 2,             // beginner ≠ advanced
  weight_difference_kg: 15,
  hasCompetition_different_and_short: // hasCompetition diferente Y timeline < 8w
    (ctx1, ctx2) => ctx1.hasCompetition !== ctx2.hasCompetition && ctx2.timeline < 8
};
```

**Dependencias**:
- `calculateTargetsAndPlanning` (para recalcular macros)
- Catálogo de substituciones de ejercicios (JSON)
- Catálogo de substituciones de ingredientes (JSON)

**Tests críticos**:
- Casos de no adaptación correctamente detectados
- Adaptaciones de macros matemáticamente correctas
- Substituciones coherentes (mantienen tipo de ejercicio)
- Timeline correctamente escalado

---

### **7. cacheManager.ts**

**Rol**: Persistencia y gestión del ciclo de vida de planes.

**Exports principales**:
```typescript
export async function savePlan(
  plan: CompletePlanningOutput,
  context: UserPlanningContext,
  metadata: PlanMetadata
): Promise<string> // Returns planId

export async function findExactMatch(
  exactHash: string
): Promise<CompletePlanningOutput | null>

export async function findSemanticMatches(
  semanticHash: string,
  limit: number
): Promise<CachedPlan[]>

export async function incrementAccessCount(planId: string): Promise<void>
```

**Lógica `savePlan()`**:
1. Generar hashes → `contextHasher`
2. Extraer feature vector → `featureExtractor`
3. Comprimir plan (opcional):
   - `JSON.stringify(plan)`
   - gzip compression
   - Reduce storage ~70%
4. INSERT en `cached_plans`:
   ```sql
   INSERT INTO cached_plans (
     exact_hash,
     semantic_hash,
     feature_vector,
     plan_data,
     context_snapshot,
     source, -- 'ai' | 'adapted'
     user_id,
     created_at
   ) VALUES (...)
   ```
5. Retornar `planId`

**Lógica `findExactMatch()`**:
- Query simple:
  ```sql
  SELECT plan_data 
  FROM cached_plans 
  WHERE exact_hash = $1 
  LIMIT 1
  ```
- Descomprimir si es necesario
- Retornar plan o `null`

**Lógica `findSemanticMatches()`**:
- Query con pre-filtros:
  ```sql
  SELECT id, plan_data, context_snapshot, feature_vector
  FROM cached_plans
  WHERE semantic_hash = $1
    AND (plan_data->>'goalType') = $2
    AND (plan_data->>'experienceLevel') IN ($3, $4)
  ORDER BY access_count DESC
  LIMIT $5
  ```
- Retornar array de planes

**Background job** (ejecutar diario):
- Identificar planes "zombies":
  - `access_count = 0` AND `created_at < 30 días`
  - DELETE
- Identificar duplicados:
  - Agrupar por `exact_hash`
  - Mantener el de mayor `access_count`
  - DELETE duplicados
- Archivar planes antiguos populares:
  - `access_count > 10` AND `created_at > 90 días`
  - MOVE a cold storage (S3 o tabla archive)

**Dependencias**:
- `contextHasher`, `featureExtractor`
- Prisma client
- Librería de compresión (zlib)

**Tests críticos**:
- Compresión/descompresión sin pérdida
- Query de exact match usa índice (EXPLAIN)
- Background job no borra planes en uso

---

### **8. costOptimizer.ts**

**Rol**: Decisiones económicas sobre cuándo usar AI vs caché.

**Exports principales**:
```typescript
export function shouldUseAI(
  context: UserPlanningContext,
  matches: CachedPlanMatch[]
): Decision

interface Decision {
  useAI: boolean;
  reason: string;
  strategy: 'ai' | 'cache_direct' | 'cache_adapted';
  estimatedCostUsd: number;
  fallbackStrategy: 'best_match' | 'second_best' | 'fail';
}
```

**Lógica de decisión** (sistema de puntos):

**Variables de entrada**:
```typescript
const CONFIG = {
  DAILY_AI_LIMIT: 50,
  MONTHLY_BUDGET_USD: 500,
  COST_PER_AI_CALL: 0.15,
  PEAK_HOURS: [[12, 14], [20, 22]], // horarios pico
};
```

**Algoritmo de scoring**:
```typescript
let score = 0; // Empieza neutro

// PASO 1: Restricciones HARD (override todo)
if (aiCallsToday >= CONFIG.DAILY_AI_LIMIT) {
  return { useAI: false, strategy: 'cache_direct', reason: 'Daily limit reached' };
}
if (monthlyCost >= CONFIG.MONTHLY_BUDGET_USD) {
  return { useAI: false, strategy: 'cache_direct', reason: 'Monthly budget exceeded' };
}

// PASO 2: Ajustes por usuario
if (user.tier === 'premium') score += 30;
if (user.tier === 'free') score += 0;
if (user.isFirstPlan) score += 20;

// PASO 3: Ajustes por calidad de match
if (bestMatch.score > 0.95) score -= 40; // Cache excelente
if (bestMatch.score > 0.85) score -= 20;
if (bestMatch.score > 0.75) score -= 10;
if (bestMatch.score < 0.75) score += 30; // Cache dudoso

// PASO 4: Ajustes por complejidad
if (context.hasCompetition) score += 15;
if (context.intolerances.length > 2) score += 10;
if (context.excludedFoods.length > 5) score += 10;
if (context.experienceLevel === 'advanced') score += 10;

// PASO 5: Ajustes por estado del caché
if (totalCachedPlans < 100) score += 25; // Necesitamos más datos
if (semanticMatches.length < 5) score += 15;
if (hoursSinceLastAI > 6) score += 10; // Diversidad

// PASO 6: Ajustes por horario
if (isPeakHour()) score -= 15; // Preferir caché en pico

// DECISIÓN FINAL
if (score > 50) return { useAI: true, strategy: 'ai', ... };
if (score > 20) return { useAI: false, strategy: 'cache_adapted', ... };
return { useAI: false, strategy: 'cache_direct', ... };
```

**Dependencias**:
- `planRepository` (para stats de caché)
- Config central

**Tests críticos**:
- Límites hard siempre respetados
- Usuario premium favorecido sobre free
- Horarios pico correctamente detectados

---

### **9. aiGenerator.ts**

**Rol**: Wrapper del generador actual de Claude API.

**Exports principales**:
```typescript
export async function generateWithAI(
  context: UserPlanningContext
): Promise<AIGenerationResult>

interface AIGenerationResult {
  plan: CompletePlanningOutput;
  metadata: {
    tokensUsed: number;
    costUsd: number;
    durationMs: number;
    model: string;
  };
}
```

**Lógica**:
1. Preparar llamada a Claude (como ya existe)
2. Trackear tiempo de inicio
3. Ejecutar `generateCompletePlan(context)` → **función existente**
4. Trackear tiempo de fin
5. Estimar costo:
   - `cost = (tokens / 1000) * MODEL_COST_PER_1K`
6. Retornar plan + metadata

**Manejo de errores**:
```typescript
try {
  const plan = await generateCompletePlan(context);
  return { plan, metadata };
} catch (error) {
  if (error.code === 'rate_limit') {
    throw new AIRateLimitError();
  }
  if (error.code === 'timeout') {
    throw new AITimeoutError();
  }
  throw new AIGenerationError(error);
}
```

**Dependencias**:
- `src/lib/ai/generateCompletePlan.ts` (YA EXISTE - wrapper)

**Tests críticos**:
- Retry logic en caso de rate limit
- Timeout después de 90s
- Metadata correctamente calculado

---

### **10. planRepository.ts**

**Rol**: Capa de acceso a datos (abstracción de Prisma).

**Exports principales**:
```typescript
export async function insertCachedPlan(data: CachedPlanInsert): Promise<string>
export async function findByExactHash(hash: string): Promise<CachedPlan | null>
export async function findBySemanticHash(hash: string, limit: number): Promise<CachedPlan[]>
export async function updateAccessCount(planId: string): Promise<void>
export async function getCacheStats(): Promise<CacheStats>
export async function deleteOldPlans(olderThanDays: number): Promise<number>
```

**Lógica `getCacheStats()`**:
```sql
SELECT 
  COUNT(*) as total_plans,
  COUNT(DISTINCT semantic_hash) as unique_archetypes,
  AVG(access_count) as avg_access_count,
  SUM(CASE WHEN source = 'ai' THEN 1 ELSE 0 END) as ai_generated,
  SUM(CASE WHEN source = 'adapted' THEN 1 ELSE 0 END) as adapted
FROM cached_plans
WHERE created_at > NOW() - INTERVAL '30 days'
```

**Dependencias**:
- Prisma client

**Tests críticos**:
- Queries usan índices (verificar con EXPLAIN)
- Transactions para operaciones críticas
- Connection pooling configurado

---

### **11. analyticsLogger.ts**

**Rol**: Registrar todas las decisiones para análisis.

**Exports principales**:
```typescript
export async function logPlanGeneration(event: PlanGenerationEvent): Promise<void>
export async function logCachePerformance(stats: CachePerformanceStats): Promise<void>
export async function getWeeklyReport(): Promise<WeeklyReport>
```

**Estructura `PlanGenerationEvent`**:
```typescript
interface PlanGenerationEvent {
  userId: string;
  decision: 'ai' | 'cache_exact' | 'cache_adapted';
  similarityScore?: number;
  reasons: string[];
  responseTimeMs: number;
  costUsd: number;
  success: boolean;
  errorMessage?: string;
  timestamp: Date;
}
```

**Lógica `logPlanGeneration()`**:
```sql
INSERT INTO plan_generation_log (
  user_id,
  decision,
  similarity_score,
  decision_reasons, -- JSONB array
  response_time_ms,
  estimated_cost_usd,
  success,
  created_at
) VALUES (...)
```

**Lógica `getWeeklyReport()`**:
- Agregar datos de última semana:
  - Total requests
  - AI percentage
  - Cache hit rate
  - Avg similarity score
  - Total cost
  - Cost saved (vs 100% AI)
- Calcular KPIs:
  - `cache_hit_rate = cache_hits / total_requests`
  - `cost_savings = (potential_cost - actual_cost) / potential_cost`

**Dependencias**:
- Prisma client
- Config de costos

**Tests críticos**:
- Logs asíncronos (no bloquean flujo principal)
- Agregaciones correctas en reports

---

### **12. cacheConfig.ts**

**Rol**: Configuración centralizada del sistema.

**Exports principales**:
```typescript
export const CACHE_CONFIG = {
  // Similarity thresholds
  SIMILARITY_THRESHOLD_HIGH: 0.90,
  SIMILARITY_THRESHOLD_MEDIUM: 0.80,
  SIMILARITY_THRESHOLD_LOW: 0.75,
  
  // Cost limits
  DAILY_AI_LIMIT: 50,
  MONTHLY_BUDGET_USD: 500,
  COST_PER_GENERATION_USD: 0.15,
  COST_PER_1K_TOKENS: 0.003,
  
  // Cache strategy
  PREFETCH_TOP_ARCHETYPES: true,
  ARCHETYPE_THRESHOLD: 10,
  CACHE_TTL_DAYS: 90,
  COMPRESSION_ENABLED: true,
  
  // Feature weights (para similarity)
  FEATURE_WEIGHTS: {
    objective: 2.0,
    training: 1.5,
    biometrics: 1.0,
    nutrition: 0.8,
  },
  
  // Bucketing
  AGE_BUCKETS: [18, 26, 36, 46, 56, 100],
  WEIGHT_BUCKET_SIZE_KG: 5,
  TIMELINE_BUCKETS: [4, 9, 13, 17],
  
  // Peak hours (24h format)
  PEAK_HOURS: [[12, 14], [20, 22]],
};

export const MODEL_CONFIG = {
  CLAUDE_MODEL: 'claude-sonnet-4-20250514',
  MAX_TOKENS: 8000,
  TEMPERATURE: 0.7,
  TIMEOUT_MS: 90000,
};
```

**Dependencias**: Ninguna

---

## 🗄️ Cambios en Base de Datos

### **Nueva Tabla: `cached_plans`**

```sql
CREATE TABLE cached_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Hashing e identificación
  exact_hash VARCHAR(64) UNIQUE NOT NULL,
  semantic_hash VARCHAR(255) NOT NULL,
  feature_vector FLOAT[] NOT NULL, -- Array de 25-30 floats
  
  -- Plan data (comprimido opcional)
  plan_data JSONB NOT NULL,         -- CompletePlanningOutput
  context_snapshot JSONB NOT NULL,  -- UserPlanningContext original
  
  -- Metadata
  source VARCHAR(20) NOT NULL,      -- 'ai' | 'adapted'
  original_plan_id UUID REFERENCES cached_plans(id), -- si adapted
  user_id VARCHAR(255) NOT NULL,
  version VARCHAR(10) DEFAULT '1.0.0',
  
  -- Analytics
  access_count INTEGER DEFAULT 0,
  adaptation_count INTEGER DEFAULT 0,
  success_rate FLOAT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  
  -- Índices
  INDEX idx_exact_hash (exact_hash),
  INDEX idx_semantic_hash (semantic_hash),
  INDEX idx_feature_vector USING GIN (feature_vector),
  INDEX idx_composite (
    (plan_data->>'goalType'),
    (plan_data->>'experienceLevel'),
    (plan_data->>'dietType')
  ),
  INDEX idx_created (created_at DESC)
);
```

### **Nueva Tabla: `plan_generation_log`**

```sql
CREATE TABLE plan_generation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  
  -- Decisión tomada
  decision VARCHAR(20) NOT NULL,    -- 'ai' | 'cache_exact' | 'cache_adapted'
  cached_plan_id UUID REFERENCES cached_plans(id),
  similarity_score FLOAT,
  
  -- Razones y costos
  decision_reasons JSONB,           -- Array de strings
  estimated_cost_usd FLOAT,
  actual_cost_usd FLOAT,
  
  -- Performance
  response_time_ms INTEGER,
  success BOOLEAN,
  error_message TEXT,
  
  -- Context
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Índices
  INDEX idx_user_created (user_id, created_at),
  INDEX idx_decision (decision),
  INDEX idx_created (created_at DESC)
);
```

---

## 🔄 Modificación de Archivo Existente

### **`src/app/api/planning/init/route.ts`**

**Cambio principal**: Reemplazar llamada directa a `generateCompletePlan()` por `orchestrator.generatePlan()`

**ANTES**:
```typescript
// Paso 6: Generación AI (única vez)
const aiPlan = await generateCompletePlan(context);
```

**DESPUÉS**:
```typescript
// Paso 6: Generación inteligente (AI o Caché)
const { plan: aiPlan, source, metadata } = await orchestrator.generatePlan(context);

// Guardar metadata adicional
await prisma.onboardingData.update({
  where: { userId },
  data: {
    planSource: source, // 'ai' | 'cache_exact' | 'cache_adapted'
    planGenerationMetadata: metadata as Prisma.JsonObject,
  },
});
```

**Agregar al schema Prisma** (`OnboardingData` model):
```prisma
model OnboardingData {
  // ... campos existentes
  
  planSource String? // 'ai' | 'cache_exact' | 'cache_adapted'
  planGenerationMetadata Json? // Metadata del orchestrator
}
```

---

## 🚀 Plan de Implementación Sugerido

### **Fase 1: Foundation (Semana 1-2)**
**Objetivo**: Setup base sin romper nada

- [ ] Crear estructura de archivos
- [ ] Implementar `contextHasher.ts`
- [ ] Implementar `featureExtractor.ts`
- [ ] Implementar `vectorizer.ts`
- [ ] Crear migraciones de DB:
  - `cached_plans` table
  - `plan_generation_log` table
- [ ] Tests unitarios de hashing y features

**Validación**: Todos los tests pasan, DB migrada

---

### **Fase 2: Storage Layer (Semana 3)**
**Objetivo**: Persistir planes sin usarlos aún

- [ ] Implementar `planRepository.ts`
- [ ] Implementar `cacheManager.ts` (solo `savePlan`)
- [ ] Modificar `/api/planning/init` para:
  - Guardar planes generados en `cached_plans`
  - NO cambiar lógica de generación aún
- [ ] Tests de integración con DB

**Validación**: Cada plan generado se guarda automáticamente

---

### **Fase 3: Matching Engine (Semana 4-5)**
**Objetivo**: Buscar similares (sin usar aún)

- [ ] Implementar `similarityMatcher.ts`
- [ ] Implementar `cacheManager.findSemanticMatches()`
- [ ] Crear endpoint de testing:
  - `/api/planning/test-similarity`
  - Input: `UserPlanningContext`
  - Output: Top 5 matches con scores
- [ ] Validar con datos reales acumulados

**Validación**: Endpoint retorna matches coherentes

---

### **Fase 4: Adaptation (Semana 6)**
**Objetivo**: Adaptar planes

- [ ] Implementar `planAdapter.ts`
- [ ] Crear catálogos de substituciones:
  - `exercise-substitutions.json`
  - `ingredient-substitutions.json`
- [ ] Crear endpoint de testing:
  - `/api/planning/test-adaptation`
  - Input: `cachedPlanId` + `newContext`
  - Output: Plan adaptado o error
- [ ] Tests con casos reales

**Validación**: Adaptaciones son coherentes y válidas

---

### **Fase 5: Orchestration (Semana 7)**
**Objetivo**: Unir todo

- [ ] Implementar `costOptimizer.ts`
- [ ] Implementar `aiGenerator.ts` (wrapper)
- [ ] Implementar `orchestrator.ts`
- [ ] Implementar `analyticsLogger.ts`
- [ ] Modificar `/api/planning/init` para usar orchestrator
- [ ] Feature flag: `USE_CACHE_SYSTEM=false` (default)

**Validación**: Sistema funciona end-to-end con flag

---

### **Fase 6: Testing & Rollout (Semana 8-9)**
**Objetivo**: Activar gradualmente

- [ ] A/B Testing:
  - Grupo A: 100% AI (control)
  - Grupo B: Orchestrator activo
- [ ] Monitorear métricas:
  - Cache hit rate
  - User satisfaction (ambos grupos)
  - Cost savings
- [ ] Ajustar thresholds según datos reales
- [ ] Rollout gradual: 10% → 50% → 100%

**Validación**: Métricas de Grupo B ≥ Grupo A

---

### **Fase 7: Optimization (Semana 10+)**
**Objetivo**: Maximizar eficiencia

- [ ] Identificar arquetipos frecuentes
- [ ] Pre-generar planes para top 10 arquetipos
- [ ] Implementar background job de limpieza
- [ ] Crear dashboard de analytics
- [ ] Optimización de queries DB
- [ ] Considerar vector database (Pinecone) si es necesario

**Validación**: Cache hit rate > 70%, cost < $100/mes

---

## 📊 Métricas de Éxito

### **KPIs Críticos**

| Métrica | Target Mes 3 | Target Mes 6 |
|---------|--------------|--------------|
| Cache Hit Rate | 40% | 70% |
| AI Calls Reduction | -40% | -80% |
| Cost per Plan | $0.09 | $0.03 |
| Monthly Cost | $300 | <$100 |
| User Satisfaction | ≥ 4.3/5 | ≥ 4.4/5 |
| Plan Completion Rate | ≥ 65% | ≥ 70% |
| Avg Response Time | <5s | <2s |

### **Dashboard Queries**

```sql
-- Cache efficiency (últimos 7 días)
SELECT 
  decision,
  COUNT(*) as count,
  AVG(response_time_ms) as avg_time,
  AVG(actual_cost_usd) as avg_cost
FROM plan_generation_log
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY decision;

-- Top archetypos sin caché
SELECT 
  (context_snapshot->>'goalType') as goal,
  (context_snapshot->>'experienceLevel') as level,
  (context_snapshot->>'dietType') as diet,
  COUNT(*) as frequency
FROM plan_generation_log
WHERE decision = 'ai'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY goal, level, diet
ORDER BY frequency DESC
LIMIT 20;

-- Cost savings vs 100% AI
SELECT 
  SUM(CASE WHEN decision = 'ai' THEN actual_cost_usd ELSE 0.15 END) as potential_cost,
  SUM(actual_cost_usd) as actual_cost,
  (1 - SUM(actual_cost_usd) / SUM(CASE WHEN decision = 'ai' THEN actual_cost_usd ELSE 0.15 END)) * 100 as savings_pct
FROM plan_generation_log
WHERE created_at > NOW() - INTERVAL '30 days';
```

---

## 🧪 Tests Esenciales

### **Unit Tests** (Jest)

```typescript
// contextHasher.test.ts
describe('contextHasher', () => {
  test('generateExactHash is deterministic', () => {
    const hash1 = generateExactHash(mockContext);
    const hash2 = generateExactHash(mockContext);
    expect(hash1).toBe(hash2);
  });
  
  test('different contexts produce different exact hashes', () => {
    const hash1 = generateExactHash(context1);
    const hash2 = generateExactHash(context2);
    expect(hash1).not.toBe(hash2);
  });
  
  test('semantic hash bucketizes correctly', () => {
    const ctx1 = { ...mockContext, age: 27 };
    const ctx2 = { ...mockContext, age: 29 };
    expect(generateSemanticHash(ctx1)).toBe(generateSemanticHash(ctx2));
  });
});

// similarityMatcher.test.ts
describe('similarityMatcher', () => {
  test('identical contexts score 1.0', async () => {
    const matches = await findSimilar(mockContext);
    expect(matches[0].score).toBeCloseTo(1.0, 2);
  });
  
  test('filters incompatible diet types', async () => {
    const veganContext = { ...mockContext, dietType: 'vegan' };
    const matches = await findSimilar(veganContext);
    expect(matches.every(m => m.originalContext.dietType === 'vegan')).toBe(true);
  });
});

// planAdapter.test.ts
describe('planAdapter', () => {
  test('returns null for critical differences', async () => {
    const veganContext = { ...originalContext, dietType: 'vegan' };
    const carnivoreContext = { ...originalContext, dietType: 'carnivore' };
    const result = await adaptPlan(cachedPlan, veganContext, carnivoreContext);
    expect(result).toBeNull();
  });
  
  test('adapts calories proportionally to weight change', async () => {
    const newContext = { ...originalContext, weight: 80 }; // +5kg
    const result = await adaptPlan(cachedPlan, originalContext, newContext);
    expect(result.plan.weeks[0].days[0].nutrition.targetCalories).toBeGreaterThan(
      cachedPlan.weeks[0].days[0].nutrition.targetCalories
    );
  });
});
```

### **Integration Tests**

```typescript
// orchestrator.integration.test.ts
describe('orchestrator integration', () => {
  beforeAll(async () => {
    await seedTestDatabase();
  });
  
  test('uses cache for identical context', async () => {
    const result1 = await generatePlan(mockContext);
    const result2 = await generatePlan(mockContext);
    
    expect(result1.source).toBe('ai');
    expect(result2.source).toBe('cache_exact');
    expect(result2.metadata.responseTimeMs).toBeLessThan(500);
  });
  
  test('adapts for similar context', async () => {
    const context1 = { ...mockContext, weight: 75 };
    const context2 = { ...mockContext, weight: 78 };
    
    await generatePlan(context1);
    const result = await generatePlan(context2);
    
    expect(result.source).toBe('cache_adapted');
    expect(result.metadata.similarityScore).toBeGreaterThan(0.85);
  });
  
  test('respects daily AI limit', async () => {
    // Mock 50 AI calls today
    for (let i = 0; i < 50; i++) {
      await mockAICall();
    }
    
    const result = await generatePlan(uniqueContext);
    expect(result.source).not.toBe('ai');
  });
});
```

---

## 🔒 Consideraciones de Seguridad

1. **Isolación de datos**:
   - `cached_plans.user_id` debe ser del usuario que generó el plan
   - NO permitir acceso directo a planes de otros usuarios
   - En `findSimilar()`, retornar solo el plan, NO info personal del usuario original

2. **Rate limiting**:
   - Límite de búsquedas de caché por usuario: 100/hora
   - Límite de generaciones (AI o cache): 10/hora por usuario free

3. **Validación de inputs**:
   - Validar `UserPlanningContext` antes de buscar en caché
   - Sanitizar inputs antes de queries DB

4. **Secrets**:
   - `CLAUDE_API_KEY` en variables de entorno
   - DB credentials en secrets manager

---

## 📚 Recursos Adicionales

### **Documentación a consultar**:
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
- [Feature Scaling](https://scikit-learn.org/stable/modules/preprocessing.html#standardization-or-mean-removal-and-variance-scaling)
- [PostgreSQL GIN Indexes](https://www.postgresql.org/docs/current/gin.html)
- [Claude API Rate Limits](https://docs.anthropic.com/claude/reference/rate-limits)

### **Librerías útiles**:
- `zlib` o `pako`: Compresión de planes
- `crypto`: Hashing (built-in Node.js)
- `jest`: Testing
- `@prisma/client`: ORM

---

## ❓ FAQ para el Desarrollador

**P: ¿Qué pasa si `similarityMatcher` no encuentra ningún match?**
R: El `orchestrator` automáticamente fallback a AI generation. El threshold mínimo es 0.75, si todos los scores son < 0.75, se considera "sin match".

**P: ¿Cómo manejo el caso de que la AI falle (timeout, rate limit)?**
R: El `aiGenerator` lanza excepciones específicas (`AIRateLimitError`, `AITimeoutError`). El `orchestrator` las captura y:
1. Intenta usar el mejor cached match disponible (aunque score < 0.75)
2. Si no hay caché, retorna error al usuario con mensaje claro

**P: ¿Puedo testear el sistema sin consumir créditos de Claude?**
R: Sí. En `aiGenerator.ts`, detectar `NODE_ENV=test` y retornar mock data en lugar de llamar a Claude API.

**P: ¿Cómo debuggeo por qué eligió AI vs Cache?**
R: Revisar `plan_generation_log.decision_reasons` (JSONB). Contiene array de razones como:
```json
["similarity_score_low: 0.72", "user_is_premium: +30", "cache_cold: +25", "total_score: 55"]
```

**P: ¿Qué hago si los usuarios se quejan de planes repetitivos?**
R: Ajustar thresholds en `cacheConfig.ts`:
- Subir `SIMILARITY_THRESHOLD_MEDIUM` de 0.80 → 0.85
- O ajustar weights en `FEATURE_WEIGHTS` para priorizar más la personalización

**P: ¿Cómo pre-genero planes para arquetipos populares?**
R: Crear script (`scripts/seed-archetypes.ts`):
1. Query top 10 combinaciones de `goalType|level|diet` en logs
2. Para cada combinación, crear contexto sintético
3. Llamar a `orchestrator.generatePlan()` con `forceAI: true`
4. Ejecutar como cron job semanal

---

## ✅ Checklist de Entrega

Antes de considerar completada la implementación:

- [ ] Todos los tests unitarios pasan (coverage > 80%)
- [ ] Tests de integración pasan
- [ ] Migraciones de DB ejecutadas en staging
- [ ] Feature flag `USE_CACHE_SYSTEM` implementado
- [ ] Dashboard de métricas funcional
- [ ] Documentación de APIs actualizada
- [ ] Logs estructurados implementados
- [ ] Error tracking configurado (Sentry)
- [ ] Performance profiling realizado
- [ ] A/B test setup listo

---

## 📞 Contacto para Dudas

**Durante implementación**, si hay dudas sobre:
- **Decisiones de arquitectura**: Contactar a Max
- **Lógica de adaptación de planes**: Consultar con equipo de producto
- **Optimización de DB**: Consultar con DBA si disponible

**Progreso sugerido**: Updates diarios en Slack con:
- Archivos completados
- Tests pasando
- Blockers o decisiones pendientes

---

## 🎯 Resultado Esperado

Al completar esta implementación:

1. **Para usuarios**: Experiencia idéntica o mejor (planes de calidad igual/superior, respuesta más rápida)
2. **Para el negocio**: Reducción de costos del 80% en 6 meses (~$400/mes ahorrados)
3. **Para desarrollo**: Base sólida para futuras optimizaciones (arquetipos, ML, etc.)

**Tiempo estimado total**: 8-10 semanas
**Prioridad**: Alta (ROI 840%)

---

*Documento v1.0 - Última actualización: 2026-01-04*
