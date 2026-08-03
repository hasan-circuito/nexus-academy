'use client';
import type { CodeExampleStep } from '@/types/mission.types';
import { useState } from 'react';
import { Terminal, Edit2, RotateCcw, Play } from 'lucide-react';
import { PythonEditor } from '@/components/editor/PythonEditor';
import { ExecutionOutput } from '@/components/shared/ExecutionOutput';
import { usePythonEngine } from '@/hooks/usePythonEngine';

export function CodeExampleStepComponent({ step }: { step: CodeExampleStep }) {
  const [mode, setMode] = useState<'read' | 'edit'>('read');
  const [code, setCode] = useState(step.code);
  
  const { runCode, isRunning, lastResult, error: engineError } = usePythonEngine();

  const handleEdit = () => {
    setMode('edit');
  };

  const handleReset = () => {
    setCode(step.code);
    setMode('read');
  };

  const handleRun = () => {
    if (code.trim()) {
      runCode(code);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
      <p className="font-bangla text-muted-foreground">{step.explanation}</p>
      
      {engineError && (
        <div className="p-4 bg-destructive/20 border border-destructive text-destructive font-mono text-sm rounded-lg">
          Failed to load Python environment. Code execution disabled.
        </div>
      )}

      {mode === 'read' ? (
        <div className="rounded-xl overflow-hidden border border-border shadow-2xl bg-[#0d1117]">
          <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
              <div className="w-3 h-3 rounded-full bg-warning/80"></div>
              <div className="w-3 h-3 rounded-full bg-success/80"></div>
              <span className="ml-2 text-xs font-mono text-muted-foreground">example.py</span>
            </div>
            <button 
              onClick={handleEdit}
              className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-white transition-colors px-2 py-1 bg-white/5 rounded"
            >
              <Edit2 size={12} />
              <span>Edit & Run</span>
            </button>
          </div>
          <div className="p-6 font-mono text-sm text-blue-300 relative overflow-x-auto">
            <div className="flex flex-col min-w-fit space-y-1">
              {step.code.split('\n').map((line, idx) => {
                const lineNum = idx + 1;
                const annotation = step.annotations?.find(a => a.lineNumber === lineNum);
                return (
                  <div key={lineNum} className="flex items-start group/line min-h-[1.75rem]">
                    <pre className="pr-8 shrink-0 pt-1"><code>{line || ' '}</code></pre>
                    {annotation && (
                      <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-bangla text-xs opacity-60 group-hover/line:opacity-100 transition-opacity max-w-[400px]">
                        {annotation.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-[#05070a] p-4 font-mono text-sm border-t border-border/50 text-green-400">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 uppercase">
              <Terminal className="w-3 h-3" /> Output
            </div>
            {step.output}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <PythonEditor 
            value={code} 
            onChange={setCode} 
            filename="example.py" 
            height="250px" 
          />
          
          <div className="flex gap-4">
            <button 
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              className="flex items-center space-x-2 px-6 py-2 font-semibold text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={18} className={isRunning ? 'animate-pulse' : ''} />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center space-x-2 px-6 py-2 font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>

          <ExecutionOutput 
            result={lastResult} 
            isRunning={isRunning} 
          />
        </div>
      )}

      {step.postExplanation && <p className="font-bangla text-sm text-info/90 bg-info/10 p-4 rounded-lg border border-info/20">{step.postExplanation}</p>}
    </div>
  );
}
