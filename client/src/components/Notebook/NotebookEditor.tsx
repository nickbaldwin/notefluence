import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Square, Save, Undo, Redo, Settings, Share } from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Cell, CellType } from '@/types/notebook';
import { MarkdownCell } from './cells/MarkdownCell';
import { CodeCell } from './cells/CodeCell';
import { OutputCell } from './cells/OutputCell';
import { CellToolbar } from './CellToolbar';
import { NotebookToolbar } from './NotebookToolbar';
import { useNotebookStore } from '@/stores/notebookStore';
import { cn } from '@/utils/cn';

interface NotebookEditorProps {
  projectId: string;
  pageId: string;
  initialContent?: Cell[];
  onSave?: (content: Cell[]) => void;
  onAutoSave?: (content: Cell[]) => void;
  readOnly?: boolean;
}

export const NotebookEditor: React.FC<NotebookEditorProps> = ({
  projectId,
  pageId,
  initialContent = [],
  onSave,
  onAutoSave,
  readOnly = false,
}) => {
  const [cells, setCells] = useState<Cell[]>(initialContent.length > 0 ? initialContent : [
             {
           id: `cell-${Date.now()}-1`,
           type: CellType.MARKDOWN,
           content: '# Welcome to Your Secure Jupyter-Style Notebook\n\nThis Notefluence notebook features **iframe sandboxing** for safe code execution!\n\n## Security Features\n\n✅ **Sandboxed Execution**: Code runs in isolated iframe\n✅ **API Restrictions**: Dangerous APIs are disabled\n✅ **Timeout Protection**: 5-second execution limit\n✅ **Code Validation**: Pre-execution security checks\n✅ **Console Capture**: All output is captured and displayed\n\n## Getting Started\n\n1. Click the **+** button to add new cells\n2. Choose between **Markdown** or **Code** cells\n3. Write your code in code cells\n4. Click the **▶️** button to run your code\n5. See the results in the output cells below\n\n## Try These Examples\n\n**✅ Safe Code (Will Work):**\n- Basic JavaScript: `2 + 2`\n- Array operations: `[1,2,3].map(x => x*2)`\n- Functions: `Math.max(1,2,3)`\n- Console output: `console.log("Hello!")`\n\n**❌ Dangerous Code (Will Be Blocked):**\n- Network requests: `fetch("https://api.example.com")`\n- Storage access: `localStorage.setItem("key", "value")`\n- DOM manipulation: `document.body.innerHTML = "<h1>Hacked!</h1>"`\n- Infinite loops: `while(true) {}`\n\n**🧪 Test the Security:**\nTry running the cells below to see security validation in action!',
      output: null,
      metadata: {},
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `cell-${Date.now()}-2`,
      type: CellType.CODE,
      content: 'console.log("Hello from sandboxed execution!");\n\n// Try some basic JavaScript\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log("Original:", numbers);\nconsole.log("Doubled:", doubled);\n\n// Return a value\ndoubled.reduce((sum, n) => sum + n, 0)',
      output: null,
      metadata: { language: 'javascript' },
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `cell-${Date.now()}-3`,
      type: CellType.CODE,
      content: '// This will be blocked by security validation\n// Try running this to see the security in action\n\nconsole.log("Attempting to access dangerous APIs...");\n\n// This will trigger the security validation and be blocked:\nfetch("https://api.example.com");\n\n// Safe operations that work:\nconst safeMath = Math.PI * 2;\nconsole.log("Safe math:", safeMath);\n\n// Return a safe result\n{ message: "This should not execute due to fetch() being blocked", value: safeMath }',
      output: null,
      metadata: { language: 'javascript' },
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `cell-${Date.now()}-4`,
      type: CellType.CODE,
      content: '// Another security test - this will be blocked\nconsole.log("Testing localStorage access...");\n\n// This will trigger security validation:\nlocalStorage.setItem("test", "value");\n\n// Safe code that would work:\nconst numbers = [1, 2, 3, 4, 5];\nconst sum = numbers.reduce((a, b) => a + b, 0);\nconsole.log("Sum:", sum);\n\nsum',
      output: null,
      metadata: { language: 'javascript' },
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `cell-${Date.now()}-5`,
      type: CellType.CODE,
      content: '// Test infinite loop detection\nconsole.log("Testing infinite loop detection...");\n\n// This will be blocked by validation:\nwhile(true) {\n  console.log("This should not execute");\n}\n\n// This code will never be reached due to the infinite loop above\nconsole.log("This should not print");\n42',
      output: null,
      metadata: { language: 'javascript' },
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `cell-${Date.now()}-6`,
      type: CellType.CODE,
      content: '// Simple test - this should be blocked\nconsole.log("Testing simple fetch...");\nfetch("https://example.com");\nconsole.log("This should not execute");\n42',
      output: null,
      metadata: { language: 'javascript' },
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResults, setExecutionResults] = useState<Map<number, any>>(new Map());
  const [undoStack, setUndoStack] = useState<Cell[][]>([]);
  const [redoStack, setRedoStack] = useState<Cell[][]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  const { addActivity, updatePage } = useNotebookStore();

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (onAutoSave && cells.length > 0) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        onAutoSave(cells);
      }, 3000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [cells, onAutoSave]);

  // Save to undo stack when cells change
  useEffect(() => {
    if (cells.length > 0) {
      setUndoStack(prev => [...prev, cells]);
      setRedoStack([]);
    }
  }, [cells]);

  const addCell = useCallback((type: CellType, index?: number) => {
    const newCell: Cell = {
      id: `cell-${Date.now()}-${Math.random()}`,
      type,
      content: type === CellType.MARKDOWN ? '# New Cell' : '// Your code here',
      output: null,
      metadata: {},
      order: index ?? cells.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newCells = [...cells];
    const insertIndex = index ?? cells.length;
    newCells.splice(insertIndex, 0, newCell);
    
    // Update order for all cells
    newCells.forEach((cell, idx) => {
      cell.order = idx;
    });

    setCells(newCells);
    setSelectedCellIndex(insertIndex);
  }, [cells]);

  const updateCell = useCallback((index: number, updates: Partial<Cell>) => {
    setCells(prev => prev.map((cell, idx) => 
      idx === index 
        ? { ...cell, ...updates, updatedAt: new Date() }
        : cell
    ));
  }, []);

  const deleteCell = useCallback((index: number) => {
    setCells(prev => {
      const newCells = prev.filter((_, idx) => idx !== index);
      // Update order for remaining cells
      newCells.forEach((cell, idx) => {
        cell.order = idx;
      });
      return newCells;
    });
    setSelectedCellIndex(null);
  }, []);

  const executeCell = useCallback(async (index: number) => {
    const cell = cells[index];
    if (cell.type !== CellType.CODE) return;

    setIsExecuting(true);
    try {
      // Validate code before execution
      const validation = validateCode(cell.content);
      if (!validation.valid) {
        // Create error output cell for validation failures
        const errorResult = { 
          type: 'error', 
          error: `Code validation failed: ${validation.issues.join(', ')}`,
          timestamp: new Date() 
        };
        
        setExecutionResults(prev => new Map(prev.set(index, errorResult)));
        
        const outputCell: Cell = {
          id: `output-${Date.now()}-${Math.random()}`,
          type: CellType.OUTPUT,
          content: JSON.stringify(errorResult, null, 2),
          output: errorResult,
          metadata: { sourceCellId: cell.id },
          order: index + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const newCells = [...cells];
        newCells.splice(index + 1, 0, outputCell);
        newCells.forEach((cell, idx) => {
          cell.order = idx;
        });

        setCells(newCells);
        
        // Add activity
        addActivity({
          type: 'CELL_EXECUTED',
          projectId,
          pageId,
          metadata: { cellId: cell.id, language: cell.metadata?.language, validationError: true }
        });
        
        return; // Exit early for validation errors
      }
      
      // Execute code based on language
      const result = await executeCode(cell.content, cell.metadata?.language || 'javascript');
      
      setExecutionResults(prev => new Map(prev.set(index, result)));
      
      // Add output cell after code cell
      const outputCell: Cell = {
        id: `output-${Date.now()}-${Math.random()}`,
        type: CellType.OUTPUT,
        content: JSON.stringify(result, null, 2),
        output: result,
        metadata: { sourceCellId: cell.id },
        order: index + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newCells = [...cells];
      newCells.splice(index + 1, 0, outputCell);
      newCells.forEach((cell, idx) => {
        cell.order = idx;
      });

      setCells(newCells);
      
      // Add activity
      addActivity({
        type: 'CELL_EXECUTED',
        projectId,
        pageId,
        metadata: { cellId: cell.id, language: cell.metadata?.language }
      });

    } catch (error) {
      console.error('Cell execution error:', error);
      const errorResult = { 
        type: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date() 
      };
      
      setExecutionResults(prev => new Map(prev.set(index, errorResult)));
      
      // Create error output cell
      const outputCell: Cell = {
        id: `output-${Date.now()}-${Math.random()}`,
        type: CellType.OUTPUT,
        content: JSON.stringify(errorResult, null, 2),
        output: errorResult,
        metadata: { sourceCellId: cell.id },
        order: index + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newCells = [...cells];
      newCells.splice(index + 1, 0, outputCell);
      newCells.forEach((cell, idx) => {
        cell.order = idx;
      });

      setCells(newCells);
    } finally {
      setIsExecuting(false);
    }
  }, [cells, projectId, pageId, addActivity]);

  const validateCode = (code: string): { valid: boolean; issues: string[] } => {
    const issues = [];
    
    // Check for dangerous patterns
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /setTimeout\s*\(/,
      /setInterval\s*\(/,
      /fetch\s*\(/,
      /XMLHttpRequest/,
      /localStorage/,
      /sessionStorage/,
      /document\./,
      /window\./,
      /navigator\./,
      /while\s*\(true\)/,
      /for\s*\(.*\)\s*\{\s*\}/,
      /import\s*\(/,
      /require\s*\(/,
      /location\./,
      /history\./,
      /open\s*\(/,
      /alert\s*\(/,
      /confirm\s*\(/,
      /prompt\s*\(/
    ];
    
    dangerousPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        issues.push(`Dangerous pattern detected: ${pattern.source}`);
      }
    });
    
    // Check for infinite loops
    if (code.includes('while(true)') || code.includes('for(;;)')) {
      issues.push('Potential infinite loop detected');
    }
    
    // Check code length
    if (code.length > 10000) {
      issues.push('Code too long (max 10KB)');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  };

  const executeCode = async (code: string, language: string): Promise<any> => {
    // For now, we'll support JavaScript execution in the browser
    // In a real implementation, you'd send this to a backend service
    if (language === 'javascript') {
      return new Promise((resolve, reject) => {
        try {
          // Create sandboxed iframe
          const iframe = document.createElement('iframe');
          iframe.sandbox = 'allow-scripts'; // No allow-same-origin for security
          iframe.style.display = 'none';
          
          // Create isolated environment with restricted APIs
          const sandboxedCode = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Code Execution Sandbox</title>
            </head>
            <body>
              <script>
                // Override dangerous APIs
                window.fetch = undefined;
                window.XMLHttpRequest = undefined;
                window.localStorage = undefined;
                window.sessionStorage = undefined;
                window.document = undefined;
                window.navigator = undefined;
                window.location = undefined;
                window.history = undefined;
                window.open = undefined;
                window.alert = undefined;
                window.confirm = undefined;
                window.prompt = undefined;
                window.print = undefined;
                window.focus = undefined;
                window.blur = undefined;
                window.close = undefined;
                window.moveTo = undefined;
                window.moveBy = undefined;
                window.resizeTo = undefined;
                window.resizeBy = undefined;
                window.scrollTo = undefined;
                window.scrollBy = undefined;
                window.scrollX = undefined;
                window.scrollY = undefined;
                window.innerWidth = undefined;
                window.innerHeight = undefined;
                window.outerWidth = undefined;
                window.outerHeight = undefined;
                window.screenX = undefined;
                window.screenY = undefined;
                window.screenLeft = undefined;
                window.screenTop = undefined;
                window.screen = undefined;
                window.devicePixelRatio = undefined;
                window.matchMedia = undefined;
                window.getComputedStyle = undefined;
                window.getSelection = undefined;
                window.find = undefined;
                window.getMatchedCSSRules = undefined;
                window.webkitRequestAnimationFrame = undefined;
                window.requestAnimationFrame = undefined;
                window.cancelAnimationFrame = undefined;
                window.webkitCancelAnimationFrame = undefined;
                window.webkitCancelRequestAnimationFrame = undefined;
                window.mozRequestAnimationFrame = undefined;
                window.mozCancelRequestAnimationFrame = undefined;
                window.msRequestAnimationFrame = undefined;
                window.msCancelRequestAnimationFrame = undefined;
                window.oRequestAnimationFrame = undefined;
                window.oCancelRequestAnimationFrame = undefined;
                
                // Capture console output
                const logs = [];
                const errors = [];
                
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                const originalInfo = console.info;
                
                console.log = (...args) => {
                  logs.push({ type: 'log', args });
                  originalLog(...args);
                };
                console.error = (...args) => {
                  errors.push({ type: 'error', args });
                  originalError(...args);
                };
                console.warn = (...args) => {
                  logs.push({ type: 'warn', args });
                  originalWarn(...args);
                };
                console.info = (...args) => {
                  logs.push({ type: 'info', args });
                  originalInfo(...args);
                };
                
                // Set execution timeout
                const timeout = setTimeout(() => {
                  window.parent.postMessage({ 
                    type: 'error', 
                    error: 'Execution timeout (5 seconds)',
                    logs,
                    errors
                  }, '*');
                }, 5000);
                
                try {
                  // Execute the code in a controlled environment
                  let result;
                  try {
                    // Use eval for better expression support
                    result = eval(\`${code.replace(/`/g, '\\`')}\`);
                  } catch (evalError) {
                    // If eval fails, try Function constructor
                    result = new Function(\`${code.replace(/`/g, '\\`')}\`)();
                  }
                  
                  clearTimeout(timeout);
                  
                  // Send success result
                  window.parent.postMessage({ 
                    type: 'success', 
                    result, 
                    logs,
                    errors,
                    timestamp: new Date().toISOString()
                  }, '*');
                  
                } catch (error) {
                  clearTimeout(timeout);
                  
                  // Send error result
                  window.parent.postMessage({ 
                    type: 'error', 
                    error: error.message || 'Unknown error',
                    logs,
                    errors,
                    timestamp: new Date().toISOString()
                  }, '*');
                }
              </script>
            </body>
            </html>
          `;
          
          iframe.srcdoc = sandboxedCode;
          document.body.appendChild(iframe);
          
          // Listen for results from iframe
          const messageHandler = (event: MessageEvent) => {
            if (event.source === iframe.contentWindow) {
              // Clean up
              document.body.removeChild(iframe);
              window.removeEventListener('message', messageHandler);
              
              // Parse timestamp
              const data = event.data;
              if (data.timestamp) {
                data.timestamp = new Date(data.timestamp);
              }
              
              resolve(data);
            }
          };
          
          window.addEventListener('message', messageHandler);
          
          // Fallback timeout in case iframe doesn't respond
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
              window.removeEventListener('message', messageHandler);
              resolve({ 
                type: 'error', 
                error: 'Execution timeout or iframe error',
                timestamp: new Date() 
              });
            }
          }, 6000);
          
        } catch (error) {
          reject({ 
            type: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error', 
            timestamp: new Date() 
          });
        }
      });
    }
    
    // For other languages, you'd make an API call to a code execution service
    throw new Error(`Language ${language} not supported yet`);
  };

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const items = Array.from(cells);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order for all cells
    items.forEach((cell, idx) => {
      cell.order = idx;
    });

    setCells(items);
  }, [cells]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(cells);
    }
    
    // Update page in store
    updatePage(pageId, { content: cells });
    
    addActivity({
      type: 'PAGE_SAVED',
      projectId,
      pageId,
      metadata: { cellCount: cells.length }
    });
  }, [cells, onSave, pageId, projectId, updatePage, addActivity]);

  const handleUndo = useCallback(() => {
    if (undoStack.length > 1) {
      const newUndoStack = [...undoStack];
      const currentState = newUndoStack.pop()!;
      const previousState = newUndoStack[newUndoStack.length - 1];
      
      setRedoStack(prev => [...prev, currentState]);
      setUndoStack(newUndoStack);
      setCells(previousState);
    }
  }, [undoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextState = newRedoStack.pop()!;
      
      setUndoStack(prev => [...prev, cells]);
      setRedoStack(newRedoStack);
      setCells(nextState);
    }
  }, [redoStack, cells]);

  const renderCell = (cell: Cell, index: number) => {
    const isSelected = selectedCellIndex === index;
    const isExecuting = executionResults.has(index);

    return (
      <Draggable key={cell.id} draggableId={cell.id} index={index}>
        {(provided, snapshot) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.draggableProps}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "relative mb-4 rounded-lg border transition-all duration-200",
              isSelected 
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20" 
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
              snapshot.isDragging && "shadow-lg scale-105"
            )}
          >
            <CellToolbar
              cell={cell}
              index={index}
              isSelected={isSelected}
              isExecuting={isExecuting}
              onSelect={() => setSelectedCellIndex(index)}
              onDelete={() => deleteCell(index)}
              onExecute={() => executeCell(index)}
              onAddCell={(type) => addCell(type, index + 1)}
              dragHandleProps={provided.dragHandleProps}
            />

            <div className="p-4">
              {cell.type === CellType.MARKDOWN && (
                <MarkdownCell
                  content={cell.content}
                  onChange={(content) => updateCell(index, { content })}
                  readOnly={readOnly}
                />
              )}
              
              {cell.type === CellType.CODE && (
                <CodeCell
                  content={cell.content}
                  language={cell.metadata?.language || 'javascript'}
                  onChange={(content) => updateCell(index, { content })}
                  onLanguageChange={(language) => 
                    updateCell(index, { metadata: { ...cell.metadata, language } })
                  }
                  readOnly={readOnly}
                />
              )}
              
              {cell.type === CellType.OUTPUT && (
                <OutputCell
                  output={cell.output}
                  content={cell.content}
                  readOnly={true}
                />
              )}
            </div>
          </motion.div>
        )}
      </Draggable>
    );
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <NotebookToolbar
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={redoStack.length > 0 ? handleRedo : undefined}
        onAddCell={(type) => addCell(type)}
        canUndo={undoStack.length > 1}
        canRedo={redoStack.length > 0}
        readOnly={readOnly}
      />

      <div className="flex-1 overflow-auto p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="notebook-cells">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                <AnimatePresence>
                  {cells.map((cell, index) => renderCell(cell, index))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {cells.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No cells yet</h3>
              <p className="text-sm">Add your first cell to get started</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => addCell(CellType.MARKDOWN)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Markdown
              </button>
              <button
                onClick={() => addCell(CellType.CODE)}
                className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                Add Code
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
