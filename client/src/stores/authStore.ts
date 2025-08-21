import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useUserProfileStore } from './userProfileStore';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

interface AuthActions {
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
  signInWithGitHub: () => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  initialize: () => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,
  error: null,

  signInWithGoogle: async () => {
    // Determine the correct redirect URL based on the current environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const redirectUrl = isLocalhost 
      ? 'http://localhost:3000/auth/callback'
      : 'https://notefluence.vercel.app/auth/callback';
    
    console.log('Signing in with Google, redirect URL:', redirectUrl, 'Current origin:', window.location.origin);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    return { data, error };
  },

  signInWithGitHub: async () => {
    // Determine the correct redirect URL based on the current environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const redirectUrl = isLocalhost 
      ? 'http://localhost:3000/auth/callback'
      : 'https://notefluence.vercel.app/auth/callback';
    
    console.log('Signing in with GitHub, redirect URL:', redirectUrl, 'Current origin:', window.location.origin);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          scope: 'read:user user:email',
        },
      }
    });
    return { data, error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
    // Clear user profile on sign out
    useUserProfileStore.getState().clearProfile();
  },

  initialize: () => {
    console.log('Initializing auth store...');
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Auth initialization timeout - forcing completion');
      set({ 
        loading: false,
        initialized: true,
        error: 'Initialization timeout'
      });
    }, 5000);
    
    try {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        clearTimeout(timeout);
        console.log('Got session:', session, 'Error:', error);
        
        if (error) {
          console.error('Error getting session:', error);
          set({ 
            error: error.message,
            loading: false,
            initialized: true 
          });
        } else {
          set({ 
            session, 
            user: session?.user ?? null,
            loading: false,
            initialized: true,
            error: null
          });
        }
      }).catch((error) => {
        clearTimeout(timeout);
        console.error('Error in getSession:', error);
        set({ 
          error: error.message,
          loading: false,
          initialized: true 
        });
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session);
          set({ 
            session, 
            user: session?.user ?? null,
            loading: false,
            initialized: true,
            error: null
          });

          // Fetch user profile when user is authenticated
          if (session?.user) {
            useUserProfileStore.getState().fetchProfile(session.user.id);
          } else {
            // Clear profile when user is not authenticated
            useUserProfileStore.getState().clearProfile();
          }
        }
      );

      // Cleanup subscription on unmount
      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    } catch (error) {
      clearTimeout(timeout);
      console.error('Error in initialize:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
        initialized: true 
      });
    }
  },

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setInitialized: (initialized: boolean) => set({ initialized }),
}));
