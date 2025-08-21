import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, ChevronDown } from 'lucide-react';
import { Editor } from '@monaco-editor/react';

interface CodeCellProps {
  content: string;
  language: string;
  onChange: (content: string) => void;
  onLanguageChange: (language: string) => void;
  readOnly?: boolean;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '⚡' },
  { value: 'typescript', label: 'TypeScript', icon: '📘' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'json', label: 'JSON', icon: '📄' },
  { value: 'sql', label: 'SQL', icon: '🗄️' },
  { value: 'bash', label: 'Bash', icon: '💻' },
  { value: 'markdown', label: 'Markdown', icon: '📝' },
];

export const CodeCell: React.FC<CodeCellProps> = ({
  content,
  language,
  onChange,
  onLanguageChange,
  readOnly = false,
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [editorHeight, setEditorHeight] = useState(200);

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.value === language) || SUPPORTED_LANGUAGES[0];

  const handleLanguageSelect = useCallback((selectedLanguage: string) => {
    onLanguageChange(selectedLanguage);
    setShowLanguageMenu(false);
  }, [onLanguageChange]);

  const handleEditorDidMount = useCallback((editor: any) => {
    // Auto-resize editor based on content
    const updateHeight = () => {
      const lineCount = editor.getModel().getLineCount();
      const height = Math.max(200, Math.min(600, lineCount * 20 + 40));
      setEditorHeight(height);
    };

    editor.onDidChangeModelContent(updateHeight);
    updateHeight();
  }, []);

  const getLanguageIcon = (lang: string) => {
    return SUPPORTED_LANGUAGES.find(l => l.value === lang)?.icon || '📄';
  };

  return (
    <div className="space-y-2">
      {/* Language selector and controls */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            disabled={readOnly}
          >
            <span>{currentLanguage.icon}</span>
            <span className="font-medium">{currentLanguage.label}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showLanguageMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageSelect(lang.value)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    language === lang.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : ''
                  }`}
                >
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {!readOnly && (
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              title="Run cell (Shift + Enter)"
            >
              <Play className="w-4 h-4" />
              <span>Run</span>
            </button>
            <button
              className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Cell settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Code editor */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <Editor
          height={editorHeight}
          language={language}
          value={content}
          onChange={(value) => onChange(value || '')}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
            },
            automaticLayout: true,
            wordWrap: 'on',
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: true,
            parameterHints: {
              enabled: true,
            },
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
          }}
          onMount={handleEditorDidMount}
        />
      </div>

      {/* Language info */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>
          Language: <span className="font-medium">{currentLanguage.label}</span>
          {!readOnly && (
            <>
              {' • '}
              Use <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift + Enter</kbd> to run
            </>
          )}
        </p>
      </div>

      {/* Click outside to close language menu */}
      {showLanguageMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
    </div>
  );
};
