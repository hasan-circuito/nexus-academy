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
