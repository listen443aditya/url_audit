// src/hooks/useAudit.ts
import { useState, useCallback } from "react";
import type { AuditResponse } from "../types/audit";

export function useAudit() {
  const [data, setData] = useState<AuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auditUrl = useCallback(async (targetUrl: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // Slightly longer than backend timeout

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
        signal: controller.signal,
      });

      const result: AuditResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "Audit failed");
      }

      setData(result);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("The request timed out. The target server is unresponsive.");
      } else {
        setError(
          err.message ||
            "An unexpected error occurred while communicating with the server.",
        );
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, auditUrl };
}
