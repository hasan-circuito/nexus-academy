'use client';
import type { PracticeStep, MissionData } from '@/types/mission.types';
import { useState } from 'react';
import { HelpCircle, Check, Play, RotateCcw, Lightbulb, Copy } from 'lucide-react';
import { PythonEditor } from '@/components/editor/PythonEditor';
import { ExecutionOutput } from '@/components/shared/ExecutionOutput';
import { usePythonEngine } from '@/hooks/usePythonEngine';
import { PythonEngine } from '@/engines/python/PythonEngine';
import { usePracticeCode } from '@/hooks/usePracticeCode';
import { OutputComparator } from '@/engines/python/OutputComparator';
import { ValidationEngine } from '@/engines/python/ValidationEngine';
import { EvaluationResult } from '@/engines/python/python.types';
import { EventBus } from '@/engines/events/EventBus';
import { saveStepEvidence } from '@/hooks/useProgress';

import { extractInputs } from '@/engines/python/inputExtractor';

export function PracticeStepComponent({ step, missionData }: { step: PracticeStep; missionData: MissionData }) {
  const [hintIndex, setHintIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [collectedInputs, setCollectedInputs] = useState<string[]>([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showSolutionCard, setShowSolutionCard] = useState(false);

  const { runCode, isRunning, lastResult, error: engineError } = usePythonEngine();
  // Using step.title as the unique identifier so multiple practice steps in a mission don't share code
  const { code, updateCode, isLoaded, resetCode } = usePracticeCode(missionData.id, step.title, step.starterCode || '');

  const executeWithInputs = async (inputs: string[]) => {
    const result = await runCode(code, { inputs });
    
    // If execution paused to await user input from terminal
    if (result.isAwaitingInput) {
      setEvaluation(null);
      return;
    }

    if (result.success) {
      // Fallback to exact_output for older missions without validation
      const config = step.validation 
        ? { ...step.validation, expectedOutput: step.expectedOutput }
        : { type: 'exact_output' as const, value: step.expectedOutput, expectedOutput: step.expectedOutput };
      
      // Dynamic comparison using the actual inputs entered by the user
      let comparisonTarget = config.type === 'exact_output' ? config.value : config.expectedOutput;

      // If learner provided custom interactive inputs and reference solution exists,
      // run reference solution with those exact inputs to compute the true programmatic expected output.
      if (step.solution && inputs && inputs.length > 0) {
        try {
          // Guard: only execute reference solution if inputs match or exceed input() calls in solution
          const solutionInputCount = (step.solution.match(/input\s*\(/g) || []).length;
          if (inputs.length >= solutionInputCount) {
            const solutionRes = await PythonEngine.getInstance().runCode(step.solution, { inputs });
            if (solutionRes.success && solutionRes.stdout && !solutionRes.isAwaitingInput) {
              comparisonTarget = solutionRes.stdout;
              config.expectedOutput = solutionRes.stdout;
            }
          }
        } catch (e) {
          // Keep static comparisonTarget on error
        }
      }

      const comparison = OutputComparator.compare(result.stdout, comparisonTarget, {
        code,
        userInputs: inputs,
      });
      
      const evalResult = ValidationEngine.evaluate(result, comparison, config, code);
      setEvaluation(evalResult);

      if (evalResult.passed) {
        setIsDone(true);
        setFailedAttempts(0);
        // Persist practice evidence
        saveStepEvidence(missionData.id, 'practice', {
          passed: true,
          hintsUsed: hintIndex,
        });
        const stepIdx = missionData.steps.findIndex(s => s === step || s.title === step.title);
        if (stepIdx !== -1) {
          saveStepEvidence(missionData.id, `step_${stepIdx}`, {
            passed: true,
            hintsUsed: hintIndex,
            title: step.title,
            stepType: 'practice',
          });
        }
        // Emit true completion (not self-reported)
        EventBus.emit({
          type: 'PRACTICE_COMPLETED',
          payload: {
            missionId: missionData.id,
            selfReported: false,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        setFailedAttempts(prev => prev + 1);
      }
    } else {
      setEvaluation(null);
      setFailedAttempts(prev => prev + 1);
    }
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setCollectedInputs([]);
    await executeWithInputs([]);
  };

  const handleInputSubmit = (val: string) => {
    const nextInputs = [...collectedInputs, val];
    setCollectedInputs(nextInputs);
    executeWithInputs(nextInputs);
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

      {isLoaded && (
        <div className="space-y-4">
          <PythonEditor 
            value={code} 
            onChange={updateCode} 
            filename="practice.py" 
            height="250px" 
          />

          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <button 
                onClick={handleRun}
                disabled={isRunning || !code.trim()}
                className={`flex items-center space-x-2 px-6 py-2 font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDone ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-500'
                }`}
              >
                <Play size={18} className={isRunning ? 'animate-pulse' : ''} />
                <span>{isRunning ? 'Running...' : isDone ? 'Run Again' : 'Run Code'}</span>
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
                  Show Hint ({step.hints.length - hintIndex} left)
                </button>
              )}
            </div>

            {isDone && (
              <div className="flex items-center gap-2 text-emerald-400 font-bangla font-semibold text-sm bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>অনুশীলন সম্পন্ন</span>
              </div>
            )}
          </div>

          <ExecutionOutput 
            result={lastResult} 
            isRunning={isRunning} 
            evaluation={evaluation} 
            onInputSubmit={handleInputSubmit}
            code={code}
          />

          {/* Escape Hatch: Show Solution after 2 failed attempts */}
          {failedAttempts >= 2 && !isDone && (
            <div className="p-4 sm:p-5 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl space-y-3 font-bangla animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm sm:text-base">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="block font-bold">আটকে গেছ? কোনো সমস্যা নেই!</span>
                    <span className="text-xs text-muted-foreground font-normal">ছোটখাটো ফরম্যাট বা স্পেলিংয়ের কারণে আউটপুট না মিললে সমাধানটি দেখে নাও।</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSolutionCard(!showSolutionCard)}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-102 shrink-0 cursor-pointer"
                >
                  {showSolutionCard ? 'সমাধান লুকান' : '💡 সমাধান কোড ও ব্যাখ্যা দেখুন'}
                </button>
              </div>

              {showSolutionCard && (
                <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-xs text-muted-foreground">
                    রেফারেন্স সমাধানটি দেখে বুঝে নাও এবং নিজের কোডে পরিবর্তন এনে আবার রান করো:
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border font-mono text-sm bg-[#0d1117] shadow-inner">
                    <div className="bg-[#161b22] px-4 py-2 text-xs text-muted-foreground border-b border-border/50 flex items-center justify-between">
                      <span className="font-semibold text-slate-300">REFERENCE SOLUTION</span>
                      <button
                        type="button"
                        onClick={() => updateCode(step.solution)}
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover font-sans font-semibold cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>এডিটরে কপি করো (Copy to Editor)</span>
                      </button>
                    </div>
                    <pre className="p-4 text-emerald-300 whitespace-pre-wrap overflow-x-auto text-xs sm:text-sm"><code>{step.solution}</code></pre>
                  </div>
                  {step.solutionExplanation && (
                    <div className="p-3 bg-surface rounded-xl border border-border text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground block mb-1">ব্যাখ্যা:</span>
                      {step.solutionExplanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step.hints.length > 0 && hintIndex > 0 && (
            <div className="space-y-2 mt-4">
              {step.hints.slice(0, hintIndex).map((hint, i) => (
                <div key={i} className="p-4 bg-surface rounded-lg border border-border font-bangla text-muted-foreground text-sm flex gap-3">
                  <HelpCircle className="w-5 h-5 shrink-0 text-info" /> {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isDone && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 mt-8">
          <div className="p-6 rounded-xl border border-success/30 bg-success/10 text-success text-center">
            <Check className="w-12 h-12 mx-auto mb-2" />
            <span className="font-bangla font-bold text-xl block">আউটপুট সঠিক!</span>
            <span className="font-bangla font-semibold text-base block mt-1 text-success/90">খুব ভালো! তুমি এই অনুশীলনটি সফলভাবে সম্পন্ন করেছ।</span>
          </div>
          
          <div className="rounded-xl overflow-hidden border border-border font-mono text-sm">
            <div className="bg-[#0d1117] p-4 text-xs font-sans text-muted-foreground border-b border-border/50 uppercase tracking-wider font-semibold">
              Reference Solution
            </div>
            <div className="bg-[#0d1117] p-6 text-blue-300"><pre><code>{step.solution}</code></pre></div>
            <div className="bg-[#05070a] p-4 text-green-400 border-t border-border/50"><span className="text-xs text-muted-foreground uppercase mr-2">Expected Output / Goal:</span>{step.displayHint || step.expectedOutput}</div>
          </div>
          {step.solutionExplanation && (
            <p className="font-bangla text-muted-foreground bg-surface p-4 rounded-lg border border-border">{step.solutionExplanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
