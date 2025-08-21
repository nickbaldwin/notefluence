'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Chrome } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export function LoginButton() {
  const { signInWithGoogle, signInWithGitHub } = useAuthStore();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error('Failed to sign in with Google');
      } else {
        toast.success('Redirecting to Google...');
      }
    } catch (error) {
      toast.error('Sign in failed');
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const { error } = await signInWithGitHub();
      if (error) {
        toast.error('Failed to sign in with GitHub');
      } else {
        toast.success('Redirecting to GitHub...');
      }
    } catch (error) {
      toast.error('Sign in failed');
    }
  };

  return (
    <div className="space-y-4">
      <motion.button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Chrome className="w-5 h-5 mr-3" />
        Continue with Google
      </motion.button>

      <motion.button
        onClick={handleGitHubSignIn}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Github className="w-5 h-5 mr-3" />
        Continue with GitHub
      </motion.button>
    </div>
  );
}
