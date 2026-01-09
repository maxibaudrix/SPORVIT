import { create } from 'zustand';
import { DayEvent } from '@/types/calendar';

type ModalMode = 'add' | 'view' | 'edit';
type EventType = 'workout' | 'meal' | 'note';

interface DailyModalStore {
  isOpen: boolean;
  selectedDate: Date | null;
  selectedEvent: DayEvent | null;
  mode: ModalMode;
  eventType: EventType | null;

  // Abrir modal para agregar evento
  openAddModal: (date: Date, eventType: EventType) => void;

  // Abrir modal para ver/editar evento existente
  openViewModal: (event: DayEvent) => void;

  // Cambiar a modo edición
  switchToEditMode: () => void;

  // Cerrar modal
  closeModal: () => void;
}

export const useDailyModal = create<DailyModalStore>((set) => ({
  isOpen: false,
  selectedDate: null,
  selectedEvent: null,
  mode: 'add',
  eventType: null,

  openAddModal: (date, eventType) =>
    set({
      isOpen: true,
      selectedDate: date,
      mode: 'add',
      eventType,
      selectedEvent: null
    }),

  openViewModal: (event) =>
    set({
      isOpen: true,
      selectedDate: event.date,
      selectedEvent: event,
      mode: 'view',
      eventType: event.type as EventType
    }),

  switchToEditMode: () =>
    set((state) => ({ ...state, mode: 'edit' })),

  closeModal: () =>
    set({
      isOpen: false,
      selectedDate: null,
      selectedEvent: null,
      mode: 'add',
      eventType: null
    }),
}));
