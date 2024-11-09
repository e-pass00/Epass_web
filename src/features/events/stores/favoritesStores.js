import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (eventId) =>
        set((state) => ({
          favorites: [...state.favorites, eventId],
        })),
        
      removeFavorite: (eventId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== eventId),
        })),
        
      // Modifiée pour prendre en compte interestedId
      isFavorite: (eventId, event, userId) => {
        // Vérifie si l'événement et userId existent
        if (event && userId) {
          // Vérifie si l'ID de l'utilisateur est dans le tableau interestedId
          return event.interestedId?.includes(userId);
        }
        // Fallback sur l'ancien système de favoris
        return get().favorites.includes(eventId);
      },
      
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage',
    }
  )
);