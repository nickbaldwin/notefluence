'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  Folder, 
  Calendar, 
  Users, 
  FileText,
  Globe,
  Lock
} from 'lucide-react';
import { extractCount } from '@/utils/countHelpers';

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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  {project.is_public ? (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <Globe className="w-3 h-3" />
                      <span className="text-xs font-medium">Public</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <Lock className="w-3 h-3" />
                      <span className="text-xs font-medium">Private</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {project.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{extractCount(project.pages_count)} pages</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{extractCount(project.activities_count)} activities</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.updated_at)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
