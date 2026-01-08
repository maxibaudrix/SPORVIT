# 📋 INSTRUCCIONES PARA CLAUDE CODE - CALENDAR SYSTEM

## 🎯 OBJETIVO GENERAL

Transformar el dashboard calendar de una vista vertical única a un sistema responsive completo con:

- **Mobile (< 768px):** Vista vertical actual (SIN MODIFICAR)
- **Desktop (≥ 768px):** Grid 7 columnas (semana completa) + Vista mensual opcional
- **Sistema de Modal:** DailyModal para agregar/visualizar eventos del día
- **Botón CTA (+):** Inline dentro de cada columna de día (desktop) + FAB (mobile)

---

## 📐 ARQUITECTURA DE ARCHIVOS

### **Estructura completa a crear:**

```
src/
├── types/
│   └── calendar.ts                    [CREAR] - Types compartidos
│
├── hooks/
│   ├── useCalendarView.ts             [CREAR] - State week/month toggle
│   ├── useCalendarNavigation.ts       [CREAR] - Navegación prev/next/today
│   └── useDailyModal.ts               [CREAR] - State del modal
│
└── components/ui/layout/dashboard/calendar/
    ├── CalendarHeader.tsx             [CREAR] - Header con navegación y toggle
    ├── WeekView.tsx                   [CREAR] - Grid 7 columnas desktop
    ├── MonthView.tsx                  [CREAR] - Grid calendario mensual
    ├── DayColumn.tsx                  [CREAR] - Columna individual día
    ├── DayCell.tsx                    [CREAR] - Celda día (vista mes)
    ├── DailyModal.tsx                 [CREAR] - Modal día completo
    ├── EventCard.tsx                  [CREAR] - Card evento individual
    ├── AddEventButton.tsx             [CREAR] - Botón (+) inline/FAB
    ├── EmptyDayState.tsx              [CREAR] - Estado vacío
    └── WeeklyCalendar.tsx             [MODIFICAR] - Wrapper responsive
```

---

## 📦 FASE 1: FOUNDATION & TYPES

### **1.1 Archivo: `src/types/calendar.ts`**

**Propósito:** Definir todos los tipos TypeScript compartidos para el sistema de calendario.

**Contenido:**

```typescript
// Tipos de vista del calendario
export type CalendarView = 'week' | 'month';

// Representación de un día en el calendario
export interface CalendarDate {
  date: Date;               // Fecha completa
  dayNumber: number;        // Número del día (1-31)
  dayName: string;          // Nombre abreviado (Lun, Mar, etc)
  isToday: boolean;         // True si es el día actual
  isCurrentMonth: boolean;  // True si pertenece al mes actual (útil en vista mensual)
}

// Tipos de eventos del calendario
export interface CalendarEvent {
  id: string;
  type: 'workout' | 'meal' | 'note';
  title: string;
  description?: string;
  startTime?: string;       // Formato: "08:00"
  endTime?: string;         // Formato: "09:30"
  date: Date;
  metadata?: Record<string, any>;
}

// Estructura de datos para vista semanal
export interface WeekData {
  weekNumber: number;       // Número de semana del año
  year: number;
  days: CalendarDate[];     // Array de 7 días (L-D)
}

// Estructura de datos para vista mensual
export interface MonthData {
  month: number;            // 0-11 (enero-diciembre)
  year: number;
  weeks: CalendarDate[][];  // Array de semanas, cada semana es array de 7 días
}
```

---

### **1.2 Archivo: `src/hooks/useCalendarView.ts`**

**Propósito:** Hook Zustand para manejar el estado del toggle semana/mes con persistencia.

**Funcionalidad:**
- Store global para vista actual ('week' | 'month')
- Persistencia en localStorage
- Métodos: `setView()`, `toggleView()`

**Notas técnicas:**
- Usar `zustand/middleware/persist` para localStorage
- Key: `'calendar-view-storage'`
- Default: `'week'`

---

### **1.3 Archivo: `src/hooks/useCalendarNavigation.ts`**

