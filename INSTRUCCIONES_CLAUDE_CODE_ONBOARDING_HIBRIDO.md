# 📋 Instrucciones para Claude Code: Onboarding Híbrido con Sistema de Notificaciones

## 🎯 Contexto General

El proyecto ya tiene implementado un onboarding de 6 pasos completo (step-1 a step-6) y una página welcome. Ahora vamos a adaptarlo para funcionar en modo "híbrido":

1. **Onboarding básico inicial** (3 pasos rápidos) que genera un plan básico
2. **Sistema de notificaciones** que alerta al usuario para completar módulos opcionales
3. **Modal de completado** donde el usuario completa los steps pendientes (4, 5)
4. **Regeneración del plan** con nueva fecha de inicio desde el día actual

---

## 📁 Archivos Existentes a REUTILIZAR

### Onboarding Steps (YA EXISTEN - NO CREAR DE NUEVO)
```
/src/app/onboarding/
├── welcome/page.tsx          ✅ Ya existe - MODIFICAR
├── step-1-biometrics/page.tsx   ✅ Ya existe - REUTILIZAR sin cambios
├── step-2-objective/page.tsx    ✅ Ya existe - REUTILIZAR sin cambios
├── step-3-activity/page.tsx     ✅ Ya existe - REUTILIZAR sin cambios
├── step-4-training/page.tsx     ✅ Ya existe - REUTILIZAR en modal
├── step-5-diet/page.tsx         ✅ Ya existe - REUTILIZAR en modal
└── step-6-macros/page.tsx       ✅ Ya existe - MODIFICAR
```

### Store (YA EXISTE - NO REESCRIBIR)
```
/src/store/onboarding.ts      ✅ Ya existe - EXTENDER
```

### Tipos (YA EXISTEN)
```
/src/types/onboarding.d.ts    ✅ Ya existe - AGREGAR tipos nuevos
```

### Schema Prisma (YA EXISTE)
```
/prisma/schema.prisma         ✅ Ya existe - AGREGAR campos nuevos
```

**IMPORTANTE:** El modelo `Notification` YA EXISTE en el schema. Solo necesitas agregar campos al modelo `OnboardingData`.

---

## 🔧 Modificaciones Necesarias

### 1. Modificar `/prisma/schema.prisma`

**Ubicación:** Modelo `OnboardingData` (ya existe)

**AGREGAR estos campos al modelo existente:**

```prisma
model OnboardingData {
  // ... campos existentes (NO BORRAR)
  
  // AGREGAR ESTOS CAMPOS:
  onboardingType      String   @default("basic")  // "basic" | "complete"
  completedModules    String?                      // JSON: { trainingDetailed: bool, nutritionDetailed: bool }
  pendingRegeneration Boolean  @default(false)
  
  // ... resto de campos existentes
}
```

**NO modificar** el resto del modelo ni otros modelos. Solo AGREGAR estos 3 campos.

### 2. Modificar `/src/store/onboarding.ts`

**AGREGAR al interface `OnboardingStore` existente:**

```typescript
interface OnboardingStore {
  // ... propiedades existentes (NO BORRAR)
  
  // AGREGAR ESTAS PROPIEDADES:
  onboardingType: 'basic' | 'complete' | null;
  completedModules: {
    trainingDetailed: boolean;
    nutritionDetailed: boolean;
  };
  
  // AGREGAR ESTAS ACCIONES:
  setOnboardingType: (type: 'basic' | 'complete') => void;
  markModuleComplete: (module: 'training' | 'nutrition') => void;
  resetModules: () => void;
}
```

**AGREGAR en el objeto `create`:**

```typescript
export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // ... estado existente
      
      // AGREGAR ESTADO INICIAL:
      onboardingType: null,
      completedModules: {
        trainingDetailed: false,
        nutritionDetailed: false,
      },
      
      // ... acciones existentes
      
      // AGREGAR ACCIONES:
      setOnboardingType: (type) => 
        set({ onboardingType: type }),
      
      markModuleComplete: (module) =>
        set((state) => ({
          completedModules: {
            ...state.completedModules,
            [`${module}Detailed`]: true,
          },
        })),
      
      resetModules: () =>
        set({
          completedModules: {
            trainingDetailed: false,
            nutritionDetailed: false,
          },
        }),
    }),
    {
      name: 'onboarding-storage',
      // NO CAMBIAR la configuración de persistencia
    }
  )
);
```

