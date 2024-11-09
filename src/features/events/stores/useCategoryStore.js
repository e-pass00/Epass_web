import { create } from 'zustand';

export const useCategoryStore = create((set) => ({
  activeCategory: 'Tout voir',
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
