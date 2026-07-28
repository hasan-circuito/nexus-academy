// engines/python/python.worker.types.ts
// NEXUS Academy — Python Web Worker Message Protocol

export type WorkerMessageType = 
  | 'INIT'
  | 'INIT_SUCCESS'
  | 'INIT_ERROR'
  | 'RUN_CODE'
  | 'RUN_SUCCESS'
  | 'RUN_ERROR'
  | 'CANCEL' // For future cancellation support
  | 'CANCEL_SUCCESS';

export interface WorkerMessageBase {
  id: string; // Unique ID for request/response pairing
  type: WorkerMessageType;
}

// Request to initialize the worker
export interface WorkerInitRequest extends WorkerMessageBase {
  type: 'INIT';
}

// Successful initialization response
export interface WorkerInitSuccess extends WorkerMessageBase {
  type: 'INIT_SUCCESS';
}

// Failed initialization response
export interface WorkerInitError extends WorkerMessageBase {
  type: 'INIT_ERROR';
  error: string;
}

// Request to run code
export interface WorkerRunRequest extends WorkerMessageBase {
  type: 'RUN_CODE';
  code: string;
}

// Successful run response
export interface WorkerRunSuccess extends WorkerMessageBase {
  type: 'RUN_SUCCESS';
  stdout: string;
  stderr: string;
}

// Failed run response
export interface WorkerRunError extends WorkerMessageBase {
  type: 'RUN_ERROR';
  error: string;
  errorType?: string;
  lineNumber?: number;
}

// Request to cancel execution (future)
export interface WorkerCancelRequest extends WorkerMessageBase {
  type: 'CANCEL';
}

// Successful cancel response (future)
export interface WorkerCancelSuccess extends WorkerMessageBase {
  type: 'CANCEL_SUCCESS';
}

export type WorkerRequest = WorkerInitRequest | WorkerRunRequest | WorkerCancelRequest;
export type WorkerResponse = WorkerInitSuccess | WorkerInitError | WorkerRunSuccess | WorkerRunError | WorkerCancelSuccess;
