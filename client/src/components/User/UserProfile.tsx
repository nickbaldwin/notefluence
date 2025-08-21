'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { User, Edit, Save, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export function UserProfile() {
  const { user } = useAuthStore();
  const { profile, updateProfile, loading } = useUserProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    preferences: {
      theme: 'system',
      notifications: true,
      default_project_type: 'notebook'
    }
  });

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateProfile(user.id, {
        full_name: formData.full_name.trim(),
        preferences: formData.preferences
      });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      preferences: profile?.preferences || {
        theme: 'system',
        notifications: true,
        default_project_type: 'notebook'
      }
    });
    setIsEditing(false);
  };

  if (!user || !profile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Profile
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme Preference
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

          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {profile.full_name || 'No name set'}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Provider:</span>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {profile.provider || 'Unknown'}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Theme:</span>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {profile.preferences?.theme || 'system'}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Member since:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Notifications:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile.preferences?.notifications ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
