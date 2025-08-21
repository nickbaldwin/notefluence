import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are properly set
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_project_url_here' || 
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.warn('⚠️ Supabase environment variables not properly configured. Please update client/.env.local with your real Supabase credentials.');
}

// Use fallback values for development
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder_key_for_dev';

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          provider?: string | null;
          provider_id?: string | null;
          is_onboarded?: boolean;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          provider?: string | null;
          provider_id?: string | null;
          is_onboarded?: boolean;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          slug: string;
          is_public: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
          owner_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          slug: string;
          is_public?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
          owner_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          slug?: string;
          is_public?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
          owner_id?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          title: string;
          content: any;
          type: string;
          order_index: number;
          project_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content?: any;
          type?: string;
          order_index: number;
          project_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: any;
          type?: string;
          order_index?: number;
          project_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          type: string;
          project_id: string;
          page_id: string | null;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          project_id: string;
          page_id?: string | null;
          metadata?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          project_id?: string;
          page_id?: string | null;
          metadata?: any;
          created_at?: string;
        };
      };
    };
  };
}
