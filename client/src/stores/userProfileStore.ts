import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  provider_id: string | null;
  is_onboarded: boolean;
  preferences: any;
  created_at: string;
  updated_at: string;
}

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

interface UserProfileActions {
  fetchProfile: (userId: string) => Promise<void>;
  createProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  setOnboarded: (userId: string) => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}

type UserProfileStore = UserProfileState & UserProfileActions;

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User profile doesn't exist yet, create it
          await get().createProfile(userId);
        } else {
          throw error;
        }
      } else {
        set({ profile: data, loading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        loading: false 
      });
    }
  },

  createProfile: async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: user.email!,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          provider: user.app_metadata?.provider || null,
          provider_id: user.user_metadata?.provider_id || null,
          is_onboarded: false,
          preferences: {}
        })
        .select()
        .single();

      if (error) throw error;
      set({ profile: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create profile',
        loading: false 
      });
    }
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      set({ profile: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile',
        loading: false 
      });
    }
  },

  setOnboarded: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ is_onboarded: true })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update onboarding status'
      });
    }
  },

  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearProfile: () => set({ profile: null, loading: false, error: null }),
}));