### 3. Modificar `/src/app/onboarding/welcome/page.tsx`

**CAMBIOS NECESARIOS:**

1. **Agregar tracking de tipo de onboarding:**

```typescript
const { setOnboardingType } = useOnboardingStore();

const handleStartBasic = () => {
  setOnboardingType('basic');
  router.push('/onboarding/step-1-biometrics');
};

const handleStartComplete = () => {
  setOnboardingType('complete');
  router.push('/onboarding/step-1-biometrics');
};
```

2. **Modificar UI para mostrar 2 opciones:**

```tsx
<div className="grid md:grid-cols-2 gap-6">
  {/* Opción 1: Onboarding Básico (RECOMENDADO) */}
  <div className="border-2 border-emerald-500 rounded-2xl p-6">
    <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
      ⭐ RECOMENDADO
    </div>
    <h3 className="text-xl font-bold mb-2">Plan Rápido</h3>
    <p className="text-slate-400 text-sm mb-4">
      Empieza en 3 minutos. Completa tu perfil después desde el dashboard.
    </p>
    <ul className="space-y-2 mb-6 text-sm text-slate-300">
      <li>✓ Solo 3 pasos</li>
      <li>✓ Plan básico inmediato</li>
      <li>✓ Expande cuando quieras</li>
    </ul>
    <button
      onClick={handleStartBasic}
      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-full font-bold"
    >
      Empezar Plan Rápido
    </button>
  </div>

  {/* Opción 2: Onboarding Completo */}
  <div className="border border-slate-700 rounded-2xl p-6">
    <h3 className="text-xl font-bold mb-2">Plan Completo</h3>
    <p className="text-slate-400 text-sm mb-4">
      Completa todos los detalles ahora para máxima personalización.
    </p>
    <ul className="space-y-2 mb-6 text-sm text-slate-300">
      <li>✓ 6 pasos detallados</li>
      <li>✓ Plan ultra-personalizado</li>
      <li>✓ Todo configurado desde el inicio</li>
    </ul>
    <button
      onClick={handleStartComplete}
      className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-full font-bold"
    >
      Empezar Plan Completo
    </button>
  </div>
</div>
```

### 4. Modificar `/src/app/onboarding/step-6-macros/page.tsx`

**CAMBIOS NECESARIOS:**

1. **Condicionar navegación según tipo de onboarding:**

```typescript
const { onboardingType } = useOnboardingStore();

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  // Determinar si es onboarding básico o completo
  const isBasic = onboardingType === 'basic';
  const endpoint = isBasic 
    ? '/api/planning/generate-basic'
    : '/api/planning/init';
  
  const payload = isBasic
    ? buildBasicPayload()   // Solo steps 1-3 + startDate
    : buildCompletePayload(); // Todos los steps + startDate
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (response.ok) {
    // Crear notificación si es básico
    if (isBasic) {
      await fetch('/api/notifications/create', {
        method: 'POST',
        body: JSON.stringify({
          type: 'complete_profile',
          message: 'Completa tu perfil para un plan más personalizado',
        }),
      });
    }
    
    router.push('/dashboard');
  }
};

// Helper para payload básico
const buildBasicPayload = () => {
  const { biometrics, goal, activity } = useOnboardingStore.getState();
  return {
    biometrics,
    objective: goal,
    activity,
    startDate: formData.startDate,
  };
};

// Helper para payload completo
const buildCompletePayload = () => {
  const store = useOnboardingStore.getState();
  return {
    biometrics: store.biometrics,
    objective: store.goal,
    activity: store.activity,
    training: store.training,
    lifestyle: store.lifestyle,
    diet: store.diet,
    startDate: formData.startDate,
  };
};
```

2. **Modificar navegación de steps:**