**Propósito:** Hook para manejar navegación del calendario (anterior/siguiente/hoy) y cálculo de datos.

**Funcionalidad:**
- State interno: `currentDate` (fecha de referencia actual)
- Métodos de navegación:
  - `goToToday()` - Resetear a hoy
  - `goToPrevious()` - Semana/mes anterior según vista
  - `goToNext()` - Semana/mes siguiente según vista
- Métodos de cálculo:
  - `getWeekData()` - Retorna `WeekData` con 7 días desde lunes
  - `getMonthData()` - Retorna `MonthData` con grid completo del mes
  - `getHeaderTitle()` - Retorna string formateado para header (ej: "Enero 8-14, 2026")

**Dependencias:**
- `date-fns`: `startOfWeek`, `endOfWeek`, `addWeeks`, `subWeeks`, `startOfMonth`, `endOfMonth`, `addMonths`, `subMonths`, `isToday`, `format`
- `date-fns/locale`: Importar `es` para español

**Notas técnicas:**
- `weekStartsOn: 1` (lunes como primer día)
- Formato de título adaptado a vista (week vs month)

---

### **1.4 Archivo: `src/hooks/useDailyModal.ts`**

**Propósito:** Hook Zustand para manejar el estado del modal Daily.

**Funcionalidad:**
- State global del modal:
  - `isOpen: boolean`
  - `selectedDate: Date | null`
- Métodos:
  - `openModal(date: Date)` - Abrir modal con fecha específica
  - `closeModal()` - Cerrar modal y limpiar selectedDate

**Notas técnicas:**
- NO usar persistencia (modal debe cerrar al reload)
- Simple store sin middleware

---

## 🎨 FASE 2: COMPONENTES UI BÁSICOS

### **2.1 Archivo: `src/components/ui/layout/dashboard/calendar/CalendarHeader.tsx`**

**Propósito:** Header sticky del calendario con controles de navegación y toggle de vista.

