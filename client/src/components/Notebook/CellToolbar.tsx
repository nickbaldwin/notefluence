'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  GripVertical, 
  Play, 
  Trash2, 
  Plus, 
  MoreVertical,
  Copy,
  Settings
} from 'lucide-react';
import { Cell, CellType } from '@/types/notebook';

interface CellToolbarProps {
  cell: Cell;
  index: number;
  isSelected: boolean;
  isExecuting: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onExecute: () => void;
  onAddCell: (type: CellType) => void;
  dragHandleProps?: any;
}

export const CellToolbar: React.FC<CellToolbarProps> = ({
  cell,
  index,
  isSelected,
  isExecuting,
  onSelect,
  onDelete,
  onExecute,
  onAddCell,
  dragHandleProps,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getCellTypeIcon = (type: CellType) => {
    switch (type) {
      case CellType.MARKDOWN:
        return '📝';
      case CellType.CODE:
        return '⚡';
      case CellType.OUTPUT:
        return '📊';
      case CellType.IMAGE:
        return '🖼️';
      case CellType.CHART:
        return '📈';
      default:
        return '📄';
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
      <div className="flex items-center space-x-2">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Cell type indicator */}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {getCellTypeIcon(cell.type)} Cell {index + 1}
        </span>

        {/* Execute button for code cells */}
        {cell.type === CellType.CODE && (
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            title="Run cell (Shift + Enter)"
          >
            <Play className={`h-4 w-4 ${isExecuting ? 'animate-pulse' : ''}`} />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {/* Add cell buttons */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            title="Add cell"
          >
            <Plus className="h-4 w-4" />
          </button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onAddCell(CellType.MARKDOWN);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="mr-2">📝</span>
                  Add Markdown Cell
                </button>
                <button
                  onClick={() => {
                    onAddCell(CellType.CODE);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="mr-2">⚡</span>
                  Add Code Cell
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Cell actions */}
        <button
          onClick={onSelect}
          className={`p-1 rounded ${
            isSelected 
              ? 'text-primary-600 dark:text-primary-400' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Select cell"
        >
          <Settings className="h-4 w-4" />
        </button>

        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
          title="Delete cell"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};
