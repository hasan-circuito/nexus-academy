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
import { OutputComparator } from '@/engines/python/OutputComparator';
import { PythonEngine } from '@/engines/python/PythonEngine';
import type { EvaluationResult } from '@/engines/python/python.types';

import { extractInputs } from '@/engines/python/inputExtractor';

export function DebugChallengeStepComponent({ step, missionData }: { step: DebugChallengeStep; missionData: MissionData }) {
  const [hintIndex, setHintIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [collectedInputs, setCollectedInputs] = useState<string[]>([]);

  const { runCode, isRunning, lastResult, error: engineError } = usePythonEngine();
  // Using step.title as the unique identifier so multiple debug steps in a mission don't share code
  const { code, updateCode, isLoaded, resetCode } = usePracticeCode(missionData.id, step.title, step.buggyCode);

  const handleReset = () => {
    resetCode();
    setIsFixed(false);
    setEvaluation(null);
    setCollectedInputs([]);
  };

  const executeWithInputs = async (inputs: string[]) => {
    const result = await runCode(code, { inputs });

    // If code is awaiting input from terminal
    if (result.isAwaitingInput) {
      setEvaluation(null);
      return;
    }

    const normalize = (c: string) => c.replace(/\r\n/g, '\n').trim();

    // 1. Check if user hasn't made any changes to the buggy code
    const isSelfFix = normalize(step.fixedCode) === normalize(step.buggyCode);
    if (!isSelfFix && normalize(code) === normalize(step.buggyCode)) {
      setIsFixed(false);
      setEvaluation({
        passed: false,
        score: 0,
        message: 'বাগটি এখনও সমাধান করা হয়নি! মূল কোডটি অপরিবর্তিত রয়েছে।',
        stdout: result.stdout,
        stderr: result.stderr,
        runtimeError: !!result.stderr,
        validationType: 'exact_output'
      });
      return;
    }

    // 2. Check for syntax or runtime errors
    if (!result.success || result.stderr) {
      setIsFixed(false);
      setEvaluation({
        passed: false,
        score: 0,
        message: 'কোডে এখনও এরর রয়েছে! নিচের এরর মেসেজ দেখে ঠিক করো।',
        stdout: result.stdout,
        stderr: result.stderr,
        runtimeError: true,
        validationType: 'exact_output'
      });
      return;
    }

    // 3. Logic & Output Match Verification with reference fixedCode
    try {
      const engine = PythonEngine.getInstance();
      const expectedResult = await engine.runCode(step.fixedCode, { inputs });

      if (expectedResult.stdout && expectedResult.stdout.trim().length > 0) {
        const comparison = OutputComparator.compareWithInputs(result.stdout, expectedResult.stdout, inputs, code);
        if (!comparison.matched) {
          setIsFixed(false);
          setEvaluation({
            passed: false,
            score: 0,
            message: 'কোড রান করেছে, কিন্তু ফলাফল প্রত্যাশিত অনুযায়ী আসেনি। লজিকটি আরেকবার পরীক্ষা করো।',
            stdout: result.stdout,
            stderr: '',
            runtimeError: false,
            validationType: 'exact_output',
            diffExpected: expectedResult.stdout,
            diffActual: result.stdout
          });
          return;
        }
      }
    } catch (err) {
      console.warn('[DebugChallengeStep] Failed to execute reference fixedCode:', err);
    }

    // Passed all validation checks!
    setIsFixed(true);
    setEvaluation({
      passed: true,
      score: 100,
      message: 'বাগ ফিক্স হয়েছে! কোড সফলভাবে রান করেছে এবং সঠিক আউটপুট দিয়েছে।',
      stdout: result.stdout,
      stderr: '',
      runtimeError: false,
      validationType: 'exact_output'
    });

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
                onClick={handleReset}
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
            evaluation={evaluation} 
            onInputSubmit={handleInputSubmit}
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
