// engines/python/PythonEngine.ts
// NEXUS Academy — Interactive Python Execution Engine (Web Worker Wrapper)
// Source of truth: PROJECT_MEMORY.md (Python Engine)

import { EventBus } from '@/engines/events/EventBus';
import { ExecutionResult, ExecutionConfig, DEFAULT_TIMEOUT_MS, MAX_OUTPUT_CHARS } from './python.types';
import { PythonWorkerClient } from './PythonWorkerClient';

export class PythonEngine {
  private static instance: PythonEngine | null = null;
  private workerClient: PythonWorkerClient;

  private constructor() {
    this.workerClient = PythonWorkerClient.getInstance();
  }

  /**
   * Singleton pattern.
   */
  public static getInstance(): PythonEngine {
    if (!PythonEngine.instance) {
      PythonEngine.instance = new PythonEngine();
    }
    return PythonEngine.instance;
  }

  /**
   * Initialize Pyodide Web Worker.
   */
  public async init(): Promise<void> {
    await this.workerClient.init();
  }

  /**
   * Executes Python code securely with a timeout and output capture via Web Worker.
   */
  public async runCode(code: string, config: ExecutionConfig = {}): Promise<ExecutionResult> {
    const startTime = performance.now();
    const maxOutputChars = config.maxOutputChars || MAX_OUTPUT_CHARS;
    
    // Run the code in the background Web Worker
    const response = await this.workerClient.runCode(code);

    let stdoutBuffer = response.stdout;
    let stderrBuffer = response.stderr;

    if (stdoutBuffer.length >= maxOutputChars) {
      stdoutBuffer = stdoutBuffer.substring(0, maxOutputChars) + '\n... (output truncated) ...';
    }

    const executionTimeMs = Math.round(performance.now() - startTime);

    const result: ExecutionResult = {
      stdout: stdoutBuffer,
      stderr: stderrBuffer,
      success: response.success,
      executionTimeMs,
      errorType: response.errorType
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
