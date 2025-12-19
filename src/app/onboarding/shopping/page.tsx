'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useShoppingStore, ShoppingItem, Category } from '@/store/shopping'; // Corregida la ruta de importación
import { Share2, Search, Zap, CheckCircle2, ShoppingCart, Loader2, RefreshCw } from 'lucide-react';

// Componente Placeholder para el ProductCard (asumido)
const ProductCard: React.FC<{ item: ShoppingItem }> = ({ item }) => (
  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full text-sm font-bold shadow-md border border-gray-100">
    {item.nutriScore}
  </div>
);

// --- Componentes Reutilizables ---

const HealthScoreIndicator: React.FC<{ score: number }> = ({ score }) => {
  let colorClass = 'bg-green-500';
  if (score < 80) colorClass = 'bg-yellow-500';
  if (score < 60) colorClass = 'bg-red-500';

  return (
    <div className="flex items-center space-x-2 p-2 bg-white rounded-xl shadow-lg">
      <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
      <span className="text-sm font-medium text-gray-700">Healthscore: <span className="font-bold">{score}%</span></span>
    </div>
  );
};

const FilterButton: React.FC<{ 
  label: string, 
  value: string, 
  current: string, 
  onClick: (value: string) => void 
}> = ({ label, value, current, onClick }) => {
  const isActive = current === value;
  return (
    <button 
      onClick={() => onClick(value)}
      className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
        }`}
    >
      {label}
    </button>
  );
};


// --- Componente Principal ---

const ShoppingPage: React.FC = () => {
  const { items, healthScore, totalBudget, isLoading, fetchList, toggleItem, generateFromPlan } = useShoppingStore();
  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  // Cargar la lista al montar el componente
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const categoryMatch = filterCategory === 'Todas' || item.category === filterCategory;
      const statusMatch = filterStatus === 'Todos' || 
                          (filterStatus === 'Pendientes' && !item.isPurchased) || 
                          (filterStatus === 'Comprados' && item.isPurchased);
      return categoryMatch && statusMatch;
    });
  }, [items, filterCategory, filterStatus]);

  const purchasedCount = items.filter(item => item.isPurchased).length;
  const totalItems = items.length;
  const categories: (Category | 'Todas')[] = ['Todas', 'Proteínas', 'Vegetales', 'Granos', 'Lácteos', 'Otros'];
  const statusOptions = ['Todos', 'Pendientes', 'Comprados'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-4 pb-28 font-sans">
      
      {/* Header */}
      <header className="px-4 pb-4 bg-white shadow-lg sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Lista de Compra</h1>
        
        <div className="flex justify-between items-center mb-4">
          <HealthScoreIndicator score={healthScore} />
          <button 
            onClick={generateFromPlan}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Generar desde Meal Plan</span>
            <span className="sm:hidden">Generar</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600">Filtros</h2>
          
          {/* Categoría */}
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <FilterButton 
                key={cat} 
                label={cat} 
                value={cat} 
                current={filterCategory} 
                onClick={setFilterCategory} 
              />
            ))}
          </div>
          
          {/* Estado */}
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {statusOptions.map(status => (
              <FilterButton 
                key={status} 
                label={status} 
                value={status} 
                current={filterStatus} 
                onClick={setFilterStatus} 
              />
            ))}
          </div>
        </div>
      </header>
      
      {/* Lista de Productos */}
      <main className="flex-grow p-4">
        {isLoading && items.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <Loader2 className="w-8 h-8 mx-auto animate-spin" />
            <p className="mt-2">Cargando lista...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center p-10 text-gray-500 bg-white rounded-2xl shadow-inner">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3" />
            <p className="font-semibold">No hay ítems en esta vista.</p>
            <p className="text-sm">Ajusta los filtros o genera la lista desde tu Meal Plan.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredItems.map(item => (
              <li 
                key={item.id} 
                className={`flex items-center p-4 bg-white rounded-2xl shadow-md transition-all ${item.isPurchased ? 'opacity-60 border-l-4 border-green-500' : 'border-l-4 border-white hover:shadow-lg'}`}
              >
                {/* Checkbox */}
                <button 
                  onClick={() => toggleItem(item.id)}
                  disabled={isLoading}
                  className="flex-shrink-0 w-8 h-8 rounded-full border-2 transition-colors mr-4"
                >
                  {item.isPurchased ? (
                    <CheckCircle2 className="w-full h-full text-green-500 bg-white" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-full border-gray-300"></div>
                  )}
                </button>

                {/* Detalles del Ítem */}
                <div className="flex-grow min-w-0">
                  <p className={`font-semibold text-lg truncate ${item.isPurchased ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {item.name}
                  </p>
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <span>{item.quantity}{item.unit}</span>
                    <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                    <span>{item.category}</span>
                    <span className="hidden sm:inline">({item.recipeCount} recetas)</span>
                  </div>
                </div>

                {/* Nutri-Score y Acciones */}
                <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
                  <ProductCard item={item} />
                  
                  <div className="flex flex-col items-end min-w-[50px]">
                    <span className="text-md font-bold text-gray-700">{item.estimatedPrice.toFixed(2)}€</span>
                    <span className="text-xs text-gray-400">Est.</span>
                  </div>

                  <button 
                    title="Ver Alternativas"
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Footer Sticky */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-indigo-600 shadow-2xl p-4 z-20">
        <div className="flex justify-between items-center text-gray-700">
          {/* Estadísticas */}
          <div className="flex flex-col text-sm font-medium">
            <p>Total Items: <span className="font-bold">{totalItems}</span></p>
            <p>Comprados: <span className={`font-bold ${purchasedCount === totalItems ? 'text-green-600' : 'text-indigo-600'}`}>{purchasedCount} / {totalItems}</span></p>
          </div>

          {/* Presupuesto */}
          <div className="flex flex-col items-center text-sm font-medium">
            <span className="text-xs text-gray-500">Presupuesto Estimado</span>
            <span className="text-2xl font-extrabold text-indigo-700">{totalBudget.toFixed(2)}€</span>
          </div>
          
          {/* Botón Compartir */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Compartir lista</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ShoppingPage;