'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { CheckCircle, User, Settings, BookOpen, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, setOnboarded, updateProfile } = useUserProfileStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    preferences: {
      theme: 'system',
      notifications: true,
      default_project_type: 'notebook'
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        preferences: {
          ...prev.preferences,
          ...profile.preferences
        }
      }));
    }
  }, [profile]);

  const handleNext = async () => {
    if (currentStep === 1) {
      // Update user profile
      if (user && formData.full_name.trim()) {
        try {
          await updateProfile(user.id, {
            full_name: formData.full_name.trim(),
            preferences: formData.preferences
          });
          setCurrentStep(2);
        } catch (error) {
          toast.error('Failed to update profile');
        }
      } else {
        toast.error('Please enter your name');
      }
    } else if (currentStep === 2) {
      // Complete onboarding
      if (user) {
        try {
          await setOnboarded(user.id);
          toast.success('Welcome to Notefluence!');
          router.push('/');
        } catch (error) {
          toast.error('Failed to complete onboarding');
        }
      }
    }
  };

  const handleSkip = async () => {
    if (user) {
      try {
        await setOnboarded(user.id);
        toast.success('Welcome to Notefluence!');
        router.push('/');
      } catch (error) {
        toast.error('Failed to complete onboarding');
      }
    }
  };

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Notefluence
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's get you set up in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
          </div>
        </div>

        {/* Step 1: Profile Setup */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Theme
              </label>
              <select
                value={formData.preferences.theme}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, theme: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={formData.preferences.notifications}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, notifications: e.target.checked }
                }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable notifications
              </label>
            </div>
          </motion.div>
        )}

        {/* Step 2: Welcome */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                You're all set!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome to Notefluence. You can now start creating your first project and explore all the features.
              </p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="mt-8 flex space-x-3">
          {currentStep === 1 && (
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Skip for now
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {currentStep === 1 ? (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
