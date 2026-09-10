// components/editor/PythonEditor.tsx
// NEXUS Academy — Shared Python Editor Component

import React, { useRef, useEffect } from 'react';
import Editor, { useMonaco, Monaco } from '@monaco-editor/react';
import { useSettings } from '@/hooks/useSettings';

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
  const { settings } = useSettings();
  const editorRef = useRef<any>(null);
  const monacoInstanceRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const editorFindEnabledRef = useRef<boolean>(settings.editorFindEnabled);
  editorFindEnabledRef.current = settings.editorFindEnabled;

  const handleEditorDidMount = (editor: any, m: Monaco) => {
    editorRef.current = editor;
    monacoInstanceRef.current = m;

    // Define custom monokai theme if needed
    try {
      m.editor.defineTheme('monokai', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '75715E', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'F92672' },
          { token: 'string', foreground: 'E6DB74' },
          { token: 'number', foreground: 'AE81FF' },
          { token: 'type', foreground: '66D9EF', fontStyle: 'italic' },
        ],
        colors: {
          'editor.background': '#272822',
          'editor.foreground': '#F8F8F2',
          'editorCursor.foreground': '#F8F8F0',
          'editor.lineHighlightBackground': '#3E3D32',
          'editorLineNumber.foreground': '#90908A',
          'editor.selectionBackground': '#49483E',
        }
      });
    } catch {
      // Theme already defined
    }
    
    // Explicitly apply active theme
    m.editor.setTheme(settings.editorTheme);

    // Set options based on learner settings
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: settings.editorFontSize,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: readOnly,
      padding: { top: 16, bottom: 16 },
      contextmenu: false,
      renderLineHighlight: 'all',
      wordWrap: settings.editorLineWrap ? 'on' : 'off',
      find: {
        addExtraSpaceOnTop: false,
        autoFindInSelection: 'never',
        seedSearchStringFromSelection: 'never',
      },
    });

    // Intercept Find shortcut (Ctrl+F / Cmd+F):
    // If editorFindEnabled is false, do not open the search widget to prevent distracting learners.
    // If editorFindEnabled is true, trigger the standard find action.
    editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyF, () => {
      if (editorFindEnabledRef.current) {
        editor.getAction('actions.find')?.run();
      }
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

  // Dynamically update editor options and theme when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.editorFontSize,
        wordWrap: settings.editorLineWrap ? 'on' : 'off',
        find: {
          addExtraSpaceOnTop: false,
          autoFindInSelection: 'never',
          seedSearchStringFromSelection: 'never',
        },
      });

      if (monacoInstanceRef.current) {
        monacoInstanceRef.current.editor.setTheme(settings.editorTheme);
      }
    }
  }, [settings.editorFontSize, settings.editorLineWrap, settings.editorFindEnabled, settings.editorTheme]);

  // Re-apply highlights if highlightLine changes
  useEffect(() => {
    if (editorRef.current && monaco) {
      applyHighlights(editorRef.current, monaco);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightLine, monaco]);

  const containerBg = settings.editorTheme === 'monokai' ? 'bg-[#272822]' : settings.editorTheme === 'hc-black' ? 'bg-[#000000]' : 'bg-[#1E1E1E]';

  return (
    <div className={`flex flex-col rounded-lg overflow-hidden border border-slate-700 ${containerBg} shadow-xl`}>
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
          theme={settings.editorTheme}
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