```typescript
// En step 3, condicionar hacia dónde va
const handleNextFromStep3 = () => {
  const { onboardingType } = useOnboardingStore();
  
  if (onboardingType === 'basic') {
    router.push('/onboarding/step-6-macros'); // Skip steps 4 y 5
  } else {
    router.push('/onboarding/step-4-training'); // Flujo completo normal
  }
};
```

---

## 📦 Archivos NUEVOS a CREAR

### 1. Sistema de Notificaciones en Dashboard

#### A. Crear `/src/components/dashboard/NotificationBell.tsx`

**Ubicación:** Integrar en el Header del dashboard (archivo existente en `/src/components/ui/layout/dashboard/HeaderBar.tsx`)

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const fetchNotifications = async () => {
      const res = await fetch('/api/notifications/list');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    };

    fetchNotifications();
    
    // Poll cada 60 segundos
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  const handleMarkAsRead = async (notificationId: string) => {
    await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
    
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleOpenCompleteProfile = () => {
    // Abrir modal de completar perfil
    const event = new CustomEvent('open-complete-profile-modal');
    window.dispatchEvent(event);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-emerald-400 transition-colors"
      >
        <Bell className="w-6 h-6" />
        
        {/* Badge de notificaciones no leídas */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Notificaciones</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                No tienes notificaciones
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-emerald-900/10' : ''
                  }`}
                  onClick={() => {
                    handleMarkAsRead(notification.id);
                    if (notification.type === 'complete_profile') {
                      handleOpenCompleteProfile();
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    )}
                    <div className="flex-grow">
                      <p className="text-sm text-white mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

**INSTRUCCIÓN ESPECÍFICA:** Integra este componente en el Header del dashboard modificando el archivo existente `/src/components/ui/layout/dashboard/HeaderBar.tsx`. Agrégalo junto a otros iconos del header (perfil, settings, etc).

#### B. Crear `/src/components/dashboard/CompleteProfileModal.tsx`

**Modal que muestra steps 4 y 5 para completar:**

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboarding';

// IMPORTANTE: Importar los componentes de steps existentes
// Reutilizaremos su lógica pero dentro del modal
import Step4Training from '@/app/onboarding/step-4-training/page';
import Step5Diet from '@/app/onboarding/step-5-diet/page';

export default function CompleteProfileModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModalStep, setCurrentModalStep] = useState<'training' | 'diet' | 'date'>('training');
  const [startDate, setStartDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { markModuleComplete, training, diet } = useOnboardingStore();

  // Escuchar evento para abrir modal
  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open-complete-profile-modal', handleOpenModal);
    return () => window.removeEventListener('open-complete-profile-modal', handleOpenModal);
  }, []);

  const handleTrainingComplete = () => {
    markModuleComplete('training');
    setCurrentModalStep('diet');
  };

  const handleDietComplete = () => {
    markModuleComplete('nutrition');
    setCurrentModalStep('date');
  };

  const handleRegeneratePlan = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/planning/regenerate-personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleCompleted: 'BOTH',
          regenerateFrom: 'TODAY',
          trainingDetailed: training,
          nutritionDetailed: diet,
          newStartDate: startDate,
        }),
      });

      if (response.ok) {
        // Cerrar modal y refrescar dashboard
        setIsOpen(false);
        router.refresh();
        
        // Mostrar notificación de éxito
        // (puedes usar react-hot-toast o similar)
      } else {
        throw new Error('Error regenerando plan');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error regenerando tu plan. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Personaliza tu Plan
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Completa los detalles para un plan ultra-personalizado
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            {['Entrenamiento', 'Nutrición', 'Fecha inicio'].map((label, idx) => (
              <div
                key={label}
                className={`flex items-center gap-2 ${
                  idx <= ['training', 'diet', 'date'].indexOf(currentModalStep)
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  idx < ['training', 'diet', 'date'].indexOf(currentModalStep)
                    ? 'bg-emerald-500 border-emerald-500'
                    : idx === ['training', 'diet', 'date'].indexOf(currentModalStep)
                    ? 'border-emerald-400'
                    : 'border-slate-700'
                }`}>
                  {idx < ['training', 'diet', 'date'].indexOf(currentModalStep) ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{label}</span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
              style={{
                width: `${
                  currentModalStep === 'training' ? 33 :
                  currentModalStep === 'diet' ? 66 : 100
                }%`
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentModalStep === 'training' && (
            <div>
              {/* REUTILIZAR componente Step4Training existente */}
              {/* Extraer solo el formulario, sin wrapper de página */}
              <Step4Training />
              
              <button
                onClick={handleTrainingComplete}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2"
              >
                Continuar a Nutrición
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {currentModalStep === 'diet' && (
            <div>
              {/* REUTILIZAR componente Step5Diet existente */}
              <Step5Diet />
              
              <button
                onClick={handleDietComplete}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2"
              >
                Continuar a Fecha de Inicio
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {currentModalStep === 'date' && (
            <div className="space-y-6">
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6">
                <h3 className="font-bold text-white mb-2">
                  ✅ Perfil Completado
                </h3>
                <p className="text-slate-300 text-sm">
                  Ahora vamos a regenerar tu plan con toda la información detallada.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ¿Cuándo quieres empezar tu nuevo plan personalizado?
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  required
                />
                <p className="text-xs text-slate-400 mt-2">
                  Tu plan actual continuará hasta esta fecha
                </p>
              </div>

              <button
                onClick={handleRegeneratePlan}
                disabled={!startDate || isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Regenerando plan...
                  </span>
                ) : (
                  'Regenerar Mi Plan Personalizado'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**IMPORTANTE:** Este modal reutiliza los componentes de Step4 y Step5 existentes. NO COPIES todo el código de esos steps, simplemente IMPÓRTALOS y úsalos dentro del modal.

### 2. API Endpoints

#### A. Crear `/src/app/api/planning/generate-basic/route.ts`

**Endpoint para generar plan básico (solo con steps 1-3):**

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateBasicPlan } from '@/lib/ai/generateBasicPlan';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { biometrics, objective, activity, startDate } = body;

    // Validaciones básicas
    if (!biometrics || !objective || !activity || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Construir contexto básico
    const basicContext = {
      meta: {
        userId: session.user.id,
        version: '1.0-basic',
        createdAt: new Date().toISOString(),
        locale: 'es',
      },
      biometrics,
      objective,
      activity,
      planning: {
        startDate,
        duration: 12, // semanas
        trainingDefaults: {
          type: 'FULL_BODY',
          frequency: activity.currentlyTraining === 'YES' ? 
            parseInt(activity.trainingFrequencyBasic?.split('-')[0] || '3') : 
            3,
          duration: 60,
        },
        nutritionDefaults: {
          mealsPerDay: 3,
          dietType: 'OMNIVORE',
          restrictions: [],
        },
      },
    };

    // Llamar a IA para generar plan básico
    const generatedPlan = await generateBasicPlan(basicContext);

    // Guardar en DB
    await prisma.onboardingData.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        data: JSON.stringify({
          ...basicContext,
          completedAt: new Date().toISOString(),
        }),
        status: 'completed',
        onboardingType: 'basic',
        completedModules: JSON.stringify({
          trainingDetailed: false,
          nutritionDetailed: false,
        }),
      },
      update: {
        data: JSON.stringify({
          ...basicContext,
          completedAt: new Date().toISOString(),
        }),
        status: 'completed',
        onboardingType: 'basic',
        completedModules: JSON.stringify({
          trainingDetailed: false,
          nutritionDetailed: false,
        }),
      },
    });

    // Guardar plan generado
    await prisma.generatedPlan.create({
      data: {
        userId: session.user.id,
        planType: 'basic',
        planData: JSON.stringify(generatedPlan),
        startDate: new Date(startDate),
        isRegeneration: false,
      },
    });

    return NextResponse.json({
      success: true,
      planId: generatedPlan.id,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    console.error('Error generating basic plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### B. Crear `/src/app/api/planning/regenerate-personalized/route.ts`

**Endpoint para regenerar plan con datos completos:**

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePersonalizedPlan } from '@/lib/ai/generatePersonalizedPlan';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      moduleCompleted,
      regenerateFrom,
      trainingDetailed,
      nutritionDetailed,
      newStartDate,
    } = body;

    // Cargar contexto básico existente
    const onboardingData = await prisma.onboardingData.findUnique({
      where: { userId: session.user.id },
    });

    if (!onboardingData) {
      return NextResponse.json(
        { error: 'No onboarding data found' },
        { status: 404 }
      );
    }

    const basicContext = JSON.parse(onboardingData.data as string);

    // Merge con datos detallados
    const enrichedContext = {
      ...basicContext,
      training: trainingDetailed || basicContext.planning.trainingDefaults,
      nutrition: nutritionDetailed || basicContext.planning.nutritionDefaults,
      meta: {
        ...basicContext.meta,
        version: '2.0-personalized',
        regeneratedAt: new Date().toISOString(),
        regeneratedFrom,
      },
      planning: {
        ...basicContext.planning,
        startDate: newStartDate || new Date().toISOString().split('T')[0],
      },
    };

    // Generar plan personalizado con IA
    const personalizedPlan = await generatePersonalizedPlan(enrichedContext);

    // Actualizar OnboardingData
    await prisma.onboardingData.update({
      where: { userId: session.user.id },
      data: {
        data: JSON.stringify(enrichedContext),
        onboardingType: 'complete',
        completedModules: JSON.stringify({
          trainingDetailed: !!trainingDetailed,
          nutritionDetailed: !!nutritionDetailed,
        }),
        pendingRegeneration: false,
      },
    });

    // Marcar plan anterior como superseded
    await prisma.generatedPlan.updateMany({
      where: {
        userId: session.user.id,
        planType: 'basic',
      },
      data: {
        planType: 'superseded',
      },
    });

    // Crear nuevo plan personalizado
    const newPlan = await prisma.generatedPlan.create({
      data: {
        userId: session.user.id,
        planType: 'personalized',
        planData: JSON.stringify(personalizedPlan),
        startDate: new Date(newStartDate),
        isRegeneration: true,
        regeneratedFrom,
      },
    });

    return NextResponse.json({
      success: true,
      newPlanId: newPlan.id,
      startDate: newStartDate,
    });
  } catch (error) {
    console.error('Error regenerating plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### C. Crear `/src/app/api/notifications/create/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, message } = body;

    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type,
        message,
        read: false,
      },
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### D. Crear `/src/app/api/notifications/list/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### E. Crear `/src/app/api/notifications/[id]/read/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.notification.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 3. Funciones de Generación AI

