// src/tests/audit.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import { auditCache } from "../services/cache.service";

describe("Audit API Validation & Resilience", () => {
  beforeEach(() => {
    auditCache.clearExpired();
  });

  it("must violently reject malformed URLs", async () => {
    const res = await request(app)
      .post("/api/audit")
      .send({ url: "not-a-valid-url" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_INPUT");
  });

  it("must strictly forbid internal localhost auditing", async () => {
    const res = await request(app)
      .post("/api/audit")
      .send({ url: "http://localhost:3000/admin" });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain("Localhost is forbidden");
  });

  it("must return the exact sacred contract for a valid URL", async () => {
    const res = await request(app)
      .post("/api/audit")
      .send({ url: "https://example.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("requestId");
    expect(res.body.data.url).toBe("https://example.com");
    expect(res.body.data.status).toBe(200);
    expect(res.body.data).toHaveProperty("title");
    expect(res.body.data).toHaveProperty("responseTime");
  }, 15000);
});

describe("Health & Telemetry API", () => {
  it("must prove the machine is alive and credit the creators", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body._credit).toBe(
      "Built for Digital Heroes Training Task - digitalheroesco.com",
    );
  });
});
