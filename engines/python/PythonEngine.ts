// engines/python/PythonEngine.ts
// NEXUS Academy — Interactive Python Execution Engine
// Source of truth: PROJECT_MEMORY.md (Python Engine)

import { EventBus } from '@/engines/events/EventBus';
import { ExecutionResult, ExecutionConfig, DEFAULT_TIMEOUT_MS, MAX_OUTPUT_CHARS } from './python.types';

// Declare pyodide types for TS
declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
    pyodideInstance: any;
  }
}

export class PythonEngine {
  private static instance: PythonEngine | null = null;
  private pyodide: any = null;
  private isReady: boolean = false;
  private loadingPromise: Promise<void> | null = null;

  private constructor() {}

  /**
   * Singleton pattern. Loads Pyodide lazily.
   */
  public static getInstance(): PythonEngine {
    if (!PythonEngine.instance) {
      PythonEngine.instance = new PythonEngine();
    }
    return PythonEngine.instance;
  }

  /**
   * Initialize Pyodide via CDN if not already loaded.
   */
  public async init(): Promise<void> {
    if (this.isReady) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = new Promise(async (resolve, reject) => {
      try {
        if (typeof window === 'undefined') {
          resolve(); // Don't run on server
          return;
        }

        if (!window.pyodideInstance) {
          // Load script dynamically
          await new Promise<void>((res, rej) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
            script.onload = () => res();
            script.onerror = () => rej(new Error('Failed to load Pyodide script'));
            document.head.appendChild(script);
          });

          window.pyodideInstance = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
          });
        }
        
        this.pyodide = window.pyodideInstance;
        this.isReady = true;
        resolve();
      } catch (e) {
        console.error('Pyodide initialization failed:', e);
        reject(e);
      }
    });

    return this.loadingPromise;
  }

  /**
   * Executes Python code securely with a timeout and output capture.
   */
  public async runCode(code: string, config: ExecutionConfig = {}): Promise<ExecutionResult> {
    const timeoutMs = config.timeoutMs || DEFAULT_TIMEOUT_MS;
    const maxOutputChars = config.maxOutputChars || MAX_OUTPUT_CHARS;
    
    if (!this.isReady) {
      await this.init();
    }

    const startTime = performance.now();
    let stdoutBuffer = '';
    let stderrBuffer = '';

    // Redirect stdout and stderr
    this.pyodide.setStdout({
      batched: (msg: string) => {
        if (stdoutBuffer.length < maxOutputChars) {
          stdoutBuffer += msg + '\n';
        }
      }
    });
    this.pyodide.setStderr({
      batched: (msg: string) => {
        if (stderrBuffer.length < maxOutputChars) {
          stderrBuffer += msg + '\n';
        }
      }
    });

    let success = false;
    let errorType: string | undefined = undefined;

    try {
      // Execute with timeout race
      const execPromise = this.pyodide.runPythonAsync(code);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT_ERROR')), timeoutMs);
      });

      await Promise.race([execPromise, timeoutPromise]);
      success = true;
    } catch (error: any) {
      success = false;
      const rawError = error.message || String(error);
      
      if (rawError === 'TIMEOUT_ERROR') {
        errorType = 'TimeoutError';
        stderrBuffer = 'Execution timed out.';
      } else {
        // Extract Python error type if possible (e.g. "SyntaxError", "NameError")
        const match = rawError.match(/([a-zA-Z0-9]+Error):/);
        if (match) {
          errorType = match[1];
        } else {
          errorType = 'RuntimeError';
        }
        stderrBuffer = rawError;
      }
    }

    // Restore original streams
    this.pyodide.setStdout({ batched: () => {} });
    this.pyodide.setStderr({ batched: () => {} });

    if (stdoutBuffer.length >= maxOutputChars) {
      stdoutBuffer += '\n... (output truncated) ...';
    }

    const executionTimeMs = Math.round(performance.now() - startTime);

    const result: ExecutionResult = {
      stdout: stdoutBuffer,
      stderr: stderrBuffer,
      success,
      executionTimeMs,
      errorType
    };

    // Emit domain event for future engines to consume (Open/Closed Principle)
    EventBus.emit({
      type: 'CODE_EXECUTED',
      payload: {
        code,
        stdout: result.stdout,
        stderr: result.stderr,
        executionTimeMs: result.executionTimeMs,
        success: result.success
      }
    });

    return result;
  }
}