#### A. Crear `/src/lib/ai/generateBasicPlan.ts`

**Función simplificada para plan básico:**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function generateBasicPlan(basicContext: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
Genera un plan de fitness y nutrición BÁSICO de 12 semanas para:

**Datos del usuario:**
- Edad: ${basicContext.biometrics.age} años
- Género: ${basicContext.biometrics.gender}
- Peso: ${basicContext.biometrics.weight} kg
- Altura: ${basicContext.biometrics.height} cm
- Objetivo: ${basicContext.objective.goalType}
- Nivel de actividad: ${basicContext.activity.activityLevel}
- Entrena actualmente: ${basicContext.activity.currentlyTraining}

**Características del plan básico:**
- Entrenamientos: Full-body genéricos, ${basicContext.planning.trainingDefaults.frequency}x/semana
- Duración sesiones: ${basicContext.planning.trainingDefaults.duration} minutos
- Ejercicios: Del catálogo general (sin equipo específico)
- Comidas: ${basicContext.planning.nutritionDefaults.mealsPerDay} comidas/día
- Dieta: Omnívora sin restricciones
- Macros: Distribución estándar 30% proteína, 40% carbos, 30% grasas

**Formato de respuesta (JSON):**
{
  "id": "plan_basic_[uuid]",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Adaptación",
      "days": [
        {
          "dayNumber": 1,
          "dayName": "Lunes",
          "hasWorkout": true,
          "workout": {
            "name": "Full Body 1",
            "duration": 60,
            "exercises": [
              {
                "name": "Sentadillas",
                "sets": 3,
                "reps": "12",
                "rest": "60s",
                "notes": "Peso corporal o con mancuernas ligeras"
              }
              // ... más ejercicios
            ]
          },
          "meals": [
            {
              "type": "breakfast",
              "name": "Desayuno energético",
              "calories": 500,
              "protein": 30,
              "carbs": 60,
              "fats": 15,
              "ingredients": ["Avena", "Plátano", "Proteína en polvo", "Almendras"],
              "recipe": "Preparación simple..."
            }
            // ... más comidas
          ]
        }
        // ... más días
      ]
    }
    // ... más semanas
  ]
}

