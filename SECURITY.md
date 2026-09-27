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

- **Automated CI Security Scans:** Every commit and pull request triggers our GitHub Actions CI pipeline, enforcing strict type checks (`tsc --noEmit`), automated pedagogical AST verification (Rule 24), and unit test suites (1,640+ assertions passing 100%).
- **Pinned Dependencies:** All core dependencies are locked via `package-lock.json` with exact versions to prevent unintended upstream drift.
- **Minimal External Footprint:** Runtime dependencies are strictly limited to foundational libraries (Next.js, React, Tailwind CSS, Monaco Editor, Pyodide).
- **Realistic Upstream Boundaries:** While automated dependency auditing (`npm audit`) and pinned lockfiles guard against known vulnerabilities, open-source supply chains remain a shared ecosystem responsibility. Upstream patches are evaluated and integrated as released.

---

## 5. Supported Versions

| Version | Supported | Security Maintenance |
| :--- | :--- | :--- |
| `0.4.x` | :white_check_mark: | Active development release — prioritized security triage and patch releases. |
| `0.3.x` | :white_check_mark: | Maintenance fixes for published missions. |
| `< 0.3.0` | :x: | Deprecated / unmaintained. Please update to the latest release. |

---

## 6. Vulnerability Disclosure & Reporting Policy

We take the integrity of NEXUS Academy and learner safety seriously. As an open-source educational project maintained by an independent creator, we operate under a **Coordinated Vulnerability Disclosure (CVD)** framework aligned with RFC 9116:

### 6.1 How to Report
If you discover a security vulnerability or potential threat in this repository or the live deployment, please report it confidentially:

- **Email:** Report findings directly to `hasan.circuito@gmail.com`
- **Subject Line:** `[SECURITY] NEXUS Academy — <Brief Vulnerability Summary>`

### 6.2 Information to Include
To help us triage and verify your report quickly, please include:
1. A clear description of the vulnerability and attack vector.
2. Step-by-step reproduction instructions or a minimal proof-of-concept (PoC).
3. Realistic impact assessment (e.g. client XSS, denial of service, memory leak).
4. Suggested remediation or patch if available.
5. Your name, GitHub handle, or preference for public acknowledgment.

### 6.3 Response Expectations & Triage
- **Acknowledgment:** We aim to acknowledge receipt of confidential vulnerability reports on a **best-effort basis within 48 to 72 hours**.
- **Triage & Remediation:** Because NEXUS Academy is an open-source project operated without dedicated commercial support or enterprise SLAs, remediation timelines are prioritized based on severity (CVSS score). We strive to investigate confirmed vulnerabilities and deploy fixes or workarounds promptly.
- **Upstream Dependencies:** Vulnerabilities originating within upstream foundational libraries (e.g., Next.js core, Pyodide WASM, Monaco Editor) are triaged in coordination with upstream maintainers.

### 6.4 Coordinated Disclosure Guidelines
We follow standard responsible disclosure practices:
- Please allow reasonable time for investigation and remediation before publicly disclosing details.
- Do **not** open public GitHub issues or public discussions for unpatched security vulnerabilities.
- Do not attempt destructive actions against production hosting infrastructure or attempt to access or modify other individuals' local browser storage.
