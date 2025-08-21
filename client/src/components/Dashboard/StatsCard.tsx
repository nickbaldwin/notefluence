'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  blue: {
    icon: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    trend: 'text-blue-600',
  },
  green: {
    icon: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
    trend: 'text-green-600',
  },
  purple: {
    icon: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    trend: 'text-purple-600',
  },
  orange: {
    icon: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    trend: 'text-orange-600',
  },
  red: {
    icon: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-900/20',
    trend: 'text-red-600',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  color = 'blue',
}) => {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value.toLocaleString()}
            </p>
            {trend && (
              <div className={`ml-2 flex items-center text-sm font-medium ${colors.trend}`}>
                {trendDirection === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {trend}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
