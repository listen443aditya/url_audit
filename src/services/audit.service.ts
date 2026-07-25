// src/services/audit.service.ts
import { auditCache } from "./cache.service";
import { fetchWithMetadata, PageMetadata } from "../utils/fetchPage";
import { logger } from "../middleware/logger";

export const performAudit = async (
  targetUrl: string,
  requestId: string,
): Promise<{ data: PageMetadata; cached: boolean }> => {
  // Normalize the URL to ensure consistent cache keys (e.g., lowercase hostname, remove trailing slash)
  const urlObj = new URL(targetUrl);
  const normalizedUrl =
    `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.replace(
      /\/$/,
      "",
    );

  const cachedData = auditCache.get(normalizedUrl);

  if (cachedData) {
    logger.info({ requestId, url: targetUrl, cache: "HIT" }, "Cache Hit");
    return { data: cachedData, cached: true };
  }

  logger.info(
    { requestId, url: targetUrl, cache: "MISS" },
    "Cache Miss. Initiating network traversal.",
  );

  const freshData = await fetchWithMetadata(targetUrl);
  auditCache.set(normalizedUrl, freshData);

  return { data: freshData, cached: false };
};
