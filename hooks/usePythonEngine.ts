// hooks/usePythonEngine.ts
// NEXUS Academy — Hook for Python Engine

import { useState, useEffect, useCallback } from 'react';
import { PythonEngine } from '@/engines/python/PythonEngine';
import { ExecutionResult, ExecutionConfig } from '@/engines/python/python.types';

export function usePythonEngine() {
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      try {
        const engine = PythonEngine.getInstance();
        await engine.init();
        if (mounted) {
          setIsReady(true);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to initialize Python environment');
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const runCode = useCallback(async (code: string, config?: ExecutionConfig): Promise<ExecutionResult> => {
    setIsRunning(true);
    setError(null);
    try {
      const engine = PythonEngine.getInstance();
      const result = await engine.runCode(code, config);
      setLastResult(result);
      return result;
    } catch (err: any) {
      const errorResult: ExecutionResult = {
        stdout: '',
        stderr: err.message || 'Unknown error occurred',
        success: false,
        executionTimeMs: 0,
        errorType: 'RuntimeError'
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsRunning(false);
    }
  }, []);

  return {
    runCode,
    isReady,
    isRunning,
    lastResult,
    error
  };
}
