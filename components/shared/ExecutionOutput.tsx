// components/shared/ExecutionOutput.tsx
// NEXUS Academy — Interactive Python Execution Output Component

import React from 'react';
import { ExecutionResult, EvaluationResult } from '@/engines/python/python.types';
import { PythonErrorInterpreter } from '@/engines/python/PythonErrorInterpreter';
import { Terminal, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export interface ExecutionOutputProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  evaluation?: EvaluationResult | null;
}

export const ExecutionOutput: React.FC<ExecutionOutputProps> = ({ result, isRunning, evaluation }) => {
  if (isRunning) {
    return (
      <div className="mt-4 p-4 rounded-lg border border-slate-700 bg-[#0f172a] shadow-inner font-mono text-sm animate-pulse">
        <div className="flex items-center text-slate-400 space-x-2">
          <Terminal size={16} />
          <span>Executing...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mt-4 p-4 rounded-lg border border-slate-700 bg-[#0f172a] shadow-inner font-mono text-sm opacity-50">
        <div className="flex items-center text-slate-500 space-x-2">
          <Terminal size={16} />
          <span>Ready to execute. Click Run.</span>
        </div>
      </div>
    );
  }

  const interpretedError = result.stderr ? PythonErrorInterpreter.interpret(result.stderr, result.errorType) : null;

  return (
    <div className="mt-4 flex flex-col rounded-lg border border-slate-700 bg-[#0f172a] shadow-inner overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Terminal size={14} />
          <span>Output</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock size={12} />
          <span>{result.executionTimeMs} ms</span>
        </div>
      </div>

      {/* Stdout */}
      {result.stdout && (
        <div className="p-4 font-mono text-sm text-green-400 whitespace-pre-wrap">
          {result.stdout}
        </div>
      )}

      {/* Stderr / Error Interpretation */}
      {interpretedError && (
        <div className="p-4 bg-red-950/30 border-t border-red-900/50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
            <div>
              <h4 className="font-bold text-red-400 mb-1">{interpretedError.banglaTitle}</h4>
              <p className="text-red-300 text-sm mb-2">{interpretedError.explanation}</p>
              
              <div className="text-red-200 text-sm mb-2">
                <span className="font-semibold block mb-1">কেন হলো?</span>
                {interpretedError.whyItHappened}
              </div>
              
              <div className="text-red-200 text-sm mb-3">
                <span className="font-semibold block mb-1">কীভাবে ঠিক করবে?</span>
                {interpretedError.howToFix}
              </div>

              {interpretedError.correctedExample && (
                <div className="bg-black/50 p-3 rounded font-mono text-xs text-red-300 whitespace-pre-wrap border border-red-900/30">
                  {interpretedError.correctedExample}
                </div>
              )}

              <details className="mt-4">
                <summary className="text-xs text-red-500 cursor-pointer hover:text-red-400">Show raw Python error</summary>
                <div className="mt-2 p-2 bg-black/80 rounded font-mono text-[10px] text-red-500 whitespace-pre-wrap">
                  {interpretedError.originalError}
                </div>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* Unhandled raw stderr fallback (if interpretation fails) */}
      {!interpretedError && result.stderr && (
        <div className="p-4 font-mono text-sm text-red-500 whitespace-pre-wrap bg-red-950/20">
          {result.stderr}
        </div>
      )}

      {/* Evaluation Feedback */}
      {evaluation && (
        <div className={`p-4 border-t text-sm ${
          evaluation.passed 
            ? 'bg-green-950/30 border-green-900/50' 
            : 'bg-yellow-950/30 border-yellow-900/50'
        }`}>
          {evaluation.passed ? (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="font-semibold">{evaluation.message || 'আউটপুট সঠিক। খুব ভালো!'}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle size={18} className="text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-400 mb-1">সঠিক হয়নি!</h4>
                  <p className="text-yellow-300 text-sm">{evaluation.message}</p>
                </div>
              </div>
              
              {evaluation.diffExpected !== undefined && evaluation.diffActual !== undefined && (
                <>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-black/50 p-3 rounded border border-yellow-900/30">
                      <span className="text-yellow-500 uppercase block mb-2 tracking-wider">Expected Output</span>
                      <pre className="text-green-400 whitespace-pre-wrap">{evaluation.diffExpected || ' '}</pre>
                    </div>
                    <div className="bg-black/50 p-3 rounded border border-yellow-900/30">
                      <span className="text-yellow-500 uppercase block mb-2 tracking-wider">Actual Output</span>
                      <pre className="text-red-400 whitespace-pre-wrap">{evaluation.diffActual || ' '}</pre>
                    </div>
                  </div>

                  {evaluation.validationType === 'exact_output' && (
                    <div className="p-3 bg-black/30 rounded border border-yellow-900/20 text-yellow-200 text-xs">
                      <span className="text-yellow-500 uppercase block mb-1 tracking-wider">Difference</span>
                      {evaluation.diffActual && evaluation.diffExpected ? (
                          <div>
                            Your output has <strong>{evaluation.diffActual.length}</strong> characters, but expected has <strong>{evaluation.diffExpected.length}</strong>.
                          </div>
                      ) : 'No output produced.'}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
