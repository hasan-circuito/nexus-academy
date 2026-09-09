'use client';
import type { DebugChallengeStep, MissionData } from '@/types/mission.types';
import { useState } from 'react';
import { Bug, Search, Check, AlertOctagon, Play, RotateCcw } from 'lucide-react';
import { PythonEditor } from '@/components/editor/PythonEditor';
import { ExecutionOutput } from '@/components/shared/ExecutionOutput';
import { usePythonEngine } from '@/hooks/usePythonEngine';
import { usePracticeCode } from '@/hooks/usePracticeCode';
import { EventBus } from '@/engines/events/EventBus';
import { saveStepEvidence } from '@/hooks/useProgress';

import { extractInputs } from '@/engines/python/inputExtractor';

export function DebugChallengeStepComponent({ step, missionData }: { step: DebugChallengeStep; missionData: MissionData }) {
  const [hintIndex, setHintIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);

  const { runCode, isRunning, lastResult, error: engineError } = usePythonEngine();
  // Using step.title as the unique identifier so multiple debug steps in a mission don't share code
  const { code, updateCode, isLoaded, resetCode } = usePracticeCode(missionData.id, step.title, step.buggyCode);
  const detectedInputs = extractInputs(code, step.explanation);

  const handleRun = async () => {
    if (!code.trim()) return;
    const inputs = extractInputs(code, step.explanation);
    const result = await runCode(code, { inputs });
    
    if (result.success && !result.stderr) {
      setIsFixed(true);
      // Persist debug evidence
      saveStepEvidence(missionData.id, 'debug_challenge', {
        passed: true,
        hintsUsed: hintIndex,
      });
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

      {isLoaded && (
        <div className="space-y-4">
          
          <div className="bg-destructive/10 p-4 text-destructive border border-destructive/30 rounded-lg flex items-center gap-2 font-medium">
            <AlertOctagon className="w-4 h-4 shrink-0" /> {step.errorMessage}
          </div>

          <PythonEditor 
            value={code} 
            onChange={updateCode} 
            filename="debug.py" 
            height="250px"
            highlightLine={isFixed ? undefined : step.bugLine}
          />

          {detectedInputs.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-bangla text-muted-foreground bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg">
              <span className="font-semibold text-primary flex items-center gap-1 shrink-0">
                📥 নমুনা টেস্ট ইনপুট:
              </span>
              <div className="flex gap-1.5 flex-wrap items-center">
                {detectedInputs.map((val, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-background rounded text-foreground font-mono font-bold border border-border">
                    {val}
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground text-[11px] hidden sm:inline">
                (অনলাইনে কোড টেস্ট করার জন্য সিস্টেম স্বয়ংক্রিয়ভাবে এই ইনপুটগুলো পাঠাচ্ছে)
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <button 
                onClick={handleRun}
                disabled={isRunning || !code.trim()}
                className={`flex items-center space-x-2 px-6 py-2 font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFixed ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-500'
                }`}
              >
                <Play size={18} className={isRunning ? 'animate-pulse' : ''} />
                <span>{isRunning ? 'Running...' : isFixed ? 'Run Again' : 'Run Fixed Code'}</span>
              </button>

              <button 
                onClick={resetCode}
                title="Reset to Original Code"
                className="p-2 text-muted-foreground hover:bg-surface hover:text-foreground rounded-lg transition-colors border border-transparent hover:border-border"
              >
                <RotateCcw size={20} />
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

            {isFixed && (
              <div className="flex items-center gap-2 text-emerald-400 font-bangla font-semibold text-sm bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>বাগ সমাধান সম্পন্ন</span>
              </div>
            )}
          </div>

          <ExecutionOutput 
            result={lastResult} 
            isRunning={isRunning} 
            evaluation={isFixed && lastResult ? {
              passed: true,
              score: 100,
              message: 'বাগ ফিক্স হয়েছে! কোড সফলভাবে রান করেছে।',
              stdout: lastResult.stdout,
              stderr: '',
              runtimeError: false,
              validationType: 'exact_output',
            } : null}
          />

          {step.hints.length > 0 && hintIndex > 0 && (
            <div className="space-y-2 mt-4">
              {step.hints.slice(0, hintIndex).map((hint, i) => (
                <div key={i} className="p-4 bg-info/10 rounded-lg border border-info/20 font-bangla text-info text-sm flex gap-3">
                  <Search className="w-5 h-5 shrink-0" /> {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isFixed && (
        <div className="space-y-6 animate-in fade-in duration-500 mt-8">
          <div className="p-6 rounded-xl border border-success/30 bg-success/10 text-success text-center">
            <Check className="w-12 h-12 mx-auto mb-2" />
            <span className="font-bangla font-bold text-xl block">বাগ ফিক্সড!</span>
            <span className="font-bangla font-semibold text-base block mt-1 text-success/90">তুমি সফলভাবে বাগটি সমাধান করেছ।</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-success/30 font-mono text-sm shadow-md">
            <div className="bg-[#0d1117] p-4 text-xs font-sans text-muted-foreground border-b border-border/50 uppercase tracking-wider font-semibold">
              Correct Code Reference
            </div>
            <div className="bg-[#0d1117] p-6 text-blue-300"><pre><code>{step.fixedCode}</code></pre></div>
            <div className="bg-[#05070a] p-4 text-success border-t border-success/30">✓ Executed successfully</div>
          </div>
          {step.explanation && (
            <p className="font-bangla text-foreground bg-surface p-4 rounded-lg border border-border font-medium">{step.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