Genera TODAS las 12 semanas completas con 7 días cada una.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parsear JSON (quitar markdown si viene envuelto)
  const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  const planData = JSON.parse(cleanText);

  return planData;
}
```

#### B. Crear `/src/lib/ai/generatePersonalizedPlan.ts`

**Reutiliza la función existente de generación completa, pero con el contexto enriquecido:**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function generatePersonalizedPlan(enrichedContext: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
Genera un plan de fitness y nutrición ULTRA-PERSONALIZADO de 12 semanas para:

**Datos del usuario:**
[... TODOS los datos del contexto enriquecido ...]

**Training detallado:**
- Nivel: ${enrichedContext.training.trainingLevel}
- Deporte: ${enrichedContext.training.sportType}
- Días disponibles: ${enrichedContext.training.availableDays.join(', ')}
- Duración sesiones: ${enrichedContext.training.sessionDuration}
- Ubicación: ${enrichedContext.training.trainingLocation.join(', ')}
- Equipo: ${enrichedContext.training.availableEquipment.join(', ')}

**Nutrition detallada:**
- Tipo dieta: ${enrichedContext.nutrition.dietType}
- Alergias: ${enrichedContext.nutrition.allergies?.join(', ') || 'Ninguna'}
- Intolerancias: ${enrichedContext.nutrition.intolerances?.join(', ') || 'Ninguna'}
- Alimentos excluidos: ${enrichedContext.nutrition.excludedFoods?.join(', ') || 'Ninguno'}
- Comidas/día: ${enrichedContext.nutrition.mealsPerDay}
- Frecuencia cocina: ${enrichedContext.nutrition.cookingFrequency}

**Características del plan personalizado:**
- Periodización por fases (Base → Build → Peak → Taper)
- Ejercicios específicos del deporte
- Progresión de carga calculada
- Recetas filtradas por restricciones
- Macros optimizados para objetivo
- Horarios de comida adaptados

[... resto del prompt con formato JSON similar pero con mayor detalle ...]
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  const planData = JSON.parse(cleanText);

  return planData;
}
```

