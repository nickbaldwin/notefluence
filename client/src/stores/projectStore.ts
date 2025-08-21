import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { extractCount } from '@/utils/countHelpers';

interface Project {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  is_public: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  owner_id: string;
  pages_count?: number | { count: number } | { count: number }[];
  activities_count?: number | { count: number } | { count: number }[];
}

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (projectData: { title: string; description?: string; isPublic?: boolean }) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching projects from Supabase...');
      
      // Get current user ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch both user's own projects AND public projects from other users
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          *,
          pages_count:pages(count),
          activities_count:activities(count)
        `)
        .or(`owner_id.eq.${user.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      console.log('Projects fetched:', projects?.length || 0, 'Error:', error);

      if (error) {
        throw error;
      }
      
      set({ projects: projects || [], loading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        loading: false
      });
    }
  },

  createProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      console.log('Creating project:', projectData);
      
      // Get current user ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: projectData.title,
          description: projectData.description,
          slug: projectData.title.toLowerCase().replace(/\s+/g, '-'),
          is_public: projectData.isPublic || false,
          owner_id: user.id
        }])
        .select()
        .single();

      console.log('Project created:', data?.title, 'Error:', error);

      if (error) {
        throw error;
      }
      
      set((state) => ({
        projects: [data, ...state.projects],
        loading: false
      }));

      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create project',
        loading: false
      });
      throw error;
    }
  },

  updateProject: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      set((state) => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...data } : p
        ),
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update project',
        loading: false
      });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete project',
        loading: false
      });
    }
  },
}));
