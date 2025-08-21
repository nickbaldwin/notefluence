'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface OutputCellProps {
  output: any;
  content: string;
  readOnly?: boolean;
}

export const OutputCell: React.FC<OutputCellProps> = ({
  output,
  content,
  readOnly = true,
}) => {
  const isError = output?.type === 'error' || output?.error;
  const isSuccess = output?.type === 'success' && !isError;

  const renderOutput = () => {
    if (isError) {
      return (
        <div className="flex items-start space-x-2">
          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Error
            </p>
            <pre className="mt-1 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg overflow-x-auto">
              {output?.error || 'An error occurred during execution'}
            </pre>
          </div>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="flex items-start space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Success
            </p>
            <div className="mt-1 space-y-2">
              {/* Console logs */}
              {output?.logs && output.logs.length > 0 && (
                <div className="space-y-1">
                  {output.logs.map((log: any, index: number) => (
                    <div key={index} className={`text-sm p-2 rounded ${
                      log.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                      log.type === 'warn' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                      'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    }`}>
                      <span className="font-mono text-xs opacity-75">
                        {log.type.toUpperCase()}:
                      </span>{' '}
                      {log.args.map((arg: any, i: number) => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                      ).join(' ')}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Return value */}
              {output?.result !== undefined && (
                <div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Return value:
                  </div>
                  {typeof output.result === 'object' ? (
                    <pre className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(output.result, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {String(output.result)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Fallback for raw content
    return (
      <div className="flex items-start space-x-2">
        <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Output
          </p>
          <pre className="mt-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
            {content}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="border-l-4 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg p-4"
    >
      {renderOutput()}
      
      {output?.timestamp && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Executed at {new Date(output.timestamp).toLocaleTimeString()}
        </div>
      )}
    </motion.div>
  );
};
