import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit3, Check, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface MarkdownCellProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

export const MarkdownCell: React.FC<MarkdownCellProps> = ({
  content,
  onChange,
  readOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleEdit = useCallback(() => {
    setEditContent(content);
    setIsEditing(true);
  }, [content]);

  const handleSave = useCallback(() => {
    onChange(editContent);
    setIsEditing(false);
  }, [editContent, onChange]);

  const handleCancel = useCallback(() => {
    setEditContent(content);
    setIsEditing(false);
  }, [content]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  }, [handleCancel, handleSave]);

  if (readOnly) {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    {children}
                  </table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {children}
                </td>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="relative">
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Editing Markdown
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                title="Save (Cmd/Ctrl + Enter)"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                title="Cancel (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[200px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-y focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Write your markdown here..."
            autoFocus
          />
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Use <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Cmd/Ctrl + Enter</kbd> to save, <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd> to cancel</p>
          </div>
        </motion.div>
      ) : (
        <div className="group">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Edit markdown"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {children}
                    </td>
                  );
                },
              }}
            >
              {content || '*No content*'}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