---

## 🔄 Flujo Completo Implementado

### FLUJO A: Onboarding Básico

```
1. Usuario en /onboarding/welcome
   ↓
2. Selecciona "Plan Rápido" (onboardingType = 'basic')
   ↓
3. Completa Step 1 (Biometrics)
   ↓
4. Completa Step 2 (Objective)
   ↓
5. Completa Step 3 (Activity)
   ↓
6. Step 3 detecta onboardingType='basic' → Skip steps 4 y 5
   ↓
7. Redirect directo a Step 6 (Macros)
   ↓
8. Step 6 detecta onboardingType='basic'
   - Muestra solo datos de steps 1-3
   - Usuario ingresa startDate
   ↓
9. POST /api/planning/generate-basic
   - Genera plan básico con IA
   - Guarda OnboardingData con onboardingType='basic'
   - Crea notificación "complete_profile"
   ↓
10. Redirect a /dashboard
    - Plan básico visible
    - Campana con notificación (badge rojo)
```

### FLUJO B: Completar Módulos

```
1. Usuario en Dashboard ve campana con badge (1 notificación)
   ↓
2. Click en campana → Dropdown con notificaciones
   ↓
3. Click en notificación "Completa tu perfil..."
   ↓
4. Se abre CompleteProfileModal
   ↓
5. Modal Step 1: Formulario de Training (reutiliza step-4)
   - Usuario completa datos detallados
   - Click "Continuar a Nutrición"
   ↓
6. Modal Step 2: Formulario de Diet (reutiliza step-5)
   - Usuario completa datos detallados
   - Click "Continuar a Fecha de Inicio"
   ↓
7. Modal Step 3: Input de nueva startDate
   - Usuario selecciona fecha (por defecto: HOY)
   - Click "Regenerar Mi Plan Personalizado"
   ↓
8. POST /api/planning/regenerate-personalized
   - Merge basicContext + trainingDetailed + nutritionDetailed
   - Genera plan personalizado con IA
   - Actualiza OnboardingData (onboardingType='complete')
   - Marca plan anterior como 'superseded'
   - Crea nuevo GeneratedPlan con isRegeneration=true
   ↓
9. Modal se cierra
   ↓
10. Dashboard se refresca
    - Plan personalizado visible desde nueva startDate
    - Notificación marcada como leída
    - Badge desaparece
```

