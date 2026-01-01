// src/components/ui/layout/dashboard/sidebar/CalculatorsBrowser.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Star } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { 
  CALCULATORS, 
  CALCULATOR_CATEGORIES, 
  searchCalculators,
  getCalculatorsByCategory 
} from '@/config/calculators';
import type { CalculatorConfig } from '@/config/calculators';

export default function CalculatorsBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['nutrition', 'training']);
  
  const {
    openCalculator,
    activeCalculator,
    favoriteCalculators,
    recentCalculators,
    toggleFavorite,
  } = useSidebarStore();

  // Filtered calculators
  const filteredCalculators = useMemo(() => {
    if (searchQuery.trim()) {
      return searchCalculators(searchQuery);
    }
    return CALCULATORS.filter(calc => calc.phase === 1); // Solo Fase 1 por ahora
  }, [searchQuery]);

  // Toggle category
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Get calculators by category for display
  const calculatorsByCategory = useMemo(() => {
    const categories: Record<string, CalculatorConfig[]> = {};
    
    filteredCalculators.forEach(calc => {
      if (!categories[calc.category]) {
        categories[calc.category] = [];
      }
      categories[calc.category].push(calc);
    });
    
    return categories;
  }, [filteredCalculators]);

  // Render calculator item
  const CalculatorItem = ({ calculator }: { calculator: CalculatorConfig }) => {
    const Icon = calculator.icon;
    const isFavorite = favoriteCalculators.includes(calculator.id);
    const isActive = activeCalculator === calculator.id;

    return (
      <div
        className={`
          group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
          transition-colors
          ${isActive 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'hover:bg-slate-800 text-slate-300'
          }
        `}
        onClick={() => openCalculator(calculator.id)}
      >
        {/* Icon */}
        <Icon className="w-4 h-4 flex-shrink-0" />
        
        {/* Name */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{calculator.name}</div>
          <div className="text-xs text-slate-500 truncate">{calculator.description}</div>
        </div>

        {/* Favorite toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(calculator.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <Star 
            className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`}
          />
        </button>

        {/* Arrow */}
        <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white mb-3">Calculadoras</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Recientes */}
        {!searchQuery && recentCalculators.length > 0 && (
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              ⏱️ Recientes
            </div>
            <div className="space-y-1">
              {recentCalculators.slice(0, 3).map(calcId => {
                const calc = CALCULATORS.find(c => c.id === calcId);
                if (!calc) return null;
                return <CalculatorItem key={calcId} calculator={calc} />;
              })}
            </div>
          </div>
        )}

        {/* Favoritos */}
        {!searchQuery && favoriteCalculators.length > 0 && (
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              ⭐ Favoritos
            </div>
            <div className="space-y-1">
              {favoriteCalculators.map(calcId => {
                const calc = CALCULATORS.find(c => c.id === calcId);
                if (!calc) return null;
                return <CalculatorItem key={calcId} calculator={calc} />;
              })}
            </div>
          </div>
        )}

        {/* Categories */}
        {Object.entries(calculatorsByCategory).map(([categoryId, calcs]) => {
          const category = CALCULATOR_CATEGORIES[categoryId as keyof typeof CALCULATOR_CATEGORIES];
          if (!category) return null;
          
          const isExpanded = expandedCategories.includes(categoryId);

          return (
            <div key={categoryId}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(categoryId)}
                className="w-full flex items-center justify-between py-2 text-sm font-medium text-white hover:text-emerald-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="text-xs text-slate-500">({calcs.length})</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="mt-1 space-y-1 ml-2">
                  {calcs.map(calc => (
                    <CalculatorItem key={calc.id} calculator={calc} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* No results */}
        {filteredCalculators.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No se encontraron calculadoras</p>
          </div>
        )}
      </div>
    </div>
  );
}