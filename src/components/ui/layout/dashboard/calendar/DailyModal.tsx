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
import type { Recipe } from '@/lib/recipeTypes';

export const DailyModal = () => {
  const {
    isOpen,
    selectedDate,
    selectedEvent,
    mode,
    closeModal,
    switchToEditMode
  } = useDailyModal();

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Estados para el flujo de eventos
  const [showEventTypeSelector, setShowEventTypeSelector] = useState(false);
  const [showRecipeOptionsModal, setShowRecipeOptionsModal] = useState(false);
  const [showRecipeBrowser, setShowRecipeBrowser] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('breakfast');
  const [showMealTypeSelector, setShowMealTypeSelector] = useState(false);

  // Estado para toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: 'success' as 'success' | 'error' });

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

  // Reset estados de recetas cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setShowRecipeBrowser(false);
      setSelectedRecipe(null);
      setShowRecipeDetail(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Helper para mostrar toast
  const showToastNotification = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ title, description, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Early return después de todos los hooks
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
        const mealTypeLabels: { [key: string]: string } = {
          breakfast: 'desayuno',
          lunch: 'almuerzo',
          dinner: 'cena',
          snack: 'snack',
        };
        showToastNotification(
          'Receta agregada',
          `"${recipe.name}" se agregó al ${mealTypeLabels[selectedMealType] || selectedMealType}`,
          'success'
        );
        setShowRecipeDetail(false);
        setSelectedRecipe(null);
        closeModal();
        // Recargar para ver la nueva comida
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const errorData = await response.json();
        showToastNotification(
          'Error',
          errorData.error || 'No se pudo agregar la receta',
          'error'
        );
      }
    } catch (error) {
      console.error('Error:', error);
      showToastNotification(
        'Error de conexión',
        'Por favor intenta de nuevo',
        'error'
      );
    }
  };

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
      // Mapear mealType a categoría
      const categoryMap: { [key: string]: string } = {
        'breakfast': 'Desayunos',
        'lunch': 'Comidas',
        'dinner': 'Cenas',
        'snack': 'Snacks',
      };
      const initialCategory = categoryMap[selectedMealType] || 'Todas';

      return <RecipeBrowser onSelectRecipe={handleSelectRecipe} initialCategory={initialCategory} />;
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
          <button
            onClick={() => setShowEventTypeSelector(true)}
            className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/20 transition-all group flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span className="text-base font-semibold text-white">Agregar</span>
          </button>
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

      {/* Event Type Selector Modal - Principal */}
      {showEventTypeSelector && (
        <>
          <div className="fixed inset-0 bg-black/80 z-[60]" onClick={() => setShowEventTypeSelector(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md p-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">¿Qué quieres agregar?</h3>
              <div className="space-y-3">
                {/* Opción Entrenamiento */}
                <button
                  onClick={() => {
                    setShowEventTypeSelector(false);
                    alert('Funcionalidad en desarrollo');
                  }}
                  className="w-full p-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-left group flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Dumbbell className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-0.5">Entrenamiento</h4>
                    <p className="text-xs text-slate-400">Agregar sesión de ejercicio</p>
                  </div>
                </button>

                {/* Opción Comida */}
                <button
                  onClick={() => {
                    setShowEventTypeSelector(false);
                    setShowRecipeOptionsModal(true);
                  }}
                  className="w-full p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all text-left group flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Salad className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-0.5">Comida</h4>
                    <p className="text-xs text-slate-400">Agregar comida al plan</p>
                  </div>
                </button>

                {/* Opción Nota */}
                <button
                  onClick={() => {
                    setShowEventTypeSelector(false);
                    alert('Funcionalidad en desarrollo');
                  }}
                  className="w-full p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all text-left group flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-0.5">Nota</h4>
                    <p className="text-xs text-slate-400">Agregar recordatorio o nota</p>
                  </div>
                </button>
              </div>
              <button
                onClick={() => setShowEventTypeSelector(false)}
                className="w-full mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Recipe Options Modal - Buscar o Ingresar Manualmente */}
      {showRecipeOptionsModal && (
        <>
          <div className="fixed inset-0 bg-black/80 z-[60]" onClick={() => setShowRecipeOptionsModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md p-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">¿Cómo quieres agregar la comida?</h3>
              <div className="space-y-3">
                {/* Opción Buscar Receta */}
                <button
                  onClick={() => {
                    setShowRecipeOptionsModal(false);
                    setShowMealTypeSelector(true);
                  }}
                  className="w-full p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all text-left group flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Salad className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-0.5">Buscar receta</h4>
                    <p className="text-xs text-slate-400">Del catálogo de recetas</p>
                  </div>
                </button>

                {/* Opción Ingresar Manualmente */}
                <button
                  onClick={() => {
                    setShowRecipeOptionsModal(false);
                    alert('Funcionalidad en desarrollo');
                  }}
                  className="w-full p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all text-left group flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-0.5">Ingresar manualmente</h4>
                    <p className="text-xs text-slate-400">Crear receta personalizada</p>
                  </div>
                </button>
              </div>
              <button
                onClick={() => setShowRecipeOptionsModal(false)}
                className="w-full mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Meal Type Selector Modal */}
      {showMealTypeSelector && (
        <>
          <div className="fixed inset-0 bg-black/80 z-[60]" onClick={() => setShowMealTypeSelector(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md p-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Selecciona el tipo de comida</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'breakfast', label: 'Desayuno', icon: '🌅' },
                  { value: 'lunch', label: 'Almuerzo', icon: '☀️' },
                  { value: 'dinner', label: 'Cena', icon: '🌙' },
                  { value: 'snack', label: 'Snack', icon: '🍎' },
                ].map((mealType) => (
                  <button
                    key={mealType.value}
                    onClick={() => {
                      handleOpenRecipeBrowser(mealType.value);
                      setShowMealTypeSelector(false);
                    }}
                    className="p-4 rounded-lg bg-slate-800 hover:bg-emerald-500/20 hover:border-emerald-500 border border-slate-700 transition-all text-center group"
                  >
                    <div className="text-3xl mb-2">{mealType.icon}</div>
                    <div className="text-sm font-medium text-white group-hover:text-emerald-400">
                      {mealType.label}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowMealTypeSelector(false)}
                className="w-full mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[70] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`
            rounded-xl p-4 shadow-2xl border backdrop-blur-sm min-w-[320px] max-w-md
            ${toastMessage.type === 'success'
              ? 'bg-emerald-500/90 border-emerald-400 text-white'
              : 'bg-red-500/90 border-red-400 text-white'
            }
          `}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {toastMessage.type === 'success' ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">{toastMessage.title}</h4>
                <p className="text-sm opacity-90">{toastMessage.description}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
