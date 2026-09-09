// engines/python/python.worker.ts
// NEXUS Academy — Python Web Worker
// This script runs entirely in a background thread.

import type { WorkerRequest, WorkerResponse } from './python.worker.types';

// Declare globals that Pyodide expects or creates
declare const self: any;


let isReady = false;
let stderrBuffer: string[] = [];
let stdoutBuffer: string[] = [];

// Add a simple timeout mechanism within the worker (failsafe)
// NOTE: Actual timeout is managed by the main thread, but this prevents infinite while loops
// from locking the worker FOREVER if we implement a custom Pyodide interrupt later.

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const req = event.data;

  try {
    if (req.type === 'INIT') {
      if (isReady) {
        self.postMessage({ id: req.id, type: 'INIT_SUCCESS' } as WorkerResponse);
        return;
      }

      // Load Pyodide from CDN
      self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');

      self.pyodide = await self.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });

      // Setup stdio redirection overrides
      self.pyodide.setStdout({
        batched: (msg: string) => { stdoutBuffer.push(msg); }
      });
      self.pyodide.setStderr({
        batched: (msg: string) => { stderrBuffer.push(msg); }
      });
      self.pyodide.setStdin({
        stdin: () => 'Nexus\n'
      });

      isReady = true;
      self.postMessage({ id: req.id, type: 'INIT_SUCCESS' } as WorkerResponse);
    } 
    else if (req.type === 'RUN_CODE') {
      if (!isReady) {
        throw new Error('Pyodide is not initialized yet');
      }

      // Clear buffers before run
      stdoutBuffer = [];
      stderrBuffer = [];

      try {
        const inputsJson = JSON.stringify(req.inputs || []);
        const setupScript = `
import builtins, sys, json

_inputs_queue = json.loads('''${inputsJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''')

def _smart_input(prompt=''):
    global _inputs_queue
    if prompt:
        sys.stdout.write(str(prompt))
        sys.stdout.flush()
    if _inputs_queue:
        val = _inputs_queue.pop(0)
    else:
        p = str(prompt).lower()
        if 'name' in p:
            val = 'Hasan'
        elif 'where' in p or 'location' in p or 'city' in p:
            val = 'Dhaka'
        elif 'color' in p:
            val = 'Blue'
        elif 'hobby' in p:
            val = 'Reading'
        elif 'age' in p or 'year' in p:
            val = '20'
        elif 'num' in p or 'number' in p:
            val = '10'
        elif prompt and len(str(prompt).strip()) > 0 and not str(prompt).strip().endswith(':') and not str(prompt).strip().endswith('?'):
            val = str(prompt).strip()
        else:
            val = 'Nexus'
    sys.stdout.write(str(val) + '\\n')
    sys.stdout.flush()
    return str(val)

builtins.input = _smart_input
`;
        await self.pyodide.runPythonAsync(setupScript);
        await self.pyodide.runPythonAsync(req.code);
        
        self.postMessage({
          id: req.id,
          type: 'RUN_SUCCESS',
          stdout: stdoutBuffer.join('\n'),
          stderr: stderrBuffer.join('\n')
        } as WorkerResponse);
      } catch (err: any) {
        // Pyodide Python errors
        self.postMessage({
          id: req.id,
          type: 'RUN_ERROR',
          error: err.message || String(err),
          errorType: err.type || 'PythonError',
        } as WorkerResponse);
      }
    }
  } catch (error: any) {
    // Handle unexpected errors (e.g. importScripts failed)
    if (req.type === 'INIT') {
      self.postMessage({
        id: req.id,
        type: 'INIT_ERROR',
        error: error.message || String(error)
      } as WorkerResponse);
    } else if (req.type === 'RUN_CODE') {
      self.postMessage({
        id: req.id,
        type: 'RUN_ERROR',
        error: error.message || String(error)
      } as WorkerResponse);
    }
  }
};
