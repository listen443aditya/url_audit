# PagePulse: Dreadnought Edition

A high-performance, production-grade URL analysis engine. 

PagePulse abandons the fragility of simple scripts and standard fetch requests. It traverses redirect chains, interrogates native SSL/TLS security layers via socket probing, and rips open the DOM to extract deep HTML metadata (SEO, structure, and accessibility metrics) with absolute precision. The frontend then derives an intelligent, 100-point scoring matrix from this raw telemetry, wrapped in a cinematic, enterprise-grade UI.

**Live Deployment:** [Insert Your Deployed Link Here]

---

## 🏗 The Architecture of Resilience

This service is built to withstand production traffic and hostile environments. The infrastructure honors the traditional laws of backend engineering while utilizing forward-thinking extraction techniques:

*   **Concurrency Limits:** Native semaphores throttle heavy HTML parsing (`cheerio`) and SSL Socket probes, preventing the engine from exhausting server memory under heavy assault.
*   **Intelligent Caching:** Repeat audits within a configurable time window (default 60s) are served directly from an LRU memory cache, bypassing network traversal entirely.
*   **Traffic Control:** Strict rate limiting protects the API from abuse and DDoS attempts on a per-client basis.
*   **Resilience & Timeouts:** Hard bounds on execution time (15s limit) ensure hanging target servers do not consume thread resources.
*   **Structured Telemetry:** Every request is stamped with a unique `requestId` and logged systematically for tracing.
*   **The Crucible (CI/CD):** A GitHub Actions pipeline strictly enforces code quality and executes the Vitest testing suite on every push, ensuring the API contract is never broken.

---

## 📊 The Intelligence Matrix (Frontend)

The frontend is not merely a display; it is an analytical engine that processes the backend telemetry into actionable intelligence.

*   **Executive Summary:** Calculates an overall Health Score out of 100 based on latency, security headers, protocol, and SEO optimization.
*   **Network Vitals:** Visualizes payload sizes, total response times, and exposes the raw HTTP response headers.
*   **Routing & Security:** Traces every intermediary hop in a redirect chain and exposes SSL certificate issuers, TLS versions, and HSTS policy enforcement.
*   **Deep SEO & HTML:** Counts H1/H2 tags, evaluates meta description length, and hunts down images missing crucial ALT attributes for accessibility.

---

## 🔌 The API Contract

### **Endpoint:** `POST /api/audit`
Initiates a deep analysis of the target URL.

#### **Request Payload**
```json
{
  "url": "[https://www.verticx.in](https://www.verticx.in)"
}