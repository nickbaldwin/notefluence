'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Users, 
  Settings,
  Upload,
  Download,
  Share2
} from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    name: 'New Project',
    description: 'Create a new project',
    icon: Plus,
    href: '/projects/new',
    color: 'bg-blue-500',
  },
  {
    name: 'New Page',
    description: 'Add a new page to existing project',
    icon: FileText,
    href: '/pages/new',
    color: 'bg-green-500',
  },
  {
    name: 'Invite Team',
    description: 'Invite collaborators',
    icon: Users,
    href: '/team/invite',
    color: 'bg-purple-500',
  },
  {
    name: 'Import Data',
    description: 'Import from external sources',
    icon: Upload,
    href: '/import',
    color: 'bg-orange-500',
  },
  {
    name: 'Export Project',
    description: 'Export your project',
    icon: Download,
    href: '/export',
    color: 'bg-indigo-500',
  },
  {
    name: 'Share Project',
    description: 'Share with others',
    icon: Share2,
    href: '/share',
    color: 'bg-pink-500',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={action.href}
              className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {action.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
