// components/editor/PythonEditor.tsx
// NEXUS Academy — Shared Python Editor Component with Theme Auto-Sync

import React, { useRef, useEffect } from 'react';
import Editor, { useMonaco, Monaco } from '@monaco-editor/react';
import { useSettings } from '@/hooks/useSettings';
import { type EditorTheme, type ThemeMode } from '@/types/settings.types';

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

/**
 * Resolves the active Monaco editor theme name.
 * If editorTheme is 'auto' (or matches active app theme), it syncs with the app's theme.
 */
export function resolveMonacoTheme(editorTheme: EditorTheme, appTheme: ThemeMode): string {
  if (editorTheme && editorTheme !== 'auto') {
    return editorTheme;
  }
  switch (appTheme) {
    case 'warm-zen':
      return 'nexus-warm-zen';
    case 'nordic':
      return 'nexus-nordic';
    case 'cyber-oasis':
      return 'nexus-cyber';
    case 'light':
      return 'vs';
    case 'system':
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'nexus-midnight' : 'vs';
      }
      return 'nexus-midnight';
    case 'midnight':
    case 'dark':
    default:
      return 'nexus-midnight';
  }
}

/**
 * Registers custom aesthetic Monaco editor themes.
 */
export function registerCustomThemes(m: Monaco) {
  // 1. Midnight Sanctuary: charcoal slate (#0b0f19) + soothing emerald/cyan
  try {
    m.editor.defineTheme('nexus-midnight', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'EDF2F7' },
        { token: 'comment', foreground: '5C718A', fontStyle: 'italic' },
        { token: 'keyword', foreground: '34D399', fontStyle: 'bold' },
        { token: 'string', foreground: '22D3EE' },
        { token: 'number', foreground: 'A7F3D0' },
        { token: 'type', foreground: '38BDF8', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'E2E8F0' },
        { token: 'operator', foreground: '6EE7B7' },
        { token: 'delimiter', foreground: '94A3B8' },
      ],
      colors: {
        'editor.background': '#0b0f19',
        'editor.foreground': '#edf2f7',
        'editorCursor.foreground': '#34d399',
        'editor.lineHighlightBackground': '#131b2e',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#34d399',
        'editor.selectionBackground': '#1e3a5f80',
        'editor.inactiveSelectionBackground': '#1e3a5f40',
      },
    });
  } catch {}

  // 2. Warm Zen: sepia (#181512) + warm amber, gold, and bone white
  try {
    m.editor.defineTheme('nexus-warm-zen', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'F5EFE6' },
        { token: 'comment', foreground: '8C7E6C', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'F59E0B', fontStyle: 'bold' },
        { token: 'string', foreground: 'FBBF24' },
        { token: 'number', foreground: 'FCD34D' },
        { token: 'type', foreground: 'D97706', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'F5EFE6' },
        { token: 'operator', foreground: 'F59E0B' },
        { token: 'delimiter', foreground: 'A89F91' },
      ],
      colors: {
        'editor.background': '#181512',
        'editor.foreground': '#f5efe6',
        'editorCursor.foreground': '#f59e0b',
        'editor.lineHighlightBackground': '#25201b',
        'editorLineNumber.foreground': '#6b5e4f',
        'editorLineNumber.activeForeground': '#f59e0b',
        'editor.selectionBackground': '#45382680',
        'editor.inactiveSelectionBackground': '#45382640',
      },
    });
  } catch {}

  // 3. Nordic Frost: polar navy (#0f141c) + pastel lavender, sapphire, and mint
  try {
    m.editor.defineTheme('nexus-nordic', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'F0F6FC' },
        { token: 'comment', foreground: '6272A4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C084FC', fontStyle: 'bold' },
        { token: 'string', foreground: '6EE7B7' },
        { token: 'number', foreground: '93C5FD' },
        { token: 'type', foreground: '60A5FA', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'F0F6FC' },
        { token: 'operator', foreground: 'C084FC' },
        { token: 'delimiter', foreground: '8B9BB4' },
      ],
      colors: {
        'editor.background': '#0f141c',
        'editor.foreground': '#f0f6fc',
        'editorCursor.foreground': '#c084fc',
        'editor.lineHighlightBackground': '#18202d',
        'editorLineNumber.foreground': '#4b5b75',
        'editorLineNumber.activeForeground': '#c084fc',
        'editor.selectionBackground': '#2d3b5580',
        'editor.inactiveSelectionBackground': '#2d3b5540',
      },
    });
  } catch {}

  // 4. Cyber-Oasis: obsidian (#06080d) + neon cyan and iris tokens
  try {
    m.editor.defineTheme('nexus-cyber', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'F8FAFC' },
        { token: 'comment', foreground: '4F5B73', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00F0FF', fontStyle: 'bold' },
        { token: 'string', foreground: 'D946EF' },
        { token: 'number', foreground: '38BDF8' },
        { token: 'type', foreground: '818CF8', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'F8FAFC' },
        { token: 'operator', foreground: '00F0FF' },
        { token: 'delimiter', foreground: '64748B' },
      ],
      colors: {
        'editor.background': '#06080d',
        'editor.foreground': '#f8fafc',
        'editorCursor.foreground': '#00f0ff',
        'editor.lineHighlightBackground': '#0f1422',
        'editorLineNumber.foreground': '#334155',
        'editorLineNumber.activeForeground': '#00f0ff',
        'editor.selectionBackground': '#00f0ff33',
        'editor.inactiveSelectionBackground': '#00f0ff1a',
      },
    });
  } catch {}

  // Legacy standard themes
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
      },
    });
  } catch {}
}

