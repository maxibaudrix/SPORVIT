'use client';

import { useEffect, useState } from 'react';
import { X, Dumbbell, Salad, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDailyModal } from '@/hooks/useDailyModal';
import { WorkoutDetails } from '@/components/dashboard/event-details/WorkoutDetails';
import { MealDetails } from '@/components/dashboard/event-details/MealDetails';
import { RestDayDetails } from '@/components/dashboard/event-details/RestDayDetails';
import { RecipeBrowser } from '@/components/recipes/RecipeBrowser';
import { RecipeDetailModal } from '@/components/recipes/RecipeDetailModal';
import { Recipe } from '@/lib/recipeUtils';

export const DailyModal = () => {
  const {
    isOpen,
    selectedDate,
    selectedEvent,
    mode,
    eventType,
    closeModal,
    switchToEditMode,
    openAddModal
  } = useDailyModal();

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Estados para el flujo de recetas
  const [showRecipeBrowser, setShowRecipeBrowser] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('breakfast');

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          closeModal();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, showDeleteConfirm, closeModal]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !selectedDate) return null;

  const formattedDate = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });

  // Handler para eliminar evento
  const handleDelete = async () => {
    if (!selectedEvent) return;

    setIsDeleting(true);
    try {
      const endpoint =
        selectedEvent.type === 'workout'
          ? `/api/workouts/${selectedEvent.id}`
          : `/api/meals/${selectedEvent.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        closeModal();
        // Recargar la página para refrescar los eventos
        window.location.reload();
      } else {
        console.error('Error al eliminar evento');
        alert('No se pudo eliminar el evento. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Handler para toggle complete (solo para workouts)
  const handleToggleComplete = async () => {
    if (!selectedEvent || selectedEvent.type !== 'workout') return;

    try {
      const response = await fetch(`/api/workouts/${selectedEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !selectedEvent.completed,
          completedAt: !selectedEvent.completed ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        // Recargar para refrescar
        window.location.reload();
      } else {
        alert('No se pudo actualizar el estado.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión.');
    }
  };

  // Handler para abrir el browser de recetas
  const handleOpenRecipeBrowser = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowRecipeBrowser(true);
  };

  // Handler cuando se selecciona una receta del browser
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeBrowser(false);
    setShowRecipeDetail(true);
  };

  // Handler para agregar receta al plan
  const handleAddRecipeToMeal = async (recipe: Recipe, portions: number) => {
    if (!selectedDate) return;

    try {
      const response = await fetch('/api/user/meals/add-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeSlug: recipe.slug,
          date: selectedDate.toISOString(),
          mealType: selectedMealType,
          portions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        setShowRecipeDetail(false);
        setSelectedRecipe(null);
        closeModal();
        // Recargar para ver la nueva comida
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error || 'No se pudo agregar la receta'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión. Por favor intenta de nuevo.');
    }
  };

  // Reset estados de recetas cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setShowRecipeBrowser(false);
      setSelectedRecipe(null);
      setShowRecipeDetail(false);
    }
  }, [isOpen]);

  // Renderizar contenido según el modo y tipo de evento
  const renderContent = () => {
    // Modo: Ver evento existente
    if (mode === 'view' && selectedEvent) {
      if (selectedEvent.type === 'workout') {
        return (
          <WorkoutDetails
            event={selectedEvent as any}
            mode="view"
            onEdit={switchToEditMode}
            onDelete={() => setShowDeleteConfirm(true)}
            onToggleComplete={handleToggleComplete}
          />
        );
      }

      if (selectedEvent.type === 'meal') {
        return (
          <MealDetails
            event={selectedEvent as any}
            mode="view"
            onEdit={switchToEditMode}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        );
      }

      if (selectedEvent.type === 'rest') {
        return (
          <RestDayDetails
            event={selectedEvent as any}
            dailyCalories={2000} // TODO: Obtener calorías del plan del usuario
          />
        );
      }
    }

    // Modo: Editar evento (placeholder por ahora)
    if (mode === 'edit' && selectedEvent) {
      return (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">
            La funcionalidad de edición se implementará próximamente.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Volver
          </button>
        </div>
      );
    }

    // Modo: Agregar nuevo evento
    // Si está mostrando el recipe browser, renderizar eso
    if (showRecipeBrowser) {
      return <RecipeBrowser onSelectRecipe={handleSelectRecipe} />;
    }

    return (
      <div>
        <h2 className="text-2xl font-bold text-white capitalize mb-2">
          {formattedDate}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Gestiona tus eventos del día
        </p>

        <div className="border-t border-slate-800 pt-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
            Agregar nuevo evento
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* CTA Entrenamiento */}
            <button
              onClick={() => {
                // TODO: Implementar agregar entrenamiento
                alert('Funcionalidad en desarrollo');
              }}
              className="group p-6 rounded-xl bg-red-500/10 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Entrenamiento</h3>
              <p className="text-sm text-slate-400">Programa una sesión de ejercicio</p>
            </button>

            {/* CTA Comida - Ahora con submenu */}
            <div className="group relative">
              <button
                onClick={() => {
                  const mealTypes = [
                    { value: 'breakfast', label: 'Desayuno' },
                    { value: 'lunch', label: 'Almuerzo' },
                    { value: 'dinner', label: 'Cena' },
                    { value: 'snack', label: 'Snack' },
                  ];

                  // Mostrar selector simple
                  const mealType = prompt(
                    'Selecciona el tipo de comida:\n' +
                    '1 - Desayuno\n' +
                    '2 - Almuerzo\n' +
                    '3 - Cena\n' +
                    '4 - Snack',
                    '1'
                  );

                  const selectedType = mealTypes[parseInt(mealType || '1') - 1];
                  if (selectedType) {
                    handleOpenRecipeBrowser(selectedType.value);
                  }
                }}
                className="w-full p-6 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Salad className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Comida</h3>
                <p className="text-sm text-slate-400">Buscar receta del catálogo</p>
              </button>
            </div>

            {/* CTA Nota */}
            <button
              onClick={() => {
                // TODO: Implementar agregar nota
                alert('Funcionalidad en desarrollo');
              }}
              className="group p-6 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/20 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Nota</h3>
              <p className="text-sm text-slate-400">Añade una nota o recordatorio</p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header sticky */}
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                {mode === 'view' && selectedEvent && (
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {selectedEvent.type === 'workout' ? 'Entrenamiento' : 'Comida'}
                  </div>
                )}
                {mode === 'add' && (
                  <h2 className="text-xl font-bold text-white">Agregar Evento</h2>
                )}
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body scrollable */}
          <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/80 z-[60]" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md p-6">
            <div className="bg-slate-900 rounded-xl border border-red-500/30 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">¿Eliminar evento?</h3>
                  <p className="text-sm text-slate-400">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={showRecipeDetail}
          onClose={() => {
            setShowRecipeDetail(false);
            setSelectedRecipe(null);
            setShowRecipeBrowser(true); // Volver al browser
          }}
          onAddToMeal={handleAddRecipeToMeal}
        />
      )}
    </>
  );
};
