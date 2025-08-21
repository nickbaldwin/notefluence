import { create } from 'zustand';
import { Cell, Page, Activity } from '@/types/notebook';

interface NotebookState {
  currentPage: Page | null;
  pages: Page[];
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

interface NotebookActions {
  setCurrentPage: (page: Page | null) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type NotebookStore = NotebookState & NotebookActions;

export const useNotebookStore = create<NotebookStore>((set, get) => ({
  // State
  currentPage: null,
  pages: [],
  activities: [],
  loading: false,
  error: null,

  // Actions
  setCurrentPage: (page) => set({ currentPage: page }),
  
  updatePage: (pageId, updates) => set((state) => ({
    pages: state.pages.map(page => 
      page.id === pageId ? { ...page, ...updates } : page
    ),
    currentPage: state.currentPage?.id === pageId 
      ? { ...state.currentPage, ...updates }
      : state.currentPage
  })),
  
  addActivity: (activity) => set((state) => ({
    activities: [
      {
        ...activity,
        id: `activity-${Date.now()}-${Math.random()}`,
        createdAt: new Date()
      },
      ...state.activities.slice(0, 49) // Keep only last 50 activities
    ]
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));
