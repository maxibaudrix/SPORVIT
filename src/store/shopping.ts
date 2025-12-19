import { create } from 'zustand';

// --- Tipos de Datos ---

/**
 * Categorías de productos utilizadas para filtros y organización.
 */
export type Category = 'Proteínas' | 'Vegetales' | 'Granos' | 'Lácteos' | 'Otros';

/**
 * Estructura de un ítem individual en la lista de compras.
 */
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g., 'g', 'ml', 'unidades'
  category: Category;
  isPurchased: boolean;
  recipeCount: number; // Para cuántas recetas se necesita
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E';
  estimatedPrice: number;
}

/**
 * Estado global y acciones del Store de la lista de compras.
 */
export interface ShoppingListState {
  items: ShoppingItem[];
  healthScore: number;
  totalBudget: number;
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchList: (source?: 'meal-plan') => Promise<void>;
  toggleItem: (itemId: string) => Promise<void>;
  generateFromPlan: () => Promise<void>;
  addItem: (item: Omit<ShoppingItem, 'id' | 'isPurchased' | 'recipeCount'>) => Promise<void>;
}

export const useShoppingStore = create<ShoppingListState>((set, get) => ({
  // --- Estado Inicial (Mock Data) ---
  items: [
    { id: '1', name: 'Pechuga de Pollo', quantity: 800, unit: 'g', category: 'Proteínas', isPurchased: false, recipeCount: 4, nutriScore: 'A', estimatedPrice: 6.50 },
    { id: '2', name: 'Brócoli', quantity: 500, unit: 'g', category: 'Vegetales', isPurchased: true, recipeCount: 2, nutriScore: 'A', estimatedPrice: 2.10 },
    { id: '3', name: 'Leche de Almendras', quantity: 1, unit: 'L', category: 'Lácteos', isPurchased: false, recipeCount: 1, nutriScore: 'B', estimatedPrice: 1.80 },
    { id: '4', name: 'Harina de Trigo', quantity: 1000, unit: 'g', category: 'Granos', isPurchased: false, recipeCount: 1, nutriScore: 'D', estimatedPrice: 1.20 },
  ],
  healthScore: 85,
  totalBudget: 45.00,
  isLoading: false,
  error: null,

  // --- Implementación de Acciones ---

  /**
   * Carga la lista de compras desde el servidor.
   */
  fetchList: async (source) => {
    set({ isLoading: true, error: null });
    const url = source === 'meal-plan' ? '/api/shopping?source=meal-plan' : '/api/shopping';
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar la lista de compras.');
      
      const data = await response.json();
      // Asegurar que items es un array, incluso si la API devuelve una estructura
      set({ 
        items: data.items || [], 
        healthScore: data.healthScore || 0, 
        totalBudget: data.totalBudget || 0 
      });

    } catch (error: any) {
      console.error('Fetch error:', error);
      set({ error: error.message || 'Error desconocido al cargar.' });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Cambia el estado (comprado/pendiente) de un ítem. Usa actualización optimista.
   */
  toggleItem: async (itemId: string) => {
    const itemToToggle = get().items.find(item => item.id === itemId);
    if (!itemToToggle) return;

    // 1. Optimistic Update (Actualización Inmediata)
    const newIsPurchased = !itemToToggle.isPurchased;
    set(state => ({
      items: state.items.map(item =>
        item.id === itemId ? { ...item, isPurchased: newIsPurchased } : item
      ),
    }));

    try {
      // 2. Llamada a la API para persistir el cambio
      const response = await fetch(`/api/shopping/item/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPurchased: newIsPurchased }),
      });

      if (!response.ok) {
        // 3. Rollback on failure (Revertir si falla)
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, isPurchased: itemToToggle.isPurchased } : item
          ),
          error: 'Fallo al actualizar el estado del ítem en la API.'
        }));
        throw new Error('Fallo en la API.');
      }
    } catch (error: any) {
      console.error(error);
      set({ error: error.message || 'Error de red.' });
    }
  },

  /**
   * Genera una nueva lista de compras consolidando ingredientes del Meal Plan.
   */
  generateFromPlan: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/shopping/generate', { 
        method: 'POST',
        // Nota: Si la API necesita un cuerpo, se debe agregar aquí. 
        // Asumimos que la API usa la sesión para obtener el plan de la semana actual.
      }); 
      
      if (!response.ok) throw new Error('Error al generar la lista desde el Meal Plan.');
      
      const data = await response.json();
      set({ 
        items: data.items || [], 
        healthScore: data.healthScore || 0, 
        totalBudget: data.totalBudget || 0 
      });

    } catch (error: any) {
      console.error('Generate error:', error);
      set({ error: error.message || 'Error desconocido al generar la lista.' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  /**
   * Añade un nuevo ítem a la lista manualmente.
   */
  addItem: async (itemDetails) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/shopping/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemDetails),
      });

      if (!response.ok) throw new Error('Error al añadir el ítem manualmente.');
      
      const newItem: ShoppingItem = await response.json();
      
      // Actualizar el estado con el nuevo ítem
      set(state => ({
        items: [...state.items, newItem]
      }));

    } catch (error: any) {
      console.error('Add item error:', error);
      set({ error: error.message || 'Error desconocido al añadir ítem.' });
    } finally {
      set({ isLoading: false });
    }
  },
}));