**Props:**
```typescript
interface CalendarHeaderProps {
  title: string;           // Título dinámico desde useCalendarNavigation
  onPrevious: () => void;  // Callback semana/mes anterior
  onNext: () => void;      // Callback semana/mes siguiente
  onToday: () => void;     // Callback ir a hoy
}
```

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│  [<] [>]  Enero 8-14, 2026  [Hoy]     [Semana] [Mes]  │
└────────────────────────────────────────────────────────┘
```

**Estructura:**
- Sección izquierda:
  - Botones navegación (ChevronLeft, ChevronRight)
  - Título H2 capitalizado
  - Botón "Hoy" (hover:bg-slate-800)
- Sección derecha (solo desktop - `hidden md:flex`):
  - Segmented control: 2 botones (Semana/Mes)
  - Active state: `bg-emerald-500 text-white shadow-lg`
  - Inactive state: `text-slate-400 hover:text-white`

**Estilos clave:**
- Sticky: `sticky top-0 z-20`
- Background: `bg-slate-950/95 backdrop-blur-sm`
- Border: `border-b border-slate-800`

---

### **2.2 Archivo: `src/components/ui/layout/dashboard/calendar/EmptyDayState.tsx`**

**Propósito:** Componente de estado vacío cuando un día no tiene eventos.

**Layout:**
```
┌──────────────────────┐
│      [📅 Icon]       │
│                      │
│  Sin eventos         │
│  programados         │
└──────────────────────┘
```

**Estructura:**
- Icono: Calendar de lucide-react (w-8 h-8)
- Círculo gris: `bg-slate-800/50 rounded-full` (w-16 h-16)
- Texto: `text-sm text-slate-500`

---

### **2.3 Archivo: `src/components/ui/layout/dashboard/calendar/AddEventButton.tsx`**

**Propósito:** Botón CTA para agregar eventos. Tiene 2 variantes: inline (desktop) y FAB (mobile).

**Props:**
```typescript
interface AddEventButtonProps {
  date: Date;                      // Fecha del día
  variant?: 'inline' | 'fab';      // Default: 'inline'
}
```

**Variante INLINE (desktop):**
- Ubicación: Dentro de `DayColumn`, al final del contenido
- Diseño: Botón ancho completo con borde dashed
- Estilo:
  ```
  border-2 border-dashed border-slate-700
  hover:border-emerald-500/50 hover:bg-emerald-500/5
  rounded-xl py-3
  ```
- Contenido: Icono Plus + texto "Agregar"
- Comportamiento: Click → `openModal(date)`

**Variante FAB (mobile):**
- Ubicación: Fixed bottom-right
- Clase: `fixed bottom-6 right-6 md:hidden`
- Diseño: Círculo flotante 56x56px
- Estilo:
  ```
  bg-emerald-500 hover:bg-emerald-600
  rounded-full shadow-2xl shadow-emerald-500/30
  z-30
  ```
- Contenido: Solo icono Plus (w-6 h-6)
- Comportamiento: Click → `openModal(new Date())` (día actual)

**Nota importante:** Ambas variantes usan `useDailyModal().openModal()`

---

### **2.4 Archivo: `src/components/ui/layout/dashboard/calendar/EventCard.tsx`**

**Propósito:** Card compacto para representar un evento en la lista del día.

**Props:**
```typescript
interface EventCardProps {
  event: CalendarEvent;
}
```

**Estilos por tipo de evento:**
```typescript
const EVENT_STYLES = {
  workout: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: Dumbbell,
    iconColor: 'text-red-400',
  },
  meal: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: Salad,
    iconColor: 'text-orange-400',
  },
  note: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: FileText,
    iconColor: 'text-blue-400',
  },
};
```

**Estructura:**
```
┌─────────────────────────────────┐
│ [🏋️]  Entrenamiento Pecho      │
│        08:00 - 09:30            │
│        Press banca, fondos...   │  ← line-clamp-2
└─────────────────────────────────┘
```

- Layout: Flex horizontal (icon + contenido)
- Icono: 32x32px con background del tipo
- Título: `text-sm font-bold truncate`
- Hora: `text-xs text-slate-400` (si existe)
- Descripción: `text-xs text-slate-500 line-clamp-2` (si existe)
- Interacción: `hover:scale-[1.02]`
- Click: Abre `DailyModal` con la fecha del evento

---

## 📅 FASE 3: VISTAS WEEK & MONTH

### **3.1 Archivo: `src/components/ui/layout/dashboard/calendar/DayColumn.tsx`**

**Propósito:** Columna individual de un día en la vista semanal (desktop).

**Props:**
```typescript
interface DayColumnProps {
  day: CalendarDate;
  events: CalendarEvent[];
}
```

**Estructura vertical:**
```
┌─────────────────────┐
│ LUN                 │  ← Header (día)
│ 8                   │     Sticky dentro de scroll
├─────────────────────┤
│                     │
│ [Event Card 1]      │  ← Lista eventos (scroll)
│ [Event Card 2]      │
│ [Event Card 3]      │
│                     │
│ [Empty State]       │  ← Si no hay eventos
│                     │
├─────────────────────┤
│ [+ Agregar]         │  ← Botón inline (final)
└─────────────────────┘
```

**Layout técnico:**
- Container: `min-h-[600px] bg-slate-900/30 rounded-xl p-4`
- Header del día:
  - Día abreviado: `text-xs text-slate-500 uppercase`
  - Número: `text-3xl font-black`
  - Border bottom: `border-b border-slate-800 pb-3 mb-4`
- Lista de eventos:
  - Container: `space-y-2 mb-4`
  - Map de `EventCard` components
  - Si array vacío: mostrar `EmptyDayState`
- Botón agregar:
  - `AddEventButton` con `variant="inline"`
  - Siempre al final

**Estado "Hoy":**
- Border: `border-emerald-500`
- Ring: `ring-2 ring-emerald-500/20`
- Shadow: `shadow-lg shadow-emerald-500/10`
- Número del día: `text-emerald-500`

**Hover:**
- `hover:border-slate-700` (si no es hoy)

---

### **3.2 Archivo: `src/components/ui/layout/dashboard/calendar/WeekView.tsx`**

**Propósito:** Grid de 7 columnas para vista semanal (desktop only).

**Props:**
```typescript
interface WeekViewProps {
  events: CalendarEvent[];
}
```

**Funcionalidad:**
1. Obtener datos de la semana: `useCalendarNavigation('week').getWeekData()`
2. Filtrar eventos por día: `isSameDay(event.date, day.date)` de `date-fns`
3. Renderizar grid de 7 `DayColumn`

**Layout:**
- Container: `hidden md:grid md:grid-cols-7 gap-4 p-6`
- Grid: 7 columnas iguales
- Gap: 16px entre columnas
- Padding: 24px alrededor

**Nota:** Clase `hidden md:grid` asegura que solo aparece en desktop

---

### **3.3 Archivo: `src/components/ui/layout/dashboard/calendar/DayCell.tsx`**

**Propósito:** Celda individual de un día en la vista mensual.

**Props:**
```typescript
interface DayCellProps {
  day: CalendarDate;
  events: CalendarEvent[];
}
```

**Estructura:**
```
┌──────────┐
│    8     │  ← Número día
│          │
│ •••      │  ← Dots indicadores (max 3 visibles)
│ +2       │  ← Overflow count
└──────────┘
```

**Layout:**
- Aspecto: `aspect-square` (cuadrado perfecto)
- Container: `p-2 rounded-lg border`
- Flex vertical: `flex flex-col h-full`
- Número al top, dots al bottom (`mt-auto`)

**Indicadores de eventos (dots):**
- Workout: `bg-red-500` (dot 6x6px)
- Meal: `bg-orange-500`
- Note: `bg-blue-500`
- Overflow: Texto `+N` si más de 3 eventos
- Layout: `flex flex-wrap gap-1`

**Estados:**
- Hoy: `border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20`
- No del mes actual: `opacity-40`
- Hover: `hover:border-slate-600 hover:bg-slate-800/30`
- Click: Abre `DailyModal` con fecha del día

---

### **3.4 Archivo: `src/components/ui/layout/dashboard/calendar/MonthView.tsx`**

**Propósito:** Grid calendario mensual completo (desktop only).

**Props:**
```typescript
interface MonthViewProps {
  events: CalendarEvent[];
}
```

**Funcionalidad:**
1. Obtener datos del mes: `useCalendarNavigation('month').getMonthData()`
2. Filtrar eventos por día: `isSameDay(event.date, day.date)`
3. Renderizar grid de semanas con celdas

**Layout:**
```
┌────────────────────────────────────────┐
│  Lun  Mar  Mié  Jue  Vie  Sáb  Dom    │  ← Header días
├────────────────────────────────────────┤
│  [1]  [2]  [3]  [4]  [5]  [6]  [7]    │
│  [8]  [9]  [10] [11] [12] [13] [14]   │  ← Grid semanas
│  ...                                   │
└────────────────────────────────────────┘
```

**Header días de semana:**
- Container: `grid grid-cols-7 gap-2 mb-2`
- Texto: `text-xs font-bold text-slate-500 uppercase text-center`

**Grid de semanas:**
- Container outer: `space-y-2`
- Cada semana: `grid grid-cols-7 gap-2`
- Celdas: `DayCell` component

**Nota:** Clase `hidden md:block` asegura desktop only

---

## 📱 FASE 4: MODAL DAILYMODAL

### **4.1 Archivo: `src/components/ui/layout/dashboard/calendar/DailyModal.tsx`**

**Propósito:** Modal full-featured para ver/agregar eventos de un día específico.

**State y comportamiento:**
- Usar `useDailyModal()` para state
- Leer `isOpen` y `selectedDate`
- Cerrar con `closeModal()`

**Funcionalidad especial:**
1. **Cerrar con ESC:**
   ```typescript
   useEffect(() => {
     const handleEsc = (e: KeyboardEvent) => {
       if (e.key === 'Escape') closeModal();
     };
     window.addEventListener('keydown', handleEsc);
     return () => window.removeEventListener('keydown', handleEsc);
   }, [closeModal]);
   ```

2. **Lock body scroll:**
   ```typescript
   useEffect(() => {
     if (isOpen) {
       document.body.style.overflow = 'hidden';
     } else {
       document.body.style.overflow = 'unset';
     }
     return () => { document.body.style.overflow = 'unset'; };
   }, [isOpen]);
   ```

**Layout estructura:**
```
┌──────────────────────────────────────┐
│ ← Cerrar  Lunes 8 de Enero      ··· │  ← Header sticky
├──────────────────────────────────────┤
│                                      │
│  Timeline de eventos:                │
│  ┌────────────────────────────┐     │  ← Body scroll
│  │ 🏋️ Entrenamiento           │     │
│  │ 08:00 - 09:30              │     │
│  └────────────────────────────┘     │
│                                      │
│  ┌────────────────────────────┐     │
│  │ [Sin eventos hoy]          │     │
│  └────────────────────────────┘     │
│                                      │
│  CTAs para agregar:                  │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ 🏋️   │ │ 🥗   │ │ 📝   │        │
│  │Entre.│ │Comida│ │ Nota │        │
│  └──────┘ └──────┘ └──────┘        │
└──────────────────────────────────────┘
```

**Tamaños:**
- Desktop: `max-w-5xl w-full max-h-[85vh]`
- Mobile: Considerar full-screen si es necesario
- Backdrop: `bg-black/60 backdrop-blur-sm`

**Header sticky:**
- Container: `sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm`
- Título: Fecha formateada con `date-fns` → "Lunes 8 de Enero"
- Subtitle: Texto descriptivo pequeño
- Botón cerrar: X icon (top-right)

**Body scrollable:**
- Container: `overflow-y-auto max-h-[calc(85vh-80px)] p-6`
- Eventos existentes: Timeline con cards
- Empty state si no hay eventos
- CTAs al final: Grid 3 columnas (sm:grid-cols-3)

**CTAs agregar:**
- 3 botones: Entrenamiento (red), Comida (orange), Nota (blue)
- Layout por botón:
  - Icono circular grande (w-12 h-12)
  - Título h3
  - Descripción p pequeña
- Hover: Scale icon + border más visible

**Animaciones:**
- Entrada: `animate-in fade-in zoom-in-95 duration-200`
- Salida: Fade out al cerrar

---

## 🔄 FASE 5: INTEGRACIÓN WRAPPER

### **5.1 Archivo: `src/components/ui/layout/dashboard/calendar/WeeklyCalendar.tsx` [MODIFICAR]**

**Propósito:** Wrapper principal que orquesta todo el sistema según responsive breakpoint.

**Props existentes:**
```typescript
interface WeeklyCalendarProps {
  userId: string;
}
```

**Nueva lógica a implementar:**

1. **Imports necesarios:**
   - `useCalendarView` para obtener vista actual
   - `useCalendarNavigation` para navegación
   - Todos los componentes nuevos

2. **State interno:**
   - `events: CalendarEvent[]` - Array de eventos (fetch desde API)
   - `loading: boolean` - Estado de carga

3. **Fetch de eventos:**
   ```typescript
   useEffect(() => {
     // TODO: Fetch events desde /api/calendar/events
     // Params: userId, startDate, endDate
     // Por ahora: placeholder vacío
     setEvents([]);
     setLoading(false);
   }, [userId, navigation.currentDate]);
   ```

4. **Estructura del render:**
   ```typescript
   return (
     <>
       {/* Header común para ambas vistas */}
       <CalendarHeader
         title={navigation.getHeaderTitle()}
         onPrevious={navigation.goToPrevious}
         onNext={navigation.goToNext}
         onToday={navigation.goToToday}
       />

       {/* Vista desktop según toggle */}
       {view === 'week' ? (
         <WeekView events={events} />
       ) : (
         <MonthView events={events} />
       )}

       {/* FAB Mobile */}
       <AddEventButton date={navigation.currentDate} variant="fab" />

       {/* Modal Daily */}
       <DailyModal />

       {/* Mobile: Vista vertical actual (MANTENER SIN CAMBIOS) */}
       <div className="md:hidden">
         {/* TODO: Aquí mantener el WeeklyCalendar original que ya existe */}
         {/* O crear nuevo MobileWeekView si es necesario */}
       </div>
     </>
   );
   ```

**Notas importantes:**
- Desktop views son `hidden md:grid` o `hidden md:block`
- Mobile view es `md:hidden`
- FAB es `md:hidden` (solo mobile)
- Modal es global (ambas vistas)

---

## 🎨 ESTILOS GLOBALES ADICIONALES

### **Archivo: `src/app/globals.css` [AÑADIR AL FINAL]**

```css
/* ========================================
   ANIMACIONES PARA MODAL
   ======================================== */

