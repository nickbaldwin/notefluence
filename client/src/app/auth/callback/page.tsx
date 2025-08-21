'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser, setSession } = useAuthStore();
  const { fetchProfile } = useUserProfileStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed');
          // Redirect to appropriate URL based on environment
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          const redirectUrl = isLocalhost ? 'http://localhost:3000' : 'https://notefluence.vercel.app';
          window.location.href = redirectUrl;
          return;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          
          // Fetch or create user profile
          try {
            await fetchProfile(session.user.id);
            toast.success('Successfully signed in!');
            
            // Check if user needs onboarding
            const profile = useUserProfileStore.getState().profile;
            if (profile && !profile.is_onboarded) {
              const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
              const baseUrl = isLocalhost ? 'http://localhost:3000' : 'https://notefluence.vercel.app';
              window.location.href = `${baseUrl}/onboarding`;
            } else {
              const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
              const baseUrl = isLocalhost ? 'http://localhost:3000' : 'https://notefluence.vercel.app';
              window.location.href = baseUrl;
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
            toast.success('Successfully signed in!');
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const baseUrl = isLocalhost ? 'http://localhost:3000' : 'https://notefluence.vercel.app';
            window.location.href = baseUrl;
          }
        } else {
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          const baseUrl = isLocalhost ? 'http://localhost:3000' : 'https://notefluence.vercel.app';
          window.location.href = baseUrl;
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const baseUrl = isLocalhost ? 'http://localhost:3000' : 'https://notefluence.vercel.app';
        window.location.href = baseUrl;
      }
    };

    handleAuthCallback();
  }, [router, setUser, setSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we complete your authentication.
        </p>
      </motion.div>
    </div>
  );
}
