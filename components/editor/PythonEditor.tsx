// components/editor/PythonEditor.tsx
// NEXUS Academy — Shared Python Editor Component

import React, { useRef, useEffect } from 'react';
import Editor, { useMonaco, Monaco } from '@monaco-editor/react';

// Suppress Monaco Editor's non-Error cancelation exceptions in Next.js dev overlay
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.type === 'cancelation' && event.reason.msg === 'operation is manually canceled') {
      event.preventDefault(); // Prevent Next.js from throwing [object Object]
    }
  });
}

export interface PythonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  highlightLine?: number;
  filename?: string;
}

export const PythonEditor: React.FC<PythonEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = '300px',
  highlightLine,
  filename = 'main.py'
}) => {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount = (editor: any, m: Monaco) => {
    editorRef.current = editor;
    
    // Disable minimap and set basic options
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: readOnly,
      padding: { top: 16, bottom: 16 },
      contextmenu: false,
      renderLineHighlight: 'all'
    });

    applyHighlights(editor, m);
  };

  const applyHighlights = (editor: any, m: Monaco) => {
    if (highlightLine && highlightLine > 0) {
      decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: new m.Range(highlightLine, 1, highlightLine, 1),
            options: {
              isWholeLine: true,
              className: 'bg-red-500/20', // Requires Tailwind CSS class
              glyphMarginClassName: 'bg-red-500',
            }
          }
        ]
      );
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  };

  // Re-apply highlights if highlightLine changes
  React.useEffect(() => {
    if (editorRef.current && monaco) {
      applyHighlights(editorRef.current, monaco);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightLine, monaco]);

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-slate-700 bg-[#1E1E1E] shadow-xl">
      {/* macOS style window chrome */}
      <div className="flex items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-xs text-slate-400 font-mono">
          {filename}
        </div>
      </div>
      
      {/* Monaco Editor Container */}
      <div style={{ height }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange && onChange(val || '')}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
          }}
        />
      </div>
    </div>
  );
};
