'use client';
import type { DebugChallengeStep, MissionData } from '@/types/mission.types';
import { useState } from 'react';
import { Bug, Search, Check, AlertOctagon, Play } from 'lucide-react';
import { PythonEditor } from '@/components/editor/PythonEditor';
import { ExecutionOutput } from '@/components/shared/ExecutionOutput';
import { usePythonEngine } from '@/hooks/usePythonEngine';
import { usePracticeCode } from '@/hooks/usePracticeCode';
import { OutputComparator } from '@/engines/python/OutputComparator';
import { EventBus } from '@/engines/events/EventBus';

export function DebugChallengeStepComponent({ step, missionData }: { step: DebugChallengeStep; missionData: MissionData }) {
  const [hintIndex, setHintIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);

  const { runCode, isRunning, lastResult, error: engineError } = usePythonEngine();
  const { code, updateCode, isLoaded } = usePracticeCode(missionData.id, step.type, step.buggyCode);

  const handleRun = async () => {
    if (!code.trim()) return;
    const result = await runCode(code);
    
    if (result.success && !result.stderr) {
      setIsFixed(true);
      // Emit true completion (not self-reported)
      EventBus.emit({
        type: 'DEBUG_SOLVED',
        payload: {
          missionId: missionData.id,
          hintsUsed: hintIndex,
          attemptNumber: 1, // To be properly tracked in V2
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
        <span className="px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
          <Bug className="w-3 h-3" /> {step.bugType}
        </span>
      </div>
      
      <p className="font-bangla text-muted-foreground p-4 bg-surface rounded-lg border border-border">{step.scenario}</p>

      {engineError && (
        <div className="p-4 bg-destructive/20 border border-destructive text-destructive font-mono text-sm rounded-lg">
          Failed to load Python environment. Try refreshing the page.
        </div>
      )}

      {isLoaded && !isFixed && (
        <div className="space-y-4">
          
          <div className="bg-destructive/10 p-4 text-destructive border border-destructive/30 rounded-lg flex items-center gap-2 font-medium">
            <AlertOctagon className="w-4 h-4 shrink-0" /> {step.errorMessage}
          </div>

          <PythonEditor 
            value={code} 
            onChange={updateCode} 
            filename="debug.py" 
            height="250px"
            highlightLine={step.bugLine}
          />

          <div className="flex gap-4">
            <button 
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              className="flex items-center space-x-2 px-6 py-2 font-semibold text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={18} className={isRunning ? 'animate-pulse' : ''} />
              <span>{isRunning ? 'Running...' : 'Run Fixed Code'}</span>
            </button>

            {hintIndex < step.hints.length && (
              <button 
                onClick={() => setHintIndex(prev => prev + 1)} 
                className="px-4 py-2 text-sm font-medium text-info bg-info/10 hover:bg-info/20 rounded-lg transition-colors border border-info/20"
              >
                Reveal Hint ({step.hints.length - hintIndex})
              </button>
            )}
          </div>

          <ExecutionOutput 
            result={lastResult} 
            isRunning={isRunning} 
          />

          <div className="space-y-2 mt-4">
            {step.hints.slice(0, hintIndex).map((hint, i) => (
              <div key={i} className="p-4 bg-info/10 rounded-lg border border-info/20 font-bangla text-info text-sm flex gap-3">
                <Search className="w-5 h-5 shrink-0" /> {hint}
              </div>
            ))}
          </div>
        </div>
      )}

      {isFixed && (
        <div className="space-y-6 animate-in fade-in duration-500 mt-8">
          <div className="p-6 rounded-xl border border-success/30 bg-success/10 text-success text-center">
            <Check className="w-12 h-12 mx-auto mb-2" />
            <span className="font-bangla font-bold text-xl">বাগ ফিক্সড!</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-success/30 font-mono text-sm shadow-md">
            <div className="bg-[#0d1117] p-6 text-blue-300"><pre><code>{step.fixedCode}</code></pre></div>
            <div className="bg-[#05070a] p-4 text-success border-t border-success/30">✓ Executed successfully</div>
          </div>
          <p className="font-bangla text-foreground bg-surface p-4 rounded-lg border border-border font-medium">{step.explanation}</p>
        </div>
      )}
    </div>
  );
}
