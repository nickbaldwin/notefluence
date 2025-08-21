'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, BookOpen, Users, Activity, FolderOpen, FileText, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import ProjectCard from '@/components/Projects/ProjectCard';
import { ActivityFeed } from '@/components/Dashboard/ActivityFeed';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { LoginButton } from '@/components/Auth/LoginButton';
import { useAuthStore } from '@/stores/authStore';
import { useProjectStore } from '@/stores/projectStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { extractCount } from '@/utils/countHelpers';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const { user, session, loading, initialized, error, signOut, initialize, setLoading, setUser, setInitialized } = useAuthStore();
  const { projects, loading: projectsLoading, fetchProjects } = useProjectStore();
  const { profile, loading: profileLoading } = useUserProfileStore();

  // Initialize auth on mount
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // Fetch projects when user is authenticated
  useEffect(() => {
    if (user && initialized) {
      fetchProjects();
    }
  }, [user, initialized, fetchProjects]);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects, searchQuery]);

  const stats = {
    totalProjects: projects.length,
    totalPages: projects.reduce((acc, project) => acc + extractCount(project.pages_count), 0),
    totalActivities: projects.reduce((acc, project) => acc + extractCount(project.activities_count), 0),
    recentActivity: projects.filter(p => p.updated_at && new Date(p.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
  };

    // Show loading state
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="text-sm">Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show authentication required screen
  if (initialized && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to continue.
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }



  // Show dashboard for authenticated users or debug mode
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {profile?.full_name || user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </span>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={FolderOpen}
            color="blue"
          />
          <StatsCard
            title="Total Pages"
            value={stats.totalPages}
            icon={FileText}
            color="green"
          />
          <StatsCard
            title="Total Activities"
            value={stats.totalActivities}
            icon={Activity}
            color="purple"
          />
          <StatsCard
            title="Recent Activity"
            value={stats.recentActivity}
            icon={BookOpen}
            color="orange"
          />
        </div>

        {/* Search and Create */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <Link
            href="/projects/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </div>

        {/* Projects Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Projects
          </h2>
          
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get started by creating your first project
              </p>
              <Link
                href="/projects/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions and Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
