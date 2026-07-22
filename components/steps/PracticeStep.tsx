'use client';
import type { PracticeStep, MissionData } from '@/types/mission.types';
import { useState } from 'react';
import { HelpCircle, Check, Play } from 'lucide-react';
import { PythonEditor } from '@/components/editor/PythonEditor';
import { ExecutionOutput } from '@/components/shared/ExecutionOutput';
import { usePythonEngine } from '@/hooks/usePythonEngine';
import { usePracticeCode } from '@/hooks/usePracticeCode';
import { OutputComparator } from '@/engines/python/OutputComparator';
import { ComparisonResult } from '@/engines/python/python.types';
import { EventBus } from '@/engines/events/EventBus';

export function PracticeStepComponent({ step, missionData }: { step: PracticeStep; missionData: MissionData }) {
  const [hintIndex, setHintIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  const { runCode, isRunning, lastResult, error: engineError } = usePythonEngine();
  const { code, updateCode, isLoaded } = usePracticeCode(missionData.id, step.type, '');

  const handleRun = async () => {
    if (!code.trim()) return;
    const result = await runCode(code);
    
    if (result.success) {
      const comp = OutputComparator.compare(result.stdout, step.expectedOutput);
      setComparison(comp);
      
      if (comp.isMatch) {
        setIsDone(true);
        // Emit true completion (not self-reported)
        EventBus.emit({
          type: 'PRACTICE_COMPLETED',
          payload: {
            missionId: missionData.id,
            selfReported: false,
            timestamp: new Date().toISOString()
          }
        });
      }
    } else {
      setComparison(null);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl font-bold font-bangla-ui text-foreground">{step.title}</h2>
      
      <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl font-bangla text-lg font-medium text-foreground">
        {step.prompt}
      </div>

      {engineError && (
        <div className="p-4 bg-destructive/20 border border-destructive text-destructive font-mono text-sm rounded-lg">
          Failed to load Python environment. Try refreshing the page.
        </div>
      )}

      {isLoaded && !isDone && (
        <div className="space-y-4">
          <PythonEditor 
            value={code} 
            onChange={updateCode} 
            filename="practice.py" 
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
            
            {hintIndex < step.hints.length && (
              <button 
                onClick={() => setHintIndex(prev => prev + 1)} 
                className="px-4 py-2 text-sm font-medium text-info bg-info/10 hover:bg-info/20 rounded-lg transition-colors border border-info/20"
              >
                Show Hint ({step.hints.length - hintIndex} left)
              </button>
            )}
          </div>

          <ExecutionOutput 
            result={lastResult} 
            isRunning={isRunning} 
            comparison={comparison} 
          />

          <div className="space-y-2 mt-4">
            {step.hints.slice(0, hintIndex).map((hint, i) => (
              <div key={i} className="p-4 bg-surface rounded-lg border border-border font-bangla text-muted-foreground text-sm flex gap-3">
                <HelpCircle className="w-5 h-5 shrink-0 text-info" /> {hint}
              </div>
            ))}
          </div>
        </div>
      )}

      {isDone && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 mt-8">
          <div className="p-6 rounded-xl border border-success/30 bg-success/10 text-success text-center">
            <Check className="w-12 h-12 mx-auto mb-2" />
            <span className="font-bangla font-bold text-xl block">আউটপুট সঠিক।</span>
            <span className="font-bangla font-bold text-xl block mt-2">খুব ভালো! তুমি এই Practice সম্পন্ন করেছ।</span>
          </div>
          
          <div className="rounded-xl overflow-hidden border border-border font-mono text-sm">
            <div className="bg-[#0d1117] p-6 text-blue-300"><pre><code>{step.solution}</code></pre></div>
            <div className="bg-[#05070a] p-4 text-green-400 border-t border-border/50"><span className="text-xs text-muted-foreground uppercase mr-2">Expected</span>{step.expectedOutput}</div>
          </div>
          <p className="font-bangla text-muted-foreground bg-surface p-4 rounded-lg border border-border">{step.solutionExplanation}</p>
        </div>
      )}
    </div>
  );
}
