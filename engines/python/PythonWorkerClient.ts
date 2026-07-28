// engines/python/PythonWorkerClient.ts
// NEXUS Academy — Client for Python Web Worker
import { 
  WorkerRequest, 
  WorkerResponse, 
  WorkerRunRequest, 
  WorkerInitRequest,
  WorkerRunSuccess,
  WorkerRunError
} from './python.worker.types';

export class PythonWorkerClient {
  private static instance: PythonWorkerClient;
  private worker: Worker | null = null;
  private pendingRequests: Map<string, { resolve: (val: any) => void, reject: (err: any) => void }> = new Map();
  private isReady = false;
  private initPromise: Promise<void> | null = null;
  
  // Timeout for code execution (10 seconds max)
  private readonly EXECUTION_TIMEOUT_MS = 10000;

  private constructor() {}

  public static getInstance(): PythonWorkerClient {
    if (!PythonWorkerClient.instance) {
      PythonWorkerClient.instance = new PythonWorkerClient();
    }
    return PythonWorkerClient.instance;
  }

  private spawnWorker(): void {
    if (this.worker) {
      this.worker.terminate();
    }
    // Webpack / Next.js syntax for Web Workers
    this.worker = new Worker(new URL('./python.worker.ts', import.meta.url));
    this.worker.onmessage = this.handleMessage.bind(this);
    this.worker.onerror = (err) => {
      console.error('[PythonWorkerClient] Worker error:', err);
      // Reject all pending requests
      this.rejectAllPending(new Error('Python Worker crashed unrecoverably.'));
      this.isReady = false;
      this.initPromise = null;
    };
  }

  private handleMessage(event: MessageEvent<WorkerResponse>) {
    const res = event.data;
    const pending = this.pendingRequests.get(res.id);
    if (!pending) return;

    this.pendingRequests.delete(res.id);

    switch (res.type) {
      case 'INIT_SUCCESS':
        this.isReady = true;
        pending.resolve(true);
        break;
      case 'INIT_ERROR':
        pending.reject(new Error(res.error));
        break;
      case 'RUN_SUCCESS':
        pending.resolve({ stdout: res.stdout, stderr: res.stderr, success: true });
        break;
      case 'RUN_ERROR':
        // Instead of rejecting, we return it as a structured error so the UI can interpret it
        pending.resolve({ stdout: '', stderr: res.error, success: false, errorType: res.errorType });
        break;
      case 'CANCEL_SUCCESS':
        pending.resolve(true);
        break;
    }
  }

  private rejectAllPending(error: Error) {
    for (const [id, promise] of this.pendingRequests.entries()) {
      promise.reject(error);
    }
    this.pendingRequests.clear();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public init(): Promise<void> {
    if (this.isReady) return Promise.resolve();
    if (this.initPromise) return this.initPromise;

    this.spawnWorker();

    this.initPromise = new Promise((resolve, reject) => {
      const id = this.generateId();
      this.pendingRequests.set(id, { resolve, reject });
      
      const req: WorkerInitRequest = { id, type: 'INIT' };
      this.worker!.postMessage(req);
    });

    return this.initPromise;
  }

  public async runCode(code: string): Promise<{ stdout: string; stderr: string; success: boolean; errorType?: string }> {
    if (!this.isReady) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const id = this.generateId();
      
      // Setup timeout to terminate infinite loops
      const timer = setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          console.warn('[PythonWorkerClient] Execution timed out. Terminating worker to recover.');
          // Worker recovery: Terminate the frozen worker and resolve as a timeout error
          if (this.worker) {
            this.worker.terminate();
          }
          this.worker = null;
          this.isReady = false;
          this.initPromise = null;
          
          resolve({
            stdout: '',
            stderr: 'Execution timed out (possible infinite loop). Python environment has been reset.',
            success: false,
            errorType: 'TimeoutError'
          });
        }
      }, this.EXECUTION_TIMEOUT_MS);

      this.pendingRequests.set(id, {
        resolve: (val) => {
          clearTimeout(timer);
          resolve(val);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        }
      });

      const req: WorkerRunRequest = { id, type: 'RUN_CODE', code };
      this.worker!.postMessage(req);
    });
  }

  /**
   * Future cancellation support
   */
  public cancel(): void {
    if (this.worker) {
      console.log('[PythonWorkerClient] Manual cancellation requested. Resetting worker.');
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
      this.initPromise = null;
      this.rejectAllPending(new Error('Execution manually cancelled.'));
    }
  }
}