@keyframes zoom-in-95 {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-in {
  animation-fill-mode: both;
}

.zoom-in-95 {
  animation-name: zoom-in-95;
}

.fade-in {
  animation-name: fade-in;
}

/* ========================================
   SMOOTH SCROLL PARA MODAL
   ======================================== */

.overflow-y-auto {
  scroll-behavior: smooth;
}

/* ========================================
   CUSTOM SCROLLBAR (WEBKIT)
   ======================================== */

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* ========================================
   UTILITIES PARA LINE-CLAMP
   ======================================== */

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Foundation** (Estimado: 15 min)
- [ ] Crear `types/calendar.ts` con todos los types
- [ ] Crear `hooks/useCalendarView.ts` con Zustand
- [ ] Crear `hooks/useCalendarNavigation.ts` con lógica date-fns
- [ ] Crear `hooks/useDailyModal.ts` con Zustand
- [ ] Verificar imports de date-fns funcionando

### **Fase 2: Componentes UI Básicos** (Estimado: 30 min)
- [ ] Crear `CalendarHeader.tsx` con toggle y navegación
- [ ] Crear `EmptyDayState.tsx` con icono y texto
- [ ] Crear `AddEventButton.tsx` con 2 variantes (inline + FAB)
- [ ] Crear `EventCard.tsx` con estilos por tipo
- [ ] Verificar que todos los iconos de lucide-react funcionen

### **Fase 3: Componentes de Vistas** (Estimado: 45 min)
- [ ] Crear `DayColumn.tsx` con header, lista, empty, button
- [ ] Crear `WeekView.tsx` con grid 7 columnas
- [ ] Crear `DayCell.tsx` con dots de eventos
- [ ] Crear `MonthView.tsx` con grid calendario
- [ ] Verificar responsiveness (hidden/visible según breakpoint)

### **Fase 4: Modal System** (Estimado: 30 min)
- [ ] Crear `DailyModal.tsx` con estructura completa
- [ ] Implementar ESC key listener
- [ ] Implementar body scroll lock
- [ ] Implementar backdrop click to close
- [ ] Verificar animaciones de entrada/salida

### **Fase 5: Integración** (Estimado: 20 min)
- [ ] Modificar `WeeklyCalendar.tsx` como wrapper
- [ ] Integrar hooks de navegación y vista
- [ ] Conectar todas las vistas (Week/Month)
- [ ] Asegurar vista mobile preservada
- [ ] Añadir FAB para mobile

### **Fase 6: Estilos y Polish** (Estimado: 20 min)
- [ ] Añadir animaciones CSS a globals.css
- [ ] Verificar scrollbar custom en modal
- [ ] Verificar estados hover en todos los componentes
- [ ] Verificar estado "hoy" con emerald-500
- [ ] Testing responsive en mobile y desktop

---

## 🔍 DETALLES TÉCNICOS IMPORTANTES

### **Dependencias necesarias:**
```json
{
  "date-fns": "^2.30.0",
  "zustand": "^4.4.7",
  "lucide-react": "^0.263.1"
}
```

### **Imports comunes en múltiples archivos:**
```typescript
// Date-fns
import { format, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

// Lucide icons
import { 
  Calendar, Plus, X, ChevronLeft, ChevronRight,
  Dumbbell, Salad, FileText
} from 'lucide-react';

// Hooks custom
import { useCalendarView } from '@/hooks/useCalendarView';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';
import { useDailyModal } from '@/hooks/useDailyModal';

// Types
import type { CalendarDate, CalendarEvent } from '@/types/calendar';

// Utils
import { cn } from '@/lib/utils'; // Para clsx condicionales
```

### **Breakpoints responsive:**
- Mobile: `< 768px` (default, sin prefijo)
- Desktop: `≥ 768px` (prefijo `md:`)

### **Convención de clases Tailwind:**
- Use `cn()` de shadcn/ui para clases condicionales
- Orden: layout → spacing → colors → typography → effects

### **Z-index layers:**
```
z-10  → Sticky headers dentro de componentes
z-20  → CalendarHeader sticky global
z-30  → FAB mobile
z-50  → DailyModal backdrop y contenido
```

---

## 🎯 RESULTADO ESPERADO

### **Mobile (< 768px):**
- Vista vertical actual sin modificaciones
- FAB verde flotante bottom-right
- Modal full-screen al agregar evento
- Navegación con gestures (opcional fase 2)

### **Desktop (≥ 768px):**
- CalendarHeader con toggle Semana/Mes
- Vista Semana: Grid 7 columnas con botón inline en cada día
- Vista Mes: Calendario grid con dots indicadores
- Modal centrado (90vw max-w-5xl)
- Navegación con teclado (← → para prev/next)

### **Consistencia en ambos:**
- Día actual destacado con emerald-500
- Loading states con skeleton/spinner
- Empty states con ilustración
- Toast notifications para feedback

---

## 📝 NOTAS FINALES

1. **NO modificar** la vista vertical mobile existente hasta nueva instrucción
2. **Botón (+)** va DENTRO de cada DayColumn, no en header
3. **Modal** debe tener backdrop blur y cerrar con ESC
4. **Hover states** deben ser sutiles pero perceptibles
5. **Animaciones** deben ser suaves (300ms)
6. **Empty states** deben ser amigables, no técnicos

---

## 🚀 ORDEN DE EJECUCIÓN RECOMENDADO

1. ✅ **Crear todos los types** (1 archivo)
2. ✅ **Crear todos los hooks** (3 archivos)
3. ✅ **Crear componentes UI básicos** (4 archivos)
4. ✅ **Crear componentes de vistas** (4 archivos)
5. ✅ **Crear modal** (1 archivo)
6. ✅ **Modificar wrapper** (1 archivo)
7. ✅ **Añadir estilos globales** (1 archivo)
8. ✅ **Testing y ajustes**

**Total archivos:** 14 nuevos + 2 modificados
**Tiempo estimado:** 2.5 - 3 horas

---

## ❓ FAQ PARA CLAUDE CODE

**P: ¿Dónde va el botón (+) en desktop?**
R: Dentro de cada `DayColumn`, al final después de la lista de eventos. Es un botón inline ancho completo con border dashed.

**P: ¿Cómo manejo eventos dummy durante desarrollo?**
R: En `WeeklyCalendar.tsx`, crear array vacío `[]` en el state. Más adelante se reemplaza con fetch a API.

**P: ¿El modal debe ser full-screen en mobile?**
R: No necesariamente. Puede ser modal centrado con max-width reducido. La decisión es tuya según espacio.

**P: ¿Necesito implementar drag & drop de eventos?**
R: NO. Eso es fase 2. Por ahora solo click para abrir modal.

**P: ¿Qué pasa si la semana cruza 2 meses?**
R: El título del header debe mostrar "Ene 28 - Feb 3, 2026". Ya está manejado en `getHeaderTitle()`.

**P: ¿Los dots en vista mensual son clicables?**
R: NO. El click es en toda la celda (`DayCell`), no en los dots individuales.

---

**FIN DEL DOCUMENTO**
