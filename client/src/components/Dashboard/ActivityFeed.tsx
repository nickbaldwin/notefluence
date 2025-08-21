'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Edit, 
  Plus,
  Eye,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const mockActivities = [
  {
    id: '1',
    type: 'project_created',
    title: 'Created new project',
    description: 'Getting Started Guide',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    icon: Plus,
    color: 'text-green-600',
  },
  {
    id: '2',
    type: 'page_updated',
    title: 'Updated page',
    description: 'Introduction to Notebooks',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    icon: Edit,
    color: 'text-blue-600',
  },
  {
    id: '3',
    type: 'member_added',
    title: 'Added team member',
    description: 'john.doe@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    icon: Users,
    color: 'text-purple-600',
  },
  {
    id: '4',
    type: 'project_viewed',
    title: 'Viewed project',
    description: 'API Documentation',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    icon: Eye,
    color: 'text-gray-600',
  },
  {
    id: '5',
    type: 'page_created',
    title: 'Created new page',
    description: 'Authentication Guide',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    icon: FileText,
    color: 'text-orange-600',
  },
];

export const ActivityFeed: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {mockActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <div className={`flex-shrink-0 p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
              <activity.icon className={`h-4 w-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activity.description}
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {mockActivities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No recent activity
          </p>
        </div>
      )}
    </div>
  );
};
