# Security Policy & Architecture

## Security Overview

**NEXUS Academy** is engineered with a **client-side, privacy-first security model**. By shifting Python code execution, educational state evaluation, and scoring into the learner's browser via WebAssembly, the platform eliminates the most critical attack surfaces found in traditional online coding platforms.

---

## 1. Threat Model & Privacy-First Architecture

### 1.1 Zero Server-Side Code Execution
Traditional learning platforms receive untrusted user code over HTTP and execute it inside containerized server sandboxes (e.g. Docker, Firecracker, gVisor). This architecture is vulnerable to container escapes, server resource exhaustion (denial of service), and lateral network traversal.

**NEXUS Academy eliminates this attack vector entirely:**
- **Zero Server Compute:** User code is never transmitted to any server.
- **100% Client-Side WebAssembly:** Code runs locally inside the user's browser using Pyodide (CPython 3.12 compiled to WASM).
- **No Shared Infrastructure:** One user's code execution has zero capability to impact, observe, or degrade another user's session.

### 1.2 Zero Learner Telemetry & Zero Private Data Exposure
- The platform does not require registration, passwords, credit card information, or personal identifiable information (PII) to learn.
- Learner code, quiz responses, diagnostic logs, and study schedules remain exclusively in the learner's local browser storage.
- There are no third-party tracking pixels, advertising scripts, or behavioural telemetry collectors.

---

## 2. Web Worker Execution Isolation & Sandboxing

Python code is executed inside an isolated Web Worker thread:

1. **No DOM or Cookie Access:** In accordance with the W3C Web Workers specification, code running inside a Web Worker has **no access** to the `window` object, the `document` DOM, browser cookies, session tokens, or local storage.
2. **Main Thread Protection (No UI Freezes):** Heavy computation or infinite loops triggered by student code cannot block the browser's UI thread or prevent page interaction.
3. **Execution Timeouts:** Worker tasks are monitored with a strict timeout guard (default: 10,000ms). Tasks that exceed this threshold are automatically terminated and worker state is safely recycled.
4. **Memory Boundaries:** WebAssembly operates within a linearly indexed memory buffer allocated by the browser engine. Pyodide cannot access or corrupt host memory outside its assigned ArrayBuffer.

---

## 3. Storage Sandboxing & State Safety

Learner progress is persisted via the browser's `localStorage` API under safe invariants:

- **Strict Namespacing:** All application keys are prefixed with `nexus_` (e.g., `nexus_progress`, `nexus_memory`, `nexus_settings`) to prevent accidental collisions with third-party browser extensions.
- **Defensive Error Handling:** All storage reads and writes are encapsulated in `StorageService` using robust `try/catch` wrappers. This guarantees stability under private browsing quotas, storage denials, or iOS Safari sandbox constraints.
- **Corruption Isolation:** If storage data becomes corrupted or unparseable, `storageBackupAndClear` automatically copies the raw payload to a timestamped backup key (`${key}_backup_${Date.now()}`) before reinitializing safe default values. Corrupt data is never allowed to crash the application.

---

## 4. Supply Chain & Dependency Hygiene

- **Automated CI Security Scans:** Every commit and pull request triggers our GitHub Actions CI pipeline, enforcing strict type checks (`tsc --noEmit`), automated pedagogical AST verification, and unit test suites.
- **Pinned Dependencies:** All core dependencies are locked via `package-lock.json` with exact versions.
- **Minimal External Footprint:** Runtime dependencies are strictly limited to battle-tested foundational libraries (Next.js, React, Tailwind CSS, Monaco Editor, Pyodide).

---

## 5. Supported Versions

| Version | Supported | Security Maintenance |
| :--- | :--- | :--- |
| `0.4.x` | :white_check_mark: | Active release — security patches applied immediately. |
| `0.3.x` | :white_check_mark: | Maintenance fixes for published missions. |
| `< 0.3.0` | :x: | Deprecated. Please update to the latest release. |

---

## 6. Reporting a Vulnerability & Responsible Disclosure

We take the security of NEXUS Academy and our learners seriously. If you discover a security vulnerability or potential threat in this repository or live platform, please report it responsibly:

- **Email:** Report findings directly to `hasan.circuito@gmail.com`.
- **Details to Include:**
  - Description of the vulnerability or flaw.
  - Clear steps to reproduce or proof-of-concept code.
  - Potential impact assessment.
  - Your name or handle for acknowledgment (optional).
- **Response SLA:** We will acknowledge receipt of your report within **48 hours** and provide an estimated timeline for remediation.
- **Public Disclosure:** We kindly request that you refrain from disclosing the issue publicly until we have investigated and deployed a fix.