---

## ✅ Checklist de Implementación

### Fase 1: Base (Día 1-2)
- [ ] Modificar schema.prisma (agregar campos a OnboardingData)
- [ ] Ejecutar `npx prisma migrate dev --name add-onboarding-hybrid-fields`
- [ ] Modificar store onboarding.ts (agregar onboardingType y completedModules)
- [ ] Modificar welcome page (agregar 2 opciones)
- [ ] Modificar step-6 (condicionar payload según tipo)
- [ ] Modificar step-3 (condicionar navegación)

### Fase 2: Notificaciones (Día 3)
- [ ] Crear NotificationBell.tsx
- [ ] Integrar NotificationBell en HeaderBar existente
- [ ] Crear API /notifications/create
- [ ] Crear API /notifications/list
- [ ] Crear API /notifications/[id]/read
- [ ] Testing: Crear notificación manual y verificar aparece

### Fase 3: Modal y Regeneración (Día 4-5)
- [ ] Crear CompleteProfileModal.tsx
- [ ] Adaptar Step4 y Step5 para funcionar dentro del modal
- [ ] Crear API /planning/generate-basic
- [ ] Crear API /planning/regenerate-personalized
- [ ] Crear función generateBasicPlan.ts
- [ ] Crear función generatePersonalizedPlan.ts

### Fase 4: Testing E2E (Día 6)
- [ ] Test: Flujo básico completo (welcome → step 3 → step 6 → dashboard)
- [ ] Test: Notificación aparece en dashboard
- [ ] Test: Modal se abre al click en notificación
- [ ] Test: Regeneración funciona y actualiza dashboard
- [ ] Test: Plan anterior marcado como superseded
- [ ] Test: Nuevas fechas de inicio funcionan correctamente

### Fase 5: Polish (Día 7)
- [ ] Loading states en modal durante regeneración
- [ ] Animaciones de transición
- [ ] Toast notifications de éxito
- [ ] Error handling robusto
- [ ] Mensajes informativos claros
- [ ] Documentación interna

---

## 🎯 Notas Críticas para Claude Code

### 1. NO REESCRIBAS Archivos Existentes Completos

Los siguientes archivos **YA EXISTEN** y funcionan. Solo necesitas:
- `step-1-biometrics/page.tsx` → **NO TOCAR**
- `step-2-objective/page.tsx` → **NO TOCAR**
- `step-3-activity/page.tsx` → **MODIFICAR** solo la navegación (línea del router.push)
- `step-4-training/page.tsx` → **NO TOCAR** (se reutiliza en modal)
- `step-5-diet/page.tsx` → **NO TOCAR** (se reutiliza en modal)
- `step-6-macros/page.tsx` → **MODIFICAR** solo la lógica de submit

### 2. Reutilización de Componentes en Modal

En `CompleteProfileModal.tsx`, **NO COPIES** todo el código de Step4 y Step5. En su lugar:

