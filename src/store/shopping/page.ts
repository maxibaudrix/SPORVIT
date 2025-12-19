import { create } from 'zustand';

// --- Tipos de Datos ---

export type Category = 'Proteínas' | 'Vegetales' | 'Granos' | 'Lácteos' | 'Otros';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g., 'g', 'ml', 'unidades'
  category: Category;
  isPurchased: boolean;
  recipeCount: number; // Para cuántas recetas se necesita
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E'; // Asumido para el Healthscore
  estimatedPrice: number;
}

export interface ShoppingListState {
  items: ShoppingItem[];
  healthScore: number;
  totalBudget: number;
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchList: () => Promise<void>;
  toggleItem: (itemId: string) => Promise<void>;
  generateFromPlan: () => Promise<void>;
  addItem: (item: Omit<ShoppingItem, 'id' | 'isPurchased'>) => Promise<void>;
}

export const useShoppingStore = create<ShoppingListState>((set, get) => ({
  items: [
    // Datos de ejemplo iniciales para desarrollo
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

  fetchList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/shopping');
      if (!response.ok) throw new Error('Error al cargar la lista de compras.');
      
      const data = await response.json();
      set({ items: data.items, healthScore: data.healthScore, totalBudget: data.totalBudget });

    } catch (error: any) {
      set({ error: error.message || 'Error desconocido al cargar.' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleItem: async (itemId: string) => {
    const itemToToggle = get().items.find(item => item.id === itemId);
    if (!itemToToggle) return;

    // Optimistic update
    set(state => ({
      items: state.items.map(item =>
        item.id === itemId ? { ...item, isPurchased: !item.isPurchased } : item
      ),
    }));

    try {
      const response = await fetch(`/api/shopping/item/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPurchased: !itemToToggle.isPurchased }),
      });

      if (!response.ok) {
        // Rollback on failure
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, isPurchased: itemToToggle.isPurchased } : item
          ),
          error: 'Fallo al actualizar el estado del ítem.'
        }));
        throw new Error('Fallo al actualizar el estado del ítem en la API.');
      }
    } catch (error: any) {
      console.error(error);
      set({ error: error.message || 'Error de red.' });
    }
  },

  generateFromPlan: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/shopping/generate', { method: 'POST' });
      if (!response.ok) throw new Error('Error al generar la lista desde el Meal Plan.');
      
      const data = await response.json();
      set({ items: data.items, healthScore: data.healthScore, totalBudget: data.totalBudget });

    } catch (error: any) {
      set({ error: error.message || 'Error desconocido al generar la lista.' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/shopping/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error('Error al añadir el ítem manualmente.');
      
      const newItem = await response.json();
      set(state => ({
        items: [...state.items, newItem]
      }));

    } catch (error: any) {
      set({ error: error.message || 'Error desconocido al añadir ítem.' });
    } finally {
      set({ isLoading: false });
    }
  },
}));