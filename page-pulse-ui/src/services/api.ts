// page-pulse-ui/src/services/api.ts
import type { AuditResponse } from "../types/audit";
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://url-audit-5j1g.onrender.com";

export async function submitAudit(url: string): Promise<AuditResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/audit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Failsafe in case the network bridge collapses
    return {
      success: false,
      requestId: "network-failure",
      error: {
        code: "NETWORK_ERROR",
        message:
          "Failed to connect to the analysis engine. Ensure the backend is operational.",
      },
    };
  }
}
