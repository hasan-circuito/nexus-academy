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

class _NexusInputRequest(Exception):
    def __init__(self, prompt):
        self.prompt = prompt

_inputs_queue = json.loads('''${inputsJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''')
_pending_prompt = None

def _smart_input(prompt=''):
    global _inputs_queue, _pending_prompt
    p_str = str(prompt) if prompt is not None else ''
    if _inputs_queue and len(_inputs_queue) > 0:
        val = _inputs_queue.pop(0)
        if p_str:
            sys.stdout.write(p_str)
        sys.stdout.write(str(val) + '\\n')
        sys.stdout.flush()
        return str(val)
    else:
        _pending_prompt = p_str
        sys.stdout.flush()
        raise _NexusInputRequest(p_str)

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
        // Check if user input is requested from the interactive terminal
        let isInputReq = err.type === '_NexusInputRequest' || (err.message && err.message.includes('_NexusInputRequest'));
        let pendingPrompt = '';
        
        try {
          const p = self.pyodide.globals.get('_pending_prompt');
          if (p !== undefined && p !== null) {
            isInputReq = true;
            pendingPrompt = String(p);
            self.pyodide.globals.set('_pending_prompt', null);
          }
        } catch (e) {}

        if (isInputReq) {
          self.postMessage({
            id: req.id,
            type: 'AWAIT_INPUT',
            prompt: pendingPrompt,
            stdout: stdoutBuffer.join('\n'),
          } as WorkerResponse);
          return;
        }

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
