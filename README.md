# PagePulse Backend Engine

A production-grade, high-performance URL audit core designed for absolute resilience, speed, and strict adherence to API contracts.

---

## 🏗 Architectural Blueprint

This backend engine rejects fragile scripts in favor of a hardened, concurrent architecture built to withstand high-throughput production environments:

*   **Concurrency Control:** A dedicated native semaphore throttle (`fetchSemaphore`) prevents heavy DOM extraction (`cheerio`) and SSL socket probing from exhausting server memory under heavy assault.
*   **Intelligent Caching:** Repeat audits within a configurable time window are intercepted and served instantly from an optimized memory cache, bypassing redundant network traversals.
*   **Traffic Regulation:** Built-in rate limiting per client shields the server from abuse, DDoS vectors, and runaway client loops.
*   **Strict Timeouts & Resilience:** Hard execution bounds (15s ceiling) guarantee that unresponsive target endpoints never leak worker threads or freeze the event loop.
*   **Traceable Telemetry:** Every incoming connection is assigned a unique `requestId` via custom middleware, ensuring end-to-end request lifecycle visibility.
*   **The Testing Crucible:** Fully covered by a `Vitest` and `Supertest` test suite, continuously executed via a GitHub Actions pipeline to enforce strict code quality on every push.

---

## 🔌 API Contract

### **1. Target Audit Endpoint**
*   **Route:** `POST /api/audit`
*   **Description:** Traversing redirects, probing SSL certificates, and extracting deep HTML metadata.

#### **Request Payload**
```json
{
  "url": "[https://www.verticx.in](https://www.verticx.in)"
}