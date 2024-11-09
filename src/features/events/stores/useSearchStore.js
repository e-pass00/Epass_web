import { create } from 'zustand';

const useSearchStore = create((set) => ({
  searchTerm: '',
  searchResults: [],
  isModalOpen: false,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setSearchResults: (results) => set({ searchResults: results }),
  openSearchModal: () => set({ isModalOpen: true }),
  closeSearchModal: () =>
    set((state) => ({
      isModalOpen: false,
      searchTerm: '', // Reset search term when closing modal
      searchResults: [], // Reset results when closing modal
    })),

  searchEvents: (events, term) => {
    if (!term.trim()) {
      set({ searchResults: [] });
      return;
    }

    const filtered = events.filter((event) => {
      const searchTerm = term.toLowerCase();
      return (
        event.name.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm) ||
        event.city.toLowerCase().includes(searchTerm) ||
        event.locationName.toLowerCase().includes(searchTerm)
      );
    });

    set({ searchResults: filtered });
  },
}));

export default useSearchStore;
