'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  Share, 
  BookOpen,
  FileText,
  Code,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Lock,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { NotebookEditor } from '@/components/Notebook/NotebookEditor';
import { useProjectStore } from '@/stores/projectStore';
// Using the Project interface from projectStore which matches Supabase schema
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

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectSlug = params.slug as string;
  const { projects } = useProjectStore();
  
  const [activeTab, setActiveTab] = useState<'notebook' | 'pages' | 'settings'>('notebook');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Static mock data for immediate access
  const mockProjects = [
    {
      id: '1',
      title: 'Getting Started Guide',
      description: 'A comprehensive guide to using our platform',
      slug: 'getting-started-guide',
      is_public: true,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: '1',
      pages_count: 5,
      activities_count: 3,
    },
    {
      id: '2',
      title: 'API Documentation',
      description: 'Complete API reference and examples',
      slug: 'api-documentation',
      is_public: false,
      is_archived: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: '1',
      pages_count: 12,
      activities_count: 1,
    },
    {
      id: '3',
      title: 'Data Analysis Project',
      description: 'Interactive notebooks for data analysis',
      slug: 'data-analysis-project',
      is_public: true,
      is_archived: false,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: '1',
      pages_count: 8,
      activities_count: 2,
    },
  ];

  // Find project from both store and mock data
  const storeProject = projects.find(p => p.slug === projectSlug);
  const mockProject = mockProjects.find(p => p.slug === projectSlug);
  const project = storeProject || mockProject;

  if (!project) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">Project not found</h3>
              <p className="text-sm">The project "{projectSlug}" doesn't exist or has been moved.</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const mockPages = [
    { id: '1', title: 'Introduction', type: 'markdown', updatedAt: new Date() },
    { id: '2', title: 'Data Analysis', type: 'notebook', updatedAt: new Date(Date.now() - 86400000) },
    { id: '3', title: 'API Documentation', type: 'markdown', updatedAt: new Date(Date.now() - 172800000) },
  ];

  const filteredPages = mockPages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {project.title}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-gray-600 dark:text-gray-400">
                    {project.description}
                  </p>
                                           {project.is_public ? (
                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                             <Globe className="w-3 h-3 mr-1" />
                             Public
                           </span>
                         ) : (
                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                             <Lock className="w-3 h-3 mr-1" />
                             Private
                           </span>
                         )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Share className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Users className="w-4 h-4 mr-2" />
                Collaborators
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'notebook', label: 'Notebook', icon: Code },
              { id: 'pages', label: 'Pages', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'notebook' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <NotebookEditor
              projectId={project.id}
              pageId="main-notebook"
            />
          </motion.div>
        )}

        {activeTab === 'pages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                New Page
              </button>
            </div>

            {/* Pages Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPages.map((page) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {page.type === 'notebook' ? (
                          <Code className="w-5 h-5 text-primary-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-600" />
                        )}
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {page.title}
                        </h3>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{page.type}</span>
                      <span>Updated {page.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPages.map((page) => (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {page.type === 'notebook' ? (
                            <Code className="w-5 h-5 text-primary-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-gray-600" />
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {page.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {page.type} • Updated {page.updatedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Project settings and configuration options will be available here.
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