```typescript
// ❌ MAL - No hagas esto
// Copiar todo el código de step-4 aquí

// ✅ BIEN - Haz esto
import Step4TrainingForm from '@/app/onboarding/step-4-training/page';

// Y luego dentro del modal:
<Step4TrainingForm />
```

Si los componentes de steps no exportan el formulario separado, entonces:

**Opción A:** Extrae el formulario a un componente separado:
```
/src/components/onboarding/TrainingForm.tsx  (extraído de step-4)
/src/components/onboarding/DietForm.tsx      (extraído de step-5)
```

**Opción B:** Importa el page completo pero ocúltale el wrapper:
```typescript
// En step-4/page.tsx, exporta también el formulario
export { TrainingFormContent };

// En modal
import { TrainingFormContent } from '@/app/onboarding/step-4-training/page';
```

### 3. Orden de Implementación

**CRÍTICO:** Implementa en este orden exacto para evitar errores:

1. **Primero:** Schema + migración (sin esto, nada funciona)
2. **Segundo:** Store (los componentes lo necesitan)
3. **Tercero:** APIs de notificaciones (el dashboard las necesita)
4. **Cuarto:** NotificationBell (UI visible)
5. **Quinto:** Modal (el más complejo)
6. **Sexto:** APIs de generación (backend pesado)
7. **Último:** Testing E2E

### 4. Testing Incremental

Después de cada fase, TESTEA antes de continuar:

```bash
# Después de modificar schema
npx prisma migrate dev
npx prisma studio  # Verificar que campos existen

# Después de crear API
curl http://localhost:3000/api/notifications/list
# Debe retornar { notifications: [], unreadCount: 0 }

# Después de crear NotificationBell
# Abrir dashboard y verificar que campana aparece
# Crear notificación manual en DB y verificar que aparece badge
```

### 5. Variables de Entorno

Asegúrate de que existan:

```env
# .env.local
GOOGLE_AI_API_KEY=your_key_here
DATABASE_URL=your_supabase_url_here
NEXTAUTH_SECRET=your_secret_here
```

### 6. Errores Comunes a Evitar

**Error 1:** Olvidar ejecutar migración después de modificar schema
```bash
# Siempre ejecuta esto después de cambiar schema.prisma
npx prisma migrate dev --name add-new-fields
npx prisma generate
```

**Error 2:** No refrescar tipos de Prisma
```bash
# Si ves errores de TypeScript después de migración
npx prisma generate
# Luego reinicia TypeScript server en VSCode
```

**Error 3:** Importar componentes de pages incorrectamente
```typescript
// ❌ MAL
import Step4 from '@/app/onboarding/step-4-training/page';

// ✅ BIEN
import Step4 from '@/app/onboarding/step-4-training/page';
// O mejor aún, extrae el formulario a un componente separado
```

**Error 4:** No manejar el estado de loading en modal
```typescript
// ✅ SIEMPRE usa estado de loading
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    // ... llamada API
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 📚 Resumen Ejecutivo

**Objetivo:** Adaptar onboarding existente para funcionar en modo híbrido.

**Archivos a crear:** 11 nuevos (2 componentes UI + 5 APIs + 2 funciones AI + 2 helpers)

**Archivos a modificar:** 5 existentes (schema, store, welcome, step-3, step-6)

**Tiempo estimado:** 6-7 días de desarrollo

**Resultado esperado:**
- Onboarding básico funcional en 3 pasos
- Sistema de notificaciones operativo
- Modal de completado funcional
- Regeneración de plan personalizado operativa
- Dashboard actualizándose con nuevo plan

**Prioridad:** Implementar en el orden especificado en el Checklist.

---

## 🚀 Próximos Pasos Inmediatos

1. **HOY:** Modificar schema.prisma y ejecutar migración
2. **HOY:** Modificar store onboarding.ts
3. **MAÑANA:** Crear NotificationBell y APIs de notificaciones
4. **MAÑANA:** Integrar campana en HeaderBar
5. **DÍA 3-4:** Crear modal y regeneración
6. **DÍA 5-6:** Testing completo
7. **DÍA 7:** Polish y documentación

---

**¿Preguntas antes de empezar?** 🤔