export const PythonEditor: React.FC<PythonEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = '300px',
  highlightLine,
  filename = 'main.py',
}) => {
  const monaco = useMonaco();
  const { settings } = useSettings();
  const editorRef = useRef<any>(null);
  const monacoInstanceRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const editorFindEnabledRef = useRef<boolean>(settings.editorFindEnabled);
  editorFindEnabledRef.current = settings.editorFindEnabled;

  const activeMonacoTheme = resolveMonacoTheme(settings.editorTheme, settings.theme);

  const handleEditorDidMount = (editor: any, m: Monaco) => {
    editorRef.current = editor;
    monacoInstanceRef.current = m;

    registerCustomThemes(m);

    // Apply active theme
    m.editor.setTheme(activeMonacoTheme);

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
              className: 'bg-red-500/20',
              glyphMarginClassName: 'bg-red-500',
            },
          },
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
        registerCustomThemes(monacoInstanceRef.current);
        monacoInstanceRef.current.editor.setTheme(activeMonacoTheme);
      }
    }
  }, [settings.editorFontSize, settings.editorLineWrap, settings.editorFindEnabled, activeMonacoTheme]);

  // Proactively register custom themes as soon as Monaco loader initializes
  useEffect(() => {
    if (monaco) {
      registerCustomThemes(monaco);
    }
  }, [monaco]);

  // Re-apply highlights if highlightLine changes
  useEffect(() => {
    if (editorRef.current && monaco) {
      applyHighlights(editorRef.current, monaco);
    }
  }, [highlightLine, monaco]);

  const getThemeStyles = (resolvedTheme: string) => {
    switch (resolvedTheme) {
      case 'nexus-warm-zen':
        return {
          container: 'bg-[#181512] border-[#2e261f]',
          chrome: 'bg-[#201c18] border-[#2e261f]',
        };
      case 'nexus-nordic':
        return {
          container: 'bg-[#0f141c] border-[#1e2638]',
          chrome: 'bg-[#161e2b] border-[#1e2638]',
        };
      case 'nexus-cyber':
        return {
          container: 'bg-[#06080d] border-[rgba(0,240,255,0.22)] shadow-[0_0_20px_-5px_rgba(0,240,255,0.15)]',
          chrome: 'bg-[#090d16] border-[rgba(0,240,255,0.18)]',
        };
      case 'vs-dark':
        return {
          container: 'bg-[#1e1e1e] border-slate-700',
          chrome: 'bg-[#252526] border-slate-700',
        };
      case 'vs':
        return {
          container: 'bg-white border-slate-200',
          chrome: 'bg-slate-100 border-slate-200',
        };
      case 'monokai':
        return {
          container: 'bg-[#272822] border-slate-700',
          chrome: 'bg-[#1e1f1c] border-slate-700',
        };
      case 'hc-black':
        return {
          container: 'bg-[#000000] border-slate-700',
          chrome: 'bg-[#111111] border-slate-700',
        };
      case 'nexus-midnight':
      default:
        return {
          container: 'bg-[#0b0f19] border-[#1e293b]',
          chrome: 'bg-[#111827] border-[#1e293b]',
        };
    }
  };

  const { container: containerStyle, chrome: chromeStyle } = getThemeStyles(activeMonacoTheme);

  return (
    <div className={`flex flex-col rounded-lg overflow-hidden border ${containerStyle} shadow-xl transition-all duration-300`}>
      {/* Window chrome header */}
      <div className={`flex items-center px-4 py-2 border-b ${chromeStyle} transition-colors duration-300`}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 text-center text-xs text-muted-foreground font-mono">
          {filename}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div style={{ height }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          theme={activeMonacoTheme}
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
