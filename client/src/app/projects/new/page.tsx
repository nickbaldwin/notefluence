'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Lock, 
  Globe, 
  FileText,
  Settings,
  Plus,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useProjectStore } from '@/stores/projectStore';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useProjectStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'private' as 'private' | 'public' | 'team',
    template: 'blank' as 'blank' | 'documentation' | 'notebook' | 'api-docs',
    tags: [] as string[],
    collaborators: [] as string[]
  });
  
  const [newTag, setNewTag] = useState('');
  const [newCollaborator, setNewCollaborator] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const templates = [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start with an empty project',
      icon: FileText
    },
    {
      id: 'documentation',
      name: 'Documentation',
      description: 'Pre-configured for documentation with common pages',
      icon: FileText
    },
    {
      id: 'notebook',
      name: 'Data Notebook',
      description: 'Jupyter-style notebook for data analysis',
      icon: FileText
    },
    {
      id: 'api-docs',
      name: 'API Documentation',
      description: 'Template for API documentation',
      icon: Settings
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCollaborator = () => {
    if (newCollaborator.trim() && !formData.collaborators.includes(newCollaborator.trim())) {
      setFormData(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, newCollaborator.trim()]
      }));
      setNewCollaborator('');
    }
  };

  const removeCollaborator = (collaboratorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(collab => collab !== collaboratorToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      console.error('Project title is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Creating project with data:', formData);
      
      const newProject = await createProject({
        title: formData.title,
        description: formData.description,
        isPublic: formData.visibility === 'public'
      });
      
      console.log('Project created successfully:', newProject);
      
      // Show success toast
      toast.success(`Project "${formData.title}" created successfully!`);
      
      console.log('Navigating to new project...');
      
      // Navigate to the newly created project
      router.push(`/projects/${newProject.slug}`);
      
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set up a new project to organize your documentation and notebooks
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter project title..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>
            </div>
          </motion.div>

          {/* Template Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Choose a Template
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.template === template.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => handleInputChange('template', template.id)}
                >
                  <div className="flex items-start space-x-3">
                    <template.icon className={`w-5 h-5 mt-0.5 ${
                      formData.template === template.id
                        ? 'text-primary-600'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                    <div>
                      <h3 className={`font-medium ${
                        formData.template === template.id
                          ? 'text-primary-900 dark:text-primary-100'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {template.name}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        formData.template === template.id
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visibility & Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Visibility & Access
            </h2>
            
            <div className="space-y-3">
              {[
                { id: 'private', label: 'Private', description: 'Only you can see this project', icon: Lock },
                { id: 'team', label: 'Team', description: 'Only team members can access', icon: Users },
                { id: 'public', label: 'Public', description: 'Anyone can view this project', icon: Globe }
              ].map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.visibility === option.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('visibility', option.id)}
                >
                  <option.icon className={`w-5 h-5 mr-3 ${
                    formData.visibility === option.id
                      ? 'text-primary-600'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <div>
                    <div className={`font-medium ${
                      formData.visibility === option.id
                        ? 'text-primary-900 dark:text-primary-100'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {option.label}
                    </div>
                    <div className={`text-sm ${
                      formData.visibility === option.id
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {option.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tags
            </h2>
            
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-end space-x-4"
          >
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!formData.title.trim() || isLoading}
              className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
}
