import { create } from 'zustand';

interface DailyModalStore {
  isOpen: boolean;
  selectedDate: Date | null;
  openModal: (date: Date) => void;
  closeModal: () => void;
}

export const useDailyModal = create<DailyModalStore>((set) => ({
  isOpen: false,
  selectedDate: null,
  openModal: (date) => set({ isOpen: true, selectedDate: date }),
  closeModal: () => set({ isOpen: false, selectedDate: null }),
}));
