'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Undo, 
  Redo, 
  Plus, 
  Play,
  Download,
  Share2,
  Settings,
  Eye,
  Code
} from 'lucide-react';
import { CellType } from '@/types/notebook';

interface NotebookToolbarProps {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onAddCell: (type: CellType) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  readOnly?: boolean;
}

export const NotebookToolbar: React.FC<NotebookToolbarProps> = ({
  onSave,
  onUndo,
  onRedo,
  onAddCell,
  canUndo = false,
  canRedo = false,
  readOnly = false,
}) => {
  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Save button */}
          {onSave && !readOnly && (
            <button
              onClick={onSave}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              title="Save notebook (Cmd/Ctrl + S)"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
          )}

          {/* Undo/Redo buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onUndo}
              disabled={!canUndo || readOnly}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              title="Undo (Cmd/Ctrl + Z)"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo || readOnly}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              title="Redo (Cmd/Ctrl + Shift + Z)"
            >
              <Redo className="h-4 w-4" />
            </button>
          </div>

          {/* Add cell buttons */}
          {!readOnly && (
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={() => onAddCell(CellType.MARKDOWN)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                title="Add markdown cell"
              >
                <Plus className="h-4 w-4 mr-1" />
                Markdown
              </button>
              <button
                onClick={() => onAddCell(CellType.CODE)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                title="Add code cell"
              >
                <Code className="h-4 w-4 mr-1" />
                Code
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Run all cells */}
          {!readOnly && (
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              title="Run all cells"
            >
              <Play className="h-4 w-4 mr-1" />
              Run All
            </button>
          )}

          {/* Export */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            title="Export notebook"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Share */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            title="Share notebook"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* Settings */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            title="Notebook settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* View mode toggle */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            title="Toggle view mode"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
